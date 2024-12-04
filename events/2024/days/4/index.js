const fs = require('fs');
const path = require('path');

function part1() {
	const data = fs.readFileSync(path.join(__dirname, 'input.txt'), 'utf8');
	let result = 0;

	const originalGrid = [];

	for (const line of data.split('\n')) {
		const row = [];
		for (const char of line) {
			row.push(char);
		}
		originalGrid.push(row);
	}

	// Horizontal
	const horizontal = [];
	for (const row of originalGrid) {
		horizontal.push(row.join(''));
	}

	// Vertical
	const vertical = [];
	for (let i = 0; i < originalGrid[0].length; i++) {
		const column = [];
		for (let j = 0; j < originalGrid.length; j++) {
			column.push(originalGrid[j][i]);
		}
		vertical.push(column.join(''));
	}

	// Diagonal (top left to bottom right)
	const diagonalTL = [];
	for (let k = 0; k < originalGrid.length * 2 - 1; k++) {
		const diagonal = [];
		for (let j = 0; j <= k; j++) {
			const i = k - j;
			if (i < originalGrid.length && j < originalGrid.length) {
				diagonal.push(originalGrid[i][j]);
			}
		}
		diagonalTL.push(diagonal.join(''));
	}

	// Diagonal (top right to bottom left)
	const diagonalTR = [];
	for (let k = 0; k < originalGrid.length * 2 - 1; k++) {
		const diagonal = [];
		for (let j = 0; j <= k; j++) {
			const i = k - j;
			if (i < originalGrid.length && j < originalGrid.length) {
				diagonal.push(originalGrid[i][originalGrid.length - j - 1]);
			}
		}
		diagonalTR.push(diagonal.join(''));
	}

	// console.log(horizontal.length, vertical.length, diagonalTL.length, diagonalTR.length);

	// Add a duplicate of all the lines but in reverse
	const horizontalReversed = [];
	for (const row of horizontal) horizontalReversed.push(row.split('').reverse().join(''));
	horizontal.push(...horizontalReversed);

	const verticalReversed = [];
	for (const row of vertical) verticalReversed.push(row.split('').reverse().join(''));
	vertical.push(...verticalReversed);

	const diagonalTLReversed = [];
	for (const row of diagonalTL) diagonalTLReversed.push(row.split('').reverse().join(''));
	diagonalTL.push(...diagonalTLReversed);

	const diagonalTRReversed = [];
	for (const row of diagonalTR) diagonalTRReversed.push(row.split('').reverse().join(''));
	diagonalTR.push(...diagonalTRReversed);

	const regex = 'XMAS';

	let horizontalCount = 0;
	let verticalCount = 0;
	let diagonalTLCount = 0;
	let diagonalTRCount = 0;

	for (const row of horizontal) {
		const matches = row.match(new RegExp(regex, 'g'));
		if (matches) {
			// console.log(row, matches);
			horizontalCount += matches.length;
		}
	}

	for (const row of vertical) {
		const matches = row.match(new RegExp(regex, 'g'));
		if (matches) {
			verticalCount += matches.length;
		}
	}

	for (const row of diagonalTL) {
		const matches = row.match(new RegExp(regex, 'g'));
		if (matches) {
			// console.log(row, matches)
			diagonalTLCount += matches.length;
		}
	}

	for (const row of diagonalTR) {
		// console.log(row)
		const matches = row.match(new RegExp(regex, 'g'));
		if (matches) {
			diagonalTRCount += matches.length;
		}
	}

	// console.log(horizontalCount, verticalCount, diagonalTLCount, diagonalTRCount);

	result = horizontalCount + verticalCount + diagonalTLCount + diagonalTRCount;

	return result;
}

function part2() {
	const data = fs.readFileSync(path.join(__dirname, 'input.txt'), 'utf8');
	let result = 0;

	const originalGrid = [];

	for (const line of data.split('\n')) {
		const row = [];
		for (const char of line) {
			row.push(char);
		}
		originalGrid.push(row);
	}

	const threeByThrees = [];

	for (let i = 0; i < originalGrid.length; i++) {
		if (originalGrid[i + 1] && originalGrid[i + 2]) {
			for (let j = 0; j < originalGrid[i].length; j++) {
				if (originalGrid[i][j + 1] && originalGrid[i][j + 2]) {
					const threeByThree = [
						[originalGrid[i][j], originalGrid[i][j + 1], originalGrid[i][j + 2]],
						[originalGrid[i + 1][j], originalGrid[i + 1][j + 1], originalGrid[i + 1][j + 2]],
						[originalGrid[i + 2][j], originalGrid[i + 2][j + 1], originalGrid[i + 2][j + 2]],
					];
					threeByThrees.push(threeByThree);
				}
			}
		}
	}

	/**
	 * m.s
	 * .a.
	 * m.s
	 *
	 * m.m
	 * .a.
	 * s.s
	 *
	 * s.s
	 * .a.
	 * m.m
	 *
	 * s.m
	 * .a.
	 * s.m
	 *
	 * m.s.a.m.s
	 * m.m.a.s.s
	 * s.s.a.m.m
	 * s.m.a.s.m
	 *
	 */

	const nines = [];
	for (const threeByThree of threeByThrees) {
		const nine = threeByThree.flat().join('');
		nines.push(nine);
	}

	for (const nine of nines) {
		let nA = nine.split(''); // nineArray
		nA = [nA[0], nA[2], nA[4], nA[6], nA[8]];
		if (nA[0] === 'M' && nA[1] === 'S' && nA[2] === 'A' && nA[3] === 'M' && nA[4] === 'S') {
			result++;
		} else if (nA[0] === 'M' && nA[1] === 'M' && nA[2] === 'A' && nA[3] === 'S' && nA[4] === 'S') {
			result++;
		} else if (nA[0] === 'S' && nA[1] === 'S' && nA[2] === 'A' && nA[3] === 'M' && nA[4] === 'M') {
			result++;
		} else if (nA[0] === 'S' && nA[1] === 'M' && nA[2] === 'A' && nA[3] === 'S' && nA[4] === 'M') {
			result++;
		}

	}
	return result;
}

console.log(`Part 1: ${part1()}`);
console.log(`Part 2: ${part2()}`);

module.exports = {
	part1,
	part2,
};