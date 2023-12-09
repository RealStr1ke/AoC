const fs = require('fs');
// const math = require('mathjs');
const Stopwatch = require('statman-stopwatch');

// Find all of the directories in the current directory
const dirs = fs.readdirSync(`${__dirname}/days`, { withFileTypes: true })
	.filter(dirent => dirent.isDirectory()).map(dirent => dirent.name);


// For each directory, find the index.js file and add it to the days object
const days = {};
for (const dir of dirs) {
	days[dir] = require(`${__dirname}/days/${dir}/index.js`);
}

// Based on the command line arguments, run the correct challenge solution function
const commandLineArgs = require('command-line-args');
const optionDefinitions = [
	{ name: 'day', alias: 'd', type: Number },
	{ name: 'part', alias: 'p', type: Number },
    { name: 'help', alias: 'h', type: Boolean },
];

const args = commandLineArgs(optionDefinitions);

if (args.day && args.part) {
	const stopwatch = new Stopwatch(true);
	const result = days[args.day][`part${args.part}`]();
	console.log(`Day ${args.day} (Part ${args.part}) Result: ${result}`);
	console.log(`Execution Time: ${stopwatch.read().toPrecision(3)}ms`);
} else if (args.help) {
    console.log('Usage: node main.js -d [day] -p [part]');
} else {
	console.log('Please specify a day and part number with the -d and -p flags');
}