define(['app','underscore', 'backbone','base/controller','base/model','base/view'], function   (app,_,Backbone,baseController,baseModel,baseView) {
	return null;
	/*var nodeView = function(view,options){
		var _this = this;
		var viewOptions = ['model', 'collection', 'el', 'id', 'attributes', 'className', 'tagName', 'events'];
		_.extend(this,{
			_ensureElement: function() {

//				var attrs = _.extend({}, _.result(this, 'attributes'));
//				if (this.id) attrs.id = _.result(this, 'id');
//				if (this.className) attrs['class'] = _.result(this, 'className');
//				var $el = $('<' + _.result(this, 'tagName') + '>').attr(attrs);
//
//
//				return;


//				var $el = $.load('<div></div>')('div');
//				var test = $('<div>hello</div>');
//				$('#body').html(test);
//
////				console.log($el.html())
//				console.log($.html())
//				//var $ = $.load('<div></div>');
//				//this.$el = $('div');
//				//this.$el.html('<p>this is the test</p>');
//				//console.log(this.$el.html());
//
//				this.$el = $.load('<div></div>');
////				this.el = this.$el.html();
//				return null;
				if (!this.el) {
					var attrs = _.extend({}, _.result(this, 'attributes'));
					if (this.id) attrs.id = _.result(this, 'id');
					if (this.className) attrs['class'] = _.result(this, 'className');
					var $el = $('<' + _.result(this, 'tagName') + '>').attr(attrs);
					this.setElement($el, false);
				} else {
					this.setElement(_.result(this, 'el'), false);
				}
			},
			setElement: function(element, delegate) {

				this.$el = element instanceof $ ? element : $(element);
				this.el = this.$el[0];
				//if (delegate !== false) this.delegateEvents();
				return this;
			}
		},view);

		_this.cid = _.uniqueId('view');
		Backbone.View.prototype._configure.apply(this,[options||{}]);
		_this._ensureElement();
		_this.initialize.apply(_this, [options]);
		//_this.delegateEvents();


		//this.initialize(options);
	};*/

//	function load(module,callback){
//		if(_.isString(viewFile)){
//			require([viewFile],function(viewFile){
//				callback(viewFile);
//			})
//		}else{
//			callback(viewFile);
//		}
//	}
//	function addGlobalHandler(){
//		var _this = this;
//
//		_this.delegateGlobalEvents = function(){
//			_.each(_this.globalEvents,function(method,event){
//				_this.listenTo(app,event,_this[method]);
//			});
//		};
//		_this.undelegateGlobalEvents = function(){
//			_this.stopListening(app);
//		};
//		_this.delegateGlobalEvents();
//	}
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


	var factory = {
		/**
		 * I can use the standard view but I need to override the _ensureElement && setElement methods so that it works
		 * in node.js
		 */
		view:{
			create:function(viewTemplate,options){
				//we need to add the number of views pending so that node will know when all views have rendered so that
				//it can return the response with the rendered views
				if(!options.noPending){
					app.pendingViews++;
				}

				//if viewFile is string it means it is the module name
				var core = {
						async:async,
						globalEvents:{
							'cleanUp':'_close'
						},
						initialize:function(options){
							var _this = this;
							//options.template && (_this.template = options.template);

						},
						loadData:function(options){
							var _this = this;
							if(!_this.model || _.isUndefined(_this.model.attributes)){
								_this.model = factory.model.create({},_this.model);
								//we dont need to bind to the model since we just passed a data object to be rendered
								_this._render(options);
							}else{
								//make sure we are not already listening
								//TODO:I dont like what I am doing here, unbinding and binding again
								_this.stopListening(_this.model,'change',_this.onModelChange);
								_this.listenTo(_this.model,'change',_this.onModelChange);
								if(_this.model.attributes){
									_this._render(options);
								}else if(!_this.options.noFetch){
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
								template = _this.options.template || _this.template,
								data = _this.model.toJSON(),
								done=_this.async();

							if(template){
								app.loadTemplate(template,function(tmpl){
									_this.$el.append(_.template(tmpl,data));
									done();
								});
							}else{
								debug('DEBUG:Missing Template');
							}
						},
						beforeRender:function(){ },
						/**
						 * I need to rethink the name of this since it is used in onModelChange
						 * @private
						 */
						_render:function(options){
							var _this=this;
							options = options || {};
							//I should make the async take an array of methods to do in a row
							_this.async.call(_this,_this.beforeRender,function(){
								_this.async.call(_this,_this.renderTemplate,function(){
									_this.async.call(_this,_this.afterRender,function(){

										_this.trigger('rendered');
										if(_.isFunction(_this.options.onRender)){
											_this.options.onRender.call(_this);
										}
										if(_.isFunction(options.onRender)){
											_this.options.onRender.call(_this);
										}
										//this must be last if we want the previous callbacks to run before the app ends
										app.trigger('view:rendered',_this);
									});
								});
							});
						},
						render:function(options){
							var _this=this;

							_this.loadData(options);
							//_this._render(options);
						},
						afterRender:function(){
							//this.async()();
						},
						_close:function(){
							//_this.remove();
							_this.off();//remove any callbacks that where listening to view events
							_this.stopListening();//stop listening to any other events
							_this.undelegateEvents();//remove all the events
							_this.undelegateGlobalEvents();//remove all global events (stopListening will do that already
						},

						close:function(){ }

					},
					 view = _.extend({},core,baseView,viewTemplate);

				view.core=core;
				view.base=baseView;
				//merge globalEvents and events from all three
				view.globalEvents = _.extend({},core.globalEvents || {},baseView.globalEvents || {},viewTemplate.globalEvents || {});
				view.events = _.extend({},core.events || {},baseView.events || {},viewTemplate.events || {});

				//remove any events if we are in node
				if(app.isNode){
					view.events = null;
					//return new nodeView(view,options || {});
				}
				var viewInstance = new (Backbone.View.extend(view))(options || {});
				app.addGlobalHandler.call(viewInstance);
				return viewInstance;
			}
		},
		model:{
			//IF I CHANGE SIGNATURE REMEMBER TO CHANGE VIEW ALSO!!!
			create:function(modelTemplate,data,options){

				var core = {
						async:async,
						globalEvents:{ }
					},
					model = _.extend({},core,baseModel,modelTemplate);
				model.core=core;
				model.base=baseModel;
				//merge globalEvents and events from all three
				model.globalEvents = _.extend({},core.globalEvents || {},baseModel.globalEvents || {},modelTemplate.globalEvents || {});

				var modelInstance = new (Backbone.Model.extend(model))(data,options || {});
				app.addGlobalHandler.call(modelInstance);
				return modelInstance;
			}
		},
		controller:{
			create:function(controllerTemplate){
				//when I extend the object from the base object I can basically add a this.base = to it so that I can call it


				var core={
						async:async,
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
							var _this = this;
							//TODO:I need to find a better way to call the renderLayout (maybe add it to app.js?)
							app.dispatch('modules/layout/layout','renderLayout',['default',{'onRender':function(){
								app.$document.append(this.$el);
								$('#content').html(view.$el);
							}}]);
							view.render();

							//for the layout data first look for : this.layoutModel > app.initModel > view.model
							//do not do a fetch if the model is already populated but if it is not then do the fetch
							//think of some smart way that both models can run at the same time
						}


					},
					controller = _.extend({},core,baseController,controllerTemplate, Backbone.Events);
				controller.core=core;
				controller.base=baseController;
				//merge globalEvents and events from all three
				controller.globalEvents = _.extend({},core.globalEvents || {},baseController.globalEvents || {},controllerTemplate.globalEvents || {});

				//bind all the events
				app.addGlobalHandler.call(controller);

				return controller;

			}
		}
	};
	return factory;
});