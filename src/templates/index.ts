import fs from 'fs';
import path from 'path';
// @ts-expect-error This error occurs in the template, but not when copied to the actual day's folder
import * as aoc from '../../../../src/lib/utils.ts';

function part1(inputSource?: string | { file: string }): number {
	// Handle different input sources for testing
	let input: string;
	if (!inputSource) {
		input = fs.readFileSync(path.join(__dirname, 'input.txt'), 'utf8');
	} else if (typeof inputSource === 'string') {
		input = inputSource;
	} else {
		input = fs.readFileSync(path.join(__dirname, inputSource.file), 'utf8');
	}

	// eslint-disable-next-line prefer-const -- This error occurs in the template, but not when the solution is completed.
	let result: number = 0;
	// eslint-disable-next-line @typescript-eslint/no-unused-vars -- This error occurs in the template, but not when the solution is completed.
	const data: string[] = aoc.createArray(input, '\n');

	// Solution logic here

	return result;
}

function part2(inputSource?: string | { file: string }): number {
	// Handle different input sources for testing
	let input: string;
	if (!inputSource) {
		input = fs.readFileSync(path.join(__dirname, 'input.txt'), 'utf8');
	} else if (typeof inputSource === 'string') {
		input = inputSource;
	} else {
		input = fs.readFileSync(path.join(__dirname, inputSource.file), 'utf8');
	}

	// eslint-disable-next-line prefer-const -- This error occurs in the template, but not when the solution is completed.
	let result: number = 0;
	// eslint-disable-next-line @typescript-eslint/no-unused-vars -- This error occurs in the template, but not when the solution is completed.
	const data: string[] = aoc.createArray(input, '\n');

	// Solution logic here

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