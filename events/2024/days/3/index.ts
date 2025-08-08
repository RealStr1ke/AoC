import fs from 'fs';
import path from 'path';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import * as aoc from '../../../../src/lib/utils.ts';

function part1(): number {
	const input: string = fs.readFileSync(path.join(__dirname, 'input.txt'), 'utf8');
	let result: number = 0;

	const memory: string = input.split('\n').join('');
	const match: RegExp = /mul\((\d+),(\d+)\)/g;
	const matches: string[] | null = memory.match(match);

	if (matches) {
		for (const pair of matches) {
			const numbers: string[] = pair.slice(4, -1).split(',');
			const num1: number = parseInt(numbers[0]);
			const num2: number = parseInt(numbers[1]);

			result += num1 * num2;
		}
	}

	return result;
}

function part2(): number {
	const input: string = fs.readFileSync(path.join(__dirname, 'input.txt'), 'utf8');
	let result: number = 0;

	const memory: string = input.split('\n').join('');
	const match: RegExp = /mul\((\d+),(\d+)\)|do\(\)|don't\(\)/g;
	const matches: string[] | null = memory.match(match);

	if (matches) {
		let enabled: boolean = true;
		for (const mem of matches) {
			if (mem === 'do()') {
				enabled = true;
			} else if (mem === 'don\'t()') {
				enabled = false;
			} else if (mem.includes('mul(') && enabled) {
				const numbers: string[] = mem.slice(4, -1).split(',');
				const num1: number = parseInt(numbers[0]);
				const num2: number = parseInt(numbers[1]);

				result += num1 * num2;
			}
		}
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
