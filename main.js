const fs = require('fs');
const Stopwatch = require('statman-stopwatch');
const commandLineArgs = require('command-line-args');

// Define command line arguments
const optionDefinitions = [
	{ name: 'year', alias: 'y', type: Number },
	{ name: 'day', alias: 'd', type: Number },
	{ name: 'part', alias: 'p', type: Number },
	{ name: 'help', alias: 'h', type: Boolean },
];

const args = commandLineArgs(optionDefinitions);

// If year is not specified, default to current year
const year = args.year || new Date().getFullYear();

// Find all of the years in the events folder


if (args.day && args.part) {
	const stopwatch = new Stopwatch(true);
	const result = days[args.day][`part${args.part}`]();
	console.log(`❄️ | Year ${year}, Day ${args.day} (Part ${args.part}) Result: ${result}`);
	console.log(`❄️ | Execution Time: ${stopwatch.read().toPrecision(3)}ms`);
} else if (args.help) {
	console.log('❄️ | Usage: node main.js -y [year] -d [day] -p [part]');
} else {
	console.log('❄️ | Please specify a year, day and part number with the -y, -d and -p flags');
}