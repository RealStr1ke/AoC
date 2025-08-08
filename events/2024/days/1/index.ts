import fs from 'fs';
import path from 'path';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import * as aoc from '../../../../src/lib/utils.ts';

function part1(): number {
	const input: string = fs.readFileSync(path.join(__dirname, 'input.txt'), 'utf8');
	let result: number = 0;

	const left: string[] = [];
	const right: string[] = [];

	for (const line of input.split('\n')) {
		const [l, r] = line.split('   ');
		left.push(l);
		right.push(r);
	}

	const leftNum: number[] = left.map(Number);
	leftNum.sort((a, b) => a - b);

	const rightNum: number[] = right.map(Number);
	rightNum.sort((a, b) => a - b);

	const pairs: [number, number][] = [];
	for (let i = 0; i < leftNum.length; i++) pairs.push([leftNum[i], rightNum[i]]);

	for (const [l, r] of pairs) result += Math.abs(l - r);

	return result;
}

function part2(): number {
	const input: string = fs.readFileSync(path.join(__dirname, 'input.txt'), 'utf8');
	let result: number = 0;

	const left: string[] = [];
	const right: string[] = [];

	for (const line of input.split('\n')) {
		const [l, r] = line.split('   ');
		left.push(l);
		right.push(r);
	}

	const leftNum: number[] = left.map(Number);
	leftNum.sort((a, b) => a - b);

	const rightNum: number[] = right.map(Number);
	rightNum.sort((a, b) => a - b);

	const leftCount: Record<number, number> = {};
	const rightCount: Record<number, number> = {};

	for (const num of leftNum) leftCount[num] = (leftCount[num] || 0) + 1;
	for (const num of rightNum) rightCount[num] = (rightCount[num] || 0) + 1;

	for (const num of leftNum) if (rightCount[num]) result += num * rightCount[num];

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
