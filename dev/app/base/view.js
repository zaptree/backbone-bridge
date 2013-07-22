define(['underscore'],function(_){
	return {
		serializeForm:function($form){
			var data = {};
			_.each($form.serializeArray(),function(field){
				data[field['name']] =field['value'];
			});
			return data;

		}
	};
});