import { Args, Command } from '@oclif/core';
import fs from 'fs';
import path from 'path';
import axios from 'axios';
import chalk from 'chalk';
import * as cheerio from 'cheerio';

export default class Stats extends Command {
	static summary = 'Displays the global completion stats for the given year.';
	static description = 'Displays the global completion stats for the given year. If no year is given, it\'ll display the stats for the current year.';
	static hidden = false;
	static usage = 'aocs stats (year)';
	static examples = [
		{
			command: 'aocs stats 2019',
			description: 'Displays the global completion stats for 2019.',
		},
		{
			command: 'aocs stats',
			description: 'Displays the global completion stats for the current year.',
		},
	];
	static strict = false;
	static hiddenAliases = [
		'st',
	];
	static enableJsonFlag: false;


	static args = {
		year: Args.integer({
			description: 'The challenge\'s year',
		}),
	};

	static flags = {};

	public async run(): Promise<void> {
		// Parse the arguments
		const { args } = await this.parse(Stats);
		const year = args.year ?? new Date().getFullYear();
		const explicit = args.year ?? false;

		// Validate the input
		if (!explicit && new Date().getMonth() !== 11) {
			this.error('You must specify the year explicitly if it is not December.');
		}

		// Validate the year and day
		if (year < 2015 || year > new Date().getFullYear()) {
			this.error('Year must be between 2015 and the current year. Your input: ' + year);
		}


		// Get the session cookie
		const configPath = path.join(__dirname, '..', '..', 'config.json');
		const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
		const sessionCookie = config.session;

		// Retrieve the text
		let text = '';
		const endpoint = 'https://adventofcode.com';


		const response = await axios.get(`${endpoint}/${year}/stats`, {
			headers: {
				cookie: `session=${sessionCookie}`,
			},
		});

		text = response.data;

		// console.log(text);

		// Parse the HTML
		const page = cheerio.load(text);

		// Get the stats
		const stats = page('pre.stats a').map((_, el) => {
			const day = page(el).text().match(/\d+/)?.[0] ?? '';
			const both = page(el).find('.stats-both').first().text().trim();
			const first = page(el).find('.stats-firstonly').first().text().trim();
			const bothStars = page(el).find('.stats-both').last().text().length;
			const firstStars = page(el).find('.stats-firstonly').last().text().length;

			return {
				day: parseInt(day),
				bothComplete: parseInt(both.replace(/,/g, '')),
				firstOnly: parseInt(first.replace(/,/g, '')),
				bothStars: bothStars,
				firstStars: firstStars,
			};
		}).get().reverse();

		this.log(`${chalk.bold.green(`Global completion stats for ${chalk.italic.yellow(year)}:`)}`);
		for (let i = stats.length - 1; i >= 0; i--) {
			const day = stats[i];
			const bothStars = chalk.yellow('*'.repeat(day.bothStars));
			const firstStars = chalk.gray('*'.repeat(day.firstStars));
			// this.log(`Day ${day.day}: ${bothStars}${firstStars} (${day.bothComplete} both, ${day.firstOnly} first)`);
			this.log(` ${chalk.italic.bold.green(day.day.toString().padStart(2, ' ') + ':')} ${bothStars}${firstStars} ${chalk.white(`(${chalk.yellow(`${day.bothComplete} both`)}, ${chalk.gray(`${day.firstOnly} first`)})`)}`);
		}
	}
}
