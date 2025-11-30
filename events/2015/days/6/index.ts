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

	const lights: boolean[][] = Array.from({ length: 1000 }, () => Array(1000).fill(false));

	for (const line of data) {
		const splitLine: string[] = line.split(' ');
		const instruction: 'toggle' | 'turn on' | 'turn off' =
			splitLine[0] === 'toggle'
				? 'toggle'
				: splitLine[1] === 'on'
					? 'turn on'
					: 'turn off';
		let start, end;
		if (instruction === 'toggle') {
			start = splitLine[1].split(',').map(Number);
			end = splitLine[3].split(',').map(Number);
		} else {
			start = splitLine[2].split(',').map(Number);
			end = splitLine[4].split(',').map(Number);
		}

		console.log(`Instruction: ${instruction} - ${start} to ${end}`);

		for (let x = start[0]; x <= end[0]; x++) {
			for (let y = start[1]; y <= end[1]; y++) {
				if (instruction === 'toggle') {
					lights[x][y] = !lights[x][y];
				} else if (instruction === 'turn on') {
					lights[x][y] = true;
				} else if (instruction === 'turn off') {
					lights[x][y] = false;
				}
			}
		}
	}

	result = lights.flat().filter(Boolean).length;

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

	const lights: number[][] = Array.from({ length: 1000 }, () => Array(1000).fill(0));

	for (const line of data) {
		const splitLine: string[] = line.split(' ');
		const instruction: 'toggle' | 'turn on' | 'turn off' =
			splitLine[0] === 'toggle'
				? 'toggle'
				: splitLine[1] === 'on'
					? 'turn on'
					: 'turn off';
		let start, end;
		if (instruction === 'toggle') {
			start = splitLine[1].split(',').map(Number);
			end = splitLine[3].split(',').map(Number);
		} else {
			start = splitLine[2].split(',').map(Number);
			end = splitLine[4].split(',').map(Number);
		}

		console.log(`Instruction: ${instruction} - ${start} to ${end}`);

		for (let x = start[0]; x <= end[0]; x++) {
			for (let y = start[1]; y <= end[1]; y++) {
				if (instruction === 'toggle') {
					lights[x][y] += 2;
				} else if (instruction === 'turn on') {
					lights[x][y] += 1;
				} else if (instruction === 'turn off') {
					if (lights[x][y] > 0) lights[x][y] -= 1;
				}
			}
		}
	}

	result = lights.flat().reduce((acc, val) => acc + Math.max(0, val), 0);

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