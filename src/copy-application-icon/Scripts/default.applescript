on open (thePaths)
	set myFile to (item 1 of thePaths)
	set appPath to POSIX path of myFile
	
	try
		tell application "System Events"
			tell property list file (appPath & "Contents/Info.plist")
				set iconName to the value of property list item "CFBundleIconFile"
			end tell
		end tell
		if iconName does not end with ".icns" then set iconName to iconName & ".icns"
	on error errorText
		beep
		display alert "Could not find an application icon." message errorText
		return
	end try
	
	set iconFile to POSIX file (appPath & "Contents/Resources/" & iconName)
	set the clipboard to iconFile
	return [{title:iconName, |path|:iconFile, icon:iconFile, subtitle:"Copied to clipboard!"}]
end open