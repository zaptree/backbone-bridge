var requirejs = require('./app/vendors/r.js');
var connect = require('connect');
var request = require('request');
var memwatch = require('memwatch');
var hd = new memwatch.HeapDiff();
//var _ = require('./app/vendors/underscore.js');
memwatch.on('leak', function(info) {
	//console.log(info);
	var diff = hd.end();
	//console.log(diff);
	console.log(diff.after.size);
	hd = new memwatch.HeapDiff();

});
memwatch.on('stats', function(stats) {
	//console.log(stats);
});
GLOBAL.debug = function(msg){
	console.log(msg)
};

requirejs.config({
	config: {
		text: {
			//Valid values are 'node', 'xhr', or 'rhino'
			env: 'node'
		}
	},
	//Pass the top-level main.js/index.js require
	//function to requirejs so that node modules
	//are loaded relative to the top-level JS file.
	baseUrl:__dirname+'/app',
	paths: {
		'text': 'vendors/require_text',
		//'config':'../app/config',
		'core':'../core',
		'app': '../core/app',

		'factory':'../core/factory'

	},

	nodeRequire: require
});


requirejs([
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
		request({
			url:settings.apiBaseUrl+options.url,
			headers:options.contentType ? {'content-type':options.contentType} : {},
			form:options.data,
			method:options.type,
			proxy:settings.requestProxxy

		},function (error, response, body) {
			//console.log(body);
			if(error){
				//todo:handle errors (options.error)
				console.log('There was an error getting the request')
			}
			options.success(JSON.parse(body),response.statusText);
		})

		return null;

		//return Backbone.$.ajax.apply(Backbone.$, arguments);
	};
	//I need to load all the templates


	//Backbone.history.start({silent: true});

	//Backbone.history.loadUrl('home/whatever');req
	//Backbone.history.loadUrl('home');

	var server = connect()
		.use(connect.logger('dev'))
		.use(connect.static('public'));
	if(settings.mode==='dev'){
		server.use('/app',connect.static('app'))
			.use('/core',connect.static('core'))
	}
	if(settings.clientApiProxxy){
		server.use(settings.clientApiProxxy,function(req,res){
			var url = settings.clientApiProxxy+req.url,
				data=[
					{
						id:1,
						title:'The weather is going to be great',
						author:'John'
					},
					{
						id:2,
						title:'Stocks are on the rise',
						author:'Peter'
					},
					{
						id:3,
						title:'World cup qualifiers latest scores',
						author:'Alex'
					}
				],
				responseData={error:'no path was matched'};

			if(url=='/api/posts'){
				responseData=data;
			}else if(url=='/api/posts/1'){
				responseData = data[0];
				responseData.text = "The latest satellite images tell us that the weather will be great so you can make plans to go to the beach."
			}else if(url=='/api/posts/2'){
				responseData = data[1];
				responseData.text = "It looks like the stock market is yielding record profits for investors."
			}else if(url=='/api/posts/3'){
				responseData = data[2];
				responseData.text = "Teams are battling out for a spot in the world cup qualifiers, stay tuned for the latest scores."

			}
			_.delay(function(){
				res.writeHead(200, { 'Content-Type': 'application/json' });
				//console.log(JSON.stringify(responseData))
				res.write(JSON.stringify(responseData));
				res.end();
			},1000);

		});
	}
	server.use(function(req, res){
			//res.shouldKeepAlive=false;
			var url = req.url;
			var $ = cheerio.load(tmplIndex),
				app = new application();

			app.isNode=true;
			app.server = {
				response: res,
				request:req
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
				routes:routes
			});
			//todo: I think backbone saves routers so we need to clean it up at the end of every request or find some solution
			app.router = new router();
			//I can use this alternatively
			app.router.on('route',function(method,args){
				var parts = method.split('.');
				app.dispatch(parts[0],parts[1],args);
			});
			Backbone.history.loadUrl(url);


			//app.req = req;

			//app.pendingViewsHandler();
			//res.end('hello world\n');
		})
		.listen(3000);
});


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