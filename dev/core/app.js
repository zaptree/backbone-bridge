define(['underscore', 'backbone','factory','base/controller','base/model','base/view'], function   (_,Backbone,factory,baseController,baseModel,baseView) {
	var app = function(req,res){
		this.addGlobalHandler(this);
		this.request = req;
		this.response = res;
		this.factory = factory(this);
		//any property that is not a primitive and stores state must be initialized in the constructor
		this.loadedControllers = {};
		this.loadedTemplates = {};
	};
	_.extend(app.prototype,{
		isNode:false,
		pendingViews:0,
		renderId:0,
		globalEvents:{
			'view:rendered':'pendingViewsHandler',
			'shutdown':'_shutdown'
		},
		pendingViewsHandler:function(view){
			var _this = this;
			if(view && !view.options.noPending){
				_this.pendingViews--;
			}
			//console.log('reducing a view')
			//not sure if I should put under if statement
			//if there are no pending views we can
			if(_this.pendingViews===0 && _this.isNode){

				_this.server.response.end(_this.$.html());
				_this.shutdown();
			}


		},
		/**
		 * this function takes an object or a string and returns object or tries to load object from requirejs using
		 * string. Basically it allows you to load an object synchronously if it was already loaded previously and
		 * throw an error when it was not loaded
		 * @param objTemplate (object or string path)
		 */
		loadSync:function(objTemplate){
			if(_.isString(objTemplate)){
				if(require.defined(objTemplate)){
					return requirejs(objTemplate);
				}else{
					this.error({
						Error:new Error("Module "+objTemplate+" had not been loaded. To load a module synchronously you must make sure it was already loaded as a dependency before hand.")
					});
				}
			}
			return objTemplate;
		},
		error:function(error){
			var _this = this;
			if(this.isNode){
				_this.server.response.end("<p><strong>"+error.Error.message+"</strong></p>"+"<pre>"+error.Error.stack+"</pre>");
				//_this.server.response.end.call(_this,"There was an error");
				this.shutdown();
			}else{
				alert('ToDo: implement client side error handling. :'+error.Error.message);
			}

		},
		dispatch:function(controllerPath,method,args){

			var _this = this,
				lc=_this.loadedControllers;
			//we cant reuse the same controllers since they have an app objects specific to each request
			if(lc[controllerPath]){
				lc[controllerPath].run(method,args);
				return;
			}
			require([controllerPath],function(controllerTemplate){
				var controller = _this.factory.controller.create(controllerTemplate);
				lc[controllerPath] = controller;
				controller.run(method,args);
			});
		},
		loadTemplate:function(template,callback){
			if(this.isNode){
				require(['fs'],function(fs){
					fs.readFile('app/'+template+'.html', function (err, html) {
						if (err) { throw err; }
						callback && callback(html.toString());
					});
				});

			}else{
				$.get('/app/'+template+'.html',function(html,status){
					callback && callback(html);
				});
			}

		},
		addGlobalHandler: function(app){
			var _this = this,
				app=app || _this.app;//if we dont pass in the app context we assume that the current objects has it set (most likely only the app itself will pass in the app parameter)

			_this.delegateGlobalEvents = function(){
				_.each(_this.globalEvents,function(method,event){
					_this.listenTo(app,event,_this[method]);
				});
			};
			_this.undelegateGlobalEvents = function(){
				_this.stopListening(app);
			};
			_this.delegateGlobalEvents();
		},
		shutdown:function(){
			var _this = this;
			//todo:Emptying handlers might not be ok if we call a route server side after a async operation, I need to rethink this... somehow remove only the handler in the current context? assign an id to it?
			//we need to clean up the handlers otherwise they will keep on adding routes on every request
			Backbone.history.handlers = [];
			_this.router.off();//remove even binds on the router
			_this.trigger('shutdown');
		},
		_shutdown:function(){
			var _this= this;
			_this.off();
			_this.stopListening();
			_this.undelegateGlobalEvents();//remove all global events (stopListening will do that already
		}

	},Backbone.Events);

	return app;
});