/**
 * this is basically the same as app/config
 * @type {*}
 */
var requirejs = require('./../app/vendors/r');
var connect = require('connect');
var request = require('request');
/*
var memwatch = require('memwatch');
var hd = new memwatch.HeapDiff();
memwatch.on('leak', function (info) {
	var diff = hd.end();
	//console.log(diff);
	//console.log(diff.after.size);
	hd = new memwatch.HeapDiff();
});
memwatch.on('stats', function (stats) {
	console.log((Math.round(stats.current_base / 10000) / 100) + ' mb --');
});
 */

GLOBAL.debug = function(msg){
	console.log(msg)
};

module.exports = function(req,res){
	//todo: I think that rjs will be a uniquire rjs configuration to this context, I need to test this with multiple projects running simulated async calls and see if the different rjs configs overwrite one another thus loading files from the wrong project
	var rjs = requirejs.config({
		config: {
			text: {
				//Valid values are 'node', 'xhr', or 'rhino'
				env: 'node'
			}
		},
		//Pass the top-level main.js/index.js require
		//function to requirejs so that node modules
		//are loaded relative to the top-level JS file.
		baseUrl:__dirname+'/../app',
		paths: {
			'text': 'vendors/require_text',
			//'config':'../app/config',
			'core':'../core',
			'app': '../core/app',

			'factory':'../core/factory'

		},

		nodeRequire: require
	});


	rjs([
		'app','underscore', 'backbone','config/routes','config/settings','cheerio','text!../index.html'
		//,'bootstrap'
	], function   (application,_,Backbone,routes,settings,cheerio,tmplIndex) {


		Backbone.ajax = function(options) {
			/*		var options = {
			 //success:null,
			 dataType:null,
			 //url:null,
			 //contentType:null,
			 data:null,
			 type:null,
			 emulateJSON:null,
			 processData:null
			 }*/
			var url = settings.apiBaseUrl;

			request({
				url:settings.apiBaseUrl+(options.url.indexOf(settings.clientApiProxyPath) === 0 ? options.url.replace(settings.clientApiProxyPath,'') : options.url),
				headers:options.contentType ? {'content-type':options.contentType} : {},
				form:options.data,
				method:options.type,
				proxy:settings.requestProxy

			},function (error, response, body) {
				//console.log(body);
				if(error){
					var errorMsg = "There was an error fetching your request.";
					//an extra check for users using a proxy to give them a better error solution
					if(error.code==='ECONNREFUSED' && settings.requestProxy){
						errorMsg += ' Your settings are configured to use a proxy ('+settings.requestProxy+'). If you are using a proxy such as Fiddler make sure it is working or disable using a proxy from the settings.';
					}
					options.error({
						Error:new Error(errorMsg)
					});
				}else{
					var data;
					try{
						data=JSON.parse(body)

					}catch(err){
						var errorMsg = "Error parsing response from request to api: "+err.message;
						options.error({
							Error:new Error(errorMsg)
						});
						return;
					}
					if(response.statusCode<300){
						options.success(data,response.statusText);
					}else{
						options.error({
							Error:new Error('The api request returned a status code of: '+response.statusCode)
						});
					}

				}


			});

			return null;

			//return Backbone.$.ajax.apply(Backbone.$, arguments);
		};


		var url = req.url;
		var $ = cheerio.load(_.template(tmplIndex, settings, {variable: 'data'})),
			app = new application();

		app.isNode = true;
		app.server = {
			response: res,
			request: req
		};
		//todo:I will probably have to clean up all controllers views models the app object and so on, trigger a cleanup
		//todo:make sure backbone events dont keep adding handlers and never removing between requests!!!!!

		//todo:I need to make sure that when there are no views at all that I still call res.end();(maybe at controller after or something)

		app.$ = $;
		//app.test++;
		//res.end(app.test + ' count');return;

		//todo:I don't think this is safe since it will be shared between request if a view is created after an async operation
		//Backbone.$ = $;
		app.$document = $('#layout');

		var router = Backbone.Router.extend({
			routes: routes
		});
		//todo: I think backbone saves routers so we need to clean it up at the end of every request or find some solution
		app.router = new router();
		var noRouteFound = true;
		//I can use this alternatively
		app.router.on('route', function (method, args) {
			noRouteFound = false;
			var parts = method.split('.');
			app.dispatch(parts[0], parts[1], args);
		});
		//app.shutdown();
		Backbone.history.loadUrl(url);

		if (noRouteFound) {
			//todo:I should set up an html page that will handle the default 404 if none was set through backbone
			app.$ = cheerio.load("<h1>404 page not found.</h1><p>The url: <strong>" + url + "</strong> did not match any of your routes.</p>");
			app.pendingViewsHandler();
		}

	});
};






//
//exports.run = function(request, response){
//
//	console.log('sss')
//
//	response.writeHeader(200, {"Content-Type": "text/plain"});
//	response.write("Hello World2");
//	response.end();
//
//}