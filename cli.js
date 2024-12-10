const fs = require('fs');
const colors = require('colors');
const Stopwatch = require('statman-stopwatch');
const commandLineArgs = require('command-line-args');

function runPart(day, part) {
	const stopwatch = new Stopwatch(true);
	const result = day[`part${part}`]();
	stopwatch.stop();
	return { result, time: stopwatch.read().toPrecision(3) };
}

function updateInput(year, day, session) {

}

function main() {
	// Define command line arguments
	const optionDefinitions = [
		{ name: 'year', alias: 'y', type: Number },
		{ name: 'day', alias: 'd', type: Number },
		{ name: 'part', alias: 'p', type: String },
		{ name: 'help', alias: 'h', type: Boolean },
		{ name: 'input', alias: 'i', type: Boolean, defaultOption: true },
	];

	const args = commandLineArgs(optionDefinitions);

	if (args.input && (!args.year || !args.day)) {
		console.log('❄️ | Please provide both year and day as command-line arguments to retrieve and update the input.');
		process.exit(1);

	}

	// If year is not specified, default to current year
	const year = args.year || new Date().getFullYear();

	// Find all of the years in the events folder
	const years = fs.readdirSync('./events').filter(file => !isNaN(parseInt(file)));

	// If the year is not in the list of years, exit
	if (!years.includes(year.toString())) {
		console.log('❄️ | Year not found');
		process.exit(1);
	}

	// Find all of the days in the year folder
	const days = fs.readdirSync(`./events/${year}/days`).filter(file => !isNaN(parseInt(file)));

	// If the day is not in the list of days, exit
	if (args.day && !days.includes(args.day.toString())) {
		console.log('❄️ | Day not found');
		process.exit(1);
	}

	// If the part is not 1, 2, or both, exit
	if (args.part && !['1', '2', 'both'].includes(args.part)) {
		console.log('❄️ | Part not found');
		process.exit(1);
	}

	if (args.day && args.part) {
		const day = require(`./events/${year}/days/${args.day}/index.js`);
		const stringBuilder = [];
		if (args.part === 'both') {
			const part1 = runPart(day, 1);
			const part2 = runPart(day, 2);
			stringBuilder.push(colors.underline(colors.bold(colors.green(`❄️ | Year ${colors.yellow(args.year)}: Day ${colors.yellow(args.day)}`))));
			stringBuilder.push(colors.bold(colors.green(`   | Part ${colors.yellow('1')}: ${colors.yellow(`${part1.result}`)} ${colors.italic(`(Execution Time: ${colors.yellow(`${part1.time}ms`)})`)}`)));
			stringBuilder.push(colors.bold(colors.green(`   | Part ${colors.yellow('2')}: ${colors.yellow(`${part2.result}`)} ${colors.italic(`(Execution Time: ${colors.yellow(`${part2.time}ms`)})`)}`)));
			stringBuilder.push(colors.bold(colors.italic(colors.green(`   | Total Execution Time: ${colors.yellow(`${(Number(part1.time) + Number(part2.time)).toPrecision(3)}ms`)}`))));
		} else if (parseInt(args.part) === 1 || parseInt(args.part) === 2) {
			const { result, time } = runPart(day, parseInt(args.part));
			stringBuilder.push(colors.underline(colors.bold(colors.green(`❄️ | Year ${colors.yellow(args.year)}: Day ${colors.yellow(args.day)}`))));
			stringBuilder.push(colors.bold(colors.green(`   | Part ${colors.yellow(args.part)}: ${colors.yellow(`${result}`)} ${colors.italic(`(Execution Time: ${colors.yellow(`${time}ms`)})`)}`)));
			stringBuilder.push(colors.bold(colors.italic(colors.green(`   | Total Execution Time: ${colors.yellow(`${time}ms`)}`))));
		}

		console.log(stringBuilder.join('\n'));
	} else if (args.help) {
		console.log('❄️ | Usage: node main.js -y [year] -d [day] -p [part]');
	} else {
		console.log('❄️ | Please specify a year, day and part number with the -y, -d and -p flags');
	}
}

main();