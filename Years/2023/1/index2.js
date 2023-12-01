const fs = require('fs');

// Function that checks if char is num
function isNum(char) {
	return char.match(/[0-9]/i);
}

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
	console.log(totalNum);
});