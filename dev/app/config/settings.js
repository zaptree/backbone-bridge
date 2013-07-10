define({
	//dev|debug|production
	mode:'dev',

	//the base url of your api
	apiBaseUrl:'http://dev-hub.com/bbapi',

	//if you need to proxxy your requests for debugging (i.e. fiddler put http://127.0.0.1:8888)
	requestProxy:'http://127.0.0.1:8888',

	//this will allow you to proxxy client side fetch calls to the api (circumvent cross origin restrictions)
	//set to false to disable otherwise to the base path that api requests are under.
	//this will be removed from the model.url before making the actual call i.e.: a model with url /api/
	clientApiProxyPath:'/api'

});