import fs from 'fs';
import path from 'path';
import * as aoc from '../../../../src/lib/utils.ts';

function part1(inputSource?: string | { file: string }): number {
	// Handle different input sources for testing
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

	const ranges: Array<[number, number]> = data[0].split('\n').map((line) => {
		const [start, end] = line.split('-').map(Number);
		return [start, end];
	});
	
	const ids: number[] = data[1].split('\n').map(Number);
	const validIds: number[] = [];
	for (const range of ranges) {
		// console.log(`Checking range: ${range[0]}-${range[1]}`);
		for (const id of ids) {
			if (id >= range[0] && id <= range[1]) {
				// console.log(`ID ${id} is valid for range ${range[0]}-${range[1]}`);
				validIds.push(id);
			}
		}
	}
	
	const uniqueValidIds: Set<number> = new Set(validIds);
	result = uniqueValidIds.size;

	return result;
}

function part2(inputSource?: string | { file: string }): number {
	// Handle different input sources for testing
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

	const ranges: Array<[number, number]> = data[0].split('\n').map((line) => {
		const [start, end] = line.split('-').map(Number);
		return [start, end];
	});
	
	// Sort ranges by start position
	ranges.sort((a, b) => a[0] - b[0]);
	
	// Merge overlapping ranges
	const merged: Array<[number, number]> = [];
	for (const range of ranges) {
		if (merged.length === 0 || merged[merged.length - 1][1] < range[0] - 1) {
			merged.push(range);
		} else {
			merged[merged.length - 1][1] = Math.max(merged[merged.length - 1][1], range[1]);
		}
	}
	
	// Count total IDs across all merged ranges
	for (const range of merged) {
		result += range[1] - range[0] + 1;
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