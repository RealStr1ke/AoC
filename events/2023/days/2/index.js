import fs from 'fs';

function part1() {
	const data = fs.readFileSync(path.join(__dirname, 'input.txt'), 'utf8');

	let games = [];
	for (const line of data.split('\n')) {
		const currentGame = {};
		currentGame.game = parseInt(line.split(':')[0].split(' ')[1]);

		// Parse each round (separated by ';')
		const rounds = line.split(':')[1].split(';');
		for (const round of rounds) {
			// Parse each color (separated by ',')
			const colors = round.split(',');
			// console.log(colors)
			for (const color of colors) {
				// Parse each number (separated by ' ')
				const numbers = color.split(' ');
				// console.log(numbers)
				const colorName = numbers[2];
				const colorValue = parseInt(numbers[1]);

				// // If the color doesn't exist in the current game, add it
				if (!currentGame[colorName]) {
					currentGame[colorName] = colorValue;
				// If the color does exist, make sure the value is the highest
				} else if (colorValue > currentGame[colorName]) {
					currentGame[colorName] = colorValue;
				}
			}
		}

		// Add the current game to the list of games
		games.push(currentGame);
	}

	// Remove the games that have more than 12 red, 13 green, and 14 blue
	games = games.filter(game => {
		return game.red <= 12 && game.green <= 13 && game.blue <= 14;
	});

	// Print the sum of the game numbers
	let sum = 0;
	for (const game of games) {
		sum += game.game;
	}

	// Return the sum

}

function part2() {
	fs.open('input.txt', 'r', (err, fd) => {
		const games = [];
		for (const line of fs.readFileSync(fd, 'utf8').split('\n')) {
			// Each line looks like this:
			// "Game 1: 10 blue, 12 red; 8 red; 7 green, 5 red, 7 blue"

			const currentGame = {};
			currentGame.game = parseInt(line.split(':')[0].split(' ')[1]);

			// Parse each round (separated by ';')
			const rounds = line.split(':')[1].split(';');
			for (const round of rounds) {
				// Parse each color (separated by ',')
				const colors = round.split(',');
				// console.log(colors)
				for (const color of colors) {
					// Parse each number (separated by ' ')
					const numbers = color.split(' ');
					// console.log(numbers)
					const colorName = numbers[2];
					const colorValue = parseInt(numbers[1]);

					// // If the color doesn't exist in the current game, add it
					if (!currentGame[colorName]) {
						currentGame[colorName] = colorValue;
					} else {
						// If the color does exist, make sure the value is the highest
						if (colorValue > currentGame[colorName]) {
							currentGame[colorName] = colorValue;
						}
					}
				}
			}

			// Add the current game to the list of games
			games.push(currentGame);
		}

		// Find the power of each game (red * green * blue)
		for (const game of games) {
			game.power = game.red * game.green * game.blue;
		}

		// Sum the powers of all the games
		let sum = 0;
		for (const game of games) {
			sum += game.power;
		}

		// Print the sum
		console.log(`Part 2 Result: ${sum}`);
	});
}

export default {
	part1,
	part2,
};