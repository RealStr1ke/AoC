import { Args, Command, Flags } from '@oclif/core';
import fs from 'fs';
import path from 'path';
import axios from 'axios';
import chalk from 'chalk';
import * as cheerio from 'cheerio';

export default class Submit extends Command {
	static summary = 'Submits the result of a solution for the given challenge.';
	static description = 'Submits the solution for the given year and day with the given part. If no solution is given, it\'ll use the solution saved in the `config.json` file.';
	static hidden = false;
	static usage = 'aocs submit (year) (day) [solution] -p [part]';
	static examples = [
		{
			command: 'aocs submit 2024 3 12345 -p 1',
			description: 'Submits the solution `12345` for the Day 3 of AoC\'s 2020 calendar for Part 1',
		},
		{
			command: 'aocs submit 2015 7 12345 -p 2',
			description: 'Submits the solution `12345` for the Day 7 of AoC\'s 2015 calendar for Part 2',
		},

	];
	static strict = false;
	static hiddenAliases = [
		's',
	];
	static enableJsonFlag: false;


	static args = {
		year: Args.integer({
			description: 'The challenge\'s year',
		}),
		day: Args.integer({
			description: 'The challenge\'s day',
		}),
		solution: Args.integer({
			description: 'The solution to submit',
		}),
	};

	static flags = {
		part: Flags.string({
			char: 'p',
			description: 'The part of the challenge to view',
		}),
	};

	private parseResponse(response: string): string {
		const $ = cheerio.load(response);
		const text = $('main').text();
		// const text = 'That\'s the right answer!';
		let result = '';
		// console.log(text.includes('right'));
		if (text.includes('That\'s the right answer!')) {
			result = chalk.green('This answer is correct!');
		} else if (text.includes('too low')) {
			result = chalk.red('This answer is incorrect (too low).');
		} else if (text.includes('too high')) {
			result = chalk.red('This answer is incorrect (too high).');
		} else if (text.includes('That\'s not the right answer')) {
			result = chalk.red('This answer is incorrect.');
		} else if (text.includes('You gave an answer too recently')) {
			const regex = /You have (.+?) left to wait/;
			const matches = text.match(regex);
			if (matches) {
				result = chalk.yellow(`You have ${matches[1]} left before you can submit another answer.`);
			} else {
				result = chalk.yellow('You have to wait before you can submit another answer.');
			}
		} else if (text.includes('You don\'t seem to be solving the right level')) {
			result = chalk.yellow('You have already solved this challenge.');
		} else {
			this.log(text);
			this.error(chalk.red('An error occurred while submitting the answer.'));
		}

		return result;
	}

	public async run(): Promise<void> {
		// Parse the arguments
		const { args, flags } = await this.parse(Submit);
		const year = args.year ?? new Date().getFullYear();
		const day = args.day ?? new Date().getDate();
		const part = flags.part ?? '1';
		const explicit = {
			year: args.year !== undefined,
			day: args.day !== undefined,
			part: flags.part !== undefined,
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
		} else if (!explicit.day && new Date().getDate() > 25) {
			this.error('You must specify the day explicitly since the current day is after the 25th.');
		} else if (day > 25 || day < 1) {
			this.error('Day must be between 1 and 25. Your input: ' + day);
		} else if (flags.part && flags.part !== '1' && flags.part !== '2') {
			this.error('Part must be either 1 or 2. Your input: ' + flags.part);
		}

		// If no solution is provided, get the solution from the config file
		let solution = args.solution;
		if (!args.solution) {
			const configPath = path.join(__dirname, '..', '..', 'config.json');
			const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
			solution = config.results[year]?.[day]?.[`part${part}`];
			if (!solution) {
				this.error('No solution found in the config file. Please provide a solution.');
			}
		}

		// Get the session cookie
		const configPath = path.join(__dirname, '..', '..', 'config.json');
		const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
		const sessionCookie = config.session;

		// Go to the page
		const endpoint = 'https://adventofcode.com';
		const response = await axios.post(`${endpoint}/${year}/day/${day}/answer`,
			`level=${part}&answer=${solution}`,
			{
				headers: {
					cookie: `session=${sessionCookie}`,
				},
			},
		);

		// Parse the response
		const result = this.parseResponse(response.data);
		this.log(result);
	}
}
