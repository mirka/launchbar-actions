#!/bin/bash
#
# Prepare zip files for release

rm -rf release
mkdir release

cd dist
for file in *
do
	plist="$file/Contents/Info.plist"
	version=$(defaults read $(pwd)/"$plist" CFBundleVersion)
	filename=$(basename "$file" .lbaction)
	echo "👉 $file ($version)"
	zip -r "../release/$filename"_"$version.zip" "$file"
done
