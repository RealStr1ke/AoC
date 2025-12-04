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

	const grid: string[][] = [];
	for (const line of data) {
		grid.push(line.split(''));
	}

	for (let y = 0; y < grid.length; y++) {
		for (let x = 0; x < grid[y]!.length; x++) {
			if (grid[y]![x] === '@') {
				const surroundings = [
					[x - 1, y - 1],
					[x, y - 1],
					[x + 1, y - 1],
					[x - 1, y],
					[x + 1, y],
					[x - 1, y + 1],
					[x, y + 1],
					[x + 1, y + 1],
				];

				const adjacent: string[] = [];
				for (const [sx, sy] of surroundings) {
					if (grid[sy] && grid[sy]![sx]) {
						adjacent.push(grid[sy]![sx]);
					}
				}

				const rolls = adjacent.filter((v) => v === '@').length;
				if (rolls < 4) result += 1;
				// console.log(`At (${x},${y}) found ${rolls} adjacent rolls`);
			}
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
	const data: string[] = aoc.createArray(input, '\n');

	const grid: string[][] = [];
	for (const line of data) {
		grid.push(line.split(''));
	}

	let continueLoop = true;
	let loop = 0;
	while (continueLoop) {
		loop += 1;
		const validRolls: [number, number][] = [];
		for (let y = 0; y < grid.length; y++) {
			for (let x = 0; x < grid[y]!.length; x++) {
				if (grid[y]![x] === '@') {
					const surroundings = [
						[x - 1, y - 1],
						[x, y - 1],
						[x + 1, y - 1],
						[x - 1, y],
						[x + 1, y],
						[x - 1, y + 1],
						[x, y + 1],
						[x + 1, y + 1],
					];

					const adjacent: string[] = [];
					for (const [sx, sy] of surroundings) {
						if (grid[sy] && grid[sy]![sx]) {
							adjacent.push(grid[sy]![sx]);
						}
					}

					const rolls = adjacent.filter((v) => v === '@').length;
					if (rolls < 4) {
						validRolls.push([x, y]);
					}
				}
			}
		}
		if (validRolls.length === 0) {
			continueLoop = false;
		} else {
			for (const [x, y] of validRolls) {
				grid[y]![x] = '.';
				result += 1;
			}
		}
		console.log(`Iteration #${loop}: removed ${validRolls.length} rolls `);
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