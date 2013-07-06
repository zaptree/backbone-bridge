define(['underscore'],function(_){

	return {
		events:{
			'click a':'redirect'
		},
		redirect:function(e){
			console.log()
			this.app.router.navigate($(e.currentTarget).attr('href'),{trigger: true})
			return false;
		},
		template:'modules/layout/templates/default',
		globalEvents:{}
	};
});