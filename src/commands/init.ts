import { Args, Command } from '@oclif/core';
import fs from 'fs';
import path from 'path';
import chalk from 'chalk';
import inquirer from 'inquirer';

export default class Init extends Command {
	static summary = 'Initializes the CLI.';
	static description = 'Initializes the Advent of Code CLI. This will create a `session.txt` file in the root directory of this repository and prompt you to enter your session cookie in order to save it to that file. You can find your session cookie by logging into the Advent of Code website, opening the developer tools, going to the `Application` tab, and copying the value of the `session` cookie. If `(session)` is provided, it\'ll save that value to the `session.txt` file instead of prompting you.';
	static hidden = false;
	static usage = 'aocs init (session)';
	static examples = [
		{
			command: 'aocs init',
			description: 'Initializes the CLI and prompts you to enter your session cookie',
		},
		{
			command: 'aocs init (session)',
			description: 'Initializes the CLI with the provided session cookie',
		},
	];
	static strict = false;
	static aliases = [];
	static enableJsonFlag: false;

	static args = {
		session: Args.string({
			description: 'Your Advent of Code session cookie',
		}),
	};

	static flags = {};

	public async run(): Promise<void> {
		// Parse the arguments
		const { args } = await this.parse(Init);

		let session = args.session ?? '';
		if (!args.session) {
			const prompt = await inquirer.prompt([
				{
					type: 'input',
					name: 'session',
					message: chalk.blue('Enter your Advent of Code session cookie:'),
				},
			]);
			session = prompt.session;
		}

		const configPath = path.join(__dirname, '..', '..', 'config.json');
		if (!fs.existsSync(configPath)) {
			try {
				fs.writeFileSync(configPath, JSON.stringify({ session }, null, 4));
			} catch (error) {
				this.error(chalk.red('Failed to save session cookie to `config.json` \n Error: ') + error);
			}
		} else {
			try {
				const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
				config.session = session;
				try {
					fs.writeFileSync(configPath, JSON.stringify(config, null, 4));
				} catch (error) {
					this.error(chalk.red('Failed to save session cookie to `config.json` \n Error: ') + error);
				}
			} catch (error) {
				this.error(chalk.red('Failed to save session cookie to `config.json` \n Error: ') + error);
			}
		}
		this.log(chalk.green('Session cookie saved to `config.json`'));

		return;
	}
}
