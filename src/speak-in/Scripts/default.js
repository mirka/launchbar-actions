// Customize languages
const config = [
	{ name: 'French', icon: '🇫🇷', voice: 'Audrey' },
	{ name: 'German', icon: '🇩🇪', voice: 'Anna' },
	{ name: 'English (US)', icon: '🇺🇸', voice: 'Samantha' },
	{ name: 'Japanese', icon: '🇯🇵', voice: 'Kyoko' },
	{ name: 'Russian', icon: '🇷🇺', voice: 'Milena' },
	{ name: 'Portuguese (Brazilian)', icon: '🇧🇷', voice: 'Felipe' },
];

function runWithString(string) {
	return generateLanguages(string, config);
}

function _say({ text, voice }) {
	LaunchBar.hide();
	LaunchBar.executeAppleScript(`say "${text}" using "${voice}"`);
}

function truncate(str, n = 60){
	return (str.length > n) ? str.substr(0, n - 1) + '…' : str;
}

function generateLanguages(string, config) {
	return config.map(({ name, icon, voice }) => ({
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
}
