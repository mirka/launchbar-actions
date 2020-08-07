on open (my_app)
	tell application "Finder" to set app_name to name of (file my_app)
	if app_name ends with ".app" then
		set app_name to text 1 thru -5 of app_name
	end if
	
	tell application "System Events"
		if process named app_name exists then
			set is_visible to visible of process named app_name
			my quit_and_wait(app_name)
		end if
	end tell
	
	if is_visible is false then
		tell application named app_name to run
		delay 2
		
		tell application "System Events"
			set visible of process named app_name to false
		end tell
		
	else
		tell application named app_name to activate
	end if
	
end open

on quit_and_wait(app_name)
	tell application named app_name to quit
	
	tell application "System Events"
		repeat while process named app_name exists
			delay 2
		end repeat
	end tell
end quit_and_wait