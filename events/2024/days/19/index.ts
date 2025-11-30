import fs from 'fs';
import path from 'path';
import * as aoc from '../../../../src/lib/utils.ts';

// Used this for example input, but of course it's too slow for the real input
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function getArrangements(design: string, patterns: string[]): string[][] {
	const arrangements: string[][] = [];
	const possiblePatterns: string[] = [];

	for (const pattern of patterns) {
		const designSlice: string = design.slice(0, pattern.length);
		if (designSlice === pattern) {
			if (design.length === pattern.length) {
				arrangements.push([pattern]);
			} else {
				possiblePatterns.push(pattern);
			}
		}
	}


	for (const pattern of possiblePatterns) {
		const designSlice: string = design.slice(pattern.length);
		const subArrangements = getArrangements(designSlice, patterns);
		for (const subArr of subArrangements) {
			arrangements.push([pattern, ...subArr]);
		}
	}

	return arrangements;
}

function getArrangementsCount(design: string, patterns: string[], memo = new Map<string, number>()): number {
	// Check if we already calculated this sub-design
	if (memo.has(design)) {
		return memo.get(design)!;
	}

	if (design.length === 0) {
		return 1;
	}

	let possible: number = 0;
	for (const pattern of patterns) {
		if (design.startsWith(pattern)) {
			possible += getArrangementsCount(design.slice(pattern.length), patterns, memo);
		}
	}

	// Store the result before returning
	memo.set(design, possible);
	return possible;
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

	const data: string[] = aoc.createArray(input, '\n\n');

	const availablePatterns: string[] = data[0].split(', ');
	const desiredDesigns: string[] = data[1].split('\n');

	for (const design of desiredDesigns) {
		// console.log(`Checking Design: ${design}`);
		const arrangementsCount: number = getArrangementsCount(design, availablePatterns);
		if (arrangementsCount > 0) {
			// console.log(`Design: ${design} is possible. Arrangements: ${arrangementsCount}`);
			result++;
		} else {
			// console.log(`Design: ${design} is not possible.`);
		}
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

	const data: string[] = aoc.createArray(input, '\n\n');

	const availablePatterns: string[] = data[0].split(', ');
	const desiredDesigns: string[] = data[1].split('\n');

	for (const design of desiredDesigns) {
		// console.log(`Checking Design: ${design}`);
		const arrangementsCount: number = getArrangementsCount(design, availablePatterns);
		if (arrangementsCount > 0) {
			// console.log(`Design: ${design} is possible. Arrangements: ${arrangementsCount}`);
			result += arrangementsCount;
		} else {
			// console.log(`Design: ${design} is not possible.`);
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