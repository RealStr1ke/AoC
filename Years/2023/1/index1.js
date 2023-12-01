const fs = require('fs');

// Function that checks if char is num
function isNum(char) {
	return char.match(/[0-9]/i);
}

// Open a file called input1.txt
fs.open('input1.txt', 'r', (err, fd) => {
	let totalNum = 0;
	// For each line, turn each string into a character array
	for (const line of fs.readFileSync(fd, 'utf8').split('\n')) {
		const charArray = line.split('');
		// console.log(charArray);

		// // For each character, check if it is a letter
		// for (let i = 0; i < charArray.length; i++) {
		// 	if (charArray[i].match(/[a-z]/i)) {
		// 		// If it is, check if it is uppercase
		// 		if (charArray[i] == charArray[i].toUpperCase()) {
		// 			// If it is, make it lowercase
		// 			charArray[i] = charArray[i].toLowerCase();
		// 		} else {
		// 			// If it isn't, make it uppercase
		// 			charArray[i] = charArray[i].toUpperCase();
		// 		}
		// 	}
		// }


		// Then, for each array, make a separate array only including the numbers in order
		const numArray = [];
		for (let i = 0; i < charArray.length; i++) {
			if (isNum(charArray[i])) {
				numArray.push(charArray[i]);
			}
		}

		// Take the first and last number
		const firstNum = numArray[0];
		const lastNum = numArray[numArray.length - 1];

		// Combine that into a number
		const combinedNum = parseInt(`${firstNum}${lastNum}`);

		console.log(`${firstNum}${lastNum}`);
		// Add that number to the total
		totalNum += combinedNum;

		// Print the character array
		// console.log(charArray.join(''));
	}
	console.log(totalNum);
});