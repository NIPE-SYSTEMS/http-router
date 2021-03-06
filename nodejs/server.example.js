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

var http_router = require("./http-router.js");

http_router.add({ url: "/", port: 8081 }, function(error, url, data)
{
	if(error)
	{
		console.error(error.message);
		
		return;
	}
	
	console.log(url);
	
	return "Hello World from node via http-router.";
});

http_router.add({ url: "/hello/world", port: 8081 }, function(error, url, data)
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

setTimeout(function()
{
	http_router.remove({ url: "/*/bar", port: 8080 });
}, 1000);

// gracefully shutdown on SIGINT (<Ctrl> + <C>)
process.on("SIGINT", function()
{
	http_router.stop();
});
