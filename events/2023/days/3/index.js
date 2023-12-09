const fs = require('fs');
function isNum(char) {
	return char.match(/[0-9]/);
}
function part1() {
	fs.open('input.txt', 'r', (err, fd) => {
		// Any variables
		let result = 0;
		// let result;

		const text = fs.readFileSync(fd, 'utf8').split('\n');

		for (let i = 0; i < text.length; i++) {
			const line = text[i].trim();
			const lineChars = line.split('');

			// Get prev and next lines if they exist (if they don't, make them empty strings)
			const prevLine = (text[i - 1] || '').trim();
			const nextLine = (text[i + 1] || '').trim();

			// Find all numbers in the line (can be 1-3 digits long) and their indexes
			const digitsList = [];
			for (let j = 0; j < line.length; j++) {
				const char = line[j];
				if (isNum(char)) {
					digitsList.push({ index: j, value: char });
				}
			}

			// Make sure to combine adjacent numbers and save the index of the first digit: { index: 0, value: '123' }
			const numbers = [];
			for (let j = 0; j < digitsList.length; j++) {
				const digit = digitsList[j];
				if (j === 0) {
					numbers.push({ index: digit.index, value: digit.value });
				} else if (digit.index === digitsList[j - 1].index + 1) {
					numbers[numbers.length - 1].value += digit.value;
				} else {
					numbers.push({ index: digit.index, value: digit.value });
				}
			}

			// For each number, if there are any symbols that surround it (excluding numbers and periods), including symbols on prev and next lines (diagonally too), add the number to the result
			for (let j = 0; j < numbers.length; j++) {
				const num = numbers[j];

				let numStatus = false;
                let surroundingCharacters = [];

                // Check if there are any symbols in the surrounding characters
                surroundingCharacters.push(lineChars[num.index - 1]);
                surroundingCharacters.push(lineChars[num.index + num.value.length]);
                surroundingCharacters.push(prevLine[num.index - 1]);
                surroundingCharacters.push(prevLine[num.index + num.value.length]);
                surroundingCharacters.push(nextLine[num.index - 1]);
                surroundingCharacters.push(nextLine[num.index + num.value.length]);
                for (let i = 0; i < num.value.length; i++) {
                    // surroundingCharacters.push(lineChars[num.index + i]);
                    surroundingCharacters.push(prevLine[num.index + i]);
                    surroundingCharacters.push(nextLine[num.index + i]);
                }

                // console.log(`surroundingCharacters: ${surroundingCharacters}`)
                for (const char of surroundingCharacters) {
                    if (char && !isNum(char) && char !== '.') {
                        numStatus = true;
                        break;
                    }
                } 

				// // Split prev and next lines into arrays of characters
                // const prevLineChars = prevLine.split('');
                // const nextLineChars = nextLine.split('');
                // console.log(`prevLineChars: ${prevLineChars}`)
                // console.log(`nextLineChars: ${nextLineChars}`)

                // // Get the section of the line that is above and below the number
                // const prevLineSection = prevLineChars.slice(num.index - 1, num.index + num.value.length + 1);
                // const nextLineSection = nextLineChars.slice(num.index - 1, num.index + num.value.length + 1);
                // console.log(`prevLineSection: ${prevLineSection}`)
                // console.log(`nextLineSection: ${nextLineSection}`)

                // // Check if there are any symbols in the section
                // if (prevLineSection.some(char => !isNum(char) && char !== '.')) {
                //     numStatus = true;
                //     break;
                // }
                // if (nextLineSection.some(char => !isNum(char) && char !== '.')) {
                //     numStatus = true;
                //     break;
                // }

				// if (lineChars[num.index - 1] && !isNum(lineChars[num.index - 1]) && lineChars[num.index - 1] !== '.') numStatus = true;
				// if (lineChars[num.index + num.value.length] && !isNum(lineChars[num.index + num.value.length]) && lineChars[num.index + num.value.length] !== '.') numStatus = true;

				if (numStatus) {
					result += parseInt(num.value);
				}

				console.log(`${num.value} on line ${i + 1} is ${numStatus ? 'surrounded' : 'not surrounded'} `);
			}

			// console.log(numbers);


		}

		// Print the result
		console.log(`Part 1 Result: ${result}`);
	});
}

