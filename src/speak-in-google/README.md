# Speak In… (Google)

This LaunchBar action uses Google's Text-to-Speech API to generate natural-sounding speech from text input. The resulting audio file can be used in flashcard apps like [Anki](https://apps.ankiweb.net/).

## Features

- High-quality speech synthesis using Google's voices.
- Support for multiple languages and voice types.
- Audio file generation and caching.
- Customizable voice selection.
- Usage statistics tracking.

## Prerequisites

Before using this action, you need to set up Google Cloud:

### 1. Install Google Cloud CLI

Download and install the Google Cloud CLI from:
https://cloud.google.com/sdk/docs/install

### 2. Create a Google Cloud Project

1. Go to the [Google Cloud Console](https://console.cloud.google.com/).
2. Create a new project or select an existing one.
3. Note your project ID.

### 3. Enable the Text-to-Speech API

1. Go to the [Text-to-Speech API page](https://console.cloud.google.com/apis/library/texttospeech.googleapis.com).
2. Select your project.
3. Click "Enable".

### 4. Set up Authentication

Run the following commands in Terminal:

```bash
# Authenticate with Google Cloud
gcloud auth application-default login

# Set your project ID (replace YOUR_PROJECT_ID with your actual project ID)
gcloud config set project YOUR_PROJECT_ID

# IMPORTANT: Set quota project for Application Default Credentials
gcloud auth application-default set-quota-project YOUR_PROJECT_ID
```

### 5. Verify Setup

You can test your setup by running:

```bash
gcloud auth application-default print-access-token
```

This should return an access token if everything is configured correctly.

## Usage

1. Activate LaunchBar.
2. Type "Speak In Google" and press Tab.
3. Enter the text you want to speak.
4. Select a voice/language from the list.
5. The text will be spoken using Google TTS.

### Available Options

- **Speak**: Immediately speak the text using the selected voice.
- **Make audio file**: Generate an MP3 file of the spoken text.
- **Stop speaking**: Cancel current speech (for long texts).
- **Settings**: Edit the voice configuration file.
- **Setup Instructions**: View setup help.

## Configuration

You can customize the available voices by editing the `languages.json` file in the action's support directory. The file will be created automatically the first time you run the action.

### Voice Format

Each voice entry should have:

- `name`: Display name for the voice.
- `icon`: Flag or emoji to represent the language/region.
- `voice`: Google TTS voice name (e.g., "en-US-Neural2-F").

### Available Google TTS Voices

You can find a complete list of available voices in the [Google TTS documentation](https://cloud.google.com/text-to-speech/docs/voices).

## Troubleshooting

### "Google Cloud CLI Required" Error

Install the Google Cloud CLI and ensure it's in your PATH.

### "Google TTS Error" Messages

1. **"quota project not set" or "PERMISSION_DENIED" errors**:
   ```bash
   gcloud auth application-default set-quota-project YOUR_PROJECT_ID
   ```

2. **"gcloud command not found" in LaunchBar**:
   - Ensure gcloud is installed via Homebrew: `brew install google-cloud-sdk`
   - The action automatically handles PATH issues for common installation locations

3. **Authentication errors**:
   ```bash
   gcloud auth application-default login
   ```

4. **Project configuration**:
   ```bash
   gcloud config set project YOUR_PROJECT_ID
   gcloud config get-value project  # Verify it's set correctly
   ```

5. **API not enabled**:
   - Go to [Google Cloud Console](https://console.cloud.google.com/apis/library/texttospeech.googleapis.com)
   - Ensure Text-to-Speech API is enabled for your project

### Voice Not Found Errors

Make sure you're using valid Google TTS voice names. Check the [voice documentation](https://cloud.google.com/text-to-speech/docs/voices) for available options.

## Cost Considerations

Google Text-to-Speech API charges based on the number of characters processed. Check the [pricing page](https://cloud.google.com/text-to-speech/pricing) for current rates.

The action caches generated audio files to avoid re-processing the same text with the same voice.

## Support

For issues with the LaunchBar action itself, please check the project repository.
For Google Cloud or TTS API issues, refer to the [Google Cloud documentation](https://cloud.google.com/text-to-speech/docs).
