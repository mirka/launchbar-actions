const DEFAULTS_PATH = Action.path + '/Contents/Resources/default-languages.json';
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

	File.writeJSON({
		...data,
		[voice]: Date.now(),
	}, STATS_PATH);
}

function _say({ text, voice, meta }) {
	LaunchBar.executeAppleScript(`say "${text}" using "${voice}"`);

	updateStats(voice);

	return [
		{
			...meta,
			action: '_say',
			actionArgument: {
				text,
				voice,
				meta,
			},
		},
		{
			...meta,
			title: 'Make audio file',
			icon: getFileHandler('com.apple.m4a-audio') || 'font-awesome:file',
			action: '_makeAudioFile',
			actionArgument: { text, voice },
			actionReturnsItems: true,
		},
	];
}

function getFileHandler(type) {
	try {
		const handlers = File.readPlist('~/Library/Preferences/com.apple.LaunchServices/com.apple.launchservices.secure.plist');
		const { LSHandlerRoleAll: appId } = handlers.LSHandlers.find(item => item.LSHandlerContentType === type);
		return appId;
	} catch (err) {
		return null;
	}
}

function _makeAudioFile({ text, voice }) {
	const filePath = LaunchBar.execute(Action.path + '/Contents/Scripts/make-audio-file.sh', text, voice);

	return [{
		path: filePath,
	}];
}

function truncate(str, n = 60){
	return (str.length > n) ? str.substr(0, n - 1) + '…' : str;
}

function generateLanguages(string, config) {
	const lastInvoked = getStats();
	config.sort((a, b) => (lastInvoked[b.voice] || 0) - (lastInvoked[a.voice] || 0));

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
			subtitle: '',
		}
	];
}
