define(['underscore'],function(_){

	return {
		events:{},
		template:'modules/blog/templates/index',
		afterRender:function(){
			//console.log(this.model.toJSON().errors[0].message)
			//console.log(this.model.toJSON());
		},
		globalEvents:{}
	};
});