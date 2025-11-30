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

	const data: string[] = aoc.createArray(input);
	let currentFloor: number = 0;

	for (const char of data[0]) {
		if (char === '(') {
			currentFloor++;
		} else if (char === ')') {
			currentFloor--;
		} else {
			throw new Error('Invalid character in input');
		}
	}

	result = currentFloor;
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

	const data: string[] = aoc.createArray(input);
	let currentFloor: number = 0;

	for (let i = 0; i < data[0].length; i++) {
		const char: string = data[0][i];
		if (char === '(') {
			currentFloor++;
		} else if (char === ')') {
			currentFloor--;
		} else {
			throw new Error('Invalid character in input');
		}

		if (currentFloor === -1) {
			result = i + 1;
			break;
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