var requirejs = require('./app/vendors/r.js');
var connect = require('connect');
var request = require('request');
var settings = requirejs('./app/config/settings');
var startup = require('./core/startup');




var server = connect()
	//.use(connect.logger('dev'))
	.use(connect.static('public'));
	if(settings.mode==='dev'){
		server.use('/app',connect.static('app'))
			.use('/core',connect.static('core'))
	}
	if(settings.clientApiProxyPath){
		server.use(settings.clientApiProxyPath,function(req,res){
			//req.pipe(request[req.method](url))
			req.pipe(request({
				url:settings.apiBaseUrl+(req.url.indexOf(settings.clientApiProxyPathPath) === 0 ? req.url.replace(settings.clientApiProxyPathPath,'') : req.url),

				//method:req.method,
				//headers:req.headers,

				proxy:settings.requestProxy
			})).pipe(res);

		});
	}

	server.use(function(req, res){
		startup(req,res);
		//var start = requirejs('core/startup');
		//res.end('endthis')
	})
	.use(connect.errorHandler({ dumpExceptions: true }))
.listen(3000);
