const axios = require('axios');
const commandLineArgs = require('command-line-args');

const optionDefinitions = [
	{ name: 'year', alias: 'y', type: Number },
	{ name: 'day', alias: 'd', type: Number },
	{ name: 'output', alias: 'o', type: String },
];

const options = commandLineArgs(optionDefinitions);

const endpoint = `https://adventofcode.com`;
const sessionCookie = require('fs').readFileSync('session.txt', 'utf8');

async function getInput(year, day) {
	const url = `${endpoint}/${year}/day/${day}/input`;
	const headers = { Cookie: `session=${sessionCookie}` };

	try {
		const response = await axios.get(url, { headers });
		return response.data;
	} catch (error) {
		console.error('Error retrieving input:', error.message);
		process.exit(1);
	}
}

async function saveInputToFile(input, filePath) {
	const fs = require('fs');

	try {
		await fs.promises.writeFile(filePath, input);
		console.log(`Input saved to ${filePath}`);
	} catch (error) {
		console.error('Error saving input to file:', error.message);
		process.exit(1);
	}
}

async function main() {
	const { year, day, output } = options;

	if (!year || !day) {
		console.error('Please provide both year and day as command-line arguments.');
		process.exit(1);
	}

	const input = await getInput(year, day);

	if (output) {
		await saveInputToFile(input, output);
	} else {
		console.log(input);
	}
}

main();
