import fs from 'fs';
import path from 'path';

function slide(platform, cardinal) {
	let newPlatform = platform;
	if (cardinal === 'north') {
		// Flip newPlatform on its side so columns become rows
		newPlatform = newPlatform[0].map((col, i) => newPlatform.map(row => row[i]));
		for (let i = 0; i < newPlatform.length; i++) {
			for (let j = 0; j < newPlatform[i].length; j++) {
				if (newPlatform[i][j] === 'O') {
					// Slide all the occurences of "O" to the left until they either hit the beginning of the row, a "O", or a "#"
					let k = j;

					if (k === 0) {
						// console.log(`Line ${i}`);
						continue;
					} else {
						while (k > 0) {
							// Corrected condition: check if the previous cell is not "O" and not "#"
							if (newPlatform[i][k - 1] !== 'O' && newPlatform[i][k - 1] !== '#') {
								newPlatform[i][k - 1] = 'O';
								newPlatform[i][k] = '.';
								k--;
							} else {
								break;
							}
						}
					}
				} else {
					continue;
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
							// Corrected condition: check if the next cell is not "O" and not "#"
							if (newPlatform[i][k + 1] !== 'O' && newPlatform[i][k + 1] !== '#') {
								newPlatform[i][k + 1] = 'O';
								newPlatform[i][k] = '.';
								k++;
							} else {
								break;
							}
						}
					}
				} else {
					continue;
				}
			}
		}

		// Flip newPlatform back to normal
		newPlatform = newPlatform[0].map((col, i) => newPlatform.map(row => row[i]));
	} else if (cardinal === 'east') {
		// Reverse each line
		newPlatform = newPlatform.map(line => line.reverse());

		for (let i = 0; i < newPlatform.length; i++) {
			for (let j = 0; j < newPlatform[i].length; j++) {
				if (newPlatform[i][j] === 'O') {
					// Slide all the occurences of "O" to the left until they either hit the beginning of the row, a "O", or a "#"
					let k = j;

					if (k === 0) {
						continue;
					} else {
						while (k > 0) {
							// Corrected condition: check if the previous cell is not "O" and not "#"
							if (newPlatform[i][k - 1] !== 'O' && newPlatform[i][k - 1] !== '#') {
								newPlatform[i][k - 1] = 'O';
								newPlatform[i][k] = '.';
								k--;
							} else {
								break;
							}
						}
					}
				} else {
					continue;
				}
			}
		}

		// Reverse each line back to normal
		newPlatform = newPlatform.map(line => line.reverse());
	} else if (cardinal === 'west') {
		for (let i = 0; i < newPlatform.length; i++) {
			for (let j = 0; j < newPlatform[i].length; j++) {
				if (newPlatform[i][j] === 'O') {
					// Slide all the occurences of "O" to the left until they either hit the beginning of the row, a "O", or a "#"
					let k = j;

					if (k === 0) {
						// console.log(`Line ${i}`);
						continue;
					} else {
						while (k > 0) {
							// Corrected condition: check if the previous cell is not "O" and not "#"
							if (newPlatform[i][k - 1] !== 'O' && newPlatform[i][k - 1] !== '#') {
								newPlatform[i][k - 1] = 'O';
								newPlatform[i][k] = '.';
								k--;
							} else {
								break;
							}
						}
					}
				} else {
					continue;
				}
			}
		}
	}

	// for (const line of newPlatform) {
	// 	console.log(line.join(''));
	// }

	return newPlatform;
}

function cycle(platform) {
	// A cycle is a slide to the north, then to the west, then to the south, then to the east
	let newPlatform = platform;

	newPlatform = slide(newPlatform, 'north');
	// console.log("North");
	// for (const line of newPlatform) {
	// 	console.log(line.join(''));
	// }

	newPlatform = slide(newPlatform, 'west');
	// console.log("West");
	// for (const line of newPlatform) {
	// 	console.log(line.join(''));
	// }

	newPlatform = slide(newPlatform, 'south');
	// console.log("South");
	// for (const line of newPlatform) {
	// 	console.log(line.join(''));
	// }

	newPlatform = slide(newPlatform, 'east');
	// console.log("East");
	// for (const line of newPlatform) {
	// 	console.log(line.join(''));
	// }


	return newPlatform;
}


function part1() {
	const data = fs.readFileSync(path.join(__dirname, 'input.txt'), 'utf8');
	let result = 0;

	let platform = data.split('\n').map(line => line.split(''));
	platform = slide(platform, 'north');


	// for (const line of platform) {
	//     console.log(line.join(""));
	// }

	for (let i = 0; i < platform.length; i++) {
		// Get the amount of "O" in the line
		const line = platform[i];
		const oCount = line.filter(cell => cell === 'O').length;

		// Add to the result: oCount multiplied by the length of the platform minus the index of the line
		result += oCount * (platform.length - i);
	}

	return result;
}

function part2() {
	const data = fs.readFileSync(path.join(__dirname, 'input.txt'), 'utf8');
	let result = 0;

	const original = data.split('\n').map(line => line.split(''));
	let platform = original;

	// Cycle until the platform loops back to the original platform
	let cycleCount = 0;
	const matchesOriginalPlatform = (currentPlatform, originalPlatform) => {
		for (let i = 0; i < currentPlatform.length; i++) {
			for (let j = 0; j < currentPlatform[i].length; j++) {
				if (currentPlatform[i][j] !== originalPlatform[i][j]) {
					// console.log(`${originalPlatform[i].join("")} !== ${currentPlatform[i].join("")}`)
					return false;
				}
			}
		}
		return true;
	};

	let pastNum = 0;
	const matchesPastPlatforms = (currentPlatform, pastPlatforms) => {
		for (let i = 0; i < pastPlatforms.length; i++) {
			const pastPlatform = pastPlatforms[i];
			if (matchesOriginalPlatform(currentPlatform, pastPlatform)) {
				pastNum = i;
				return true;
			}
		}
		return false;
	};

	const pastPlatforms = [];
	while (!matchesPastPlatforms(platform, pastPlatforms) || cycleCount === 0) {
		pastPlatforms.push(platform);
		console.log(`Cycle ${cycleCount + 1}`);
		platform = cycle(platform);
		cycleCount++;
	}

	// console.log(`It took ${cycleCount} cycles to get back to the platform ${pastNum}`);
	pastPlatforms.push(platform);


	// Cycle 1000000000 times
	let loopNum = 0;
	for (let i = 0; i < 1000000000; i++) {
		loopNum++;
	    if (loopNum === platformLoopFull.length) {
	        loopNum = 0;
		}
	}

	platform = platformLoopFull[loopNum + 1];

	for (let i = 0; i < platform.length; i++) {
		// Get the amount of "O" in the line
		const line = platform[i];
		const oCount = line.filter(cell => cell === 'O').length;

		// Add to the result: oCount multiplied by the length of the platform minus the index of the line
		result += oCount * (platform.length - i);
	}

	return result;
}

export default {
	part1,
	part2,
};