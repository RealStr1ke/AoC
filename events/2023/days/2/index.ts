import fs from 'fs';
import path from 'path';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import * as aoc from '../../../../src/lib/utils.ts';

interface Game {
	game: number;
	red?: number;
	green?: number;
	blue?: number;
	power?: number;
}

function part1(inputSource?: string | { file: string }): number {
	let input: string;
	if (!inputSource) {
		input = fs.readFileSync(path.join(__dirname, 'input.txt'), 'utf8');
	} else if (typeof inputSource === 'string') {
		input = inputSource;
	} else {
		input = fs.readFileSync(path.join(__dirname, inputSource.file), 'utf8');
	}
	let result: number = 0;

	let games: Game[] = [];
	for (const line of input.split('\n')) {
		const currentGame: Game = {} as Game;
		currentGame.game = parseInt(line.split(':')[0].split(' ')[1]);

		// Parse each round (separated by ';')
		const rounds: string[] = line.split(':')[1].split(';');
		for (const round of rounds) {
			// Parse each color (separated by ',')
			const colors: string[] = round.split(',');
			for (const color of colors) {
				// Parse each number (separated by ' ')
				const numbers: string[] = color.split(' ');
				const colorName: string = numbers[2];
				const colorValue: number = parseInt(numbers[1]);

				// If the color doesn't exist in the current game, add it
				if (!currentGame[colorName as keyof Game]) {
					(currentGame as any)[colorName] = colorValue;
				// If the color does exist, make sure the value is the highest
				} else if (colorValue > (currentGame as any)[colorName]) {
					(currentGame as any)[colorName] = colorValue;
				}
			}
		}

		// Add the current game to the list of games
		games.push(currentGame);
	}

	// Remove the games that have more than 12 red, 13 green, and 14 blue
	games = games.filter(game => {
		return (game.red || 0) <= 12 && (game.green || 0) <= 13 && (game.blue || 0) <= 14;
	});

	// Calculate the sum of the game numbers
	let sum: number = 0;
	for (const game of games) {
		sum += game.game;
	}

	result = sum;
	return result;
}

function part2(inputSource?: string | { file: string }): number {
	let input: string;
	if (!inputSource) {
		input = fs.readFileSync(path.join(__dirname, 'input.txt'), 'utf8');
	} else if (typeof inputSource === 'string') {
		input = inputSource;
	} else {
		input = fs.readFileSync(path.join(__dirname, inputSource.file), 'utf8');
	}
	let result: number = 0;

	const games: Game[] = [];
	for (const line of input.split('\n')) {
		const currentGame: Game = {} as Game;
		currentGame.game = parseInt(line.split(':')[0].split(' ')[1]);

		// Parse each round (separated by ';')
		const rounds: string[] = line.split(':')[1].split(';');
		for (const round of rounds) {
			// Parse each color (separated by ',')
			const colors: string[] = round.split(',');
			for (const color of colors) {
				// Parse each number (separated by ' ')
				const numbers: string[] = color.split(' ');
				const colorName: string = numbers[2];
				const colorValue: number = parseInt(numbers[1]);

				// If the color doesn't exist in the current game, add it
				if (!currentGame[colorName as keyof Game]) {
					(currentGame as any)[colorName] = colorValue;
				// If the color does exist, make sure the value is the highest
				} else if (colorValue > (currentGame as any)[colorName]) {
					(currentGame as any)[colorName] = colorValue;
				}
			}
		}

		// Add the current game to the list of games
		games.push(currentGame);
	}

	// Find the power of each game (red * green * blue)
	for (const game of games) {
		game.power = (game.red || 0) * (game.green || 0) * (game.blue || 0);
	}

	// Sum the powers of all the games
	let sum: number = 0;
	for (const game of games) {
		sum += game.power || 0;
	}

	result = sum;
	return result;
}

export interface Solution {
	part1: (inputSource?: string | { file: string }) => number;
	part2: (inputSource?: string | { file: string }) => number;
}

export default {
	part1,
	part2,
} as Solution;
