on open (my_app)
	tell application "Finder"
		set app_name to name of (file my_app)
		if class of (file my_app) is not application file then
			return
		end if
	end tell
	
	if app_name ends with ".app" then
		set app_name to text 1 thru -5 of app_name
	end if
	
	tell application "System Events"
	set should_launch_visible to true
	
		if process named app_name exists then
			set should_launch_visible to visible of process named app_name
			my quit_and_wait(app_name)
		end if
	end tell
	
	if should_launch_visible is false then
		tell application named app_name to run
		delay 2
		
		tell application "System Events"
			set visible of process named app_name to false
		end tell
		
	else
		try
			tell application named app_name to activate
		end try
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