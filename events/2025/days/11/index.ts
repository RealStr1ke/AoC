import fs from 'fs';
import path from 'path';
import * as aoc from '../../../../src/lib/utils.ts';

interface Device {
	name: string;
	outputs: string[];
}

function countPaths(devices: Device[], start: string, end: string, requiredNodes: string[] = []): number {
	// Build adjacency map
	const paths = new Map<string, string[]>();
	devices.forEach(d => paths.set(d.name, d.outputs));
	
	// Memoization cache
	const memo = new Map<string, number>();
	
	function numberPaths(k: string, seenNodes: Set<string>): number {
		// Base case: reached the end
		if (k === end) {
			// Check if all required nodes were seen
			return requiredNodes.every(node => seenNodes.has(node)) ? 1 : 0;
		}
		
		// Check memo cache
		const seenKey = Array.from(seenNodes).sort().join(',');
		const cacheKey = `${k}:${seenKey}`;
		if (memo.has(cacheKey)) {
			return memo.get(cacheKey)!;
		}
		
		// Update state based on current node
		const newSeenNodes = new Set(seenNodes);
		if (requiredNodes.includes(k)) {
			newSeenNodes.add(k);
		}
		
		// Count paths through all neighbors
		let total = 0;
		const neighbors = paths.get(k) || [];
		for (const v of neighbors) {
			total += numberPaths(v, newSeenNodes);
		}
		
		// Cache and return
		memo.set(cacheKey, total);
		return total;
	}
	
	return numberPaths(start, new Set<string>());
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

	const devices: Device[] = data.map((line) => {
		const name = line.slice(0, line.indexOf(':'));
		const outputsStr = line.slice(line.indexOf(':') + 1).trim();
		const outputs = outputsStr.length > 0 ? outputsStr.split(' ').map(s => s.trim()) : [];
		return { name, outputs };
	});

	result = countPaths(devices, 'you', 'out');

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
	const data: string[] = aoc.createArray(input, '\n');

	const devices: Device[] = data.map((line) => {
		const name = line.slice(0, line.indexOf(':'));
		const outputsStr = line.slice(line.indexOf(':') + 1).trim();
		const outputs = outputsStr.length > 0 ? outputsStr.split(' ').map(s => s.trim()) : [];
		return { name, outputs };
	});

	result = countPaths(devices, 'svr', 'out', ['dac', 'fft']);

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