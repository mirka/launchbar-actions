#!/bin/bash
#
# Build actions from src

# Reset dist folder
rm -rf dist
mkdir dist

# Copy files from src
cd src

for file in *
do
	cp -R "$file" "../dist"
done

# Process each action
cd ../dist
for action in *
do
	plist="$action/Info.plist"
	name=$(defaults read $(pwd)/$plist CFBundleName)

	# Quick hack replacement for escaped unicode from `defaults`
	name=$(sed "s/\\\\u2026/…/" <<< "$name")

	echo "📦 Building \"$name\""

	# Compile text scripts
	scripts_dir="$action/Scripts"
	text_script="$scripts_dir/default.applescript"
	if [ -e "$text_script" ]; then
		osacompile -o "$scripts_dir/default.scpt" "$text_script"
		rm "$text_script"
	fi

	# Add common metadata to plist
	plutil -insert LBDescription.LBAuthor -string 'Lena Morita' "$plist"
	plutil -insert LBDescription.LBTwitter -string '@mirka' "$plist"
	plutil -insert LBDescription.LBWebsiteURL -string 'https://github.com/mirka/launchbar-actions' "$plist"

	# Bundle up
	fullname="$name.lbaction"
	mkdir "$fullname"
	mv "$action" "$fullname/Contents"
done

# Refresh Actions in LaunchBar
osascript -e 'tell application "LaunchBar" to update indexing rule "Actions"'
echo "✨ Refreshed LaunchBar Actions"
