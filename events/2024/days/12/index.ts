import fs from 'fs';
import path from 'path';
import * as aoc from '../../../../src/lib/utils.ts';

function findRegions(data: string[][]): Record<string, [number, number][][]> {
	const regions: Record<string, [number, number][][]> = {};

	const checked: number[][] = [];
	for (let i = 0; i < data.length; i++) {
		for (let j = 0; j < data[i].length; j++) {
			const letter: string = data[i][j];
			// console.log(`Checking ${i},${j} for ${letter}`);
			if (!regions[letter]) regions[letter] = [];
			if (checked.some((c) => c[0] === i && c[1] === j)) {
				// console.log(`Skipping ${i},${j} as it has already been checked`);
				continue;
			}

			const region: [number, number][] = [];
			// console.log(`Pushing ${i},${j} to region`);
			region.push([i, j]);
			checked.push([i, j]);

			const surrounding: number[][] = [];
			for (let k = 0; k < aoc.directions.length; k++) {
				const newRow: number = i + aoc.directions[k][0];
				const newCol: number = j + aoc.directions[k][1];

				if (aoc.coordsExist(data, newRow, newCol)) {
					surrounding.push([newRow, newCol]);
				}
			}
			while (surrounding.length > 0) {
				const current: number[] | undefined = surrounding.pop();
				if (!current) continue;
				const row: number = current[0];
				const col: number = current[1];

				if (checked.some((c) => c[0] === row && c[1] === col)) {
					// console.log(`Skipping ${row},${col} as it has already been checked`);
					continue;
				}


				if (data[row][col] === letter) {
					// console.log(`Pushing ${row},${col} to region`);
					region.push([row, col]);
					checked.push([row, col]);

					for (let k = 0; k < aoc.directions.length; k++) {
						const newRow: number = row + aoc.directions[k][0];
						const newCol: number = col + aoc.directions[k][1];

						if (aoc.coordsExist(data, newRow, newCol)) {
							if (checked.some((c) => c[0] === newRow && c[1] === newCol)) {
								// console.log(`Skipping ${newRow},${newCol} as it has already been checked`);
								continue;
							}
							// console.log(`Pushing ${newRow},${newCol} to surroundings of ${row},${col}`);
							surrounding.push([newRow, newCol]);
						}
					}
				}
			}

			regions[letter].push(region);
		}
	}

	return regions;
}

function calculatePerimeter(region: number[][]): [number, number][] {
	const perimeter: [number, number][] = [];

	for (let i = 0; i < region.length; i++) {
		const row: number = region[i][0];
		const col: number = region[i][1];

		for (let j = 0; j < aoc.directions.length; j++) {
			const newRow: number = row + aoc.directions[j][0];
			const newCol: number = col + aoc.directions[j][1];

			if (!region.some((r) => r[0] === newRow && r[1] === newCol)) {
				perimeter.push([newRow, newCol]);
			}
		}
	}

	return perimeter;
}

