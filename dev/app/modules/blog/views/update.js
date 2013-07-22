define(['underscore'],function(_){
	return {
		template:'modules/blog/templates/update',
		globalEvents:{},
		events:{
			'submit #post-form':'submit'
		},
		afterRender:function(){
			//console.log(this.model.toJSON());
		},
		submit:function(e){
			var $form = $(e.currentTarget),
				data = this.serializeForm($form);
			this.model.save(data);
			//console.log(this.model.attributes);

			return false;
		}
	};
});