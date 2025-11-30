import fs from 'fs';
import path from 'path';
import * as aoc from '../../../../src/lib/utils.ts';

function findRobotStartPos(grid: string[][]): [number, number] {
	for (let y = 0; y < grid.length; y++) {
		for (let x = 0; x < grid[y].length; x++) {
			if (grid[y][x] === '@') {
				return [x, y];
			}
		}
	}
	return [-1, -1];
}

function moveRobot(grid: string[][], instructions: string[]): string[][] {
	const startPos: [number, number] = findRobotStartPos(grid);
	const newGrid: string[][] = grid.map((row: string[]) => row.slice());

	// Instructions: < ^ > v
	const directions: [number, number][] = [
		[1, 0], // Right
		[0, 1], // Down
		[-1, 0], // Left
		[0, -1], // Up
	];
	let x: number = startPos[0];
	let y: number = startPos[1];

	for (const instruction of instructions) {
		let direction: [number, number] = [0, 0];
		if (instruction === '<') {
			direction = directions[2];
		} else if (instruction === '^') {
			direction = directions[3];
		} else if (instruction === '>') {
			direction = directions[0];
		} else if (instruction === 'v') {
			direction = directions[1];
		} else {
			console.error('Invalid instruction');
			process.exit(1);
		}

		// console.log(x, y, direction);

		// Check what is in the next position
		const nextX: number = x + direction[0];
		const nextY: number = y + direction[1];
		const nextPos: string = newGrid[nextY][nextX];

		if (nextPos === '#') {
			// Do nothing
		} else if (nextPos === 'O') {
			// Make an array of all the cells in the direction of the robot
			const cells: string[] = [];
			let cellX: number = nextX;
			let cellY: number = nextY;
			while (newGrid[cellY][cellX] !== '#') {
				cells.push(newGrid[cellY][cellX]);
				cellX += direction[0];
				cellY += direction[1];
			}
			// console.log(cells);

			const emptyCellIndex: number = cells.indexOf('.');
			if (emptyCellIndex === -1) {
				// Do nothing
				// console.log("Unable to move box")
			} else {
				const newCells = [ '.', ...cells.slice(0, emptyCellIndex), ...cells.slice(emptyCellIndex + 1) ];
				// console.log(cells);
				// console.log(newCells);

				cellX = nextX;
				cellY = nextY;
				for (const cell of newCells) {
					newGrid[cellY][cellX] = cell;
					cellX += direction[0];
					cellY += direction[1];
				}
				newGrid[y][x] = '.';
				newGrid[nextY][nextX] = '@';
				x = nextX;
				y = nextY;
			}
		} else {
			newGrid[y][x] = '.';
			newGrid[nextY][nextX] = '@';
			x = nextX;
			y = nextY;
		}
	}

	return newGrid;
}

