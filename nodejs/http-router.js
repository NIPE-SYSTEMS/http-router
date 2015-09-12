/**
 * Copyright (C) 2015 NIPE-SYSTEMS
 * 
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

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

function httpRouterRemove(options)
{
	// validate options object
	if(typeof options != "object")
	{
		throw new Error("Invalid options.");
		
		return;
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
		options.url = "/";
	}
	else
	{
		options.url = options.url;
	}
	
	// remove router from server
	var foundServer = httpServerExists(options.bindAddress, options.port);
	
	if(foundServer == null)
	{
		throw new Error("Failed to find server for router.");
		
		return;
	}
	
	foundServer.routers = foundServer.routers.filter(function(value, key, array)
	{
		if(value.url == options.url)
		{
			// console.log("Removed router", value);
			
			return false;
		}
		
		return true;
	});
	
	// remove server if no more routers are connected
	if(foundServer.routers.length == 0)
	{
		foundServer.server.close();
		
		var index = servers.indexOf(foundServer);
		if(index != -1)
		{
			servers.splice(index, 1);
		}
	}
}

function httpServerShutdown()
{
	servers.forEach(function(value, key, array)
	{
		value.server.close();
	});
}

module.exports.add = httpRouterAdd;
module.exports.remove = httpRouterRemove;
module.exports.stop = httpServerShutdown;
