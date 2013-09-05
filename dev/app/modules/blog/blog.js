define(['underscore'
	//models
	, 'modules/blog/models/post'
	//collections
	, 'modules/blog/collections/posts'
	//views
	, 'modules/blog/views/index'
	, 'modules/blog/views/read'
	, 'modules/blog/views/create'
	, 'modules/blog/views/update'
],function(_
		//models
		, modelPost
		//collections
		, collectionPosts
		//views
		, viewIndex
		, viewRead
	){
	//controllers should only be initialized once so we create them before hand
	return {
		layout:'default',
		globalEvents:{},
		before:function(){
			//console.log('the main controller before method runs');
		},
		index:function(){
			var collection = this.factory.collection.create('modules/blog/collections/posts',null,null);
			var view = this.factory.view.create('modules/blog/views/index',{
				collection:collection
			});
			this.render(view);
		},
		read:function(id){
			var model = this.factory.model.create(modelPost);
			model.id=id;
			var view = this.factory.view.create(viewRead,{model:model});
			this.render(view);
		},
		create:function(){
			var model = this.factory.model.create('modules/blog/models/post');
			var view = this.factory.view.create('modules/blog/views/create',{
				model:model,
				fetch:false
			});
			this.render(view);
		},
		update:function(id){
			var model = this.factory.model.create('modules/blog/models/post',{id:id});
			var view = this.factory.view.create('modules/blog/views/update',{
				model:model,
				fetch:true
			});
			this.render(view);
		},
		delete:function(id){

		},
		after:function(){
			//console.log('the main controller after method runs');
		}
	};
});