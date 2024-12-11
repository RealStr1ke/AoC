import fs from 'fs';
import path from 'path';

function part1() {
	const data = fs.readFileSync(path.join(__dirname, 'input.txt'), 'utf8');
	let result = 0;

	const memory = data.split('\n').join('');
	const match = /mul\((\d+),(\d+)\)/g;
	const matches = memory.match(match);

	for (const pair of matches) {
		const numbers = pair.slice(4, -1).split(',');
		numbers[0] = parseInt(numbers[0]);
		numbers[1] = parseInt(numbers[1]);

		result += numbers[0] * numbers[1];
	}

	return result;
}

function part2() {
	const data = fs.readFileSync(path.join(__dirname, 'input.txt'), 'utf8');
	let result = 0;

	const memory = data.split('\n').join('');
	const match = /mul\((\d+),(\d+)\)|do\(\)|don't\(\)/g;
	const matches = memory.match(match);

	let enabled = true;
	for (const mem of matches) {
		if (mem === 'do()') {
			enabled = true;
		} else if (mem === 'don\'t()') {
			enabled = false;
		} else if (mem.includes('mul(') && enabled) {
			const numbers = mem.slice(4, -1).split(',');
			numbers[0] = parseInt(numbers[0]);
			numbers[1] = parseInt(numbers[1]);

			result += numbers[0] * numbers[1];
		}
	}

	return result;
}

// console.log(`Part 1: ${part1()}`);
// console.log(`Part 2: ${part2()}`);

export default {
	part1,
	part2,
};