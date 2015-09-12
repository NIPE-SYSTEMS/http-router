// the stored path can consist of wildcards
function httpRouterPathMatch(searchPath, storedPath)
{
	if(searchPath == storedPath)
	{
		return true;
	}
	
	var searchPathArray = searchPath.split("/");
	var storedPathArray = storedPath.split("/");
	
	if(searchPathArray.length == storedPathArray.length)
	{
		for(var i in searchPathArray)
		{
			if(searchPathArray[i] != storedPathArray[i] && searchPathArray[i] != "*")
			{
				return false;
			}
		}
		
		return true;
	}
	
	return false;
}

module.exports = httpRouterPathMatch;
