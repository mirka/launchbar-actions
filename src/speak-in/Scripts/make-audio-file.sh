#!/bin/bash
#
# Generate an audio file of the spoken text in Temporary Files

string="$1"
voice="$2"

cd "$LB_ACTION_PATH"
bundle_id=$(defaults read "$(pwd)/Contents/Info.plist" CFBundleIdentifier)
tmp_path="$TMPDIR$bundle_id"
mkdir -p "$tmp_path"

filename=$(echo -n "$voice-$string" | shasum | head -c 8)'.m4a'
fullpath="$tmp_path/$filename"

say "$string" -v "$voice" --data-format=aac -o "$fullpath"

echo -n "$fullpath"
