import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import * as aoc from '../../../../src/lib/utils.ts';

function part1(): number {
	const input: string = fs.readFileSync(path.join(__dirname, 'input.txt'), 'utf8');
	// eslint-disable-next-line prefer-const -- This error occurs in the template, but not when the solution is completed.
	let result: number = 0;

	while (true) {
		const hash = crypto.createHash('md5').update(`${input}${result}`).digest('hex');
		if (hash.startsWith('00000')) break;
		result++;
	}

	return result;
}

function part2(): number {
	const input: string = fs.readFileSync(path.join(__dirname, 'input.txt'), 'utf8');
	// eslint-disable-next-line prefer-const -- This error occurs in the template, but not when the solution is completed.
	let result: number = 0;

	while (true) {
		const hash = crypto.createHash('md5').update(`${input}${result}`).digest('hex');
		if (hash.startsWith('000000')) break;
		result++;
	}

	return result;
}

export interface Solution {
	part1: () => number;
	part2: () => number;
}

export default {
	part1,
	part2,
} as Solution;