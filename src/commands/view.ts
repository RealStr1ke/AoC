import { Args, Command, Flags } from '@oclif/core';
import fs from 'fs';
import path from 'path';
import axios from 'axios';
import * as cheerio from 'cheerio';

export default class View extends Command {
	static summary = 'Displays the text for the given challenge';
	static description = 'Displays the challenge text for the given year and day. If no part is given, it\'ll display both parts.';
	static hidden = false;
	static usage = 'aocs view (year) (day) -p [part]';
	static examples = [
		{
			command: 'aocs view 2024 3',
			description: 'Displays the challenge text for the Day 3 of AoC\'s 2020 calendar',
		},
		{
			command: 'aocs view 2015 7',
			description: 'Displays the challenge text for the Day 7 of AoC\'s 2015 calendar',
		},
	];
	static strict = false;
	static aliases = [
		'v',
		'c',
		'challenge',
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
		part: Flags.string({
			char: 'p',
			description: 'The part of the challenge to view',
		}),
	};

	public async run(): Promise<void> {
		// Parse the arguments
		const { args, flags } = await this.parse(View);
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

		// Validate the part
		if (flags.part && flags.part !== '1' && flags.part !== '2' && flags.part !== 'both') {
			this.error('Part must be either 1, 2 or both. Your input: ' + flags.part);
		}

		// Get the session cookie
		const configPath = path.join(__dirname, '..', '..', 'config.json');
		const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
		const sessionCookie = config.session;

		// Retrieve the text
		let text = '';
		const endpoint = 'https://adventofcode.com';


		const response = await axios.get(`${endpoint}/${year}/day/${day}`, {
			headers: {
				cookie: `session=${sessionCookie}`,
			},
		});

		text = response.data;

		// Parse the HTML
		const page = cheerio.load(text);

		// Get the challenge text
		const challengeText = page('.day-desc').text().trim();

		const [ part1, part2 ] = challengeText.split('--- Part Two ---');
		let part2Access = true;

		if (!part2 && flags.part === '2') {
			this.error('You don\'t have the second part of the challenge yet.');
		} else if (!part2 && flags.part === 'both') {
			part2Access = false;
		}

		const regex = /--- Day (\d+): (.+?) ---/;
		const match = part1.match(regex);
		const title = match ? match[2] : 'Unknown Challenge';
		const titleText = `--- Day ${day}: ${title} ---`;

		// Display the challenge text
		if (flags.part) this.log(titleText);
		if (flags.part === '1' || flags.part === 'both') {
			this.log('\n--- Part One ---\n');
			this.log(part1.trim().replace(titleText, ''));
		}
		if (flags.part === '2' || flags.part === 'both') {
			this.log('\n--- Part Two ---\n');
			if (part2Access) {
				this.log(part2.trim());
			} else {
				this.log('You don\'t have the second part of the challenge yet.');
			}
		}
	}
}
