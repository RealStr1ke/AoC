import fs from 'fs';
import path from 'path';

function blink(stones, iterations) {
	let stonesObj = {};
	const cache = {};

	for (const stone of stones) {
		if (!stonesObj[stone]) stonesObj[stone] = 0;
		stonesObj[stone]++;
	}

	for (let i = 0; i < iterations; i++) {
		const newStonesObj = {};

		for (const stone of Object.keys(stonesObj)) {
			const currentCount = stonesObj[stone];

			if (!cache[stone]) {
				if (stone === '0') {
					cache[stone] = 1;
				} else if (stone.length % 2 === 0) {
					const half = stone.length / 2;
					cache[stone] = [ parseInt(stone.slice(0, half)), parseInt(stone.slice(half)) ];
				} else {
					cache[stone] = stone * 2024;
				}

				// console.log(`[${stone}] -> [${cache[stone]}]`);
			}

			if (stone.length % 2 === 0) {
				if (!newStonesObj[cache[stone][0]]) newStonesObj[cache[stone][0]] = 0;
				if (!newStonesObj[cache[stone][1]]) newStonesObj[cache[stone][1]] = 0;
				newStonesObj[cache[stone][0]] += currentCount;
				newStonesObj[cache[stone][1]] += currentCount;
			} else {
				if (!newStonesObj[cache[stone]]) newStonesObj[cache[stone]] = 0;
				newStonesObj[cache[stone]] += currentCount;
			}

			for (const s in newStonesObj) {
				if (newStonesObj[s] === 0) delete newStonesObj[s];
			}
		}

		stonesObj = newStonesObj;
	}


	let stoneCount = 0;
	for (const s of Object.keys(stonesObj)) {
		stoneCount += stonesObj[s];
	}

	return stoneCount;


	// Old code used for Part 1 (before the silly Part 2)
	/**
	let newStones = stones.slice();
	const cache = {};
	for (let i = 0; i < iterations; i++) {
		const tmpStones = [];
		console.log(i)
		for (const stone of newStones) {
			if (!cache[stone]) {
				if (stone === 0) {
					cache[stone] = [ 1 ];
				} else if (`${stone}`.length % 2 === 0) {
					const half = `${stone}`.length / 2;
					cache[stone] = [ parseInt(`${stone}`.slice(0, half)), parseInt(`${stone}`.slice(half)) ];
				} else {
					cache[stone] = [ stone * 2024 ];
				}
			}
			tmpStones.push(...cache[stone]);
		}
		newStones = tmpStones;
	}
	return newStones;
	 */

}

function part1() {
	const data = fs.readFileSync(path.join(__dirname, 'input.txt'), 'utf8');
	let result = 0;

	let stones = [];
	for (const line of data.split('\n')) {
		stones = line.split(' ').map(Number);
	}

	const stoneCount = blink(stones, 25);

	result = stoneCount;

	return result;
}

function part2() {
	const data = fs.readFileSync(path.join(__dirname, 'input.txt'), 'utf8');
	let result = 0;

	let stones = [];
	for (const line of data.split('\n')) {
		stones = line.split(' ').map(Number);
	}

	const stoneCount = blink(stones, 75);

	result = stoneCount;

	return result;
}

// console.log(`Part 1: ${part1()}`);
// console.log(`Part 2: ${part2()}`);

export default {
	part1,
	part2,
};