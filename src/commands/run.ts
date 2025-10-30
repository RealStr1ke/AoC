import { Args, Command, Flags } from '@oclif/core';
import fs from 'fs';
import path from 'path';
// @ts-expect-error - I'm assuming statman-stopwatch isn't ESM compatible or whatever
import Stopwatch from 'statman-stopwatch';
// @ts-expect-error - I'm assuming cli-spinner isn't ESM compatible or whatever
import { Spinner } from 'cli-spinner';
import chalk from 'chalk';

export default class Run extends Command {
	static summary = 'Runs the solution for the given challenge.';
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
	static hiddenAliases = [
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
		const explicit = {
			year: args.year !== undefined,
			day: args.day !== undefined,
		};

		// Set default spinner text
		Spinner.setDefaultSpinnerString(18);

		// Start spinner for validating input
		const validatingSpinner = new Spinner({
			text: chalk.gray('Validating command input... %s'),
			stream: process.stderr,
			onTick: function(msg: string) {
				this.clearLine(this.stream);
				this.stream.write(msg);
			},
		});
		validatingSpinner.start();

		// Validate the input
		if ((!explicit.year || !explicit.day) && new Date().getMonth() !== 11) {
			this.error('You must specify the year and day explicitly since the current month isn\'t December.');
		} else if (!explicit.day && new Date().getDate() > (year >= 2025 ? 12 : 25)) {
			this.error(`You must specify the day explicitly since the current day is after the ${year >= 2025 ? 12 : 25}th.`);
		} else if (day > (year >= 2025 ? 12 : 25) || day < 1) {
			this.error(`Day must be between 1 and ${year >= 2025 ? 12 : 25} for year ${year}. Your input: ${day}`);
		} else if (flags.part && flags.part !== '1' && flags.part !== '2' && flags.part !== 'both') {
			this.error('Part must be either 1, 2 or both. Your input: ' + flags.part);
		}

		// Stop the validating spinner
		validatingSpinner.stop(false);
		this.log(chalk.green('\nSuccessfully validated the command input.'));

		// Check if the challenge exists
		const dir = path.join(__dirname, '..', '..', 'events', year.toString(), 'days', day.toString());
		let indexPath = path.join(dir, 'index.ts');
		if (!fs.existsSync(indexPath)) {
			indexPath = path.join(dir, 'index.js');
			if (!fs.existsSync(indexPath)) {
				this.error(`The challenge for ${year} Day ${day} does not exist.`);
			}
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
			// Start the spinner for part 1
			const part1Spinner = new Spinner({
				text: chalk.gray('Running part 1... %s'),
				stream: process.stderr,
				onTick: function(msg: string) {
					this.clearLine(this.stream);
					this.stream.write(msg);
				},
			});
			part1Spinner.start();
			try {
				const { result, time } = this.runPart(solution, 1);
				part1Spinner.stop(false);
				this.log(`\n${chalk.green.bold('Part 1:')} ${chalk.yellow(result)} ${chalk.gray.italic(`(in ${chalk.white(`${time} ms`)})`)}`);
				config.results[year][day].part1 = result;
			} catch (error) {
				part1Spinner.stop(false);
				config.results[year][day].part1 = 'ERROR';
				this.log(chalk.red('An error occurred while running part 1.\n Error: ' + error));
			}
		}
		if (flags.part === '2' || flags.part === 'both') {
			// Start the spinner for part 2
			const part2Spinner = new Spinner({
				text: chalk.gray('Running part 2... %s'),
				stream: process.stderr,
				onTick: function(msg: string) {
					this.clearLine(this.stream);
					this.stream.write(msg);
				},
			});
			part2Spinner.start();
			try {
				const { result, time } = this.runPart(solution, 2);
				part2Spinner.stop(false);
				this.log(`\n${chalk.green.bold('Part 2:')} ${chalk.yellow(result)} ${chalk.gray.italic(`(in ${chalk.white(`${time} ms`)})`)}`);
				config.results[year][day].part2 = result;
			} catch (error) {
				part2Spinner.stop(false);
				config.results[year][day].part2 = 'ERROR';
				this.log(chalk.red('An error occurred while running part 2.\n Error: ' + error));
			}
		}

		// Save the results
		fs.writeFileSync(configPath, JSON.stringify(config, null, 4));
		this.log(chalk.green(`Results saved to ${chalk.yellow('`config.json`')}`));

		return;
	}
}
