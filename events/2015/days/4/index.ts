import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
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
	// eslint-disable-next-line prefer-const -- This error occurs in the template, but not when the solution is completed.
	let result: number = 0;

	while (true) {
		const hash = crypto.createHash('md5').update(`${input}${result}`).digest('hex');
		if (hash.startsWith('00000')) break;
		result++;
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
	part1: (inputSource?: string | { file: string }) => number;
	part2: (inputSource?: string | { file: string }) => number;
}

export default {
	part1,
	part2,
} as Solution;