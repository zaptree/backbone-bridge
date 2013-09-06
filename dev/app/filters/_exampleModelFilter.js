/**
 * Filters are used to augment the functionality of your objects by hooking into the life cycle of the object
 * This is an example of a filter used for a model.
 * Model Hooks:
 * preFetch - runs before the fetching of data allowing the ability to alter the options and to stop the actual fetching
 * preParse - runs right after the fetching but
 */
define(['underscore'],function(_){
	return {
		/**
		 * prefetch must return the options with any modifications and they will then be passed to the fetch (unless
		 * there are more filters first). This method must return the options sync to work correctly. if a falsy value
		 * is returned original options will get used (to empty out options return {}).
		 * There is a special option called stop that if true will cause the fetch to not call the sync method, this
		 * is a great way to do a caching filter for example
		 * @param options - these are the options that where passed into the fetch method
		 * @param filterSettings - the settings for the filter (passed as the last argument of all filter methods)
		 * @returns options - return the options
		 */
		preFetch:function(options,filterSettings){
			options = options ? _.clone(options) : {};
			//options.stop = true;//enabling this option will stop the fetch method from calling sync
			return options;
		},
		/**
		 * preParse runs right after the fetching and before the parsing occurs.
		 * This method can be async (use the async method)
		 * There is a special stop parameter that can be passed in the options to stop the parse and success callback
		 * from running
		 *
		 * @param resp - the response from the fetch call
		 * @param options - the options passed into the fetch call
		 * @param filterSettings - the settings for the filter (passed as the last argument of all filter methods)
		 * @returns [resp,options] - return the resp and options that where passed in with any modifications
		 */
		preParse:function(resp,options,filterSettings){
			console.log('pre parsing');
			//options.stop = true;//enabling this option will stop the success and the parsing of the model to run
			return [resp,options];
		}
	};
});