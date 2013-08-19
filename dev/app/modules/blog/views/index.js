define(['underscore'],function(_){
	return {
		template:'modules/blog/templates/index',
		globalEvents:{},
		events:{
			'click .delete-post':'delete',
			'click #loop':'loop',
			'click #once':'once'
		},
		loop:function(){
			for(var i = 0; i< 30000; i++){
				$.get('/posts/create?'+i);
			}
		},
		once:function(){
			$.get('/posts/create?2');
		},
		afterRender:function(){},
		delete:function(e){
			var $el=$(e.currentTarget),
				id = $el.attr('data-id');

			this.collection.get($(e.currentTarget).attr('data-id')).destroy({
				success :function(model,data){
					if(data.success){
						$el.closest('tr').remove();
					}
				}
			});
			return false;
		}
	};
});