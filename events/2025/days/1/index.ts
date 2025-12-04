import fs from 'fs';
import path from 'path';
import * as aoc from '../../../../src/lib/utils.ts';

function part1(inputSource?: string | { file: string }): number {
	let input: string;
	if (!inputSource) {
		input = fs.readFileSync(path.join(__dirname, 'input.txt'), 'utf8');
	} else if (typeof inputSource === 'string') {
		input = inputSource;
	} else {
		input = fs.readFileSync(path.join(__dirname, inputSource.file), 'utf8');
	}


	let result: number = 0;
	const data: string[] = aoc.createArray(input, '\n');

	let dial = 50;
	for (const inst of data) {
		const direction = inst.charAt(0);
		let value = parseInt(inst.slice(1), 10);
		// console.log(`Direction: ${direction}, Value: ${value}`);

		if (direction === 'L') value = -value;
		dial += value;

		if (dial < 0) {
			dial = (dial + 100) % 100;
		} else if (dial > 99) {
			dial = dial % 100;
		}
		if (dial === 0) result += 1;
	}

	return result;
}

function part2(inputSource?: string | { file: string }): number {
	let input: string;
	if (!inputSource) {
		input = fs.readFileSync(path.join(__dirname, 'input.txt'), 'utf8');
	} else if (typeof inputSource === 'string') {
		input = inputSource;
	} else {
		input = fs.readFileSync(path.join(__dirname, inputSource.file), 'utf8');
	}


	let result: number = 0;
	const data: string[] = aoc.createArray(input, '\n');

	let dial = 50;
	for (const inst of data) {
		const direction = inst.charAt(0);
		const value = parseInt(inst.slice(1), 10);

		if (direction === 'L') {
			for (let i = 0; i < value; i++) {
				dial -= 1;
				if (dial < 0) {
					dial = 99;
				}
				if (dial === 0) result += 1;
			}
		} else {
			// direction === 'R'
			for (let i = 0; i < value; i++) {
				dial += 1;
				if (dial > 99) {
					dial = 0;
				}
				if (dial === 0) result += 1;
			}
		}
	}

	return result;
}

export interface Solution {
	part1: (inputSource?: string | { file: string }) => number;
	part2: (inputSource?: string | { file: string }) => number;
}

export default {
	part1,
	part2,
} as Solution;