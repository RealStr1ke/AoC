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
		if (flags.list || flags.private) {
			// Get all private leaderboards
			const response = await axios.get(`https://adventofcode.com/${year}/leaderboard/private`, {
				headers: {
					cookie: `session=${sessionCookie}`,
				},
			});

			const page = cheerio.load(response.data);
			// Parse user's name and own private leaderboard code
			const username = page('.user').first().text().split(' ')[0].trim();
			const userCode = page('code').first().text().split('-')[0] || 'N/A';

			// Parse other private leaderboards
			const leaderboards: { code: string; owner: string }[] = [];
			page('div').each((_, element) => {
				const viewLink = page(element).find('a[href*="/leaderboard/private/view/"]');
				if (viewLink.length) {
					const code = viewLink.attr('href')?.split('/').pop() || '';
					const owner = page(element).text().split(']').pop()?.trim() || '';
					if (code && owner) {
						leaderboards.push({ code, owner });
					}
				}
			});
			if (leaderboards.length === 0 && !userCode) {
				this.error('No private leaderboards found.');
			} else if (flags.list) {
				this.log(`${chalk.bold.hex('#FDFD66')('Private Leaderboards:\n')}`);
				if (userCode) {
					this.log(`${chalk.bold.greenBright(`${username} (You)`)}: ${chalk.italic.gray(userCode)}\n`);
				}
				leaderboards.forEach(lb => {
					this.log(`${chalk.bold.whiteBright(lb.owner)}: ${chalk.italic.gray(lb.code)}`);
				});
			} else if (flags.private) {
				leaderboards.push({ code: userCode, owner: username });

				const plResponse = await axios.get(`https://adventofcode.com/${year}/leaderboard/private/view/${flags.private}.json`, {
					headers: {
						cookie: `session=${sessionCookie}`,
					},
				});

				const plData = plResponse.data;

				const membersRaw = Object.values(plData.members).sort((a: any, b: any) => b.local_score - a.local_score);

				interface Member {
					name: string;
					score: {
						local: number;
						global: number;
					}
					stars: number;
					completion: Record<string,
						Record<string, {
							completed: boolean;
							timestamp: number;
						}
					>>
				}

				type DayCompletion = Record<string, { get_star_ts: number }>;

				const members: Member[] = membersRaw.map((member: any) => {
					const completion: Record<string, Record<string, { completed: boolean; timestamp: number }>> = {};
					for (const [day, data] of Object.entries(member.completion_day_level)) {
						const part1 = (data as DayCompletion)['1'];
						const part2 = (data as DayCompletion)['2'];
						completion[day] = {
							'part1': {
								completed: part1 !== undefined,
								timestamp: part1?.get_star_ts || 0,
							},
							'part2': {
								completed: part2 !== undefined,
								timestamp: part2?.get_star_ts || 0,
							},
						};
					}
					return {
						name: member.name,
						score: {
							local: member.local_score,
							global: member.global_score,
						},
						stars: member.stars,
						completion,
					};
				});

				// Sort members by local score (descending)
				members.sort((a, b) => b.score.local - a.score.local);

				if (explicit) {
					// Logic for displaying private leaderboard for specific day
				} else {
					// Leaderboard calendar header
					const daysTop 	 = '         1111111111222222'.split('');
					const daysBottom = '1234567890123456789012345'.split('');

					for (let i = 0; i < 25; i++) {
						const iDay = Date.now() > new Date(year, 11, i + 1).getTime() ? chalk.green : chalk.gray;
						daysTop[i] = iDay(daysTop[i]);
						daysBottom[i] = iDay(daysBottom[i]);
					}


					this.log('          ' + daysTop.join(''));
					this.log('          ' + daysBottom.join(''));


					// Create star visualization for each member
					members.forEach((member, index) => {
						let stars = '';
						for (let day = 1; day <= 25; day++) {
							const dayCompletion = member.completion[day];
							if (!dayCompletion) {
								stars += chalk.white('─');
							} else if (dayCompletion.part2.completed) {
								stars += chalk.yellow('*');
							} else if (dayCompletion.part1.completed) {
								stars += chalk.gray('*');
							} else {
								stars += chalk.white('─');
							}
						}

						// Format the output line with padding
						const position = `${index + 1})`.padStart(4);
						const score = `${member.score.local}`.padStart(4);
						const name = member.name || 'anonymous';

						this.log(`${position} ${score} ${stars}  ${name}`);
					});
				}
			}
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
