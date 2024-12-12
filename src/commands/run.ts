import { Args, Command, Flags } from '@oclif/core';
import fs from 'fs';
import path from 'path';
// @ts-expect-error - I'm assuming statman-stopwatch isn't ESM compatible or whatever
import Stopwatch from 'statman-stopwatch';

export default class Run extends Command {
	static summary = 'Runs the solution for the given challenge';
	static description = 'Runs the solution for the given year and day with the given part. This will save the result to the `config.json` file for later use. If no part is given, it runs both parts.';
	static hidden = false;
	static usage = 'aocs run (year) (day) -p [part]';
	static examples = [
		{
			command: 'aocs run 2024 3 -p 1',
			description: 'Runs the solution for the Day 3 of AoC\'s 2020 calendar for part 1 and saves the result',
		},
		{
			command: 'aocs run 2015 7 -p both',
			description: 'Runs the solution for the Day 7 of AoC\'s 2015 calendar for both parts and saves the results',
		},
	];
	static strict = false;
	static aliases = [
		'r',
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
			description: 'The part of the challenge to run',
		}),
	};

	private runPart(day: any, part: number): { result: number, time: number } {
		const stopwatch = new Stopwatch();
		stopwatch.start();
		const result = day.default[`part${part}`]();
		stopwatch.stop();

		return { result, time: stopwatch.read().toPrecision(3) };
	}

	public async run(): Promise<void> {
		// Parse the arguments
		const { args, flags } = await this.parse(Run);
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
		if (flags.part !== '1' && flags.part !== '2' && flags.part !== 'both') {
			this.error('Part must be either `1`, `2`, or `both`. Your input: ' + flags.part);
		}

		// Check if the challenge exists
		const dir = path.join(__dirname, '..', '..', 'events', year.toString(), 'days', day.toString());
		const indexPath = path.join(dir, 'index.js');
		if (!fs.existsSync(indexPath)) {
			this.error('The challenge\'s `index.js` file does not exist. Please create it first.');
		}

		// Load the config file
		const configPath = path.join(__dirname, '..', '..', 'config.json');
		const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
		if (config.results === undefined) config.results = {};
		if (config.results[year] === undefined) config.results[year] = {};
		if (config.results[year][day] === undefined) config.results[year][day] = {};

		// Run the solution
		const solution = await import(indexPath);
		if (flags.part === '1' || flags.part === 'both') {
			const { result, time } = this.runPart(solution, 1);
			this.log(`Part 1: ${result} (in ${time} ms)`);
			config.results[year][day].part1 = result;
		}

		if (flags.part === '2' || flags.part === 'both') {
			const { result, time } = this.runPart(solution, 2);
			this.log(`Part 2: ${result} (in ${time} ms)`);
			config.results[year][day].part2 = result;
		}

		// Save the results
		fs.writeFileSync(configPath, JSON.stringify(config, null, 4));
		this.log('Results saved to `config.json`');

		return;
	}
}
