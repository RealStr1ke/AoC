import { Args, Command, Flags } from '@oclif/core';
import fs from 'fs';
import path from 'path';
import axios from 'axios';
import chalk from 'chalk';
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
	static hiddenAliases = [
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
			default: 'both',
		}),
	};

	public async run(): Promise<void> {
		// Parse the arguments
		const { args, flags } = await this.parse(View);
		const year = args.year ?? new Date().getFullYear();
		const day = args.day ?? new Date().getDate();
		const explicit = {
			year: args.year !== undefined,
			day: args.day !== undefined,
		};

		// Get the available years
		const eventsHTML = await axios.get('https://adventofcode.com/2024/events');
		const eventsPage = cheerio.load(eventsHTML.data);
		const eventYears: number[] = [];
		eventsPage('.eventlist-event a').each((_, element) => { eventYears.push(parseInt(eventsPage(element).text().replace(/\[|\]/g, ''))); });

		// Validate the input
		if ((!explicit.year || !explicit.day) && new Date().getMonth() !== 11) {
			this.error('You must specify the year and day explicitly since the current month isn\'t December.');
		} else if (!eventYears.includes(year)) {
			this.error('The year you specified is not available. The available years are: ' + eventYears.join(', '));
		} else if (!explicit.day && new Date().getDate() > (year >= 2025 ? 12 : 25)) {
			this.error(`You must specify the day explicitly since the current day is after the ${year >= 2025 ? 12 : 25}th.`);
		} else if (day > (year >= 2025 ? 12 : 25) || day < 1) {
			this.error(`Day must be between 1 and ${year >= 2025 ? 12 : 25} for year ${year}. Your input: ${day}`);
		} else if (flags.part && flags.part !== '1' && flags.part !== '2' && flags.part !== 'both') {
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

		const dayDescElements = page('article.day-desc');
		const part2Access = dayDescElements.length === 2;

		const processedText: string[] = [];
		dayDescElements.each((i, elem) => {
			let rawText = page(elem).html() ?? '';
			rawText = rawText
				.replace(/<code>(.*?)<\/code>/g, (_, p1) => chalk.gray.italic(p1))
				.replace(/<em>(.*?)<\/em>/g, (_, p1) => chalk.italic(p1))
				.replace(/<pre><code>([\s\S]*?)<\/code><\/pre>/g, (_, p1) => chalk.gray.italic(p1))
				.replace(/<strong>(.*?)<\/strong>/g, (_, p1) => chalk.yellow.italic(p1))
				.replace(/<[^>]+>/g, '')
				.replace(/&gt;/g, '>')
				.replace(/&lt;/g, '<')
				.trim();
			processedText.push(rawText);
		});

		const regex = /--- Day (\d+): (.+?) ---/;
		const match = processedText[0].match(regex);
		const title = match ? match[2] : 'Unknown Challenge';
		const titleText = `--- Day ${day}: ${title} ---`;

		if (!part2Access && flags.part === '2') {
			this.error('You don\'t have access to the second part of the challenge yet.');
		}

		// Display the challenge text
		if (flags.part) this.log(chalk.hex('#00CC00').underline.bold(titleText));
		if (flags.part === '1' || flags.part === 'both') {
			const part1 = processedText[0];
			this.log(chalk.hex('#FDFD66').underline.italic('\n-- Part One --'));
			// this.log(chalk.hex('#CCCCCC')(part1.trim().replace(titleText, '')));
			this.log(chalk.green(part1.trim().replace(titleText, '')));
		}
		if (flags.part === '2' || flags.part === 'both') {
			const part2 = processedText[1];
			this.log(chalk.hex('#FDFD66').underline.italic('\n-- Part Two --'));
			if (part2Access) {
				// this.log(chalk.hex('#CCCCCC')(part2.replace('--- Part Two ---', '').trim()));
				this.log(chalk.green(part2.replace('--- Part Two ---', '').trim()));
			} else {
				this.log(chalk.yellow('You don\'t have access to the second part of the challenge yet.'));
			}
		}
	}
}
