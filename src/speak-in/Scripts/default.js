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

function _say({ text, voice }) {
	LaunchBar.hide();
	LaunchBar.executeAppleScript(`say "${text}" using "${voice}"`);

	updateStats(voice);
}

function truncate(str, n = 60){
	return (str.length > n) ? str.substr(0, n - 1) + '…' : str;
}

function generateLanguages(string, config) {
	const lastInvoked = getStats();
	config.sort((a, b) => (lastInvoked[b.voice] || 0) - (lastInvoked[a.voice] || 0));

	const languages = config.map(({ name, icon, voice }) => ({
		title: name,
		icon,
		label: voice,
		subtitle: truncate(string),
		action: '_say',
		actionArgument: {
			text: string,
			voice,
		},
		actionRunsInBackground: true,
	}));

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
