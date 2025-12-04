import fs from 'fs';
import path from 'path';
import * as aoc from '../../../../src/lib/utils.ts';

function findHighestNumber(sequence: string, length: number): number {
	const result: string[] = [];

	for (let i = 0; i < sequence.length; i++) {
		const current = sequence[i];

		// Remove smaller values from result while we have enough remaining digits
		while (
			result.length > 0 &&
			result[result.length - 1]! < current &&
			sequence.length - i + result.length > length
		) {
			result.pop();
		}

		// Add current digit if we haven't reached the target length
		if (result.length < length) {
			result.push(current);
		}
	}

	return parseInt(result.join(''), 10);
}

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

	for (const line of data) {
		const joltage = findHighestNumber(line, 2);
		console.log(`${line} -> ${joltage}`);
		result += joltage;
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

	for (const line of data) {
		const joltage = findHighestNumber(line, 12);
		console.log(`${line} -> ${joltage}`);
		result += joltage;
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