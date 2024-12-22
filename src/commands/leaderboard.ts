import { Args, Command, Flags } from '@oclif/core';
import fs from 'fs';
import path from 'path';
import axios from 'axios';
import chalk from 'chalk';
import terminalLink from 'terminal-link';
import * as cheerio from 'cheerio';

export default class Leaderboard extends Command {
	static summary = 'Displays global/private leaderboards and personal stats.';
	static description = 'Displays global points leaderboards, private leaderboards, completion times, and personal stats for Advent of Code challenges. Defaults to current year if not specified. Defaults to global points leaderboard if no flags are specified.';
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

		// Handle personal stats flag
		if (flags.personal) {
			const personalStatsResponse = await axios.get(`https://adventofcode.com/${year}/leaderboard/self`, {
				headers: {
					cookie: `session=${sessionCookie}`,
				},
			});

			// console.log(personalStatsResponse.data); process.exit();

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


		// Handle private leaderboard flags
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

				const leaderboard = leaderboards.find(lb => lb.code === flags.private);

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
					for (const [dayNum, data] of Object.entries(member.completion_day_level)) {
						const part1 = (data as DayCompletion)['1'];
						const part2 = (data as DayCompletion)['2'];
						completion[dayNum] = {
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
					this.log(`${chalk.bold(`${chalk.hex('#FDFD66')(leaderboard?.owner)}'s ${chalk.italic(`Private Leaderboard for ${year}, Day ${day}`)}:`)}\n`);

					const part1Members = members
						.filter(m => m.completion[day]?.part1.completed)
						.sort((a, b) => a.completion[day].part1.timestamp - b.completion[day].part1.timestamp);

					const part2Members = members
						.filter(m => m.completion[day]?.part2.completed)
						.sort((a, b) => a.completion[day].part2.timestamp - b.completion[day].part2.timestamp);

					this.log(chalk.yellow.bold.italic('Part 1:'));
					const maxTimeP1 = new Date(Math.max(...part1Members.map(m => m.completion[day].part1.timestamp)) * 1000);
					const maxTimestampMsP1 = maxTimeP1.getTime() - new Date(year, 11, day).getTime();
					const maxHourLengthP1 = Math.floor(maxTimestampMsP1 / (1000 * 60 * 60)).toString().length;
					part1Members.forEach((member, index) => {
						const position = `${index + 1})`.padStart(4);
						const timestamp = new Date(member.completion[day].part1.timestamp * 1000);
						const challengeStart = new Date(year, 11, day);
						const elapsedMs = timestamp.getTime() - challengeStart.getTime();
						const elapsedHours = Math.floor(elapsedMs / (1000 * 60 * 60));
						const elapsedMinutes = Math.floor((elapsedMs % (1000 * 60 * 60)) / (1000 * 60));
						const elapsedSeconds = Math.floor((elapsedMs % (1000 * 60)) / 1000);
						const timeStr = `${elapsedHours.toString().padStart(2, '0').padStart(maxHourLengthP1, ' ')}:${elapsedMinutes.toString().padStart(2, '0')}:${elapsedSeconds.toString().padStart(2, '0')}`;
						const name = member.name || 'anonymous';

						this.log(`${chalk.italic(position)} ${chalk.green(timeStr)} ${name}`);
					});
					if (part1Members.length === 0) {
						this.log(chalk.yellow.italic('No completions yet.'));
					}

					this.log();

					this.log(chalk.yellow.bold.italic('Part 2:'));
					const maxTimeP2 = new Date(Math.max(...part2Members.map(m => m.completion[day].part2.timestamp)) * 1000);
					const maxTimestampMsP2 = maxTimeP2.getTime() - new Date(year, 11, day).getTime();
					const maxHourLengthP2 = Math.floor(maxTimestampMsP2 / (1000 * 60 * 60)).toString().length;
					part2Members.forEach((member, index) => {
						const position = `${index + 1})`.padStart(4);
						const timestamp = new Date(member.completion[day].part2.timestamp * 1000);
						const challengeStart = new Date(year, 11, day);
						const elapsedMs = timestamp.getTime() - challengeStart.getTime();
						const elapsedHours = Math.floor(elapsedMs / (1000 * 60 * 60));
						const elapsedMinutes = Math.floor((elapsedMs % (1000 * 60 * 60)) / (1000 * 60));
						const elapsedSeconds = Math.floor((elapsedMs % (1000 * 60)) / 1000);
						const timeStr = `${elapsedHours.toString().padStart(2, '0').padStart(maxHourLengthP2, ' ')}:${elapsedMinutes.toString().padStart(2, '0')}:${elapsedSeconds.toString().padStart(2, '0')}`;
						const name = member.name || 'anonymous';

						this.log(`${chalk.italic(position)} ${chalk.green(timeStr)} ${name}`);
					});
					if (part2Members.length === 0) {
						this.log(chalk.yellow.italic('No completions yet.'));
					}
				} else {
					this.log(`${chalk.bold(`${chalk.hex('#FDFD66')(leaderboard?.owner)}'s ${chalk.italic('Private Leaderboard for 2024')}:`)}\n`);

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
						for (let dayNum = 1; dayNum <= 25; dayNum++) {
							const dayCompletion = member.completion[dayNum];
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

		// Handle global daily completion leaderboard flag
		if (flags.times) {
			if (!explicit) {
				this.error('You must specify the day explicitly when using the --times flag.');
			}

			const dailyTimesResponse = await axios.get(`https://adventofcode.com/${year}/leaderboard/day/${day}`, {
				headers: {
					cookie: `session=${sessionCookie}`,
				},
			});

			const dailyTimesData = dailyTimesResponse.data;
			const page = cheerio.load(dailyTimesData);

			interface DailyPartMember {
				position: number;
				timeTaken: string;
				dayCompleted: string;
				name: string;
				profileLink?: string;
				sponsor: {
					status: boolean;
					link?: string;
				};
				supporter: boolean;
				anonymous: boolean;
			}

			const dailyLeaderboard = {
				part1: [] as DailyPartMember[],
				part2: [] as DailyPartMember[],
			};

			// Get both sets of entries based on the description text
			const bothStarsDesc = page('p:contains("both stars")').first();
			const firstStarDesc = page('p:contains("first star")').first();

			// All entries between "both stars" and "first star" are part 2 completions
			const part2Entries = bothStarsDesc.nextUntil(firstStarDesc, 'div.leaderboard-entry');

			// All entries after "first star" are part 1 completions
			const part1Entries = firstStarDesc.nextAll('div.leaderboard-entry');

			// Parse both parts
			// @ts-expect-error - TS doesn't like cheerio types apparently lol idk
			const parsePart = (entries: cheerio.Cheerio<cheerio.Element>, part: 'part1' | 'part2') => {
				entries.each((index, element) => {
					const entry = page(element);
					const position = index + 1;

					// Get name and potential profile link
					let name = '';
					let profileLink: string | undefined;
					const nameElement = entry.find('a[href^="https://"]');
					if (nameElement.length) {
						name = nameElement.text();
						profileLink = nameElement.attr('href') || undefined;
					} else if (entry.find('.leaderboard-anon').length) {
						name = `(anonymous user ${entry.find('.leaderboard-anon').text().trim()})`;
					} else {
						name = entry.clone().children().remove().end().text().replace(/\s+/g, ' ').trim();
					}

					// Check if anonymous
					const isAnonymous = name.includes('(anonymous user #');
					if (isAnonymous) {
						name = name.replace('(anonymous user #', '#').replace(')', '');
					}

					// Check supporter status (AoC++)
					const isSupporter = entry.find('.supporter-badge').length > 0;

					// Check sponsor status and link
					const sponsorBadge = entry.find('.sponsor-badge');
					const isSponsor = sponsorBadge.length > 0;
					const sponsorLink = isSponsor ? sponsorBadge.attr('href') : undefined;

					// Get leaderboard time
					const leaderboardTime = entry.find('.leaderboard-time').text().trim();
					const dayCompleted = leaderboardTime.split('  ')[0];
					const timeTaken = leaderboardTime.split('  ')[1];

					dailyLeaderboard[part].push({
						position,
						timeTaken,
						dayCompleted,
						name,
						profileLink,
						sponsor: {
							status: isSponsor,
							link: sponsorLink,
						},
						supporter: isSupporter,
						anonymous: isAnonymous,
					});
				});
			};

			parsePart(part2Entries, 'part2');
			parsePart(part1Entries, 'part1');

			this.log(`${chalk.bold.hex('#FDFD66')(`Global Completion Times for ${year}, Day ${day}:`)}`);
			if (!terminalLink.isSupported) this.log(chalk.gray.italic('Note: Your terminal does not support clickable links, so none will be displayed.'));
			this.log();
			// Display part 2 completions
			this.log(chalk.yellow.bold.italic('Part 2:'));
			dailyLeaderboard.part2.forEach(member => {
				const position = `${member.position})`.padStart(4);
				const time = chalk.green(member.timeTaken.padEnd(9));
				const name = member.anonymous ? chalk.gray(member.name) :
					member.profileLink && terminalLink.isSupported ? terminalLink(chalk.green(member.name), member.profileLink) :
						member.profileLink ? chalk.green(member.name) :
							chalk.white(member.name);
				const badges = [
					member.supporter ? (terminalLink.isSupported ?
						terminalLink(chalk.yellow('(AoC++)'), `https://adventofcode.com/${year}/support`) :
						chalk.yellow('(AoC++)')) + ' ' : '',
					member.sponsor.status ? (terminalLink.isSupported ?
						terminalLink(chalk.blue('(Sponsor)'), `https://adventofcode.com${member.sponsor?.link ?? '/about#sponsors'}`) :
						chalk.blue('(Sponsor)')) + ' ' : '',
				].join('');

				this.log(`${position} ${time} ${name} ${badges}`);
			});

			this.log();

			// Display part 1 completions
			this.log(chalk.yellow.bold.italic('Part 1:'));
			dailyLeaderboard.part1.forEach(member => {
				const position = `${member.position})`.padStart(4);
				const time = chalk.green(member.timeTaken.padEnd(9));
				const name = member.anonymous ? chalk.gray(member.name) :
					member.profileLink && terminalLink.isSupported ? terminalLink(chalk.green(member.name), member.profileLink) :
						member.profileLink ? chalk.green(member.name) :
							chalk.white(member.name);
				const badges = [
					member.supporter ? (terminalLink.isSupported ?
						terminalLink(chalk.yellow('(AoC++)'), `https://adventofcode.com/${year}/support`) :
						chalk.yellow('(AoC++)')) + ' ' : '',
					member.sponsor.status ? (terminalLink.isSupported ?
						terminalLink(chalk.blue('(Sponsor)'), `https://adventofcode.com${member.sponsor?.link ?? '/about#sponsors'}`) :
						chalk.blue('(Sponsor)')) + ' ' : '',
				].join('');

				this.log(`${position} ${time} ${name} ${badges}`);
			});

			this.log();
			return;
		}
		// Handle global leaderboard flag (default)
		if (flags.global) {
			const globalLBResponse = await axios.get(`https://adventofcode.com/${year}/leaderboard`, {
				headers: {
					cookie: `session=${sessionCookie}`,
				},
			});

			interface GlobalMember {
				position: number;
				name: string;
				score: number;
				profileLink?: string;
				sponsor: {
					status: boolean;
					link?: string;
				};
				supporter: boolean;
				anonymous: boolean;
			}

			const globalLBData = globalLBResponse.data;
			const page = cheerio.load(globalLBData);

			// Parse the global leaderboard HTML
			const members: GlobalMember[] = [];
			page('div.leaderboard-entry').each((index, element) => {
				// const position = Number(page(element).find('.leaderboard-position').text().replace(/[^0-9]/g, ''));
				const position = index + 1;
				const score = Number(page(element).find('.leaderboard-totalscore').text().replace(/[^0-9]/g, ''));

				// Get name and potential profile link
				let name = '';
				let profileLink: string | undefined;
				const nameElement = page(element).find('a[href^="https://"]');
				if (nameElement.length) {
					name = nameElement.text();
					profileLink = nameElement.attr('href') || undefined;
				} else {
					// Remove all elements that are within a <span> or <a> tag (unless .leaderboard-anon span exists, then just use the text within that)
					name = page(element).clone().children().remove().end().text().replace(/\s+/g, ' ').trim();

					if (page(element).find('.leaderboard-anon').length) {
						name = `(anonymous user ${page(element).find('.leaderboard-anon').text().trim()})`;
					}


					// name = page(element).clone().children().remove().end().text().replace(/\s+/g, ' ').trim();

				}

				// Check if anonymous
				const isAnonymous = name.includes('(anonymous user #');
				if (isAnonymous) {
					name = name.replace('(anonymous user #', '#').replace(')', '');
				}

				// Check supporter status (AoC++)
				const isSupporter = page(element).find('.supporter-badge').length > 0;

				// Check sponsor status and link
				const sponsorBadge = page(element).find('.sponsor-badge');
				const isSponsor = sponsorBadge.length > 0;
				const sponsorLink = isSponsor ? sponsorBadge.attr('href') : undefined;

				// Add member to the list
				members.push({
					position,
					name,
					score,
					profileLink,
					sponsor: {
						status: isSponsor,
						link: sponsorLink,
					},
					supporter: isSupporter,
					anonymous: isAnonymous,
				});
			});

			this.log(`${chalk.bold.hex('#FDFD66')(`Global Leaderboard for ${year}:`)}`);
			if (!terminalLink.isSupported) this.log(chalk.gray.italic('Note: Your terminal does not support clickable links, so none will be displayed.'));
			this.log();

			members.forEach(member => {
				const position = `${member.position})`.padStart(4);
				const score = `${member.score}`.padStart(4);
				const name = member.anonymous ? chalk.gray(member.name) :
					member.profileLink && terminalLink.isSupported ? terminalLink(chalk.green(member.name), member.profileLink) :
						member.profileLink ? chalk.green(member.name) :
							chalk.white(member.name);
				const badges = [
					member.supporter ? (terminalLink.isSupported ?
						terminalLink(chalk.yellow('(AoC++)'), `https://adventofcode.com/${year}/support`) :
						chalk.yellow('(AoC++)')) + ' ' : '',
					member.sponsor.status ? (terminalLink.isSupported ?
						terminalLink(chalk.blue('(Sponsor)'), `https://adventofcode.com${member.sponsor?.link ?? '/about#sponsors'}`) :
						chalk.blue('(Sponsor)')) + ' ' : '',
				].join('');

				this.log(`${position} ${score} ${name} ${badges}`);
			});
			return;
		}
	}
}
