requirejs.config({
	config: {
		text: {
			//Valid values are 'node', 'xhr', or 'rhino'
			env: 'xhr'
		}
	},
	//Pass the top-level main.js/index.js require
	//function to requirejs so that node modules
	//are loaded relative to the top-level JS file.
	baseUrl:'/app',
	paths: {
		'text': 'vendors/require_text',
		//'config':'../app/config',
		'core':'../core',
		'app': '../core/app',

		'factory':'../core/factory',


		jquery: 'vendors/zepto',
		underscore: 'vendors/underscore',
		backbone: 'vendors/backbone'

	},
	shim: {
		backbone: {
			deps: ['underscore', 'jquery'],
			exports: 'Backbone'
		},

		underscore: {
			exports: '_'
		}
	}
});
requirejs([
	'app','underscore', 'backbone','config/routes','config/settings','jquery'
	//,'bootstrap'
], function   (application,_,Backbone,routes,settings) {
	var app = new application();
	app.isNode=false;
	app.$ = $;
	app.$document = $('#layout');

	var router = Backbone.Router.extend({
		routes:routes
	});
	app.router = new router();
	//I can use this alternatively
	app.router.on('route',function(method,args){
		var parts = method.split('.');
		app.dispatch(parts[0],parts[1],args);
	});
	Backbone.history.start();


});