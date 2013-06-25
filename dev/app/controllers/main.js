define(['underscore'
	//models
	, 'models/home'
	//views
	, 'views/home'
],function(_
		//models
		, modelHome
		//views
		, viewHome
	){
	//controllers should only be initialized once so we create them before hand
	return {
		layout:'default',
		globalEvents:{},
		before:function(){
			//console.log('the main controller before method runs');
		},
		index:function(){
			/**
			 * No autoRendering of the view unless we use the this.render which will fetch  and render the view automagically
			 * var model = factory.model.create();
			 * var view = factory.view.create(viewHome,{
			 *     model:model
			 * });
			 * app.$document.append(view.$el);
			 * model.fetch({success:function(){
			 *     view.render(function(){
			 *         console.log($.html());
			 *     });
			 * });
			 *
			 */
			//var model = factory.model.create()


			//this.app.pendingViewsHandler();
			var view = this.app.factory.view.create(viewHome,{model:{test:'OH YEAH!!!'}});
			//app.$document.append(view.$el);
			//view.render();

			this.render(view);


			//console.log(view.el);
//			app.trigger('layout:render',{
//				layout:'default',
//				content:view.$el
//			});
			//console.log('index runs');
		},
		after:function(){
			//console.log('the main controller after method runs');
		}
	};
});