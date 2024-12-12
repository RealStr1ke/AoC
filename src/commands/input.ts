import { Args, Command, Flags } from '@oclif/core';
import fs from 'fs';
import path from 'path';
import chalk from 'chalk';
import { Spinner } from 'cli-spinner';
import axios from 'axios';

export default class Input extends Command {
	static summary = 'Gets the input for a challenge';
	static description = 'Displays the correct input for the given year and day. If `--save` is provided, it\'ll save the input to the `input.txt` file in the day\'s folder.';
	static hidden = false;
	static usage = 'aocs input (year) (day) [--save]';
	static examples = [
		{
			command: 'aocs input 2024 3',
			description: 'Displays the input for the Day 3 of AoC\'s 2020 calendar',
		},
		{
			command: 'aocs input 2015 7 --save',
			description: 'Displays the input for the Day 7 of AoC\'s 2015 calendar and saves it to the `input.txt` file',
		},
	];
	static strict = false;
	static aliases = [
		'i',
		'in',
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
		save: Flags.boolean({
			char: 's',
			description: 'Whether or not to save the input',
		}),
	};

	public async run(): Promise<void> {
		// Parse the arguments
		const { args, flags } = await this.parse(Input);
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

		// Get the session cookie
		const configPath = path.join(__dirname, '..', '..', 'config.json');
		const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
		const sessionCookie = config.session;

		// Start spinner for retrieving input
		const inputSpinner = new Spinner({
			text: chalk.gray('Retrieving input... %s'),
			stream: process.stderr,
			onTick: function(msg: string) {
				this.clearLine(this.stream);
				this.stream.write(msg);
			},
		});
		inputSpinner.setSpinnerString(18);
		if (flags.save) inputSpinner.start();

		// Retrieve the input
		let input = '';
		const endpoint = 'https://adventofcode.com';

		await axios.get(`${endpoint}/${year}/day/${day}/input`, {
			headers: {
				cookie: `session=${sessionCookie}`,
			},
		}).then((res) => {
			if (res) {
				input = res.data;
				if (flags.save) inputSpinner.stop(false);
				if (flags.save) this.log(chalk.green('\nSuccessfully retrieved the input.'));
			} else {
				if (flags.save) inputSpinner.stop(false);
				this.log('\n');
				this.log(chalk.red('Failed to retrieve the input. Please check your session cookie.'));
				input = '';
			}
		}).catch((error) => {
			if (flags.save) inputSpinner.stop(false);
			this.log('\n');
			this.log(chalk.red('Failed to retrieve the input. Please check your session cookie. \n Error: ') + error);
			input = '';
		});

		// Save the input if the flag is set, otherwise display it
		if (flags.save) {
			// Create the directory if it doesn't exist
			const dir = path.join(__dirname, '..', '..', 'events', year.toString(), 'days', day.toString());

			const writeInputSpinner = new Spinner({
				text: chalk.gray('Saving input... %s'),
				stream: process.stderr,
				onTick: function(msg: string) {
					this.clearLine(this.stream);
					this.stream.write(msg);
				},
			});
			writeInputSpinner.setSpinnerString(18);
			writeInputSpinner.start();

			try {
				if (!fs.existsSync(dir)) {
					fs.mkdirSync(dir, { recursive: true });
				}

				const inputPath = path.join(dir, 'input.txt');
				fs.writeFileSync(inputPath, input);
				writeInputSpinner.stop(false);
				this.log(chalk.green(`\nInput saved to ${inputPath}`));
			} catch (error) {
				writeInputSpinner.stop(false);
				this.error(chalk.red('\nFailed to save input. \n Error: ') + error);
			}
		} else {
			this.log(chalk.gray(input));
		}
	}
}
