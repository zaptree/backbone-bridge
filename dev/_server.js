/**
 * Run with nodesupervisor
 * @type {*}
 */

var http = require('http'),
	url = require('url'),
	path = require('path'),
	fs = require('fs'),
	index = require('./index');
var mimeTypes = {
	"html":"text/html",
	"jpeg":"image/jpeg",
	"jpg":"image/jpeg",
	"png":"image/png",
	"js":"text/javascript",
	"less":"text/css",
	"css":"text/css"};
var serverSettings={
	headerHost:'samsonite.test.madmobile.com',
	remote:'samsonite.test.madmobile.com',
	css:'samsonite'
};

http.createServer(function (request, response) {
	var uri = url.parse(request.url).pathname
	//console.log(uri)
	if(uri=='/'){
		//uri+='index.html';
		index.run(request, response);return;

	}else if(uri.match(/^\/assets\/skins\/(.*)/)){
		var parts = uri.match(/^\/assets\/skins\/(.*)/);
//
		uri='/assets/skins/'+serverSettings.css+'/'+parts[1];
		console.log(process.cwd(), decodeURI(uri))
		//}else if(uri=='/assets/skins/skin.less'){

//		uri='/assets/skins/'+serverSettings.css+'/skin.less';
//		console.log(process.cwd(), decodeURI(uri))
	}else if(uri=='/assets/dist/style.css'){
		uri='/assets/dist/skin-'+serverSettings.css+'.css';
	}
	//console.log('running')
	var filename = path.join(process.cwd(), decodeURI(uri));
	var stats;

	if (request.url.match(/^\/?json/)) {
		var postBody = '';
		request.on('data', function (requestChunk) {
			postBody += requestChunk;
		});
		request.on('end', function () {
			//http://samsonite.test.madmobile.com/json/init
			//console.log(request.headers.connection);

			var sendHeaders = request.headers;
			//we must change the host
			sendHeaders.host =serverSettings.headerHost;
			var options = {
				host:serverSettings.remote,
				port:80,
				path:request.url,
				method:request.method,
				headers:sendHeaders
				//headers:request.headers
			};

			var req = http.request(options, function (res) {
				//console.log('STATUS: ' + res.statusCode);
				//console.log('HEADERS: ' + JSON.stringify(res.headers));
				response.writeHeader(res.statusCode, res.headers);
				res.setEncoding('utf8');
				res.on('data', function (chunk) {
					//console.log('BODY: ' + chunk);
					response.write(chunk);
					console.log("writing chunk")
				});
				res.on('end', function () {
					console.log('remote request done!');
					console.log('---------------------------------------------')
					response.end();
				});
			});

			req.on('error', function (e) {
				console.log('problem with request: ' + e.message);
			});

			// write data to request body
			req.write(postBody);
			req.end();

		});
		return;
	}



	try {
		stats = fs.lstatSync(filename); // throws if path doesn't exist
	} catch (e) {

		index.run(request, response);return;

	}


	if (stats.isFile()) {
		// path exists, is a file
		var mimeType = mimeTypes[path.extname(filename).split(".")[1]];
		response.writeHead(200, {'Content-Type':mimeType});

		var fileStream = fs.createReadStream(filename);
		fileStream.pipe(response);
	} else if (stats.isDirectory()) {
		// path exists, is a directory
		response.writeHead(200, {'Content-Type':'text/plain'});
		response.write('Index of ' + uri + '\n');
		response.write('TODO, show index?\n');
		response.end();
	} else {
		// Symbolic link, other?
		// TODO: follow symlinks?  security?
		response.writeHead(500, {'Content-Type':'text/plain'});
		response.write('500 Internal server error\n');
		response.end();
	}

}).listen(1337);