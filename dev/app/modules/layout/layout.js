define(['app','underscore','factory','modules/layout/views/default'],function(app,_,factory,viewDefault){
	//controllers should only be initialized once so we create them before hand
	return factory.controller.create({
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

			var view = factory.view.create(viewDefault, _.extend({
					model:{testme:'hello'}
				},options));

			view.render();

			return view;
		}


	});
});