function moveRobotExpanded(grid: string[][], instructions: string[]): string[][] {
	// Expand the grid following these rules
	const expandedGrid: string[][] = [];
	for (const row of grid) {
		const newRow: string[] = [];
		for (const cell of row) {
			if (cell === '#') {
				newRow.push('#', '#');
			} else if (cell === 'O') {
				newRow.push('[', ']');
			} else if (cell === '.') {
				newRow.push('.', '.');
			} else if (cell === '@') {
				newRow.push('@', '.');
			}
		}
		expandedGrid.push(newRow);
	}

	const startPos: [number, number] = findRobotStartPos(expandedGrid);
	const newGrid: string[][] = expandedGrid.map((row: string[]) => row.slice());

	// Instructions: < ^ > v
	const directions: [number, number][] = [
		[1, 0], // Right
		[0, 1], // Down
		[-1, 0], // Left
		[0, -1], // Up
	];
	let x: number = startPos[0];
	let y: number = startPos[1];

	for (const instruction of instructions) {
		let direction: [number, number] = [0, 0];
		if (instruction === '<') {
			direction = directions[2];
		} else if (instruction === '^') {
			direction = directions[3];
		} else if (instruction === '>') {
			direction = directions[0];
		} else if (instruction === 'v') {
			direction = directions[1];
		} else {
			console.error('Invalid instruction');
			process.exit(1);
		}
		// console.log(`Move ${instruction}:`);
		// console.log(x, y, direction);

		// Check what is in the next position
		const nextX: number = x + direction[0];
		const nextY: number = y + direction[1];
		const nextPos: string = newGrid[nextY][nextX];

		if (nextPos === '#') {
			// Do nothing
		} else if (nextPos === '[' || nextPos === ']') {
			if (instruction === '<' || instruction === '>') {
				const cells: string[] = [];
				let cellX: number = nextX;
				let cellY: number = nextY;
				while (newGrid[cellY][cellX] !== '#') {
					cells.push(newGrid[cellY][cellX]);
					cellX += direction[0];
					cellY += direction[1];
				}
				// console.log(cells);

				const emptyCellIndex: number = cells.indexOf('.');
				if (emptyCellIndex === -1) {
					// Do nothing
					// console.log("Unable to move box")
				} else {
					const newCells = [ '.', ...cells.slice(0, emptyCellIndex), ...cells.slice(emptyCellIndex + 1) ];
					// console.log(cells);
					// console.log(newCells);

					// Write the new cells back to the grid
					cellX = nextX;
					cellY = nextY;
					for (const cell of newCells) {
						newGrid[cellY][cellX] = cell;
						cellX += direction[0];
						cellY += direction[1];
					}
					newGrid[y][x] = '.';
					newGrid[nextY][nextX] = '@';
					x = nextX;
					y = nextY;
				}
			} else if (instruction === '^' || instruction === 'v') {
				const boxPos: [number, number] = nextPos === '[' ? [nextX, nextY] : [nextX - 1, nextY];
				// console.log(boxPos);
				const boxesBeingPushed: [number, number][] = [];
				const boxesBeingChecked: [number, number][] = [];
				let cantBePushed: boolean = false;
				boxesBeingPushed.push(boxPos);
				boxesBeingChecked.push(boxPos);

				if (instruction === '^') {
					while (boxesBeingChecked.length > 0 && !cantBePushed) {
						const box: [number, number] = boxesBeingChecked.pop() as [number, number];

						if (newGrid[box[1] - 1][box[0] - 1] === '[') {
							boxesBeingChecked.push([box[0] - 1, box[1] - 1]);
							boxesBeingPushed.push([box[0] - 1, box[1] - 1]);
						}
						if (newGrid[box[1] - 1][box[0]] === '[') {
							boxesBeingChecked.push([box[0], box[1] - 1]);
							boxesBeingPushed.push([box[0], box[1] - 1]);
						}
						if (newGrid[box[1] - 1][box[0] + 1] === '[') {
							boxesBeingChecked.push([box[0] + 1, box[1] - 1]);
							boxesBeingPushed.push([box[0] + 1, box[1] - 1]);
						}

						if (newGrid[box[1] - 1][box[0]] === '#' || newGrid[box[1] - 1][box[0] + 1] === '#') {
							cantBePushed = true; break;
						}
					}

					if (!cantBePushed) {
						// Remove duplicates from the boxesBeingPushed array and sort it to prevent tomfoolery idk
						const boxesBeingPushedSet = new Set<string>();
						const boxesBeingPushedUnique: [number, number][] = [];
						for (const box of boxesBeingPushed) {
							const boxStr: string = box.join(',');
							if (!boxesBeingPushedSet.has(boxStr)) {
								boxesBeingPushedSet.add(boxStr);
								boxesBeingPushedUnique.push(box);
							}
						}
						boxesBeingPushedUnique.sort((a: [number, number], b: [number, number]) => {
							if (a[1] === b[1]) {
								return a[0] - b[0];
							}
							return b[1] - a[1];
						});

						while (boxesBeingPushedUnique.length > 0) {
							const box: [number, number] = boxesBeingPushedUnique.pop() as [number, number];
							newGrid[box[1] - 1][box[0]] = '[';
							newGrid[box[1]][box[0]] = '.';
							newGrid[box[1] - 1][box[0] + 1] = ']';
							newGrid[box[1]][box[0] + 1] = '.';
						}

						newGrid[y][x] = '.';
						newGrid[nextY][nextX] = '@';
						x = nextX;
						y = nextY;
					}
				} else if (instruction === 'v') {
					// console.log(boxesBeingChecked);
					while (boxesBeingChecked.length > 0 && !cantBePushed) {
						const box: [number, number] = boxesBeingChecked.pop() as [number, number];

						if (newGrid[box[1] + 1][box[0] - 1] === '[') {
							boxesBeingChecked.push([box[0] - 1, box[1] + 1]);
							boxesBeingPushed.push([box[0] - 1, box[1] + 1]);
						}
						if (newGrid[box[1] + 1][box[0]] === '[') {
							boxesBeingChecked.push([box[0], box[1] + 1]);
							boxesBeingPushed.push([box[0], box[1] + 1]);
						}
						if (newGrid[box[1] + 1][box[0] + 1] === '[') {
							boxesBeingChecked.push([box[0] + 1, box[1] + 1]);
							boxesBeingPushed.push([box[0] + 1, box[1] + 1]);
						}

						if (newGrid[box[1] + 1][box[0]] === '#' || newGrid[box[1] + 1][box[0] + 1] === '#') {
							cantBePushed = true; break;
						}
					}

					if (!cantBePushed) {
						// Remove duplicates from the boxesBeingPushed array and sort it to prevent tomfoolery idk
						const boxesBeingPushedSet = new Set<string>();
						const boxesBeingPushedUnique: [number, number][] = [];
						for (const box of boxesBeingPushed) {
							const boxStr: string = box.join(',');
							if (!boxesBeingPushedSet.has(boxStr)) {
								boxesBeingPushedSet.add(boxStr);
								boxesBeingPushedUnique.push(box);
							}
						}
						boxesBeingPushedUnique.sort((a: [number, number], b: [number, number]) => {
							if (a[1] === b[1]) {
								return a[0] - b[0];
							}
							return a[1] - b[1];
						});

						while (boxesBeingPushedUnique.length > 0) {
							const box: [number, number] = boxesBeingPushedUnique.pop() as [number, number];
							newGrid[box[1] + 1][box[0]] = '[';
							newGrid[box[1]][box[0]] = '.';
							newGrid[box[1] + 1][box[0] + 1] = ']';
							newGrid[box[1]][box[0] + 1] = '.';
						}

						newGrid[y][x] = '.';
						newGrid[nextY][nextX] = '@';
						x = nextX;
						y = nextY;
					}
				}
			}

		} else {
			newGrid[y][x] = '.';
			newGrid[nextY][nextX] = '@';
			x = nextX;
			y = nextY;
		}
	}

	return newGrid;
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

	const data: string[] = aoc.createArray(input, '\n\n');

	const grid: string[][] = data[0].split('\n').map((row: string) => row.split(''));
	const instructions: string[] = data[1].split('\n').join('').split('');

	const newGrid: string[][] = moveRobot(grid, instructions);

	for (let i = 0; i < newGrid.length; i++) {
		for (let j = 0; j < newGrid[i].length; j++) {
			if (newGrid[i][j] === 'O') {
				result += (100 * i) + j;
			}
		}
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

	const data: string[] = aoc.createArray(input, '\n\n');

	const grid: string[][] = data[0].split('\n').map((row: string) => row.split(''));
	const instructions: string[] = data[1].split('\n').join('').split('');

	const newGrid: string[][] = moveRobotExpanded(grid, instructions);

	for (let i = 0; i < newGrid.length; i++) {
		for (let j = 0; j < newGrid[i].length; j++) {
			if (newGrid[i][j] === '[') {
				result += (100 * i) + j;
			}
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