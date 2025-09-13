const DEFAULTS_PATH =
  Action.path + '/Contents/Resources/default-languages.json';
const USER_CONFIG_PATH = Action.supportPath + '/languages.json';
const STATS_PATH = Action.supportPath + '/last-invoked.json';

function runWithString(string) {
	const config = getConfig();
	return generateLanguages(string, config);
}

function getConfig() {
	if (!File.exists(USER_CONFIG_PATH)) {
		// Copy defaults to new user config file
		const data = File.readText(DEFAULTS_PATH);
		File.writeText(data, USER_CONFIG_PATH);
	}

	return File.readJSON(USER_CONFIG_PATH).languages;
}

function getStats() {
	return File.exists(STATS_PATH) ? File.readJSON(STATS_PATH) : {};
}

function updateStats(voice) {
	const data = getStats() || {};

	File.writeJSON(
		{
			...data,
			[voice]: Date.now(),
		},
		STATS_PATH
	);
}

function getCachePath(text, voice) {
	// Get bundle ID to create cache path
	const bundleId = LaunchBar.execute(
		'/usr/bin/defaults',
		'read',
		Action.path + '/Contents/Info.plist',
		'CFBundleIdentifier'
	).trim();
	
	const tmpPath = `/tmp/${bundleId}`;
	
	// Create filename hash same way as shell script
	const filenameHash = LaunchBar.execute(
		'/bin/bash',
		'-c',
		`echo -n "${voice}-${text}" | shasum | head -c 8`
	).trim();
	
	return `${tmpPath}/${filenameHash}.mp3`;
}

function checkCache(text, voice) {
	const audioFile = getCachePath(text, voice);
	
	// Check if cached file exists
	if (File.exists(audioFile)) {
		return audioFile;
	}
	
	return null;
}

function _playAudioAndReturnItems(audioFilePath, text, voice, meta) {
	const MAKE_CANCELABLE_AFTER_LENGTH = 50;
	
	// Play the audio file asynchronously in background
	const pid = LaunchBar.executeAppleScript(`
		do shell script "nohup afplay '${audioFilePath}' > /dev/null 2>&1 & echo $!" without altering line endings
	`).trim();

	updateStats(voice);

	const defaultItems = [
		{
			...meta,
			path: audioFilePath,
		},
	];

	if (text.length > MAKE_CANCELABLE_AFTER_LENGTH) {
		return [
			...defaultItems,
			{
				title: 'Stop speaking',
				icon: 'font-awesome:times-circle',
				action: '_killProcess',
				actionArgument: pid,
			},
		];
	}

	return defaultItems;
}

function _say({ text, voice, meta }) {
	// Check cache first to avoid expensive Google Cloud setup if we already have the audio
	const cachedAudioPath = checkCache(text, voice);
	if (cachedAudioPath) {
		return _playAudioAndReturnItems(cachedAudioPath, text, voice, meta);
	}

	// Check for Google Cloud setup before attempting to speak
	const setupCheck = LaunchBar.execute(
		'/bin/bash',
		'-c',
		'export PATH="/opt/homebrew/bin:/usr/local/bin:$PATH" && command -v gcloud >/dev/null 2>&1 && echo "ok" || echo "missing"'
	);

	if (setupCheck.trim() === 'missing') {
		return [
			{
				title: 'Google Cloud CLI Required',
				subtitle: 'Please install Google Cloud CLI and authenticate',
				icon: 'font-awesome:exclamation-triangle',
				url: 'https://cloud.google.com/sdk/docs/install',
			},
		];
	}

	// Calculate the cache path where the new audio should be saved
	const expectedCachePath = getCachePath(text, voice);
	
	const audioFilePath = LaunchBar.execute(
		Action.path + '/Contents/Scripts/say.sh',
		text,
		voice,
		expectedCachePath
	).trim();

	// Check if the script returned an error
	if (audioFilePath.includes('Error:')) {
		return [
			{
				title: 'Google TTS Error',
				subtitle: 'Check your Google Cloud authentication and project setup',
				icon: 'font-awesome:exclamation-triangle',
				action: '_showSetupInstructions',
			},
		];
	}

	return _playAudioAndReturnItems(audioFilePath, text, voice, meta);
}

function _showSetupInstructions() {
	return [
		{
			title: 'Setup Instructions',
			subtitle: 'Follow these steps to configure Google TTS',
			icon: 'font-awesome:info-circle',
		},
		{
			title: '1. Install Google Cloud CLI',
			subtitle: 'Download and install from cloud.google.com/sdk',
			icon: 'font-awesome:download',
			url: 'https://cloud.google.com/sdk/docs/install',
		},
		{
			title: '2. Authenticate with Google Cloud',
			subtitle: 'Run: gcloud auth application-default login',
			icon: 'font-awesome:key',
		},
		{
			title: '3. Set your project ID',
			subtitle: 'Run: gcloud config set project YOUR_PROJECT_ID',
			icon: 'font-awesome:cog',
		},
		{
			title: '4. Set quota project',
			subtitle: 'Run: gcloud auth application-default set-quota-project YOUR_PROJECT_ID',
			icon: 'font-awesome:exclamation-triangle',
		},
		{
			title: '5. Enable Text-to-Speech API',
			subtitle: 'Enable the API in Google Cloud Console',
			icon: 'font-awesome:toggle-on',
			url: 'https://console.cloud.google.com/apis/library/texttospeech.googleapis.com',
		},
	];
}

function _killProcess(pid) {
	LaunchBar.executeAppleScript(`do shell script "kill ${pid}"`);
}

function truncate(str, n = 60) {
	return str.length > n ? str.substr(0, n - 1) + '…' : str;
}

function generateLanguages(string, config) {
	const lastInvoked = getStats();
	config.sort(
		(a, b) => (lastInvoked[b.voice] || 0) - (lastInvoked[a.voice] || 0)
	);

	const languages = config.map(({ name, icon, voice }) => {
		const meta = {
			title: name,
			icon,
			label: voice,
			subtitle: truncate(string),
		};
		return {
			...meta,
			action: '_say',
			actionArgument: {
				text: string,
				voice,
				meta,
			},
			actionReturnsItems: true,
		};
	});

	return [
		...languages,
		{
			title: 'Settings',
			icon: 'font-awesome:cog',
			path: USER_CONFIG_PATH,
			subtitle: 'Configure Google TTS voices',
		},
		{
			title: 'Setup Instructions',
			icon: 'font-awesome:info-circle',
			subtitle: 'How to configure Google Cloud TTS',
			action: '_showSetupInstructions',
			actionReturnsItems: true,
		},
	];
}