function calculateSides(region: [number, number][]): number {
	// Make a grid of the region
	let grid: string[][] = [];
	let biggestRow: number = 0;
	let biggestCol: number = 0;
	let smallestRow: number = Infinity;
	let smallestCol: number = Infinity;

	for (let i = 0; i < region.length; i++) {
		const row: number = region[i][0];
		const col: number = region[i][1];

		if (row > biggestRow) biggestRow = row;
		if (row < smallestRow) smallestRow = row;
		if (col > biggestCol) biggestCol = col;
		if (col < smallestCol) smallestCol = col;
	}

	for (let i = 0; i < biggestRow - smallestRow + 1; i++) {
		grid.push([]);
		for (let j = 0; j < biggestCol - smallestCol + 1; j++) {
			grid[i].push('.');
		}
	}

	for (let i = 0; i < region.length; i++) {
		const row: number = region[i][0];
		const col: number = region[i][1];

		grid[row - smallestRow][col - smallestCol] = '#';
	}

	// Expand that grid
	grid = aoc.expandGrid(grid, 3);

	for (let i = 0; i < grid.length; i++) {
		// console.log(grid[i].join(''));
	}

	const newRegion: number[][] = [];
	for (let i = 0; i < grid.length; i++) {
		for (let j = 0; j < grid[i].length; j++) {
			if (grid[i][j] === '#') {
				newRegion.push([i, j]);
			}
		}
	}

	const perimeter: [number, number][] = calculatePerimeter(newRegion);
	// console.log(perimeter);


	biggestRow = 0;
	biggestCol = 0;
	smallestRow = Infinity;
	smallestCol = Infinity;

	for (let i = 0; i < perimeter.length; i++) {
		const row: number = perimeter[i][0];
		const col: number = perimeter[i][1];

		if (row > biggestRow) biggestRow = row;
		if (row < smallestRow) smallestRow = row;
		if (col > biggestCol) biggestCol = col;
		if (col < smallestCol) smallestCol = col;
	}

	// Make a grid of the perimeter
	grid = [];
	for (let i = 0; i < biggestRow - smallestRow + 1; i++) {
		grid.push([]);
		for (let j = 0; j < biggestCol - smallestCol + 1; j++) {
			grid[i].push('.');
		}
	}
	for (let i = 0; i < perimeter.length; i++) {
		const row: number = perimeter[i][0];
		const col: number = perimeter[i][1];

		grid[row - smallestRow][col - smallestCol] = '#';
	}

	for (let i = 0; i < grid.length; i++) {
		// console.log(grid[i].join(''));
	}

	const newHeight: number = grid.length + 2;
	const newLength: number = grid[0].length + 2;
	const newGrid: string[][] = [];
	for (let i = 0; i < newHeight; i++) {
		newGrid.push([]);
		for (let j = 0; j < newLength; j++) {
			newGrid[i].push('.');
		}
	}
	for (let i = 0; i < grid.length; i++) {
		for (let j = 0; j < grid[i].length; j++) {
			newGrid[i + 1][j + 1] = grid[i][j];
		}
	}

	for (let i = 0; i < newGrid.length; i++) {
		// console.log(newGrid[i].join(''));
	}

	// Find all the corners
	const corners: [number, number][] = [];

	for (let i = 0; i < newGrid.length; i++) {
		for (let j = 0; j < newGrid[i].length; j++) {
			if (newGrid[i][j] === '#') {
				// Make a 3x3 grid around the point
				const directions: [number, number][] = [
					[-1, -1],
					[-1, 0],
					[-1, 1],
					[0, -1],
					[0, 0],
					[0, 1],
					[1, -1],
					[1, 0],
					[1, 1],
				];

				const chars: string[] = [];
				for (let k = 0; k < directions.length; k++) {
					const newRow: number = i + directions[k][0];
					const newCol: number = j + directions[k][1];

					if (aoc.coordsExist(newGrid, newRow, newCol)) {
						chars.push(newGrid[newRow][newCol]);
					}
				}

				// console.log([i, j], chars);

				if (chars[3] === '#' && chars[4] === '#' && chars[5] === '#') {
					// Not a corner
				} else if (chars[1] === '#' && chars[4] === '#' && chars[7] === '#') {
					// Not a corner
				} else if (chars[3] === '.' && chars[4] === '#' && chars[5] === '#') {
					if (chars[1] === '#') {
						// console.log(`Corner at ${i},${j}`);
						corners.push([i, j]);
					} else if (chars[7] === '#') {
						// console.log(`Corner at ${i},${j}`);
						corners.push([i, j]);
					} else {
						// Is a corner, but ignored
					}
				} else if (chars[3] === '#' && chars[4] === '#' && chars[5] === '.') {
					if (chars[1] === '#') {
						// console.log(`Corner at ${i},${j}`);
						corners.push([i, j]);
					} else if (chars[7] === '#') {
						// console.log(`Corner at ${i},${j}`);
						corners.push([i, j]);
					} else {
						// Is a corner, but ignored
					}
				} else {
					// console.log(`Corner at ${i},${j}`);
					corners.push([i, j]);
					// newGrid[i][j] = 'X';
				}
			}
		}

		for (let k = 0; k < newGrid.length; k++) {
			for (let l = 0; l < newGrid[i].length; l++) {
				if (corners.some((c) => c[0] === k && c[1] === l)) {
					// newGrid[i][j] = 'X';
				}
			}
		}

		for (let k = 0; k < newGrid.length; k++) {
			// console.log(newGrid[i].join(''));
		}


	}

	return corners.length;

}

function part1(): number {
	const input: string = fs.readFileSync(path.join(__dirname, 'input.txt'), 'utf8');

	let result: number = 0;

	const data: string[][] = aoc.createGrid(input);

	const regions: Record<string, [number, number][][]> = findRegions(data);
	const perimeters: Record<string, number[]> = {};

	// For each region of each letter, calculate the perimeter
	for (const letter in regions) {
		if (Object.prototype.hasOwnProperty.call(regions, letter)) {
			const region: [number, number][][] = regions[letter];

			perimeters[letter] = [];
			for (let i = 0; i < region.length; i++) {
				perimeters[letter].push(calculatePerimeter(region[i]).length);
			}
		}
	}

	// Multiply the perimeters of each region of each letter by the region area (aka region.length)
	for (const letter in perimeters) {
		if (Object.prototype.hasOwnProperty.call(perimeters, letter)) {
			const perims: number[] = perimeters[letter];

			for (let i = 0; i < perims.length; i++) {
				result += perims[i] * regions[letter][i].length;
			}
		}
	}

	return result;
}

function part2(): number {
	const input: string = fs.readFileSync(path.join(__dirname, 'input.txt'), 'utf8');

	let result: number = 0;

	const data: string[][] = aoc.createGrid(input);

	const regions: Record<string, [number, number][][]> = findRegions(data);
	const sides: Record<string, number[]> = {};

	// For each region of each letter, calculate the sides
	for (const letter in regions) {
		if (Object.prototype.hasOwnProperty.call(regions, letter)) {
			const letterRegions: [number, number][][] = regions[letter];

			sides[letter] = [];
			for (let i = 0; i < letterRegions.length; i++) {
				const region: [number, number][] = letterRegions[i];
				// calculateSides(regions["Z"][0]);
				sides[letter].push(calculateSides(region));
			}
		}
	}

	// Multiply the side counts of each region of each letter by the region area (aka region.length)
	for (const letter in sides) {
		if (Object.prototype.hasOwnProperty.call(sides, letter)) {
			const sideCounts: number[] = sides[letter];

			for (let i = 0; i < sideCounts.length; i++) {
				// console.log(`Adding ${sideCounts[i]} * ${regions[letter][i].length}`);
				result += sideCounts[i] * regions[letter][i].length;
			}
		}
	}

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