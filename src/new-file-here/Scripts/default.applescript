on open (thePaths)
	set myPath to item 1 of thePaths
	
	display dialog "Filename:" default answer ".txt"
	set filename to text returned of result
	set fullpath to (POSIX path of myPath) & filename
	
	do shell script "touch -a '" & fullpath & "'"
	tell application "LaunchBar" to activate
	
	return [{title:filename, |path|:fullpath}]
end open
