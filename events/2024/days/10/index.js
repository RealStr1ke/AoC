import fs from 'fs';
import path from 'path';

function findTrailHeads(grid) {
	const trailHeads = [];

	for (let i = 0; i < grid.length; i++) {
		for (let j = 0; j < grid[i].length; j++) {
			if (grid[i][j] === 0) {
				trailHeads.push([i, j]);
			}
		}
	}

	return trailHeads;
}

function findNextSteps(grid, pos) {
	const [x, y] = pos;

	const cardinals = {
		n: [-1, 0],
		// ne: [-1, 1],
		e: [0, 1],
		// se: [1, 1],
		s: [1, 0],
		// sw: [1, -1],
		w: [0, -1],
		// nw: [-1, -1],
	};

	const steps = [];
	for (const cardinal of Object.keys(cardinals)) {
		const [i, j] = cardinals[cardinal];
		if (grid[x + i]) {
			if (grid[x + i][y + j]) {
				if (parseInt(grid[x + i][y + j]) === parseInt(grid[x][y]) + 1) {
					steps.push([x + i, y + j]);
				}
			}
		}
	}

	return steps;
}

function splitTrail(grid, trail, steps) {
	const trails = [];
	const [x, y] = trail[trail.length - 1];

	for (const step of steps) {
		const [i, j] = step;
		const newTrail = [...trail, step];
		const nextSteps = findNextSteps(grid, step);

		if (nextSteps.length === 0) {
			trails.push(newTrail);
		} else {
			trails.push(...splitTrail(grid, newTrail, nextSteps));
		}
	}

	return trails;
}

function getTrails(grid) {
	const trailHeads = findTrailHeads(grid);

	const trails = [];
	for (const trailHead of trailHeads) {
		const posTrails = [[trailHead]];

		const nextSteps = findNextSteps(grid, trailHead);
		if (nextSteps.length > 0) {
			posTrails.push(...splitTrail(grid, [trailHead], nextSteps));
		}

		for (const posTrail of posTrails) {
			// for (let i = 0; i < posTrail.length; i++) {
			// 	console.log(grid[posTrail[i][0]][posTrail[i][1]]);
			// }

			const trueTrail = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
			let isValid = true;

			for (let i = 0; i < trueTrail.length; i++) {
				if (!posTrail[i]) {
					// console.log(`${posTrail} is invalid due to missing position ${i}`);
					isValid = false;
					break;
				} else if (grid[posTrail[i][0]][posTrail[i][1]] !== trueTrail[i]) {
					// console.log(`${posTrail} is invalid due to grid[${posTrail[i][0]}][${posTrail[i][1]}] not being ${trueTrail[i]}`);
					isValid = false;
					break;
				}
			}

			if (isValid) {
				// console.log(`${posTrail} is valid`);
				trails.push(posTrail);
			}
		}

		// console.log(trails)
	}

	// Remove duplicate trails (just in case)
	const uniqueTrails = [];
	for (const trail of trails) {
		let isUnique = true;
		for (const uniqueTrail of uniqueTrails) {
			if (trail.length === uniqueTrail.length) {
				let isSame = true;
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

function part1() {
	const data = fs.readFileSync(path.join(__dirname, 'input.txt'), 'utf8');
	let result = 0;
	const topoGrid = [];

	for (const line of data.split('\n')) {
		topoGrid.push(line.split('').map(Number));
	}

	// console.log(topoGrid)
	const trails = getTrails(topoGrid);
	const trailHeads = {};
	for (const trail of trails) {
		const trailHead = trail[0];
		if (!trailHeads[trailHead]) {
			trailHeads[trailHead] = [];
		}

		// console.log(trail[trail.length - 1]);
		const trailEnd = `${trail[trail.length - 1][0]}, ${trail[trail.length - 1][1]}`;
		if (trailHeads[trailHead].indexOf(trailEnd) === -1) {
			trailHeads[trailHead].push(trailEnd);
		}
	}

	for (const trailHead of Object.keys(trailHeads)) {
		// console.log(trailHeads[trailHead]);
		// console.log(`Trail head ${trailHead} hits ${trailHeads[trailHead].length} unique trail ends: ${trailHeads[trailHead].join(' - ')}`);
		result += trailHeads[trailHead].length;
	}

	for (const trail of trails) {
		// console.log(`${topoGrid[trail[0][0]][trail[0][1]]} -> ${topoGrid[trail[1][0]][trail[1][1]]} -> ${topoGrid[trail[2][0]][trail[2][1]]} -> ${topoGrid[trail[3][0]][trail[3][1]]} -> ${topoGrid[trail[4][0]][trail[4][1]]} -> ${topoGrid[trail[5][0]][trail[5][1]]} -> ${topoGrid[trail[6][0]][trail[6][1]]} -> ${topoGrid[trail[7][0]][trail[7][1]]} -> ${topoGrid[trail[8][0]][trail[8][1]]} -> ${topoGrid[trail[9][0]][trail[9][1]]}`);
	}

	// console.log(trails.length)
	return result;
}

function part2() {
	const data = fs.readFileSync(path.join(__dirname, 'input.txt'), 'utf8');
	let result = 0;
	const topoGrid = [];

	for (const line of data.split('\n')) {
		topoGrid.push(line.split('').map(Number));
	}

	// console.log(topoGrid)
	const trails = getTrails(topoGrid);

	// it's literally just the number of trails lol
	result = trails.length;

	return result;
}

// console.log(`Part 1: ${part1()}`);
// console.log(`Part 2: ${part2()}`);

export default {
	part1,
	part2,
};
