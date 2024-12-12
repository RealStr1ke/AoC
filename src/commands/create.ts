import { Args, Command, Flags } from '@oclif/core';
import fs from 'fs';
import path from 'path';
import axios from 'axios';

export default class Create extends Command {
	static summary = 'Setup a new challenge folder';
	static description = 'Creates a new folder for the given year and day with the template `index.js` solution file, `input.txt` file, and `README.md` file with the challenge description.';
	static hidden = false;
	static usage = 'aocs create (year) (day) [--input]';
	static examples = [
		{
			command: 'aocs create 2024 3',
			description: 'Creates and sets up a new folder for the Day 3 of AoC\'s 2020 calendar',
		},
		{
			command: 'aocs create 2015 7 --input',
			description: 'Creates and sets up a new folder for the Day 7 of AoC\'s 2015 calendar and retrieves the input',
		},
	];
	static strict = false;
	static aliases = [
		'c',
		'cr',
		'new',
	];
	static enableJsonFlag: false;


	static args = {
		year: Args.integer({
			description: 'The challenge\'s year',
		}),
		day: Args.integer({
			description: 'The challenge\'s day',
		}),
	};

	static flags = {
		input: Flags.boolean({
			char: 'i',
			description: 'Whether or not to retrieve the input',
		}),
	};

	public async run(): Promise<void> {
		// Parse the arguments
		const { args, flags } = await this.parse(Create);
		const year = args.year ?? new Date().getFullYear();
		const day = args.day ?? new Date().getDate();
		const explicit = args.day ?? false;

		// Validate the input
		if (!explicit && new Date().getMonth() !== 11) {
			this.error('You must specify the year and day explicitly if it is not December.');
		}

		// Validate the year and day
		if (year < 2015 || year > new Date().getFullYear()) {
			this.error('Year must be between 2015 and the current year. Your input: ' + year);
		}
		if (day > 25 || day < 1) {
			this.error('Day must be between 1 and 25. Your input: ' + day);
		}

		// Create the directory if it doesn't exist
		const dir = path.join(__dirname, '..', '..', 'events', year.toString(), 'days', day.toString());
		if (!fs.existsSync(dir)) {
			fs.mkdirSync(dir, { recursive: true });
		}

		// Paths
		const inputPath = path.join(dir, 'input.txt');
		const indexPath = path.join(dir, 'index.js');
		const readmePath = path.join(dir, 'README.md');
		const indexTemplatePath = path.join(__dirname, '..', '..', 'src', 'templates', 'index.js');
		const readmeTemplatePath = path.join(__dirname, '..', '..', 'src', 'templates', 'README.md');

		// Read the templates
		const indexTemplate = fs.readFileSync(indexTemplatePath, 'utf-8');
		const readmeTemplate = fs.readFileSync(readmeTemplatePath, 'utf-8');

		// Retrieve the input if the flag is set
		let input = '';
		if (flags.input) {
			const endpoint = 'https://adventofcode.com';
			const configPath = path.join(__dirname, '..', '..', 'config.json');
			const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
			const sessionCookie = config.session;

			const response = await axios.get(`${endpoint}/${year}/day/${day}/input`, {
				headers: {
					cookie: `session=${sessionCookie}`,
				},
			});

			input = response.data;
		}

		// Write the the files
		fs.writeFileSync(inputPath, input);
		fs.writeFileSync(indexPath, indexTemplate);
		fs.writeFileSync(readmePath, readmeTemplate);
	}
}
