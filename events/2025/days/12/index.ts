import fs from 'fs';
import path from 'path';
import * as aoc from '../../../../src/lib/utils.ts';

interface Region {
	width: number;
	height: number;
	counts: number[];
}

interface Shape {
	pattern: string[][];
	area: number;
}

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

	const regions: Region[] = (data.pop() || '').split('\n').map(line => {
		const parts = line.split(': ');
		const width = parseInt(parts[0].split('x')[0], 10);
		const height = parseInt(parts[0].split('x')[1], 10);
		const counts = parts[1].split(' ').map(s => parseInt(s, 10));
		return { width, height, counts };
	});

	const shapeLines: string[][] = data.map(block => block.split('\n').slice(1).map(line => line.trim()));

	// Parse shapes
	const shapes: Shape[] = shapeLines.map(lines => {
		// area is number of '#' characters
		const area = lines.reduce((sum, line) => sum + (line.match(/#/g)?.length || 0), 0);
		const pattern = lines.map(line => line.split(''));
		return { pattern, area };
	});
	// console.log(shapes);
	
	// Check each region
	for (const region of regions) {
		const regionArea = region.width * region.height;
		let shapeAreaSum = 0;
		for (let i = 0; i < region.counts.length; i++) {
			shapeAreaSum += region.counts[i] * shapes[i].area;
		}
		if (shapeAreaSum > regionArea) {
			// console.log(`Region ${region.width}x${region.height} is overfilled: shape area sum ${shapeAreaSum} > region area ${regionArea}`);
		} else {
			// console.log(`Region ${region.width}x${region.height} is valid: shape area sum ${shapeAreaSum} <= region area ${regionArea}`);
			result++;
		}
	}

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

	// eslint-disable-next-line prefer-const -- This error occurs in the template, but not when the solution is completed.
	let result: number = 0;
	// eslint-disable-next-line @typescript-eslint/no-unused-vars -- This error occurs in the template, but not when the solution is completed.
	const data: string[] = aoc.createArray(input, '\n');

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