import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

type Platform = string[][];
type Cardinal = 'north' | 'south' | 'east' | 'west';

function slide(platform: Platform, cardinal: Cardinal): Platform {
	let newPlatform = platform.map(row => [...row]);
	
	if (cardinal === 'north') {
		// Flip newPlatform on its side so columns become rows
		newPlatform = newPlatform[0].map((col, i) => newPlatform.map(row => row[i]));
		for (let i = 0; i < newPlatform.length; i++) {
			for (let j = 0; j < newPlatform[i].length; j++) {
				if (newPlatform[i][j] === 'O') {
					// Slide all the occurences of "O" to the left until they either hit the beginning of the row, a "O", or a "#"
					let k = j;

					if (k === 0) {
						continue;
					} else {
						while (k > 0) {
							// Check if the previous cell is not "O" and not "#"
							if (newPlatform[i][k - 1] !== 'O' && newPlatform[i][k - 1] !== '#') {
								newPlatform[i][k - 1] = 'O';
								newPlatform[i][k] = '.';
								k--;
							} else {
								break;
							}
						}
					}
				}
			}
		}

		// Flip newPlatform back to normal
		newPlatform = newPlatform[0].map((col, i) => newPlatform.map(row => row[i]));
	} else if (cardinal === 'south') {
		// Flip newPlatform on its side so columns become rows
		newPlatform = newPlatform[0].map((col, i) => newPlatform.map(row => row[i]));
		for (let i = 0; i < newPlatform.length; i++) {
			for (let j = newPlatform[i].length - 1; j >= 0; j--) {
				if (newPlatform[i][j] === 'O') {
					// Slide all the occurences of "O" to the right until they either hit the end of the row, a "O", or a "#"
					let k = j;

					if (k === newPlatform[i].length - 1) {
						continue;
					} else {
						while (k < newPlatform[i].length - 1) {
							// Check if the next cell is not "O" and not "#"
							if (newPlatform[i][k + 1] !== 'O' && newPlatform[i][k + 1] !== '#') {
								newPlatform[i][k + 1] = 'O';
								newPlatform[i][k] = '.';
								k++;
							} else {
								break;
							}
						}
					}
				}
			}
		}

		// Flip newPlatform back to normal
		newPlatform = newPlatform[0].map((col, i) => newPlatform.map(row => row[i]));
	} else if (cardinal === 'east') {
		// Reverse each line
		newPlatform = newPlatform.map(line => [...line].reverse());

		for (let i = 0; i < newPlatform.length; i++) {
			for (let j = 0; j < newPlatform[i].length; j++) {
				if (newPlatform[i][j] === 'O') {
					// Slide all the occurences of "O" to the left until they either hit the beginning of the row, a "O", or a "#"
					let k = j;

					if (k === 0) {
						continue;
					} else {
						while (k > 0) {
							// Check if the previous cell is not "O" and not "#"
							if (newPlatform[i][k - 1] !== 'O' && newPlatform[i][k - 1] !== '#') {
								newPlatform[i][k - 1] = 'O';
								newPlatform[i][k] = '.';
								k--;
							} else {
								break;
							}
						}
					}
				}
			}
		}

		// Reverse each line back to normal
		newPlatform = newPlatform.map(line => [...line].reverse());
	} else if (cardinal === 'west') {
		for (let i = 0; i < newPlatform.length; i++) {
			for (let j = 0; j < newPlatform[i].length; j++) {
				if (newPlatform[i][j] === 'O') {
					// Slide all the occurences of "O" to the left until they either hit the beginning of the row, a "O", or a "#"
					let k = j;

					if (k === 0) {
						continue;
					} else {
						while (k > 0) {
							// Check if the previous cell is not "O" and not "#"
							if (newPlatform[i][k - 1] !== 'O' && newPlatform[i][k - 1] !== '#') {
								newPlatform[i][k - 1] = 'O';
								newPlatform[i][k] = '.';
								k--;
							} else {
								break;
							}
						}
					}
				}
			}
		}
	}

	return newPlatform;
}

function cycle(platform: Platform): Platform {
	// A cycle is a slide to the north, then to the west, then to the south, then to the east
	let newPlatform = platform;

	newPlatform = slide(newPlatform, 'north');
	newPlatform = slide(newPlatform, 'west');
	newPlatform = slide(newPlatform, 'south');
	newPlatform = slide(newPlatform, 'east');

	return newPlatform;
}

function platformsMatch(platform1: Platform, platform2: Platform): boolean {
	for (let i = 0; i < platform1.length; i++) {
		for (let j = 0; j < platform1[i].length; j++) {
			if (platform1[i][j] !== platform2[i][j]) {
				return false;
			}
		}
	}
	return true;
}

function part1(): number {
	const data = fs.readFileSync(path.join(__dirname, 'input.txt'), 'utf8');
	let result = 0;

	let platform = data.split('\n').map(line => line.split(''));
	platform = slide(platform, 'north');

	for (let i = 0; i < platform.length; i++) {
		// Get the amount of "O" in the line
		const line = platform[i];
		const oCount = line.filter(cell => cell === 'O').length;

		// Add to the result: oCount multiplied by the length of the platform minus the index of the line
		result += oCount * (platform.length - i);
	}

	return result;
}

function part2(): number {
	const data = fs.readFileSync(path.join(__dirname, 'input.txt'), 'utf8');
	let result = 0;

	let platform = data.split('\n').map(line => line.split(''));

	// Find the cycle pattern
	const pastPlatforms: Platform[] = [];
	let cycleCount = 0;
	let cycleStart = -1;

	while (cycleStart === -1) {
		// Check if current platform matches any past platform
		for (let i = 0; i < pastPlatforms.length; i++) {
			if (platformsMatch(platform, pastPlatforms[i])) {
				cycleStart = i;
				break;
			}
		}

		if (cycleStart === -1) {
			pastPlatforms.push(platform.map(row => [...row]));
			platform = cycle(platform);
			cycleCount++;
		}
	}

	const cycleLength = cycleCount - cycleStart;
	const remaining = (1000000000 - cycleStart) % cycleLength;
	const finalPlatform = pastPlatforms[cycleStart + remaining];

	for (let i = 0; i < finalPlatform.length; i++) {
		// Get the amount of "O" in the line
		const line = finalPlatform[i];
		const oCount = line.filter(cell => cell === 'O').length;

		// Add to the result: oCount multiplied by the length of the platform minus the index of the line
		result += oCount * (finalPlatform.length - i);
	}

	return result;
}

interface Solution {
	part1: () => number;
	part2: () => number;
}

const solution: Solution = {
	part1,
	part2,
};

export default solution;
