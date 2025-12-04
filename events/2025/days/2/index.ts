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

	const ranges: [number, number][] = [];

	for (const range of data[0].split(',')) {
		const [start, end] = range.split('-').map(Number);
		ranges.push([start, end]);
	}

	const repeats = [];
	for (const range of ranges) {
		const [start, end] = range;
		for (let i = start; i <= end; i++) {
			const chars = i.toString();
			const splitIndex = Math.floor(chars.length / 2);
			const firstHalf = chars.slice(0, splitIndex);
			const secondHalf = chars.slice(splitIndex);

			if (firstHalf === secondHalf) repeats.push(i);

		}
	}

	for (const repeat of repeats) {
		result += repeat;
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

	const ranges: [number, number][] = [];

	for (const range of data[0].split(',')) {
		const [start, end] = range.split('-').map(Number);
		ranges.push([start, end]);
	}

	const repeats = [];
	for (const range of ranges) {
		const [start, end] = range;
		for (let i = start; i <= end; i++) {
			const chars = i.toString().split('');
			const charHalf = chars.length / 2;
			for (let j = 0; j < charHalf; j++) {
				const charSet = chars.slice(0, j + 1).join('');
				let valid = true;
				for (let k = j + 1; k < chars.length; k += charSet.length) {
					if (chars.slice(k, k + charSet.length).join('') !== charSet) {
						valid = false;
						break;
					}
				}
				if (valid && i >= 10) {
					repeats.push(i);
					// console.log(`Found repeating pattern: ${i} with pattern ${charSet}`);
					break;
				}
			}

		}
	}

	for (const repeat of repeats) result += repeat;

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