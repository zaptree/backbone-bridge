var connect = require('connect');

var app = connect()
	//.use(connect.logger('dev'))
	.use(function(req, res){
		var url = req.url,
			data=[
				{
					id:1,
					title:'The weather is going to be great',
					author:'John'
				},
				{
					id:2,
					title:'Stocks are on the rise',
					author:'Peter'
				},
				{
					id:3,
					title:'World cup qualifiers latest scores',
					author:'Alex'
				}
			],
			responseData={error:'no path was matched'};

		if(url=='/api/posts'){
			responseData=data;
		}else if(url=='/api/posts/1'){
			responseData = data[0];
			responseData.text = "The latest satellite images tell us that the weather will be great so you can make plans to go to the beach."
		}else if(url=='/api/posts/2'){
			responseData = data[1];
			responseData.text = "It looks like the stock market is yielding record profits for investors."
		}else if(url=='/api/posts/3'){
			responseData = data[2];
			responseData.text = "Teams are battling out for a spot in the world cup qualifiers, stay tuned for the latest scores."

		}

		res.writeHead(200, { 'Content-Type': 'application/json' });
		//console.log(JSON.stringify(responseData))
		res.write(JSON.stringify(responseData));
		res.end();
	})
	.listen(8080);