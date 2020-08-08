#!/bin/bash
#
# Say in background

string="$1"
voice="$2"

# Return pid without waiting
say "$string" -v "$voice" > /dev/null & echo -n $!
