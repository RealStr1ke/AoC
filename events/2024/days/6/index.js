import fs from 'fs';
import path from 'path';

function findGuard(gridMap) {
	for (let i = 0; i < gridMap.length; i++) {
		for (let j = 0; j < gridMap[i].length; j++) {
			if (gridMap[i][j] === '^') return [i, j];
		}
	}
}

function findPath(gridMap) {
	const guard = findGuard(gridMap);
	// console.log(gridMap.join('\n'));
	const guardPath = [];

	let pos = guard;
	let currentDirection = 'up';

	while (true) {
		const [i, j] = pos;
		let di, dj;
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

		// console.log(i + di, j + dj);
		// console.log(pos)

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
function findObstuctionsForLoop(gridMap) {
	const walls = {};
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

	const obstructions = [];

	for (let i = 0; i < gridMap.length; i++) {
		for (let j = 0; j < gridMap[i].length; j++) {
			if (gridMap[i][j] !== '#' && gridMap[i][j] !== '^') {
				// Deep copy of gridMap
				const newGridMap = gridMap.map(row => row.slice());

				newGridMap[i][j] = '#';
				const tempWall = {
					hit: {
						up: false,
						right: false,
						down: false,
						left: false,
					},
					hitIndexes: [],
				};

				const guard = findGuard(gridMap);
				const guardPath = [];

				let pos = guard;
				let currentDirection = 'up';
				let steps = 0;

				while (steps < 20000) {
					const [k, l] = pos;
					let dk, dl;
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


function part1() {
	const data = fs.readFileSync(path.join(__dirname, 'input.txt'), 'utf8');
	let result = 0;

	const gridMap = [];
	for (const line of data.split('\n')) gridMap.push(line.split(''));

	const guardPath = findPath(gridMap);

	const pathMap = gridMap;
	for (const [i, j] of guardPath) pathMap[i][j] = 'X';
	const mapString = pathMap.map(row => row.join('')).join('');

	for (const char of mapString.split('')) if (char === 'X') result++;


	return result;
}

function part2() {
	const data = fs.readFileSync(path.join(__dirname, 'input.txt'), 'utf8');
	let result = 0;

	const gridMap = [];
	for (const line of data.split('\n')) gridMap.push(line.split(''));

	const guardNewWalls = findObstuctionsForLoop(gridMap);
	// console.log(guardNewWalls);

	result = guardNewWalls.length;

	return result;
}

// console.log(`Part 1: ${part1()}`);
// console.log(`Part 2: ${part2()}`);

export default {
	part1,
	part2,
};