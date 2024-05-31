if(!URL.canParse){
	URL.canParse = function(...args){
		try { new URL(...args) }
		catch { return false }
		return true
	}
}
