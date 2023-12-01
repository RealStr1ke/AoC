function score(elf, you) {
	// For elf: A is Rock, B is Paper, C is Scissors
	// For you: X is Rock, Y is Paper, Z is Scissors
	const combined = elf + you;
	let yourScore = 0;
	switch (combined) {
        case 'AX':
        case 'BY':
        case 'CZ':
            yourScore += 3; break;
        case 'AY':
        case 'BZ':
        case 'CX':
            yourScore += 6; break;
        case 'AZ':
        case 'BX':
        case 'CY':
            yourScore += 0; break;
	}

	switch (you) {
        case 'X':
            yourScore += 1;
            break;
        case 'Y':
            yourScore += 2;
            break;
        case 'Z':
            yourScore += 3;
            break;
	}

	// switch (combined) {
	//     case 'AX': console.log('Rock draws with Rock. Game is a draw.'); break;
	//     case 'AY': console.log('Paper beats Rock. You win!'); break;
	//     case 'AZ': console.log('Rock beats Scissors. You lose.'); break;
	//     case 'BX': console.log('Paper beats Rock. You lose.'); break;
	//     case 'BY': console.log('Paper draws with Paper. Game is a draw.'); break;
	//     case 'BZ': console.log('Scissors beats Paper. You win!'); break;
	//     case 'CX': console.log('Rock beats Scissors. You win!'); break;
	//     case 'CY': console.log('Scissors beats Paper. You lose.'); break;
	//     case 'CZ': console.log('Scissors draws with Scissors. Game is a draw.'); break;
	// }

	return yourScore;
}

function part1() {
	const fs = require('fs');
	const path = require('path');

	// Read input file
	const strategy = fs.readFileSync(path.join(__dirname, 'input.txt'), 'utf8').split('\n');

	let yourScore = 0;
	for (let i = 0; i < strategy.length; i++) {
		const elf = strategy[i].split(' ')[0];
		const you = strategy[i].split(' ')[1];
		const gameScore = score(elf, you);
		yourScore += gameScore;

		// console.log(`Elf: ${elf}, You: ${you}, Score: ${gameScore}`);

	}

	return yourScore;
}

function solve2(elf, outcome) {
    // For elf: A is Rock, B is Paper, C is Scissors
    // For you: X is Rock, Y is Paper, Z is Scissors
    // For outcome: X is a loss for you, Y is a draw, Z is a win for you

    let yourMove = '';
    switch (outcome) {
        case 'X':
            switch (elf) {
                case 'A':
                    yourMove = 'Z';
                    break;
                case 'B':
                    yourMove = 'X';
                    break;
                case 'C':
                    yourMove = 'Y';
                    break;
            }
            break;
        case 'Y':
            switch (elf) {
                case 'A':
                    yourMove = 'X';
                    break;
                case 'B':
                    yourMove = 'Y';
                    break;
                case 'C':
                    yourMove = 'Z';
                    break;
            }
            break;
        case 'Z':
            switch (elf) {
                case 'A':
                    yourMove = 'Y';
                    break;
                case 'B':
                    yourMove = 'Z';
                    break;
                case 'C':
                    yourMove = 'X';
                    break;
            }
            break;
    }

    return yourMove;
}
function part2() {
    const fs = require('fs');
	const path = require('path');

	// Read input file
	const strategy = fs.readFileSync(path.join(__dirname, 'input.txt'), 'utf8').split('\n');

	let yourScore = 0;
	for (let i = 0; i < strategy.length; i++) {
		const elf = strategy[i].split(' ')[0];
		const outcome = strategy[i].split(' ')[1];
        const you = solve2(elf, outcome);
		const gameScore = score(elf, you);
		yourScore += gameScore;

		// console.log(`Elf: ${elf}, You: ${you}, Score: ${gameScore}`);

	}

	return yourScore;
}
console.log(`Part 1 Result: ${part1()}`);
console.log(`Part 2 Result: ${part2()}`);