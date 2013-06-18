define(['underscore', 'backbone'], function   (_,Backbone) {
	var app = function(req,res){
		this.addGlobalHandler();
		this.request = req;
		this.response = res;
	};
	_.extend(app.prototype,{
		isNode:false,
		pendingViews:0,
		globalEvents:{
			'view:rendered':'pendingViewsHandler'
		},
		pendingViewsHandler:function(view){
			if(!view.options.noPending){
				this.pendingViews--;
			}
			//console.log('reducing a view')
			//not sure if I should put under if statement
			//if there are no pending views we can
			if(this.pendingViews===0){
				this.res.end.call(this.res,$.html());
				//console.log($.html());
				//console.log('its ready to return');
			}


		},
		dispatch:function(controllerPath,method,args){
			require([controllerPath],function(controller){
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

			}

		},
		addGlobalHandler: function(){
			var _this = this;

			_this.delegateGlobalEvents = function(){
				_.each(_this.globalEvents,function(method,event){
					_this.listenTo(app,event,_this[method]);
				});
			};
			_this.undelegateGlobalEvents = function(){
				_this.stopListening(app);
			};
			_this.delegateGlobalEvents();
		}

	},Backbone.Events);

	return app;
});