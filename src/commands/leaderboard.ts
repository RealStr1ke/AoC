import { Args, Command, Flags } from '@oclif/core';
import fs from 'fs';
import path from 'path';
import axios from 'axios';
import chalk from 'chalk';
import terminalLink from 'terminal-link';
import * as cheerio from 'cheerio';

export default class Leaderboard extends Command {
	static summary = 'Displays global/private leaderboards.';
	static description = 'Displays global and private points/daily leaderboards for Advent of Code challenges. Defaults to current year if not specified. Defaults to global points leaderboard if no flags are specified. Note: Global leaderboards are only available for years 2015-2024.';
	static hidden = false;
	static usage = 'aocs leaderboard (year) (day) [--global] [--private <code>] [--list]';
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
			command: 'aocs leaderboard 2023 15 --global',
			description: 'Shows completion times leaderboard for both parts of day 15, 2023',
		},
		{
			command: 'aocs leaderboard 2025 --private 123456',
			description: 'Shows private leaderboard with code 123456 for 2025 (global not available)',
		},
		{
			command: 'aocs leaderboard --list',
			description: 'Lists all available private leaderboards',
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
		global: Flags.boolean({
			char: 'g',
			description: 'Show global points leaderboard for the year (2015-2024 only)',
			exclusive: ['private', 'list'],
			default: true,
		}),
		private: Flags.string({
			char: 'r',
			description: 'Show private leaderboard for given code',
			exclusive: ['global', 'list'],
		}),
		list: Flags.boolean({
			char: 'l',
			description: 'List all available private leaderboards',
			exclusive: ['global', 'private'],
		}),
	};

	public async run(): Promise<void> {
		// Parse the arguments
		const { args, flags } = await this.parse(Leaderboard);
		const year = args.year ?? new Date().getFullYear();
		const day = args.day ?? new Date().getDate();
		const explicit = {
			year: args.year !== undefined,
			day: args.day !== undefined,
		};

		// Get the available years
		const eventsHTML = await axios.get('https://adventofcode.com/2024/events');
		const eventsPage = cheerio.load(eventsHTML.data);
		const eventYears: number[] = [];
		eventsPage('.eventlist-event a').each((_, element) => { eventYears.push(parseInt(eventsPage(element).text().replace(/\[|\]/g, ''))); });

		// Validate the input
		if (!explicit.year && new Date().getMonth() !== 11) {
			this.error('You must specify the year and day explicitly since the current month isn\'t December.');
		} else if (!eventYears.includes(year)) {
			this.error('The year you specified is not available. The available years are: ' + eventYears.join(', '));
		} else if (day > (year >= 2025 ? 12 : 25) || day < 1) {
			this.error(`Day must be between 1 and ${year >= 2025 ? 12 : 25} for year ${year}. Your input: ${day}`);
		}

		// Get the session cookie
		const configPath = path.join(__dirname, '..', '..', 'config.json');
		const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
		const sessionCookie = config.session;

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

				if (explicit.day) {
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
					this.log(`${chalk.bold(`${chalk.hex('#FDFD66')(leaderboard?.owner)}'s ${chalk.italic(`Private Leaderboard for ${year}`)}:`)}\n`);

					// Leaderboard calendar header - adjust for different years
					const maxDays = year >= 2025 ? 12 : 25;
					let daysTop: string[];
					let daysBottom: string[];

					if (year >= 2025) {
						// For 12 days: "123456789012"
						daysTop = '            '.split(''); // 12 spaces
						daysBottom = '123456789012'.split('');
					} else {
						// For 25 days: original format
						daysTop = '         1111111111222222'.split('');
						daysBottom = '1234567890123456789012345'.split('');
					}

					for (let i = 0; i < maxDays; i++) {
						const iDay = Date.now() > new Date(year, 11, i + 1).getTime() ? chalk.green : chalk.gray;
						daysTop[i] = iDay(daysTop[i]);
						daysBottom[i] = iDay(daysBottom[i]);
					}

					this.log('          ' + daysTop.join(''));
					this.log('          ' + daysBottom.join(''));

					// Create star visualization for each member
					members.forEach((member, index) => {
						let stars = '';
						for (let dayNum = 1; dayNum <= maxDays; dayNum++) {
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

		// Handle global leaderboard flag (default)
		if (flags.global) {
			// Check if global leaderboards are available for this year
			if (year >= 2025) {
				this.log(chalk.yellow.bold('Global leaderboards are no longer available starting from 2025.'));
				this.log(chalk.gray('As announced by Eric Wastl, global leaderboards were discontinued to reduce'));
				this.log(chalk.gray('stress and prevent competitive behavior that went against the spirit of AoC.'));
				this.log();
				this.log(chalk.cyan('You can still use:'));
				this.log(chalk.cyan('• Private leaderboards: ') + chalk.white(`aocs leaderboard ${year} --private <code>`));
				this.log(chalk.cyan('• List private leaderboards: ') + chalk.white(`aocs leaderboard ${year} --list`));
				return;
			}

			if (explicit.day) {
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
			} else {
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
}
