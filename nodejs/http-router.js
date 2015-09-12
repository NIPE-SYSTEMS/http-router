var http = require("http");
var url = require("url");
var httpRouterPath = require("./http-router-path.js");

// servers: {
//     server: http.Server
//     bindAddress
//     port
//     routers: [ router ]
// }
// 
// router: {
//     url
//     callback
// }
var servers = [];

function httpServerExists(bindAddress, port)
{
	// loop through servers
	for(var i in servers)
	{
		if(servers[i].port == port && servers[i].bindAddress == bindAddress)
		{
			return servers[i];
		}
	}
	
	return null;
}

function httpServerAdd(bindAddress, port)
{
	var server =
	{
		server: null,
		bindAddress: bindAddress,
		port: port,
		routers: []
	};
	
	server.server = http.createServer(function(request, response)
	{
		var requestMessageBody = "";
		
		request.on("data", function(data)
		{
			requestMessageBody += data.toString();
		});
		
		request.on("end", function()
		{
			var pathname = url.parse(request.url).pathname;
			var requestAnswered = false;
			
			// console.log(pathname);
			
			// remove leading slash
			if(pathname[0] == "/")
			{
				pathname = pathname.substr(1, pathname.length - 1);
			}
			
			// remove trailing slash
			if(pathname.length > 0 && pathname[pathname.length - 1] == "/")
			{
				pathname = pathname.substr(0, router.url.length - 1);
			}
			
			// call callback for first router with url
			for(var i in this.routers)
			{
				if(httpRouterPath(this.routers[i].url, pathname))
				{
					var responseMessageBody = this.routers[i].callback(null, pathname, requestMessageBody);
					
					response.writeHead(200);
					response.end(responseMessageBody);
					
					requestAnswered = true;
					
					break;
				}
			}
			
			// throw error
			if(requestAnswered == false)
			{
				response.writeHead(404);
				response.end("404 - Not found");
			}
		}.bind(this));
	}.bind(server));
	
	server.server.listen(port, bindAddress);
	
	// console.log("New server", server);
	
	servers.push(server);
}

// options: {
//     bindAddress
//     port
//     url
// }
function httpRouterAdd(options, callback)
{
	var router = {};
	
	// validate options object
	if(typeof options != "object")
	{
		callback(new Error("Invalid options."));
	}
	
	// validate callback
	if(typeof callback != "function")
	{
		throw new Error("Callback must be of type \"function\".");
	}
	
	// default bind address
	if(options.bindAddress === undefined)
	{
		options.bindAddress = "0.0.0.0";
	}
	else
	{
		options.bindAddress = options.bindAddress;
	}
	
	// default port
	if(options.port === undefined)
	{
		options.port = 80;
	}
	else
	{
		options.port = options.port;
	}
	
	// default url
	if(options.url === undefined)
	{
		router.url = "/";
	}
	else
	{
		router.url = options.url;
	}
	
	// remove leading slash
	if(router.url[0] == "/")
	{
		router.url = router.url.substr(1, router.url.length - 1);
	}
	
	// remove trailing slash
	if(router.url.length > 0 && router.url[router.url.length - 1] == "/")
	{
		router.url = router.url.substr(0, router.url.length - 1);
	}
	
	// save callback
	router.callback = callback;
	
	// add router
	var foundServer = httpServerExists(options.bindAddress, options.port);
	
	// create new server if not exists
	if(foundServer == null)
	{
		httpServerAdd(options.bindAddress, options.port);
		foundServer = httpServerExists(options.bindAddress, options.port);
	}
	
	// console.log("New router", router);
	
	// add router to server
	foundServer.routers.push(router);
}

function httpServerShutdown()
{
	servers.forEach(function(value, key, array)
	{
		value.server.close();
	});
}

// httpRouterAdd({ port: 8080, url: "hello/world" }, function(error, url, data)
// {
// 	// console.log(data);
	
// 	return "Hello World 1";
// });

// httpRouterAdd({ port: 8080, url: "/bla" }, function(error, url, data)
// {
// 	// console.log(data);
	
// 	return "Hello World 2";
// });

// httpRouterAdd({ port: 8080, url: "*/world" }, function(error, url, data)
// {
// 	console.log(url);
	
// 	return "Hello World 3";
// });

// process.on("SIGINT", function()
// {
// 	httpServerShutdown();
// });

module.exports.add = httpRouterAdd;
module.exports.stop = httpServerShutdown;
