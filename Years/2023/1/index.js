const fs = require('fs');

// Function that checks if char is num
function isNum(char) {
	return char.match(/[0-9]/i);
}

// Part 1

// Open a file called input1.txt
fs.open('input.txt', 'r', (err, fd) => {
	let totalNum = 0; // Total number
	for (const line of fs.readFileSync(fd, 'utf8').split('\n')) {
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
		totalNum += combinedNum;
	}
	console.log(`Part 1 Result: ${totalNum}`);
});

// Part 2

// Open a file called input.txt
fs.open('input.txt', 'r', (err, fd) => {
	let totalNum = 0;
	// For each line, turn each string into a character array
	for (const line of fs.readFileSync(fd, 'utf8').split('\n')) {
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
		totalNum += combinedNum;
	}
	console.log(`Part 2 Result: ${totalNum}`);
});