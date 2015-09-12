var http_router = require("./http-router.js");

http_router.add({ url: "/", port: 8080 }, function(error, url, data)
{
	if(error)
	{
		console.error(error.message);
		
		return;
	}
	
	console.log(url);
	
	return "Hello World from node via http-router.";
});

http_router.add({ url: "/hello/world", port: 8080 }, function(error, url, data)
{
	if(error)
	{
		console.error(error.message);
		
		return;
	}
	
	console.log(url);
	
	return "Hello World from node via http-router.";
});

http_router.add({ url: "/*/bar", port: 8080 }, function(error, url, data)
{
	if(error)
	{
		console.error(error.message);
		
		return;
	}
	
	console.log(url);
	
	return "Hello World from node via http-router.";
});

// gracefully shutdown on SIGINT (<Ctrl> + <C>)
process.on("SIGINT", function()
{
	http_router.stop();
});
