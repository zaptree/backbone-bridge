define(['underscore'],function(_){
	return {
		template:'modules/blog/templates/index',
		globalEvents:{},
		events:{
			'click .delete-post':'delete'
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