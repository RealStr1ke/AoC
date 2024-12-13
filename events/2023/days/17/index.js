import fs from 'fs';
import path from 'path';
const { default: Heap } = require('heap-js');

function part1() {
	const result = 0;
	const map = fs.readFileSync(path.join(__dirname, 'input.txt'), 'utf8').split('\n');
	for (let line of map) {
	    line = line.split('').map(num => parseInt(num));
		console.log(line);
	}

	return result;
}

function part2() {
	const data = fs.readFileSync(path.join(__dirname, 'input.txt'), 'utf8');
	const result = 0;

	for (const line of data.split('\n')) {

	}

	return result;
}

// console.log(`Part 1: ${part1()}`);
// console.log(`Part 2: ${part2()}`);

export default {
	part1,
	part2,
};