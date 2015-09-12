// the stored path can consist of wildcards
function httpRouterPathMatch(searchPath, storedPath)
{
	var searchPathArray = searchPath.split("/");
	var storedPathArray = storedPath.split("/");
	
	console.log("Testing", searchPath, storedPath);
	
	if(searchPath == storedPath)
	{
		console.log("true");
		
		return true;
	}
	
	if(searchPathArray.length == storedPathArray.length)
	{
		for(var i in searchPathArray)
		{
			
			if(searchPathArray[i] != storedPathArray[i] && searchPathArray[i] != "*")
			{
				console.log("false");
				
				return false;
			}
		}
		
		console.log("true");
		
		return true;
	}
	
	// for(var i in searchPathArray)
	// {
	// 	if(search)
	// }
	
	console.log("false");
	
	return false;
}

module.exports = httpRouterPathMatch;
