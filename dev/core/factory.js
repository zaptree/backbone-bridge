define(['underscore', 'backbone','base/controller','base/model','base/view'], function   (_,Backbone,baseController,baseModel,baseView) {
	//return null;
	function async(method,args,callback){
		var i = arguments.length,
			_this=this;
		if(!i){
			//if there are no arguements it means that this.async() was called from the "method" so we must return
			//a method so that it can resolve its self
			_this._async=true;
			return function(){
				var method = _this._async_method;
				_this._async=false;
				_this._async_method = null;
				method.apply(_this,arguments);
			};

		}else if(i===2){
			//if there are only to arguments then we passed only method and callback
			callback = args;
			args = [];
		}
		_this._async_method = callback;
		method.apply(_this,args);
		//if _this._async = true it means that the method called async so we let it resolve on its own
		//if _this._async == false then that means it was not an async method so we call the callback automatically
		if(!_this._async){callback();}

	}
	function await(count,callback){
		return function(overideCallback){
			if(overideCallback){
				callback = overideCallback;
			}
			count--;
			if(count===0){
				callback();
			}
		}
	}
	var coreTemplates = {
		//all factory objects inherit from this
		base:{
			globalEvents:{
				'shutdown':'shutdown'
			},
			/**
			 * Default close implementation unbinds all events
			 */
			close:function(){
				var _this = this;
				_this.off();
				_this.stopListening();
				_this.undelegateGlobalEvents();//remove all global events (stopListening will do that already
			},
			onCLose:function(){ },
			/**
			 * The shutdown function gets called when you want to close the whole app, all it is is a wrapper for
			 * close plus adding a onShutdown function call for any custom shutdown code your object needs
			 * (usually the end of a request in node)
			 * @private
			 */
			shutdown:function(){
				var _this=this;
				_this.close();
				_this.onShutdown();
				//debug(this.type+' shutting down');
			},

			onShutdown:function(){}
		},
		view:{
			globalEvents:{
				'cleanUp':'close',
				'shutdown':'shutdown'
			},
			initialize:function(options){
				var _this = this;
				//options.template && (_this.template = options.template);

			},
			loadData:function(){
				var _this = this;
				if(this.collection){
					//TODO:I dont like what I am doing here, unbinding and binding again
					_this.stopListening(_this.collection,'reset',_this.onModelChange);
					_this.listenTo(_this.collection,'reset',_this.onModelChange);

					//todo:I think it is always an array even if empty so the first check is not needed
					if((this.collection.models && this.collection.models.length)  || _this.options.noFetch){
						_this._render();
					}else{
						_this.collection.fetch();
					}
				}else if(!_this.model || _.isUndefined(_this.model.attributes)){
					_this.model = this.app.factory.model.create({},_this.model);
					//we dont need to bind to the model since we just passed a data object to be rendered
					_this._render();
				}else{
					//make sure we are not already listening
					//TODO:I dont like what I am doing here, unbinding and binding again
					_this.stopListening(_this.model,'change',_this.onModelChange);
					_this.listenTo(_this.model,'change',_this.onModelChange);
					if((_this.model.attributes && _.keys(_this.model.attributes).length > 0) || _this.options.noFetch){
						_this._render();
					}else{
						_this.model.fetch();
					}
				}
			},
			onModelChange:function(){
				this._render();
			},
			renderTemplate:function(){
				//console.log(this);
				var _this=this,
					model = _this.collection || _this.model,
					template = _this.options.template || _this.template,
					data = model.toJSON(),
					templates = (!_this.app.isNode && window.JST) ? JST : this.app.loadedTemplates;

				if(template){
					if(templates[template]){
						_this.$el.html(templates[template](data));
					}else{
						var done=_this.async();
						_this.app.loadTemplate(template,function(tmpl){
							/*_.templateSettings = {
								variable: 'data'
							};*/
							templates[template] = _.template(tmpl,null,{variable: 'data'});
							var html = templates[template](data);
							_this.$el.html(html);
							//_this.$el.append(_.template(tmpl,data,{variable: 'data'}));
							done();
						});
					}

				}else{
					_this.app.error({
						Error:new Error('No template was set')
					});
				}
			},
			beforeRender:function(){ },
			/**
			 * I need to rethink the name of this since it is used in onModelChange
			 * @private
			 */
			_render:function(){
				var _this=this;
				//I should make the async take an array of methods to do in a row
				_this.async.call(_this,_this.beforeRender,function(){
					_this.async.call(_this,_this.renderTemplate,function(){
						_this.async.call(_this,_this.afterRender,function(){

							_this.trigger('rendered');
							if(_.isFunction(_this.options.onRender)){
								_this.options.onRender.call(_this);
							}
							//this must be last if we want the previous callbacks to run before the app ends
							_this.app.trigger('view:rendered',_this);
						});
					});
				});
			},
			render:function(){
				var _this=this;
				_this.loadData();
				//_this._render(options);
			},
			afterRender:function(){
				//this.async()();
			},
			/**
			 * The _close event gets called every time the global cleanUp function gets called.
			 * (usually on every request in the front end)
			 * @private
			 */
			close:function(){
				var _this=this;
				//_this.remove();
				_this.off();//remove any callbacks that where listening to view events
				_this.remove();
				//_this.stopListening();//stop listening to any other events (remove does that already)
				if(!_this.app.isNode){
					_this.undelegateEvents();//remove all the events
				}
				_this.undelegateGlobalEvents();//remove all global events (stopListening will do that already
				_this.onCLose();
			}
		},
		model:{
			globalEvents:{
				'shutdown':'shutdown'
			}
		},
		collection:{
		},
		controller:{
			//this is the default method to call on the controller so that it uses
			//the lifecycle. This should be used by the dispatch method
			run:function(method,args){
				var _this = this;
				//call the before method
				_this.async.call(_this,_this.before,function(){
					//call the controller action
					_this.async.call(_this,_this[method],args,function(){
						//call the after method
						_this.after.call(_this);
					});
				});
			},
			//add default before method
			before:function(){},
			after:function(){},
			render:function(view,layout,reRenderLayout){
				this.app.renderId++;//we use this to avoid out of sync views being rendered
				var _this = this,
					done = await(2),
					renderId=this.app.renderId;
				layout = layout || 'default';
				//TODO:I need to find a better way to call the renderLayout (maybe add it to _this.app.js?)
				_this.app.dispatch('modules/layout/layout','renderLayout',[layout,{'onRender':function(){
					var $this = this;
					done(function(){
						if(_this.app.renderId==renderId){
							_this.app.$document.html($this.$el);
							_this.app.$('#content').html(view.$el);
						}
					});
				}}]);

				var onRender = view.options.onRender;
				view.options.onRender = function(){
					onRender && onRender();
					done();
				};
				view.render();
			}

		}
	};
	/**
	 * We need to pass in the app instance because in node we will have a new app instance created for each request
	 * so using require would not work since that app object would be shared by all clients and requests.
	 */
	return function(app){
		var baseTemplates = {
			view:baseView,
			model:baseModel,
			controller:baseController
		};


		/**
		 * This function does all the common factory code shared by all types
		 * @param type (controller|view|model|collection)
		 * @param objTemplate
		 */
		function create(type,objTemplate){
			//console.log(coreTemplates);
			//objTemplate = _.extend({},coreTemplates.base,baseTemplates[type]);
			var core = coreTemplates[type],
				base = baseTemplates[type],
				obj = _.extend({},coreTemplates.base,core,base,objTemplate);//for controllers I wanted to add Backbone.Events
			obj.type = type;
			obj.core = core;
			obj.base = base;
			obj.app = app;
			obj.async = async;
			obj.await = await;
			//merge globalEvents and events from all three (note that the core overwrites the core.base events if it is defined and not merged);
			obj.globalEvents = _.extend({}, core.globalEvents || coreTemplates.base.globalEvents || {} ,base.globalEvents || {},objTemplate.globalEvents || {});
			//app.addGlobalHandler.call(obj); //
			return obj;
		};


		return {
			/**
			 * I can use the standard view but I need to override the _ensureElement && setElement methods so that it works
			 * in node.js
			 */
			view:{
				create:function(viewTemplate,options){
					viewTemplate = app.loadSync(viewTemplate);
					//we need to add the number of views pending so that node will know when all views have rendered so that
					//it can return the response with the rendered views
					if(!options.noPending){
						app.pendingViews++;
					}

					//if viewFile is string it means it is the module name
					var view = create('view',viewTemplate);

					view.events = _.extend({},coreTemplates.view.events || {},baseView.events || {},viewTemplate.events || {});
					//remove any events if we are in node
					if(app.isNode){
						view.events = null;
					}

					//we need to set the Backbone.$ every time there is a view being created otherwise Backbone.$
					//might be the cheerio object from another request.
					Backbone.$ = app.$;
					var viewInstance = new (Backbone.View.extend(view))(options || {});
					app.addGlobalHandler.call(viewInstance);
					return viewInstance;
				}
			},
			collection:{
				create:function(collectionTemplate,models,options){
					collectionTemplate = app.loadSync(collectionTemplate);
					var collection = create('collection',collectionTemplate);
					var collectionInstance = new (Backbone.Collection.extend(collection))(models,options || {});
					app.addGlobalHandler.call(collectionInstance);
					if(app.isNode){
						collectionInstance.on('error',function(m,resp){
							if(resp.Error){
								app.error(resp);
							}
						});
					}
					return collectionInstance;
				}
			},
			model:{
				//IF I CHANGE SIGNATURE REMEMBER TO CHANGE VIEW ALSO!!!
				create:function(modelTemplate,data,options){
					modelTemplate = app.loadSync(modelTemplate);

					var model = create('model',modelTemplate);
					var modelInstance = new (Backbone.Model.extend(model))(data,options || {});
					app.addGlobalHandler.call(modelInstance)
					if(app.isNode){
						modelInstance.on('error',function(m,resp){
							if(resp.Error){
								app.error(resp);
							}
						});
					}
					return modelInstance;
				}
			},
			controller:{

				create:function(controllerTemplate){
					controllerTemplate = app.loadSync(controllerTemplate);
					var controller = create('controller',_.extend({},controllerTemplate,Backbone.Events));
					app.addGlobalHandler.call(controller);
					return controller;

				}
			}
		};
	}

});