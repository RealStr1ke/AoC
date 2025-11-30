import fs from 'fs';
import path from 'path';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import * as aoc from '../../../../src/lib/utils.ts';

function checkIfSafe(levels: number[]): boolean {
	const increasing: boolean = levels[0] < levels[1];
	for (let i = 0; i < levels.length; i++) {
		if (i === 0) continue;

		if (increasing) {
			if (levels[i] < levels[i - 1]) return false;
		} else if (!increasing) {
			if (levels[i] > levels[i - 1]) return false;
		}

		if (Math.abs(levels[i] - levels[i - 1]) > 3 || Math.abs(levels[i] - levels[i - 1]) === 0) return false;
	}

	return true;
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

	const levelsList: number[][] = [];
	for (const line of input.split('\n')) levelsList.push(line.split(' ').map(Number));

	for (const levels of levelsList) if (checkIfSafe(levels)) result++;

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

	const levelsList: number[][] = [];
	for (const line of input.split('\n')) levelsList.push(line.split(' ').map(Number));

	for (const levels of levelsList) {
		const safe: boolean = checkIfSafe(levels);

		if (safe) {
			result++;
		} else {
			for (let i = 0; i < levels.length; i++) {
				const newLevels: number[] = levels.slice(0, i).concat(levels.slice(i + 1));
				if (checkIfSafe(newLevels)) {
					result++;
					break;
				}
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
