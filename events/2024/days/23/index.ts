import fs from 'fs';
import path from 'path';
import * as aoc from '../../../../src/lib/utils.ts';

function parseConnections(connections: [string, string][]): Record<string, string[]> {
	const obj: Record<string, string[]> = {};

	for (const [c1, c2] of connections) {
		if (obj[c1]) {
			obj[c1].push(c2);
		} else {
			obj[c1] = [c2];
		}

		if (obj[c2]) {
			obj[c2].push(c1);
		} else {
			obj[c2] = [c1];
		}
	}

	return obj;
}

function findTriangles(computers: Record<string, string[]>): string[][] {
	const triangles: string[][] = [];
	const nodes = Object.keys(computers);

	for (const node of nodes) {
		for (const neighbor1 of computers[node]) {
			for (const neighbor2 of computers[node]) {
				if (neighbor1 < neighbor2 && computers[neighbor1].includes(neighbor2)) {
					triangles.push([node, neighbor1, neighbor2].sort());
				}
			}
		}
	}

	// Remove duplicates
	return triangles.filter((triangle, index) =>
		triangles.findIndex(t =>
			t[0] === triangle[0] &&
			t[1] === triangle[1] &&
			t[2] === triangle[2],
		) === index,
	);
}

function isClique(nodes: string[], computers: Record<string, string[]>, cache: Map<string, boolean>): boolean {
	const key = nodes.sort().join(',');
	if (cache.has(key)) return cache.get(key)!;

	for (const node1 of nodes) {
		for (const node2 of nodes) {
			if (node1 < node2 && !computers[node1].includes(node2)) {
				cache.set(key, false);
				return false;
			}
		}
	}

	cache.set(key, true);
	return true;
}

function findCliquesRecursive(candidates: string[], current: string[], computers: Record<string, string[]>, cache: Map<string, boolean>, maxClique: string[]): string[] {
	if (current.length > maxClique.length && isClique(current, computers, cache)) maxClique = [...current];
	if (current.length + candidates.length <= maxClique.length) return maxClique;

	for (let i = 0; i < candidates.length; i++) {
		const newCurrent = [...current, candidates[i]];
		const newCandidates = candidates.slice(i + 1).filter(node => current.every(c => computers[c].includes(node)));
		maxClique = findCliquesRecursive(newCandidates, newCurrent, computers, cache, maxClique);
	}

	return maxClique;
}

function findMaximalClique(computers: Record<string, string[]>): string[] {
	const nodes = Object.keys(computers);
	const cache = new Map<string, boolean>();
	const sortedNodes = nodes.sort((a, b) => computers[b].length - computers[a].length);
	return findCliquesRecursive(sortedNodes, [], computers, cache, []);
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

	const data: string[] = aoc.createArray(input);

	const connections: [string, string][] = data.map((line: string) => {
		const [c1, c2]: string[] = line.split('-');
		return [c1, c2];
	});

	const computers: Record<string, string[]> = parseConnections(connections);
	const triangles: string[][] = findTriangles(computers);
	for (const triangle of triangles) {
		let containsT: boolean = false;
		for (const node of triangle) {
			if (node.startsWith('t')) {
				containsT = true;
			}
		}
		if (containsT) result++;
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


	const data: string[] = aoc.createArray(input);

	const connections: [string, string][] = data.map((line: string) => {
		const [c1, c2]: string[] = line.split('-');
		return [c1, c2];
	});

	const computers: Record<string, string[]> = parseConnections(connections);
	const largestClique: string[] = findMaximalClique(computers);

	// @ts-expect-error Ignore this due to the nature of the solution (result declared as a num but today's solution is a string ig lol :P)
	result = largestClique.join(',');

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