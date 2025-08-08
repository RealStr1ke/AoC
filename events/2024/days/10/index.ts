import fs from 'fs';
import path from 'path';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import * as aoc from '../../../../src/lib/utils.ts';

type Position = [number, number];
type Trail = Position[];

function findTrailHeads(grid: number[][]): Position[] {
	const trailHeads: Position[] = [];

	for (let i = 0; i < grid.length; i++) {
		for (let j = 0; j < grid[i].length; j++) {
			if (grid[i][j] === 0) {
				trailHeads.push([i, j]);
			}
		}
	}

	return trailHeads;
}

function findNextSteps(grid: number[][], pos: Position): Position[] {
	const [x, y] = pos;

	const cardinals: Record<string, [number, number]> = {
		n: [-1, 0],
		e: [0, 1],
		s: [1, 0],
		w: [0, -1],
	};

	const steps: Position[] = [];
	for (const cardinal of Object.keys(cardinals)) {
		const [i, j] = cardinals[cardinal];
		if (grid[x + i]) {
			if (grid[x + i][y + j] !== undefined) {
				if (grid[x + i][y + j] === grid[x][y] + 1) {
					steps.push([x + i, y + j]);
				}
			}
		}
	}

	return steps;
}

function splitTrail(grid: number[][], trail: Trail, steps: Position[]): Trail[] {
	const trails: Trail[] = [];

	for (const step of steps) {
		const newTrail: Trail = [...trail, step];
		const nextSteps: Position[] = findNextSteps(grid, step);

		if (nextSteps.length === 0) {
			trails.push(newTrail);
		} else {
			trails.push(...splitTrail(grid, newTrail, nextSteps));
		}
	}

	return trails;
}

function getTrails(grid: number[][]): Trail[] {
	const trailHeads: Position[] = findTrailHeads(grid);

	const trails: Trail[] = [];
	for (const trailHead of trailHeads) {
		const posTrails: Trail[] = [[trailHead]];

		const nextSteps: Position[] = findNextSteps(grid, trailHead);
		if (nextSteps.length > 0) {
			posTrails.push(...splitTrail(grid, [trailHead], nextSteps));
		}

		for (const posTrail of posTrails) {
			const trueTrail: number[] = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
			let isValid: boolean = true;

			for (let i = 0; i < trueTrail.length; i++) {
				if (!posTrail[i]) {
					isValid = false;
					break;
				} else if (grid[posTrail[i][0]][posTrail[i][1]] !== trueTrail[i]) {
					isValid = false;
					break;
				}
			}

			if (isValid) {
				trails.push(posTrail);
			}
		}
	}

	// Remove duplicate trails (just in case)
	const uniqueTrails: Trail[] = [];
	for (const trail of trails) {
		let isUnique: boolean = true;
		for (const uniqueTrail of uniqueTrails) {
			if (trail.length === uniqueTrail.length) {
				let isSame: boolean = true;
				for (let i = 0; i < trail.length; i++) {
					if (trail[i][0] !== uniqueTrail[i][0] || trail[i][1] !== uniqueTrail[i][1]) {
						isSame = false;
						break;
					}
				}

				if (isSame) {
					isUnique = false;
					break;
				}
			}
		}

		if (isUnique) {
			uniqueTrails.push(trail);
		}
	}

	return uniqueTrails;
}

function part1(): number {
	const input: string = fs.readFileSync(path.join(__dirname, 'input.txt'), 'utf8');
	let result: number = 0;
	const topoGrid: number[][] = [];

	for (const line of input.split('\n')) {
		topoGrid.push(line.split('').map(Number));
	}

	const trails: Trail[] = getTrails(topoGrid);
	const trailHeads: Record<string, string[]> = {};
	for (const trail of trails) {
		const trailHead: string = trail[0].toString();
		if (!trailHeads[trailHead]) {
			trailHeads[trailHead] = [];
		}

		const trailEnd: string = `${trail[trail.length - 1][0]}, ${trail[trail.length - 1][1]}`;
		if (trailHeads[trailHead].indexOf(trailEnd) === -1) {
			trailHeads[trailHead].push(trailEnd);
		}
	}

	for (const trailHead of Object.keys(trailHeads)) {
		result += trailHeads[trailHead].length;
	}

	return result;
}

function part2(): number {
	const input: string = fs.readFileSync(path.join(__dirname, 'input.txt'), 'utf8');
	let result: number = 0;
	const topoGrid: number[][] = [];

	for (const line of input.split('\n')) {
		topoGrid.push(line.split('').map(Number));
	}

	const trails: Trail[] = getTrails(topoGrid);

	// it's literally just the number of trails lol
	result = trails.length;
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
