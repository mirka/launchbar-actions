#!/bin/bash
#
# Prepare zip files for release

rm -rf release
mkdir release

cd dist
for file in *
do
	filename=$(basename "$file" .lbaction)
	echo $file
	zip -r "../release/$filename.zip" "$file"
done
