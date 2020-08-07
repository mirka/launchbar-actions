const USER_CONFIG_PATH = Action.supportPath + '/languages.json';
const DEFAULTS_PATH = Action.path + '/Contents/Resources/default-languages.json';

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

function _say({ text, voice }) {
	LaunchBar.hide();
	LaunchBar.executeAppleScript(`say "${text}" using "${voice}"`);
}

function truncate(str, n = 60){
	return (str.length > n) ? str.substr(0, n - 1) + '…' : str;
}

function generateLanguages(string, config) {
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
