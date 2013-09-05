/**
 * Filters are used to augment the functionality of your objects by hooking into the life cycle of the object
 * This is an example of a filter used for a model.
 * Hooks:
 * preInitialize
 * postInitialize
 * preFetch
 * postFetch
 * preParse
 */
define(['underscore'],function(_){
	return {
		preFetch:function(){

		}
	};
});