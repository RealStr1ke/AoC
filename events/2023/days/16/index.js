const fs = require('fs');
const path = require('path');

function getEnergizedTiles(grid, beam) {
	const originalGrid = grid.map(row => row.map(tile => tile));
	const energizedTiles = [ { index: beam.index, row: beam.row } ]; // Initialize energizedTiles with the initial beam
	let currentBeams = [beam]; // Initialize currentBeams with the initial beam
	const visitedTiles = []; // Initialize visitedTiles that'll contain all the tiles that have been visited alongside the direction they were visited from

	while (currentBeams.length > 0) {
		const nextBeams = []; // Store the next set of beams

		for (const currentBeam of currentBeams) {
			// console.log(currentBeam.index, currentBeam.row, currentBeam.direction)

			if (currentBeam.index >= grid[0].length || currentBeam.row >= grid.length) {
				continue; // Skip to the next beam if the tile is undefined
			} else {
				const tile = { tile: originalGrid[currentBeam.row][currentBeam.index], index: currentBeam.index, row: currentBeam.row };
				const outputBeams = getOutputBeams(tile, currentBeam);

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

	// Print the grid with all the energized tiles bolded
	let etCount = 0;
	for (let i = 0; i < grid.length; i++) {
		// let row = '';
		for (let j = 0; j < grid[i].length; j++) {
			if (energizedTiles.some(energizedTile => energizedTile.index === j && energizedTile.row === i)) {
				// row += '#';
				etCount++;
			} else {
				// row += '.';
			}
		}
		// console.log(row);
	}

	return etCount;

}

function getOutputBeams(tile, beam) {
	const outputBeams = [];
	// Empty Spaces
	if (tile.tile === '.') {
		// console.log("BEAM HIT EMPTY SPACE", tile)
		outputBeams.push({ index: tile.index, row: tile.row, direction: beam.direction });
		// Mirrors
	} else if (tile.tile === '/' || tile.tile === '\\') {
		// console.log("BEAM HIT MIRROR")
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
		// console.log("BEAM HIT SPLITTER")
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

	// console.log(outputBeams)

	return outputBeams;
}


function part1() {
	const grid = fs.readFileSync(path.join(__dirname, 'input.txt'), 'utf8').split('\n').map(line => line.split(''));
	let result = 0;

	const beam = { index: 0, row: 0, direction: 'right' };
	const energizedTiles = getEnergizedTiles(grid, beam);

	result = energizedTiles;

	return result;
}

function part2() {
	const data = fs.readFileSync(path.join(__dirname, 'input.txt'), 'utf8');
	let result = 0;

	const beams = [];
	// Add the following beams to the beams array
	// Beams on all the top tiles going down
	for (let i = 0; i < data.split('\n')[0].length; i++) {
		beams.push({ index: i, row: 0, direction: 'down' });
	}
	// Beams on all the right tiles going left
	for (let i = 0; i < data.split('\n').length; i++) {
		beams.push({ index: data.split('\n')[0].length - 1, row: i, direction: 'left' });
	}
	// Beams on all the bottom tiles going up
	for (let i = 0; i < data.split('\n')[0].length; i++) {
		beams.push({ index: i, row: data.split('\n').length - 1, direction: 'up' });
	}
	// Beams on all the left tiles going right
	for (let i = 0; i < data.split('\n').length; i++) {
		beams.push({ index: 0, row: i, direction: 'right' });
	}

	let maxEnergizedTiles = 0;
	let beamIndex = 0;
	for (const beam of beams) {
		const energizedTiles = getEnergizedTiles(data.split('\n').map(line => line.split('')), beam);
		if (energizedTiles > maxEnergizedTiles) {
			maxEnergizedTiles = energizedTiles;
			console.log(`Beam ${beamIndex} / ${beams.length} | New max with beam at ${beam.index}, ${beam.row} with direction ${beam.direction} energizing ${energizedTiles} tiles`);
		} else {
			console.log(`Beam ${beamIndex} / ${beams.length} | No new max`);
		}
		beamIndex++;
	}

	result = maxEnergizedTiles;

	return result;
}

// console.log(`Part 1: ${part1()}`);
// console.log(`Part 2: ${part2()}`);

module.exports = {
	part1,
	part2,
};