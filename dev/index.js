var requirejs = require('./app/vendors/r.js');
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


requirejs([
	'app','underscore', 'backbone','config/routes','cheerio','text!../index.html'
	,'bootstrap'
], function   (app,_,Backbone,routes,cheerio,tmplIndex) {

	app.isNode=true;
	GLOBAL.$ = cheerio.load(tmplIndex);
	Backbone.$ = $;
	app.$document = $('#layout');
	//new Backbone.View();
	//console.log($.html());
	//return;
	//console.log(tmplIndex);
//	app.loadTemplate('../index',function(){
//
//	});
	router = Backbone.Router.extend({
		routes:routes
	});
	var Router = new router();
	//I can use this alternatively
	Router.on('route',function(method,args){
		var parts = method.split('.');
		app.dispatch(parts[0],parts[1],args);
	});

	//I need to load all the templates


	//Backbone.history.start({silent: true});
	Backbone.history.loadUrl('home');
	//Backbone.history.loadUrl('home/whatever');
	//Backbone.history.loadUrl('home');

//	var app = connect()
//		.use(connect.logger('dev'))
//		.use(connect.static('public'))
//		.use(function(req, res){
//
//			app.router = Backbone.Router.extend({
//
//				routes: {
//					"test":'test'
//				},
//				test:function(){
//					console.log('this is a test')
//				}
//			});
//
//			new app.router()
//
//
//			res.end('hello world\n');
//		})
//		.listen(3000);
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