import fs from 'fs';
import path from 'path';

function expandUniverse(dataLines, count = 1) {
	// dataLines is an array of arrays of chars
	// The only chars are . and #
	// . is empty space
	// # is a galaxy
	// count is the number of times to expand the universe

	// For each column in dataLines, if the column has no galaxies, duplicate the column (by the amount of times specified by count) and place the duplicate columns to the right of the original column
	// First, flip the array so that the columns are now rows
	dataLines = dataLines[0].map((col, i) => dataLines.map(row => row[i]));

	for (let i = 0; i < dataLines.length; i++) {
		const column = dataLines[i];

		if (!column.includes('#')) {
			// console.log(`Column ${i} has no galaxies`)
			for (let j = 0; j < count; j++) {
				dataLines.splice(i + 1, 0, column);
			}
			// Increment i to skip the duplicate column
			i++;
		}
	}

	// Flip the array back so that the rows are now columns
	dataLines = dataLines[0].map((col, i) => dataLines.map(row => row[i]));

	// For each line in dataLines, if the line has no galaxies, duplicate the line and place the duplicate below the original line
	for (let i = 0; i < dataLines.length; i++) {
		const line = dataLines[i];

		// If the line has no galaxies, duplicate the line and place the duplicate below the original line
		if (!line.includes('#')) {
			// console.log(`Row ${i} has no galaxies`)
			for (let j = 0; j < count; j++) {
				dataLines.splice(i + 1, 0, line);
			}
			// Increment i to skip the duplicate line
			i++;
		}
	}

	return dataLines;
}

function expandUniverseAndReturnGalaxies(dataLines, count = 1) {
	const galaxies = [];
	let dataLinesFlipped = dataLines[0].map((col, i) => dataLines.map(row => row[i]));
	dataLinesFlipped = dataLinesFlipped[0].map((col, i) => dataLinesFlipped.map(row => row[i]));
	dataLinesFlipped = dataLinesFlipped[0].map((col, i) => dataLinesFlipped.map(row => row[i]));

	// for (const line of dataLinesFlipped) {
	// 	console.log(line.join(''));
	// }

	let emptyRows = 0;
	for (let i = 0; i < dataLines.length; i++) {
		let emptyColumns = 0;
		const line = dataLines[i];
		if (!line.includes('#')) {
			// console.log(`Row ${i} has no galaxies`)
			emptyRows++;
			continue;
		}

		// If the line has galaxies, for each char in that line, if the char is a galaxy, add the galaxy to the galaxies array
		// with the index of the line being (emptyRows * count) + i and the index of the char being (emptyColumns * count) + j
		for (let j = 0; j < line.length; j++) {
			const column = dataLinesFlipped[j];
			if (!column.includes('#')) {
				// console.log(`Column ${j} has no galaxies`)
				emptyColumns++;
			}
			const char = line[j];
			if (char === '#') {
				galaxies.push({ column: (emptyColumns * count) + j, index: (emptyRows * count) + i, number: galaxies.length + 1 });
			}
		}
	}

	// console.log("Galaxies: ", galaxies);
	return galaxies;
}

// Find shortest path between two galaxies
function pathLengthFinder(galaxies, startGalaxy, endGalaxy) {
	// Find the start and end galaxies in the universe
	const start = galaxies.find(galaxy => galaxy.number === startGalaxy);
	const end = galaxies.find(galaxy => galaxy.number === endGalaxy);

	// Find the shortest path's length between the start and end galaxies by finding the shortest path between the start and end galaxies' columns and indexes
	const pathLength = Math.abs(start.column - end.column) + Math.abs(start.index - end.index);

	// console.log(`Path length between ${startGalaxy} and ${endGalaxy}: ${pathLength}`);

	// Return the path's length
	return pathLength;

}


function part1() {
	const data = fs.readFileSync(path.join(__dirname, 'input.txt'), 'utf8');
	let result = 0;

	// Turn the data into an array of arrays of chars
	const dataLines = data.split('\n').map(line => line.split(''));

	const expandedUniverse = expandUniverse(dataLines, 1);

	// Make an array of all the galaxies
	const galaxies = [];
	for (let i = 0; i < expandedUniverse.length; i++) {
		const line = expandedUniverse[i];
		for (let j = 0; j < line.length; j++) {
			const char = line[j];
			if (char === '#') {
				// console.log(`Galaxy found at ${i}, ${j}`)
				galaxies.push({ column: i, index: j, number: galaxies.length + 1 });
			}
		}
	}

	const pairs = [];
	for (let i = 0; i < galaxies.length; i++) {
		const galaxy = galaxies[i];
		for (let j = i + 1; j < galaxies.length; j++) {
			const otherGalaxy = galaxies[j];
			pairs.push([galaxy.number, otherGalaxy.number]);
		}
	}

	// Find the shortest path between each pair of galaxies
	for (const pair of pairs) {
		result += pathLengthFinder(galaxies, pair[0], pair[1]);
	}

	// Return the result
	return result;
}

function part2() {
	const data = fs.readFileSync(path.join(__dirname, 'input.txt'), 'utf8');
	let result = 0;

	const galaxies = expandUniverseAndReturnGalaxies(data.split('\n').map(line => line.split('')), 999999);

	const pairs = [];
	for (let i = 0; i < galaxies.length; i++) {
		const galaxy = galaxies[i];
		for (let j = i + 1; j < galaxies.length; j++) {
			const otherGalaxy = galaxies[j];
			pairs.push([galaxy.number, otherGalaxy.number]);
		}
	}

	// Find the shortest path between each pair of galaxies
	for (const pair of pairs) {
		result += pathLengthFinder(galaxies, pair[0], pair[1]);
	}

	// Return the result
	return result;
}

console.log(part1());
// console.log(part2())