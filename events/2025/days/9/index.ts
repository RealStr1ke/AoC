import fs from 'fs';
import path from 'path';
import * as aoc from '../../../../src/lib/utils.ts';

function findLargestRectangleFromTile(tile: [number, number], redTiles: [number, number][]): number {
	let largestArea = 0;
	let largestTile : [number, number] = tile;
	let largestDimensions: [number, number] = [0, 0];
	for (const redTile of redTiles) {
		const width = Math.abs(redTile[0] - tile[0] + 1);
		const height = Math.abs(redTile[1] - tile[1] + 1);
		const area = width * height;
		if (area > largestArea) {
			largestArea = area;
			largestTile = redTile;
			largestDimensions = [width, height];
		}
	}
	// console.log(`New largest area: ${largestArea} from tile ${tile} to red tile ${largestTile} with dimensions ${largestDimensions}`);
	return largestArea;
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
	const data: string[] = aoc.createArray(input, '\n');

	const redTiles: [number, number][] = data.map((line) => {
		const [xStr, yStr] = line.split(',');
		return [parseInt(xStr, 10), parseInt(yStr, 10)];
	});
	
	let largestArea = 0;
	for (const tile of redTiles) {
		const area = findLargestRectangleFromTile(tile, redTiles);
		if (area > largestArea) {
			largestArea = area;
		}
	}
	return largestArea;
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

	const tiles: [number, number][] = data.map((line) => {
		const [xStr, yStr] = line.split(',');
		return [parseInt(xStr, 10), parseInt(yStr, 10)];
	});

	// Build polygon edges (each consecutive pair of tiles forms an edge)
	const edges: { minX: number; minY: number; maxX: number; maxY: number }[] = [];
	for (let i = 0; i < tiles.length; i++) {
		const current = tiles[i];
		const next = tiles[(i + 1) % tiles.length]; // Wrap around to first tile
		
		edges.push({
			minX: Math.min(current[0], next[0]),
			minY: Math.min(current[1], next[1]),
			maxX: Math.max(current[0], next[0]),
			maxY: Math.max(current[1], next[1]),
		});
	}

	// Check if a rectangle intersects with any polygon edge using AABB collision detection
	const rectangleIntersectsEdge = (
		rectMinX: number,
		rectMinY: number,
		rectMaxX: number,
		rectMaxY: number,
		cornerIdx1: number,
		cornerIdx2: number
	): boolean => {
		for (let i = 0; i < edges.length; i++) {
			const edge = edges[i];
			const nextIdx = (i + 1) % tiles.length;
			
			// Skip edges that are part of our rectangle's corners
			if (i === cornerIdx1 || i === cornerIdx2 || nextIdx === cornerIdx1 || nextIdx === cornerIdx2) continue;
			
			// AABB collision detection
			if (
				rectMinX < edge.maxX &&
				rectMaxX > edge.minX &&
				rectMinY < edge.maxY &&
				rectMaxY > edge.minY
			) {
				return true;
			}
		}
		return false;
	};

	// Try all pairs of tiles as opposite corners
	for (let i = 0; i < tiles.length; i++) {
		for (let j = i + 1; j < tiles.length; j++) {
			const tile1 = tiles[i];
			const tile2 = tiles[j];
			
			const minX = Math.min(tile1[0], tile2[0]);
			const maxX = Math.max(tile1[0], tile2[0]);
			const minY = Math.min(tile1[1], tile2[1]);
			const maxY = Math.max(tile1[1], tile2[1]);
			
			const area = (maxX - minX + 1) * (maxY - minY + 1);
	
			if (area <= result) continue;
			if (!rectangleIntersectsEdge(minX, minY, maxX, maxY, i, j)) result = area;
		}
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