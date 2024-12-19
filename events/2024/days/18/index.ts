import fs from 'fs';
import path from 'path';
import * as aoc from '../../../../src/lib/utils.ts';

function findShortestPath(grid: string[][], start: [number, number], end: [number, number]): [number, number][] {
	type Node = [number, number];
	const visited = new Set<string>();
	const distances = new Map<string, number>();
	const previous = new Map<string, Node>();
	const queue: [Node, number][] = [[start, 0]];

	// Initialize distances
	distances.set(`${start[0]},${start[1]}`, 0);

	while (queue.length > 0) {
		queue.sort((a, b) => a[1] - b[1]);
		const [current, distance] = queue.shift()!;
		const currentKey = `${current[0]},${current[1]}`;

		if (visited.has(currentKey)) continue;
		visited.add(currentKey);

		if (current[0] === end[0] && current[1] === end[1]) {
			// Build path
			const cPath: Node[] = [];
			let curr: Node | undefined = current;
			while (curr) {
				cPath.unshift(curr);
				curr = previous.get(`${curr[0]},${curr[1]}`);
			}
			return cPath;
		}

		// Check neighbors
		const neighbors: Node[] = [
			[current[0] - 1, current[1]],
			[current[0] + 1, current[1]],
			[current[0], current[1] - 1],
			[current[0], current[1] + 1],
		];

		for (const neighbor of neighbors) {
			const [x, y] = neighbor;
			if (x < 0 || y < 0 || x >= grid.length || y >= grid[0].length) continue;
			if (grid[x][y] === '#') continue;

			const newDistance = distance + 1;
			const neighborKey = `${x},${y}`;

			if (!distances.has(neighborKey) || newDistance < distances.get(neighborKey)!) {
				distances.set(neighborKey, newDistance);
				previous.set(neighborKey, current);
				queue.push([neighbor, newDistance]);
			}
		}
	}

	return []; // No path found
}

function part1(): number {
	const input: string = fs.readFileSync(path.join(__dirname, 'input.txt'), 'utf8');
	let result: number = 0;

	const data: string[] = aoc.createArray(input);

	let bytes: [number, number][] = data.map((line: string) => {
		const [x, y]: string[] = line.split(',');
		return [parseInt(x), parseInt(y)];
	});

	// Omit every byte after the first kilobyte
	bytes = bytes.slice(0, 1024);

	const maxX: number = 70;
	const maxY: number = 70;

	const startPos: [number, number] = [0, 0];
	const endPos: [number, number] = [maxX, maxY];

	// Create a grid with the largest x and y values
	const grid: string[][] = [];
	for (let i = 0; i < maxX + 1; i++) {
		grid.push(new Array(maxY + 1).fill('.'));
	}

	// Mark the bytes on the grid
	for (const [x, y] of bytes) {
		grid[x][y] = '#';
	}

	// Find the shortest path from the first byte to the last byte
	const shortestPath: [number, number][] = findShortestPath(grid, startPos, endPos);

	result = shortestPath.length - 1;

	return result;
}

function part2(): number {
	const input: string = fs.readFileSync(path.join(__dirname, 'input.txt'), 'utf8');
	let result: number = 0;

	const data: string[] = aoc.createArray(input);

	const bytes: [number, number][] = data.map((line: string) => {
		const [x, y]: string[] = line.split(',');
		return [parseInt(x), parseInt(y)];
	});

	const maxX: number = 70;
	const maxY: number = 70;

	const startPos: [number, number] = [0, 0];
	const endPos: [number, number] = [maxX, maxY];

	// Create a grid with the largest x and y values
	const grid: string[][] = [];
	for (let i = 0; i < maxX + 1; i++) {
		grid.push(new Array(maxY + 1).fill('.'));
	}

	// Add all bytes within the first kilobyte to the grid
	for (let i = 0; i < 1024; i++) {
		const [x, y] = bytes[i];
		grid[x][y] = '#';
	}

	// Add bytes to the grid until there is no path from the start to the end
	let pathExists: boolean = true;
	let bytesAdded: number = 1024;
	while (pathExists) {
		bytesAdded++;
		const [x, y] = bytes[bytesAdded - 1];
		grid[x][y] = '#';
		const shortestPath: [number, number][] = findShortestPath(grid, startPos, endPos);
		pathExists = shortestPath.length > 0;
		// console.log(`Bytes added: ${bytesAdded}, Path length: ${shortestPath.length - 1}`);
	}

	// @ts-expect-error Ignore this error due to this challenge's solution requirements
	result = `${bytes[bytesAdded - 1][0]},${bytes[bytesAdded - 1][1]}`;

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