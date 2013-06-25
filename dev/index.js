var requirejs = require('./app/vendors/r.js');
var connect = require('connect');
//var cheerio
//var $  = require('cheerio');
//$('ul', '<ul id="fruits"></ul>');
//GLOBAL.$ = require('cheerio').load('<div id="body"></div>');

//GLOBAL.$ = require('jQuery');

//var _ = require('./app/vendors/underscore.js');
//var Backbone = require('./app/vendors/backbone.js');
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

//todo:modules get loaded only once I need to make a new instance of each controller/app/view whatever otherwise it wont work
//with multiple requests
requirejs([
	'app','underscore', 'backbone','config/routes','cheerio','text!../index.html'
	//,'bootstrap'
], function   (application,_,Backbone,routes,cheerio,tmplIndex) {



	//I need to load all the templates


	//Backbone.history.start({silent: true});

	//Backbone.history.loadUrl('home/whatever');req
	//Backbone.history.loadUrl('home');

	var connectApp = connect()
		.use(connect.logger('dev'))
		.use(connect.static('public'))
		.use(function(req, res){
			//res.shouldKeepAlive=false;
			var url = req.url;
			var app = new application(),
				$ = cheerio.load(tmplIndex);

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
				var url = req.url;
				var parts = method.split('.');
				app.dispatch(parts[0],parts[1],args);
			});
			Backbone.history.loadUrl('home');


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