import fs from 'fs';
import path from 'path';
import * as aoc from '../../../../src/lib/utils.ts';

function part1(): number {
	const input: string = fs.readFileSync(path.join(__dirname, 'input.txt'), 'utf8');

	let result: number = 0;

	const data: string[] = aoc.createArray(input, '');

	const houses: Record<string, number> = {};
	houses['0,0'] = 1;

	let x = 0, y = 0;

	for (const direction of data) {
		if (direction === '>') x++;
		else if (direction === '<') x--;
		else if (direction === '^') y++;
		else if (direction === 'v') y--;

		const key = `${x},${y}`;
		houses[key] = (houses[key] || 0) + 1;
	}

	// Count houses that were visited at least once
	result = Object.keys(houses).length;

	return result;
}

function part2(): number {
	const input: string = fs.readFileSync(path.join(__dirname, 'input.txt'), 'utf8');

	let result: number = 0;

	const data: string[] = aoc.createArray(input, '');

	const houses: Record<string, number> = {};
	houses['0,0'] = 2;

	let santaX = 0, santaY = 0;
	let robotX = 0, robotY = 0;

	for (let i = 0; i < data.length; i++) {
		const direction = data[i];
		if (i % 2 === 0) {
			// Santa's turn
			if (direction === '>') santaX++;
			else if (direction === '<') santaX--;
			else if (direction === '^') santaY++;
			else if (direction === 'v') santaY--;
		} else {
			// Robot's turn
			// eslint-disable-next-line no-lonely-if
			if (direction === '>') robotX++;
			else if (direction === '<') robotX--;
			else if (direction === '^') robotY++;
			else if (direction === 'v') robotY--;
		}

		houses[`${santaX},${santaY}`] = (houses[`${santaX},${santaY}`] || 0) + 1;
		houses[`${robotX},${robotY}`] = (houses[`${robotX},${robotY}`] || 0) + 1;
	}

	// Count houses that were visited at least once
	result = Object.keys(houses).length;

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