define(['underscore'
	//models
	, 'models/home'
	//views
	, 'modules/blog/views/index'
	, 'modules/blog/views/read'
],function(_
		//models
		, modelHome
		//views
		, viewBlogIndex
		, viewBlogRead
	){
	//controllers should only be initialized once so we create them before hand
	return {
		layout:'default',
		globalEvents:{},
		before:function(){
			//console.log('the main controller before method runs');
		},
		index:function(){


			var model = this.app.factory.model.create({
				url:'/api/posts'
			});
//			model.fetch({
//				success:function(model,data){
//					var hello = data;
//				}
//			});
			var view = this.app.factory.view.create(viewBlogIndex,{model:model});


			this.render(view);
		},
		read:function(id){
			var model = this.app.factory.model.create({
				url:'/api/posts/'+id
			});
			var view = this.app.factory.view.create(viewBlogRead,{model:model});
			this.render(view);
		},
		after:function(){
			//console.log('the main controller after method runs');
		}
	};
});