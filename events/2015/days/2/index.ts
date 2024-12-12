import fs from 'fs';
import path from 'path';
import * as aoc from '../../../../src/lib/utils.ts';

function calculateSurfaceArea(l: number, w: number, h: number): number {
	return 2 * l * w + 2 * w * h + 2 * h * l;
}
function calculateRibbonLength(l: number, w: number, h: number): number {
	const [a, b, c] = [l, w, h].sort((a, b) => a - b);
	return 2 * a + 2 * b + a * b * c;
}

function part1(): number {
	const input: string = fs.readFileSync(path.join(__dirname, 'input.txt'), 'utf8');
	let result: number = 0;

	const data: string[] = aoc.createArray(input);

	for (const line of data) {
		const [l, w, h] = line.split('x').map(Number);
		result += calculateSurfaceArea(l, w, h);
		const [a, b] = [l, w, h].sort((d, e) => d - e);
		result += a * b;
	}

	return result;
}

function part2(): number {
	const input: string = fs.readFileSync(path.join(__dirname, 'input.txt'), 'utf8');
	let result: number = 0;

	const data: string[] = aoc.createArray(input);

	for (const line of data) {
		const [l, w, h] = line.split('x').map(Number);
		result += calculateRibbonLength(l, w, h);
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