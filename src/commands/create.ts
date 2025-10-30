import { Args, Command, Flags } from '@oclif/core';
import fs from 'fs';
import path from 'path';
import axios from 'axios';
import chalk from 'chalk';
// @ts-expect-error - I'm assuming cli-spinner isn't ESM compatible or whatever
import { Spinner } from 'cli-spinner';

export default class Create extends Command {
	static summary = 'Setup a new challenge folder.';
	static description = 'Creates a new folder for the given year and day with the template `index.js` solution file, `input.txt` file, and `README.md` file with the challenge description. Note: Years 2025+ have 12 days instead of 25.';
	static hidden = false;
	static usage = 'aocs create (year) (day) [--input]';
	static examples = [
		{
			command: 'aocs create 2024 3',
			description: 'Creates and sets up a new folder for Day 3 of AoC\'s 2024 calendar',
		},
		{
			command: 'aocs create 2025 7 --input',
			description: 'Creates and sets up a new folder for Day 7 of AoC\'s 2025 calendar (12-day format) and retrieves the input',
		},
	];
	static strict = false;
	static hiddenAliases = [
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
		force: Flags.boolean({
			char: 'f',
			description: 'Whether or not to overwrite the existing files',
		}),
	};

	public async run(): Promise<void> {
		// Parse the arguments
		const { args, flags } = await this.parse(Create);
		const year = args.year ?? new Date().getFullYear();
		const day = args.day ?? new Date().getDate();
		const explicit = args.day ?? false;

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
		if (!explicit && new Date().getMonth() !== 11) {
			validatingSpinner.stop(false);
			this.log('\n');
			this.error('You must specify the year and day explicitly if it is not December.');
		}

		// Validate the year and day
		if (year < 2015 || year > new Date().getFullYear()) {
			validatingSpinner.stop(false);
			this.log('\n');
			this.error('Year must be between 2015 and the current year. Your input: ' + year);
		}
		const maxDays = year >= 2025 ? 12 : 25;
		if (day > maxDays || day < 1) {
			validatingSpinner.stop(false);
			this.log('\n');
			this.error(`Day must be between 1 and ${maxDays} for year ${year}. Your input: ${day}`);
		}
		validatingSpinner.stop(false);
		this.log(chalk.green('\nSuccessfully validated the command input.'));

		// Create the directory if it doesn't exist
		const dir = path.join(__dirname, '..', '..', 'events', year.toString(), 'days', day.toString());
		if (!fs.existsSync(dir)) {
			fs.mkdirSync(dir, { recursive: true });
		}

		// Paths
		const inputPath = path.join(dir, 'input.txt');
		const indexPath = path.join(dir, 'index.ts');
		const readmePath = path.join(dir, 'README.md');
		const indexTemplatePath = path.join(__dirname, '..', '..', 'src', 'templates', 'index.ts');
		const readmeTemplatePath = path.join(__dirname, '..', '..', 'src', 'templates', 'README.md');

		// Read the templates
		const indexTemplate = fs.readFileSync(indexTemplatePath, 'utf-8');
		const readmeTemplate = fs.readFileSync(readmeTemplatePath, 'utf-8');

		// Retrieve the input if the flag is set
		let input = '';
		if (flags.input) {
			const inputSpinner = new Spinner({
				text: chalk.gray('Retrieving input... %s'),
				stream: process.stderr,
				onTick: function(msg: string) {
					this.clearLine(this.stream);
					this.stream.write(msg);
				},
			});
			inputSpinner.start();

			const endpoint = 'https://adventofcode.com';
			const configPath = path.join(__dirname, '..', '..', 'config.json');
			const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
			const sessionCookie = config.session;

			await axios.get(`${endpoint}/${year}/day/${day}/input`, {
				headers: {
					cookie: `session=${sessionCookie}`,
				},
			}).then((res) => {
				if (res) {
					input = res.data.trim();
					inputSpinner.stop(false);
					this.log(chalk.green('\nSuccessfully retrieved the input.'));
				} else {
					inputSpinner.stop(false);
					this.log('\n');
					this.log(chalk.red('Failed to retrieve the input. Please check your session cookie.'));
					input = '';
				}
			}).catch((error) => {
				inputSpinner.stop(false);
				this.log('\n');
				this.log(chalk.red('Failed to retrieve the input. Please check your session cookie. \n Error: ') + error);
				input = '';
			});
		}

		// Write the the files
		const writeInputSpinner = new Spinner({
			text: chalk.gray('Writing input file... %s'),
			stream: process.stderr,
			onTick: function(msg: string) {
				this.clearLine(this.stream);
				this.stream.write(msg);
			},
		});
		writeInputSpinner.start();
		if (fs.existsSync(inputPath)) {
			if (flags.force) {
				try {
					fs.writeFileSync(inputPath, input);
					writeInputSpinner.stop(false);
					this.log(chalk.green('\nSuccessfully wrote the input file.'));
				} catch (error) {
					writeInputSpinner.stop(false);
					this.log(chalk.red('\nFailed to write the input file. \n Error: ') + error);
				}
			} else {
				writeInputSpinner.stop(false);
				this.log(chalk.yellow('\nInput file already exists. Use the --force flag to overwrite it.'));
			}
		} else {
			try {
				fs.writeFileSync(inputPath, input);
				writeInputSpinner.stop(false);
				this.log(chalk.green('\nSuccessfully wrote the input file.'));
			} catch (error) {
				writeInputSpinner.stop(false);
				this.log(chalk.red('\nFailed to write the input file. \n Error: ') + error);
			}
		}

		const writeIndexSpinner = new Spinner({
			text: chalk.gray('Writing index file... %s'),
			stream: process.stderr,
			onTick: function(msg: string) {
				this.clearLine(this.stream);
				this.stream.write(msg);
			},
		});
		writeIndexSpinner.start();
		if (fs.existsSync(indexPath)) {
			if (flags.force) {
				try {
					fs.writeFileSync(indexPath, indexTemplate);
					writeIndexSpinner.stop(false);
					this.log(chalk.green('\nSuccessfully wrote the index file.'));
				} catch (error) {
					writeIndexSpinner.stop(false);
					this.log(chalk.red('\nFailed to write the index file. \n Error: ') + error);
				}
			} else {
				writeIndexSpinner.stop(false);
				this.log(chalk.yellow('\nIndex file already exists. Use the --force flag to overwrite it.'));
			}
		} else {
			try {
				fs.writeFileSync(indexPath, indexTemplate);
				writeIndexSpinner.stop(false);
				this.log(chalk.green('\nSuccessfully wrote the index file.'));
			} catch (error) {
				writeIndexSpinner.stop(false);
				this.log(chalk.red('\nFailed to write the index file. \n Error: ') + error);
			}
		}

		const writeReadmeSpinner = new Spinner({
			text: chalk.gray('Writing README file... %s'),
			stream: process.stderr,
			onTick: function(msg: string) {
				this.clearLine(this.stream);
				this.stream.write(msg);
			},
		});
		writeReadmeSpinner.start();
		if (fs.existsSync(readmePath)) {
			if (flags.force) {
				try {
					fs.writeFileSync(readmePath, readmeTemplate);
					writeReadmeSpinner.stop(false);
					this.log(chalk.green('\nSuccessfully wrote the README file.'));
				} catch (error) {
					writeReadmeSpinner.stop(false);
					this.log(chalk.red('\nFailed to write the README file. \n Error: ') + error);
				}
			} else {
				writeReadmeSpinner.stop(false);
				this.log(chalk.yellow('\nREADME file already exists. Use the --force flag to overwrite it.'));
			}
		} else {
			try {
				fs.writeFileSync(readmePath, readmeTemplate);
				writeReadmeSpinner.stop(false);
				this.log(chalk.green('\nSuccessfully wrote the README file.'));
			} catch (error) {
				writeReadmeSpinner.stop(false);
				this.log(chalk.red('\nFailed to write the README file. \n Error: ') + error);
			}
		}

		this.log(chalk.green('Challenge setup complete!'));
	}
}
