define({
	//dev|debug|production
	mode:'dev',

	//the base url of your api
	apiBaseUrl:'http://127.0.0.1:3000',

	//if you need to proxxy your requests for debugging (i.e. fiddler put http://127.0.0.1:8888)
	requestProxxy:'http://127.0.0.1:8888',

	//this will allow you to proxxy client side fetch calls to the api (circumvent cross origin restrictions)
	//set to false to disable otherwise to the base path that api requests are under
	clientApiProxxy:'/api'

});