define(['underscore'],function(_){
	return {
		template:'modules/blog/templates/create',
		globalEvents:{},
		events:{
			'submit #post-form':'submit'
		},
		/*onModelChange:function(){
			console.log('model changed');
		},*/
		afterRender:function(){},
		submit:function(e){
			var _this = this,
				$form = $(e.currentTarget),
				data = this.serializeForm($form);
			this.model.save(data,{success:function(){
				_this.model.clear();
			}});
			//console.log(this.model.attributes);

			return false;
		}
	};
});