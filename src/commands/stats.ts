import { Args, Command, Flags } from '@oclif/core';
import fs from 'fs';
import path from 'path';
import axios from 'axios';
import chalk from 'chalk';
import * as cheerio from 'cheerio';

export default class Stats extends Command {
	static summary = 'Displays the global or personal completion stats for the given year.';
	static description = 'Displays the global or personal completion stats for the given year. If no year is given, it\'ll display the stats for the current year. Note: Global stats are only available for years 2015-2024.';
	static hidden = false;
	static usage = 'aocs stats (year) [--global] [--personal]';
	static examples = [
		{
			command: 'aocs stats',
			description: 'Displays the global completion stats for the current year (if available).',
		},
		{
			command: 'aocs stats 2024 --global',
			description: 'Displays the global completion stats for 2024.',
		},
		{
			command: 'aocs stats 2025 --personal',
			description: 'Displays the personal completion stats for 2025 (global not available).',
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

	static flags = {
		global: Flags.boolean({
			char: 'g',
			description: 'Show global completion stats (2015-2024 only)',
			default: true,
			exclusive: ['personal'],
		}),
		personal: Flags.boolean({
			char: 'p',
			description: 'Show personal completion stats',
			exclusive: ['global'],
		}),
	};

	public async run(): Promise<void> {
		// Parse the arguments
		const { args, flags } = await this.parse(Stats);
		const year = args.year ?? new Date().getFullYear();
		const explicit = {
			year: args.year !== undefined,
		};

		// Get the available years
		const eventsHTML = await axios.get('https://adventofcode.com/2024/events');
		const eventsPage = cheerio.load(eventsHTML.data);
		const eventYears: number[] = [];
		eventsPage('.eventlist-event a').each((_, element) => { eventYears.push(parseInt(eventsPage(element).text().replace(/\[|\]/g, ''))); });

		// Validate the input
		if (!explicit.year && new Date().getMonth() !== 11) {
			this.error('You must specify the year explicitly since the current month isn\'t December.');
		} else if (!eventYears.includes(year)) {
			this.error('The year you specified is not available. The available years are: ' + eventYears.join(', '));
		}

		// Get the session cookie
		const configPath = path.join(__dirname, '..', '..', 'config.json');
		const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
		const sessionCookie = config.session;

		// Handle personal stats
		if (flags.personal) {
			const personalStatsResponse = await axios.get(`https://adventofcode.com/${year}/leaderboard/self`, {
				headers: {
					cookie: `session=${sessionCookie}`,
				},
			});

			interface DayStats {
				day: number;
				part1: {
					completed: boolean;
					timeTaken?: string;
					rank?: number;
					score?: number;
				}
				part2: {
					completed: boolean;
					timeTaken?: string;
					rank?: number;
					score?: number;
				}
			}

			// Parse the HTML content
			const $ = cheerio.load(personalStatsResponse.data);
			const days: DayStats[] = [];

			// Get the raw stats text and split into lines
			const statsText = $('pre').text();
			const lines = statsText.split('\n').filter(line => line.trim());

			// Skip the header lines
			for (let i = 2; i < lines.length; i++) {
				const line = lines[i];
				const parts = line.trim().split(/\s+/);

				const dayNum = parseInt(parts[0], 10);
				const part1Time = parts[1] === '-' ? undefined : parts[1];
				const part1Rank = parts[2] === '-' ? undefined : parseInt(parts[2], 10);
				const part1Score = parts[3] === '-' ? undefined : parseInt(parts[3], 10);
				const part2Time = parts[4] === '-' ? undefined : parts[4];
				const part2Rank = parts[5] === '-' ? undefined : parseInt(parts[5], 10);
				const part2Score = parts[6] === '-' ? undefined : parseInt(parts[6], 10);

				days.push({
					day: dayNum,
					part1: {
						completed: part1Time !== undefined,
						timeTaken: part1Time,
						rank: part1Rank,
						score: part1Score,
					},
					part2: {
						completed: part2Time !== undefined,
						timeTaken: part2Time,
						rank: part2Rank,
						score: part2Score,
					},
				});
			}

			// Sort days in ascending order
			days.sort((a, b) => a.day - b.day);

			// Display the stats
			this.log(chalk.bold.hex('#FDFD66')(`Personal Stats for ${year}:`));

			// Display column header explanation
			this.log(chalk.gray('Each part shows: ') +
				chalk.green('Time') + chalk.gray(' | ') +
				chalk.blue('Rank') + chalk.gray(' | ') +
				chalk.magenta('Score'));
			this.log();

			// Create header row
			this.log(` ${chalk.white.bold('Day'.padEnd(6))}${chalk.yellow.bold('Part 1'.padEnd(30))}${chalk.yellow.bold('Part 2'.padEnd(30))}`);
			this.log(chalk.gray('─'.repeat(65)));

			// Map of days for easy access
			const daysMap = new Map(days.map(d => [d.day, d]));

			// Display all days 1-25
			for (let i = 1; i <= 25; i++) {
				const dayStats = daysMap.get(i);
				const dayNum = i.toString().padStart(3, ' ');
				const challengeStart = new Date(year, 11, i);
				const now = new Date();
				const isAccessible = now >= challengeStart;

				// Calculate time until accessible if not yet available
				let waitTimeString = '';
				if (!isAccessible) {
					const diffMs = challengeStart.getTime() - now.getTime();
					const daysUntil = Math.floor(diffMs / (1000 * 60 * 60 * 24));
					const hours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
					const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
					const seconds = Math.floor((diffMs % (1000 * 60)) / 1000);

					const parts = [];
					if (daysUntil > 0) parts.push(`${daysUntil}d`);
					if (hours > 0) parts.push(`${hours}h`);
					if (minutes > 0) parts.push(`${minutes}m`);
					if (seconds > 0) parts.push(`${seconds}s`);
					waitTimeString = `Accessible in ${parts.join(' ')}`;
				}

				// Format part 1 stats
				let part1Stats = isAccessible ?
					chalk.gray('Not completed'.padEnd(28)) :
					chalk.gray(waitTimeString.padEnd(28));

				if (dayStats?.part1.completed) {
					part1Stats = `${chalk.green(dayStats.part1.timeTaken?.padEnd(12) ?? '')}` +
						`${chalk.blue(dayStats.part1.rank?.toString().padStart(8) ?? '')}` +
						`${chalk.magenta(dayStats.part1.score?.toString().padStart(8) ?? '')}`;
				}

				// Format part 2 stats
				let part2Stats = isAccessible ?
					chalk.gray('Not completed'.padEnd(28)) :
					chalk.gray(waitTimeString.padEnd(28));

				if (dayStats?.part2.completed) {
					part2Stats = `${chalk.green(dayStats.part2.timeTaken?.padEnd(12) ?? '')}` +
						`${chalk.blue(dayStats.part2.rank?.toString().padStart(8) ?? '')}` +
						`${chalk.magenta(dayStats.part2.score?.toString().padStart(8) ?? '')}`;
				}

				this.log(` ${chalk.white(dayNum)}   ${part1Stats}  ${part2Stats}`);
			}

			return;
		}

		// Handle global stats (default)
		if (flags.global) {
			// Check if global stats are available for this year
			if (year >= 2025) {
				this.log(chalk.yellow.bold('Global stats are no longer available starting from 2025.'));
				this.log(chalk.gray('As announced by Eric Wastl, global leaderboards and stats were discontinued'));
				this.log(chalk.gray('to reduce stress and prevent competitive behavior.'));
				this.log();
				this.log(chalk.cyan('You can still use personal stats: ') + chalk.white(`aocs stats ${year} --personal`));
				return;
			}

			// Retrieve the text
			let text = '';
			const endpoint = 'https://adventofcode.com';

			const response = await axios.get(`${endpoint}/${year}/stats`, {
				headers: {
					cookie: `session=${sessionCookie}`,
				},
			});

			text = response.data;

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
				this.log(` ${chalk.italic.bold.green(day.day.toString().padStart(2, ' ') + ':')} ${bothStars}${firstStars} ${chalk.white(`(${chalk.yellow(`${day.bothComplete} both`)}, ${chalk.gray(`${day.firstOnly} first`)})`)}`);
			}
		}
	}
}
