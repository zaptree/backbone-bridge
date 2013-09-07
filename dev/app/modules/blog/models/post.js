define(['underscore','filters/_exampleModelFilter'],function(_){

	return {
		urlRoot:'/api/posts',
		globalEvents:{},
		filters:{
			'filters/_exampleModelFilter':{}
		},
		initialize:function(){},
		test:function(){
			console.log('whatever')
		}

	};
});