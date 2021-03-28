on handle_string(extension)
	tell application "Finder"
		set filename to (do shell script "date +%s") & "." & extension
		set temp_file to make new file at (path to temporary items) with properties {name:filename}
		open temp_file
	end tell
end handle_string