function part2() {
	fs.open('input.txt', 'r', (err, fd) => {
		// Any variables
		let result = 0;
		// let result;

        let adjacentAstrixes = []; // { index: 0, line: 0, adjacentNums: <array of nums (value and index)> }
		

		const text = fs.readFileSync(fd, 'utf8').split('\n');

		for (let i = 0; i < text.length; i++) {
			const line = text[i].trim();
			const lineChars = line.split('');

			// Get prev and next lines if they exist (if they don't, make them empty strings)
			const prevLine = (text[i - 1] || '').trim();
			const nextLine = (text[i + 1] || '').trim();

			// Find all numbers in the line (can be 1-3 digits long) and their indexes
			const digitsList = [];
			for (let j = 0; j < line.length; j++) {
				const char = line[j];
				if (isNum(char)) {
					digitsList.push({ index: j, value: char });
				}
			}

			// Make sure to combine adjacent numbers and save the index of the first digit: { index: 0, value: '123' }
			const numbers = [];
			for (let j = 0; j < digitsList.length; j++) {
				const digit = digitsList[j];
				if (j === 0) {
					numbers.push({ index: digit.index, value: digit.value });
				} else if (digit.index === digitsList[j - 1].index + 1) {
					numbers[numbers.length - 1].value += digit.value;
				} else {
					numbers.push({ index: digit.index, value: digit.value });
				}
			}

			// For each number, if there are any "*" that surround it
            for (let j = 0; j < numbers.length; j++) {
				const num = numbers[j];

				let numStatus = false;
                let surroundingCharacters = [];

                // Check if there are any symbols in the surrounding characters
                surroundingCharacters.push({ char: lineChars[num.index - 1], index: num.index - 1, line: i });
                surroundingCharacters.push({ char: lineChars[num.index + num.value.length], index: num.index + num.value.length, line: i });
                surroundingCharacters.push({ char: prevLine[num.index - 1], index: num.index - 1, line: i - 1 });
                surroundingCharacters.push({ char: prevLine[num.index + num.value.length], index: num.index + num.value.length, line: i - 1 });
                surroundingCharacters.push({ char: nextLine[num.index - 1], index: num.index - 1, line: i + 1 });
                surroundingCharacters.push({ char: nextLine[num.index + num.value.length], index: num.index + num.value.length, line: i + 1 });
                for (let k = 0; k < num.value.length; k++) {
                    surroundingCharacters.push({ char: prevLine[num.index + k], index: num.index + k, line: i - 1 });
                    surroundingCharacters.push({ char: nextLine[num.index + k], index: num.index + k, line: i + 1 });
                }
                // console.log(`surroundingCharacters: ${surroundingCharacters}`)

                let surroundingAstrixes = surroundingCharacters.filter(char => char.char === '*');

                for (const astrix of surroundingAstrixes) {
                    let inMainAdjAstArr = false;
                    for (let k = 0; k < adjacentAstrixes.length; k++) {
                        const adjAstrix = adjacentAstrixes[k];
                        if (adjAstrix.index === astrix.index && adjAstrix.line === astrix.line) {
                            inMainAdjAstArr = true;
                            adjAstrix.adjacentNums.push({ index: num.index, value: num.value });
                            break;
                        }
                    }
                    if (!inMainAdjAstArr) {
                        adjacentAstrixes.push({ index: astrix.index, line: astrix.line, adjacentNums: [{ index: num.index, value: num.value }] });
                    }
                }
			}

            
			// console.log(numbers);
            
            
		}

        // console.log(adjacentAstrixes);

        // Filter to only the astrixes that have 2 adjacent numbers
        let gears = adjacentAstrixes.filter(astrix => astrix.adjacentNums.length === 2);

        // Multiply the numbers adjacent to the astrixes and add each result to the final result
        for (const gear of gears) {
            const num1 = gear.adjacentNums[0];
            const num2 = gear.adjacentNums[1];
            const gearResult = parseInt(num1.value) * parseInt(num2.value);
            result += gearResult;
            // console.log(`Gear at index ${gear.index} on line ${gear.line} has adjacent numbers ${num1.value} and ${num2.value}. ${num1.value} * ${num2.value} = ${gearResult}`);
        }

        console.log(gears.length)

		// Print the result
		console.log(`Part 2 Result: ${result}`);
	});
}

module.exports = {
	part1,
	part2
};