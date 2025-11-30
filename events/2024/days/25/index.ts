import fs from 'fs';
import path from 'path';
import * as aoc from '../../../../src/lib/utils.ts';

function findUniquePairs(locks: string[][][], keys: string[][][]) {
	const keyHeights: number[][] = keys.map(key => {
		const heights: number[] = [];
		// Flipping the key clockwise 90 degrees
		const rotatedKey = key[0].map((_, i) => key.map(row => row[i]).reverse());

		for (const row of rotatedKey) {
			let height: number = 0;
			for (const cell of row) if (cell === '#') height++;
			heights.push(height - 1);
		}
		return heights;
	});

	const lockHeights: number[][] = locks.map(lock => {
		const heights: number[] = [];
		// Flipping the lock counterclockwise 90 degrees
		const rotatedLock = lock[0].map((_, i) => lock.map(row => row[i]));

		for (const row of rotatedLock) {
			let height: number = 0;
			for (const cell of row) if (cell === '#') height++;
			heights.push(height - 1);
		}
		return heights;
	});

	const pairs = [];

	for (const lock of lockHeights) {
		for (const key of keyHeights) {
			const combined: number[] = [];
			let overlap: boolean = false;
			for (let i = 0; i < lock.length; i++) combined.push(lock[i] + key[i]);
			for (const num of combined) if (num > 5 || num < 0) overlap = true;
			if (!overlap) pairs.push([lock, key]);
		}
	}

	return pairs;
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

	const locks: string[][][] = [];
	const keys: string[][][] = [];

	for (const grid of data) {
		const gridLines = grid.split('\n');
		if (gridLines[0] === '#####') {
			locks.push(gridLines.map(row => row.split('')));
		} else if (gridLines[gridLines.length - 1] === '#####') {
			keys.push(gridLines.map(row => row.split('')));
		}
	}

	const pairs = findUniquePairs(locks, keys);

	result = pairs.length;

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

	// eslint-disable-next-line @typescript-eslint/no-unused-vars -- This error occurs in the template, but not when the solution is completed.
	const data: string[] = aoc.createArray(input);

	// @ts-expect-error lol I'm finally done with this BS
	result = 'FINALLY FINISHED!';

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