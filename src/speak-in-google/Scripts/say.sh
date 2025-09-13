#!/bin/bash
#
# Say using Google TTS API in background

# Set PATH to include common locations for gcloud
export PATH="/opt/homebrew/bin:/usr/local/bin:/usr/bin:/bin:$PATH"

# Only source shell config if gcloud is not already available
if ! command -v gcloud >/dev/null 2>&1; then
    # Try to source user's shell configuration for additional environment
    if [ -f "$HOME/.zshrc" ]; then
        source "$HOME/.zshrc" 2>/dev/null || true
    elif [ -f "$HOME/.bash_profile" ]; then
        source "$HOME/.bash_profile" 2>/dev/null || true
    elif [ -f "$HOME/.bashrc" ]; then
        source "$HOME/.bashrc" 2>/dev/null || true
    fi
fi

string="$1"
voice="$2"
audio_file="$3"

# Create directory for the audio file if it doesn't exist
audio_dir=$(dirname "$audio_file")
mkdir -p "$audio_dir"

# Check if Google Cloud credentials are available
if [ -z "$GOOGLE_APPLICATION_CREDENTIALS" ] && [ ! -f "$HOME/.config/gcloud/application_default_credentials.json" ]; then
    echo "Error: Google Cloud credentials not found. Please set GOOGLE_APPLICATION_CREDENTIALS or run 'gcloud auth application-default login'" >&2
    exit 1
fi

# Get the project ID from gcloud config or environment
if [ -z "$GOOGLE_CLOUD_PROJECT" ]; then
    GOOGLE_CLOUD_PROJECT=$(gcloud config get-value project 2>/dev/null)
fi

if [ -z "$GOOGLE_CLOUD_PROJECT" ]; then
    echo "Error: Google Cloud project not set. Please set GOOGLE_CLOUD_PROJECT environment variable or run 'gcloud config set project YOUR_PROJECT_ID'" >&2
    exit 1
fi

# Extract language code from voice name (e.g., "en-US-Neural2-F" -> "en-US", "cmn-CN-Chirp3-HD-Sulafat" -> "cmn-CN")
language_code=$(echo "$voice" | sed -E 's/^([a-z]{2,3}-[A-Z]{2}).*$/\1/')

# Prepare JSON payload for Google TTS API
json_payload=$(cat <<EOF
{
  "input": {
    "text": $(echo "$string" | jq -R .)
  },
  "voice": {
    "name": "$voice",
    "languageCode": "$language_code"
  },
  "audioConfig": {
    "audioEncoding": "MP3"
  }
}
EOF
)

# Get access token
access_token=$(gcloud auth application-default print-access-token 2>/dev/null)

if [ -z "$access_token" ]; then
    echo "Error: Unable to get access token. Please run 'gcloud auth application-default login'" >&2
    exit 1
fi

# Call Google TTS API
response=$(curl -s -X POST \
    -H "Authorization: Bearer $access_token" \
    -H "Content-Type: application/json" \
    -H "X-Goog-User-Project: $GOOGLE_CLOUD_PROJECT" \
    -d "$json_payload" \
    "https://texttospeech.googleapis.com/v1/text:synthesize")

# Check for errors in response
if echo "$response" | jq -e '.error' > /dev/null 2>&1; then
    error_message=$(echo "$response" | jq -r '.error.message')
    echo "Error from Google TTS API: $error_message" >&2
    exit 1
fi

# Extract and decode audio data
audio_content=$(echo "$response" | jq -r '.audioContent')

if [ "$audio_content" = "null" ] || [ -z "$audio_content" ]; then
    echo "Error: No audio content received from Google TTS API" >&2
    exit 1
fi

# Decode base64 audio and save to file
echo "$audio_content" | base64 -d > "$audio_file"

echo -n "$audio_file"
