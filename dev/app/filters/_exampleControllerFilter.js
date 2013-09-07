/**
 * Filters are used to augment the functionality of your objects by hooking into the life cycle of the object
 * This is an example of a filter used for a Controller.
 * Controller Hooks:
 * preBefore - runs before the before in the controller
 * postAfter - runs after the after in the controller
 * preRender - runs before the render in the controller
 * postRender - runs after the render in the controller
 */
define(['underscore'],function(_){
	return {
		/**
		 * @param filterSettings - the settings for the filter (passed as the last argument of all filter methods)
		 */
		preBefore:function(filterSettings){
			console.log('prebefore')
		},
		/**
		 * @param filterSettings - the settings for the filter (passed as the last argument of all filter methods)
		 */
		postAfter:function(filterSettings){
		},
		/**
		 * @param filterSettings - the settings for the filter (passed as the last argument of all filter methods)
		 */
		preRender:function(filterSettings){
		},
		/**
		 * @param filterSettings - the settings for the filter (passed as the last argument of all filter methods)
		 */
		postRender:function(filterSettings){
		}
	};
});