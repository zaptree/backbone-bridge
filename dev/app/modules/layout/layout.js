define(['underscore','modules/layout/views/default'],function(_,viewDefault){
	//controllers should only be initialized once so we create them before hand
	return {
		globalEvents:{
			'layout:render':'renderLayout'
		},
		renderLayout:function(layout,options){
			var layout = layout || 'default',
				_this = this;
			//_this.cl (currentLayout) stores the current rendered layout (if any
			if(_this.cl!==layout || options.redraw){
				//close _this.cv (the current view)
				_this.cv && _this.cv.close();
				//set _this.cv to the new view that was/will be rendered
				_this.cv = _this[layout](options);

			}




		},
		default:function(options){

			var view = this.app.factory.view.create(viewDefault, _.extend({
					model:{testme:'hello'}
				},options));

			view.render();

			return view;
		}


	};
});