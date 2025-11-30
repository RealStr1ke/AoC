import fs from 'fs';
import path from 'path';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import * as aoc from '../../../../src/lib/utils.ts';

type Direction = 'right' | 'down' | 'left' | 'up';

interface Beam {
	index: number;
	row: number;
	direction: Direction;
}

interface Tile {
	tile: string;
	index: number;
	row: number;
}

interface EnergizedTile {
	index: number;
	row: number;
}

interface VisitedTile {
	index: number;
	row: number;
	direction: Direction;
}

function getEnergizedTiles(grid: string[][], beam: Beam): number {
	const originalGrid: string[][] = grid.map(row => row.map(tile => tile));
	const energizedTiles: EnergizedTile[] = [{ index: beam.index, row: beam.row }]; // Initialize energizedTiles with the initial beam
	let currentBeams: Beam[] = [beam]; // Initialize currentBeams with the initial beam
	const visitedTiles: VisitedTile[] = []; // Initialize visitedTiles that'll contain all the tiles that have been visited alongside the direction they were visited from

	while (currentBeams.length > 0) {
		const nextBeams: Beam[] = []; // Store the next set of beams

		for (const currentBeam of currentBeams) {
			if (currentBeam.index >= grid[0].length || currentBeam.row >= grid.length) {
				continue; // Skip to the next beam if the tile is undefined
			} else {
				const tile: Tile = { tile: originalGrid[currentBeam.row][currentBeam.index], index: currentBeam.index, row: currentBeam.row };
				const outputBeams: Beam[] = getOutputBeams(tile, currentBeam);

				for (const outputBeam of outputBeams) {
					if (outputBeam.direction === 'right') {
						outputBeam.index++;
					} else if (outputBeam.direction === 'down') {
						outputBeam.row++;
					} else if (outputBeam.direction === 'left') {
						outputBeam.index--;
					} else if (outputBeam.direction === 'up') {
						outputBeam.row--;
					}

					// If the tile has already been visited from the same direction, skip to the next beam
					if (visitedTiles.some(visitedTile => visitedTile.index === outputBeam.index && visitedTile.row === outputBeam.row && visitedTile.direction === outputBeam.direction)) {
						continue;
					} else {
						visitedTiles.push({ index: outputBeam.index, row: outputBeam.row, direction: outputBeam.direction }); // Add the tile to the visitedTiles array
					}

					if (outputBeam.index >= 0 && outputBeam.row >= 0) {
						nextBeams.push(outputBeam); // Add valid beams to the nextBeams array
						// If the tile is not already energized, add it to the energizedTiles array
						if (!energizedTiles.some(energizedTile => energizedTile.index === outputBeam.index && energizedTile.row === outputBeam.row)) {
							energizedTiles.push({ index: outputBeam.index, row: outputBeam.row });
						}
					}
				}
			}
		}

		currentBeams = nextBeams; // Update currentBeams to the next set of beams
	}

	// Count energized tiles
	let etCount: number = 0;
	for (let i = 0; i < grid.length; i++) {
		for (let j = 0; j < grid[i].length; j++) {
			if (energizedTiles.some(energizedTile => energizedTile.index === j && energizedTile.row === i)) {
				etCount++;
			}
		}
	}

	return etCount;
}

function getOutputBeams(tile: Tile, beam: Beam): Beam[] {
	const outputBeams: Beam[] = [];
	// Empty Spaces
	if (tile.tile === '.') {
		outputBeams.push({ index: tile.index, row: tile.row, direction: beam.direction });
		// Mirrors
	} else if (tile.tile === '/' || tile.tile === '\\') {
		if (tile.tile === '/') {
			if (beam.direction === 'right') {
				outputBeams.push({ index: tile.index, row: tile.row, direction: 'up' });
			} else if (beam.direction === 'down') {
				outputBeams.push({ index: tile.index, row: tile.row, direction: 'left' });
			} else if (beam.direction === 'left') {
				outputBeams.push({ index: tile.index, row: tile.row, direction: 'down' });
			} else if (beam.direction === 'up') {
				outputBeams.push({ index: tile.index, row: tile.row, direction: 'right' });
			}
		} else if (tile.tile === '\\') {
			if (beam.direction === 'right') {
				outputBeams.push({ index: tile.index, row: tile.row, direction: 'down' });
			} else if (beam.direction === 'down') {
				outputBeams.push({ index: tile.index, row: tile.row, direction: 'right' });
			} else if (beam.direction === 'left') {
				outputBeams.push({ index: tile.index, row: tile.row, direction: 'up' });
			} else if (beam.direction === 'up') {
				outputBeams.push({ index: tile.index, row: tile.row, direction: 'left' });
			}
		}
		// Splitters
	} else if (tile.tile === '|' || tile.tile === '-') {
		if (tile.tile === '|') {
			if (beam.direction === 'right' || beam.direction === 'left') {
				outputBeams.push({ index: tile.index, row: tile.row, direction: 'up' });
				outputBeams.push({ index: tile.index, row: tile.row, direction: 'down' });
			} else if (beam.direction === 'down' || beam.direction === 'up') {
				outputBeams.push({ index: tile.index, row: tile.row, direction: beam.direction });
			}
		} else if (tile.tile === '-') {
			if (beam.direction === 'right' || beam.direction === 'left') {
				outputBeams.push({ index: tile.index, row: tile.row, direction: beam.direction });
			} else if (beam.direction === 'down' || beam.direction === 'up') {
				outputBeams.push({ index: tile.index, row: tile.row, direction: 'left' });
				outputBeams.push({ index: tile.index, row: tile.row, direction: 'right' });
			}
		}
	}

	return outputBeams;
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

	const grid: string[][] = input.split('\n').map(line => line.split(''));
	const beam: Beam = { index: 0, row: 0, direction: 'right' };
	const energizedTiles: number = getEnergizedTiles(grid, beam);

	result = energizedTiles;
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

	const beams: Beam[] = [];
	const lines: string[] = input.split('\n');
	
	// Add the following beams to the beams array
	// Beams on all the top tiles going down
	for (let i = 0; i < lines[0].length; i++) {
		beams.push({ index: i, row: 0, direction: 'down' });
	}
	// Beams on all the right tiles going left
	for (let i = 0; i < lines.length; i++) {
		beams.push({ index: lines[0].length - 1, row: i, direction: 'left' });
	}
	// Beams on all the bottom tiles going up
	for (let i = 0; i < lines[0].length; i++) {
		beams.push({ index: i, row: lines.length - 1, direction: 'up' });
	}
	// Beams on all the left tiles going right
	for (let i = 0; i < lines.length; i++) {
		beams.push({ index: 0, row: i, direction: 'right' });
	}

	let maxEnergizedTiles: number = 0;
	for (const beam of beams) {
		const energizedTiles: number = getEnergizedTiles(lines.map(line => line.split('')), beam);
		if (energizedTiles > maxEnergizedTiles) {
			maxEnergizedTiles = energizedTiles;
		}
	}

	result = maxEnergizedTiles;
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
