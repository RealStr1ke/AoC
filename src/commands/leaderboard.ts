import { Args, Command, Flags } from '@oclif/core';
import fs from 'fs';
import path from 'path';
import axios from 'axios';
import chalk from 'chalk';
import * as cheerio from 'cheerio';

export default class Leaderboard extends Command {
	static summary = 'Displays global/private leaderboards and personal stats.';
	static description = 'Shows global points leaderboards, private leaderboards, completion times, and personal stats for Advent of Code challenges. Defaults to current year if not specified. Defaults to global points leaderboard if no flags are specified.';
	static hidden = false;
	static usage = 'aocs leaderboard (year) (day) [--personal] [--global] [--times] [--private <code>] [--list]';
	static examples = [
		{
			command: 'aocs leaderboard 2023',
			description: 'Shows the global points leaderboard for 2023',
		},
		{
			command: 'aocs leaderboard 2023 --global',
			description: 'Shows the global points leaderboard for 2023',
		},
		{
			command: 'aocs leaderboard 2023 15 --times',
			description: 'Shows completion times leaderboard for both parts of day 15, 2023',
		},
		{
			command: 'aocs leaderboard --list',
			description: 'Lists all available private leaderboards',
		},
		{
			command: 'aocs leaderboard 2023 --private 123456',
			description: 'Shows private leaderboard with code 123456 for 2023',
		},
	];
	static strict = false;
	static hiddenAliases = [
		'lb',
	];
	static enableJsonFlag = false;

	static args = {
		year: Args.integer({
			description: 'The challenge\'s year',
		}),
		day: Args.integer({
			description: 'The challenge\'s day',
		}),
	};

	static flags = {
		personal: Flags.boolean({
			char: 'p',
			description: 'Show personal completion times for all days',
			exclusive: ['global', 'times', 'private', 'list'],
		}),
		global: Flags.boolean({
			char: 'g',
			description: 'Show global points leaderboard for the year',
			exclusive: ['personal', 'times', 'private', 'list'],
			default: true,
		}),
		times: Flags.boolean({
			char: 't',
			description: 'Show completion times leaderboard for a specific day',
			exclusive: ['personal', 'global', 'private', 'list'],
		}),
		private: Flags.string({
			char: 'r',
			description: 'Show private leaderboard for given code',
			exclusive: ['personal', 'global', 'times', 'list'],
		}),
		list: Flags.boolean({
			char: 'l',
			description: 'List all available private leaderboards',
			exclusive: ['personal', 'global', 'times', 'private'],
		}),
	};

	public async run(): Promise<void> {
		// Parse the arguments
		const { args, flags } = await this.parse(Leaderboard);
		const year = args.year ?? new Date().getFullYear();
		const day = args.day ?? new Date().getDate();
		const explicit = args.day ?? false;

		// Validate the input
		if (!explicit && new Date().getMonth() !== 11) {
			this.error('You must specify the year and day explicitly if it is not December.');
		}

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

		// Handle list flag
		if (flags.list) {
			// Logic for listing private leaderboards
			return;
		}

		// Handle private leaderboard
		if (flags.private) {
			// Logic for showing private leaderboard
			return;
		}

		// Handle global leaderboard
		if (flags.global) {
			// Logic for showing global points leaderboard
			return;
		}

		// Handle completion times for specific day
		if (flags.times) {
			// Logic for showing completion times leaderboard
			return;
		}

		// Handle personal stats (default)
		if (flags.personal) {
			// Logic for showing personal completion times
			return;
		}
	}
}
