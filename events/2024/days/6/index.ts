import fs from 'fs';
import path from 'path';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import * as aoc from '../../../../src/lib/utils.ts';

type Direction = 'up' | 'right' | 'down' | 'left';

interface Wall {
	hit: Record<Direction, boolean>;
	hitIndexes: number[][];
}

function findGuard(gridMap: string[][]): [number, number] {
	for (let i = 0; i < gridMap.length; i++) {
		for (let j = 0; j < gridMap[i].length; j++) {
			if (gridMap[i][j] === '^') return [i, j];
		}
	}
	return [0, 0]; // fallback
}

function findPath(gridMap: string[][]): number[][] {
	const guard: [number, number] = findGuard(gridMap);
	const guardPath: number[][] = [];

	let pos: [number, number] = guard;
	let currentDirection: Direction = 'up';

	while (true) {
		const [i, j] = pos;
		let di: number, dj: number;
		switch (currentDirection) {
			case 'up':
				[di, dj] = [-1, 0];
				break;
			case 'right':
				[di, dj] = [0, 1];
				break;
			case 'down':
				[di, dj] = [1, 0];
				break;
			case 'left':
				[di, dj] = [0, -1];
				break;
		}

		// Check if we're out of bounds
		if (pos[0] < 0 || pos[0] >= gridMap.length || pos[1] < 0 || pos[1] >= gridMap[0].length) {
			return guardPath;
		} else if (gridMap[i + di] === undefined) {
			return guardPath;
		}

		if (gridMap[i + di][j + dj] === '#') {
			// Turn right
			if (currentDirection === 'up') {
				currentDirection = 'right';
			} else if (currentDirection === 'right') {
				currentDirection = 'down';
			} else if (currentDirection === 'down') {
				currentDirection = 'left';
			} else {
				currentDirection = 'up';
			}
		}

		// Move in the current direction
		if (currentDirection === 'up') {
			pos = [i - 1, j];
		} else if (currentDirection === 'right') {
			pos = [i, j + 1];
		} else if (currentDirection === 'down') {
			pos = [i + 1, j];
		} else {
			pos = [i, j - 1];
		}

		guardPath.push(pos);
	}
}

// Needs optimization: only check for obstacles on the guard's path instead of checking every possible location
function findObstuctionsForLoop(gridMap: string[][]): number[][] {
	const walls: Record<string, Wall> = {};
	for (let i = 0; i < gridMap.length; i++) {
		for (let j = 0; j < gridMap[i].length; j++) {
			if (gridMap[i][j] === '#') {
				walls[`${i},${j}`] = {
					hit: {
						up: false,
						right: false,
						down: false,
						left: false,
					},
					hitIndexes: [],
				};
			}
		}
	}

	const obstructions: number[][] = [];

	for (let i = 0; i < gridMap.length; i++) {
		for (let j = 0; j < gridMap[i].length; j++) {
			if (gridMap[i][j] !== '#' && gridMap[i][j] !== '^') {
				// Deep copy of gridMap
				const newGridMap: string[][] = gridMap.map(row => row.slice());

				newGridMap[i][j] = '#';
				const tempWall: Wall = {
					hit: {
						up: false,
						right: false,
						down: false,
						left: false,
					},
					hitIndexes: [],
				};

				const guard: [number, number] = findGuard(gridMap);
				const guardPath: number[][] = [];

				let pos: [number, number] = guard;
				let currentDirection: Direction = 'up';
				let steps: number = 0;

				while (steps < 20000) {
					const [k, l] = pos;
					let dk: number, dl: number;
					switch (currentDirection) {
						case 'up':
							[dk, dl] = [-1, 0];
							break;
						case 'right':
							[dk, dl] = [0, 1];
							break;
						case 'down':
							[dk, dl] = [1, 0];
							break;
						case 'left':
							[dk, dl] = [0, -1];
							break;
					}

					// Check if we're out of bounds
					if (k + dk < 0 || k + dk >= newGridMap.length || l + dl < 0 || l + dl >= newGridMap[0].length) {
						break;
					}

					if (newGridMap[k + dk][l + dl] === '#') {
						if (walls[`${k + dk},${l + dl}`] === undefined) {
							if (!tempWall.hit[currentDirection]) {
								tempWall.hit[currentDirection] = true;
								tempWall.hitIndexes.push([k + dk, l + dl]);
							} else {
								obstructions.push([i, j]);
								break;
							}
						} else if (!walls[`${k + dk},${l + dl}`].hit[currentDirection]) {
							walls[`${k + dk},${l + dl}`].hit[currentDirection] = true;
							walls[`${k + dk},${l + dl}`].hitIndexes.push([k + dk, l + dl]);
						} else {
							obstructions.push([i, j]);
							break;
						}

						switch (currentDirection) {
							case 'up':
								currentDirection = 'right';
								break;
							case 'right':
								currentDirection = 'down';
								break;
							case 'down':
								currentDirection = 'left';
								break;
							case 'left':
								currentDirection = 'up';
								break;
						}
					} else {
						pos = [k + dk, l + dl];
						guardPath.push(pos);
					}

					steps++;
				}

				// Reset walls
				for (const wall of Object.keys(walls)) {
					walls[wall].hit.up = false;
					walls[wall].hit.right = false;
					walls[wall].hit.down = false;
					walls[wall].hit.left = false;
					walls[wall].hitIndexes = [];
				}
			}
		}
	}

	return obstructions;
}

function part1(): number {
	const input: string = fs.readFileSync(path.join(__dirname, 'input.txt'), 'utf8');
	let result: number = 0;

	const gridMap: string[][] = [];
	for (const line of input.split('\n')) gridMap.push(line.split(''));

	const guardPath: number[][] = findPath(gridMap);

	const pathMap: string[][] = gridMap;
	for (const [i, j] of guardPath) pathMap[i][j] = 'X';
	const mapString: string = pathMap.map(row => row.join('')).join('');

	for (const char of mapString.split('')) if (char === 'X') result++;

	return result;
}

function part2(): number {
	const input: string = fs.readFileSync(path.join(__dirname, 'input.txt'), 'utf8');
	let result: number = 0;

	const gridMap: string[][] = [];
	for (const line of input.split('\n')) gridMap.push(line.split(''));

	const guardNewWalls: number[][] = findObstuctionsForLoop(gridMap);

	result = guardNewWalls.length;
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
