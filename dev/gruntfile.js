var _ = require('underscore');
module.exports = function (grunt) {
	//Getting all file paths for all the controllers in the app so they can be included in the build
	var controllers = grunt.file.expand('./app/modules/*/*.js','./app/controllers/**.js','./app/modules/*/controllers/**.js');
	//convert paths for use with the include in requirejs
	controllers = _.map(controllers,function(path){
		return path.match(/\.\/app\/(.+)\.js/)[1];
	});



	// Project configuration.
	grunt.initConfig({
		//pkg: grunt.file.readJSON('package.json'),
		requirejs: {
			compile: {
				options: {
					almond: true,
					optimize: 'none',
					baseUrl: "app",
					mainConfigFile: "app/config.js",
					name: 'config',
					//findNestedDependencies: false,//true will allow require calls in modules to be compiled
					include: controllers,
					//include: ["vendors/require"],
					out: "public/js/application.js"
				}
			}
		},
		jst: {
			compile: {
				options: {
					processName: function(filename) {
						//convert name app/modules/blog/templates/index.html
						//to modules/blog/templates/read like we use in our project
						return filename.match(/app\/(.+?)\.html/)[1];
					},
					processContent: function(src) {
						return src.replace(/(^\s+|\s+$)/gm, '');
					},
					templateSettings: {
						//interpolate : /\{\{(.+?)\}\}/g,
						variable: 'data'
					}
				},
				files: {
					"public/js/templates.js": ["app/modules/*/templates/**.html","app/templates/**.html"]
				}
			}
		},
		uglify: {

			options: {
				mangle: false,
				report:'min'//setting to gzip is really slow
			},
			production: {
				files: {
					'public/js/application.js': ['public/js/application.js'],
					'public/js/templates.min.js': ['public/js/templates.js']
				}
			}
		}
	});

	// Load the plugin that provides the "uglify" task.
	grunt.loadNpmTasks('grunt-requirejs');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-jst');

	// Default task(s).
	grunt.registerTask('production', ['requirejs','jst','uglify:production']);

};
