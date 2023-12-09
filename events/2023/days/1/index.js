const fs = require('fs');
const path = require('path');

// Function that checks if char is num
function isNum(char) {
	return char.match(/[0-9]/i);
}

// Part 1
function part1() {
	const data = fs.readFileSync(path.join(__dirname, 'input.txt'), 'utf8');

	let result = 0;
	for (const line of data.split('\n')) {
		// For each line, turn each string into a character array
		const charArray = line.split('');

		// For each array, make a separate array only including the numbers in order
		const numArray = [];
		for (let i = 0; i < charArray.length; i++) {
			if (isNum(charArray[i])) {
				numArray.push(charArray[i]);
			}
		}

		// Take the first and last number and combine that into a number
		const firstNum = numArray[0];
		const lastNum = numArray[numArray.length - 1];
		const combinedNum = parseInt(firstNum + lastNum);

		// Add that number to the total
		// console.log(combinedNum);
		result += combinedNum;
	}

	return result;
}

// Part 2
function part2() {
	const data = fs.readFileSync(path.join(__dirname, 'input.txt'), 'utf8');

	let result = 0;
	// For each line, turn each string into a character array
	for (const line of data.split('\n')) {
		const originalLine = line;

		const words = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'];

		let replacedLine = '';
		for (let i = 0; i < line.length; i++) {
			if (isNum(line[i])) {
				replacedLine += line[i];
			}
			for (let k = 0; k < words.length; k++) {
				if (line.slice(i, i + words[k].length) == words[k]) {
					replacedLine += words.indexOf(words[k]);
					break;
				}
			}
		}

		const firstNum = replacedLine[0];
		const lastNum = replacedLine[replacedLine.length - 1];

		// Combine that into a number
		const combinedNum = parseInt(firstNum + lastNum);

		// Add that number to the total
		result += combinedNum;
	}

	return result;
}

module.exports = {
	part1,
	part2,
};