import fs from 'fs';
import path from 'path';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import * as aoc from '../../../../src/lib/utils.ts';

interface CardMatch {
	index: number;
	matches: number;
	copies?: number;
}

function part1(): number {
	const input: string = fs.readFileSync(path.join(__dirname, 'input.txt'), 'utf8');
	let result: number = 0;

	// Lines look like this:
	// Card 1: 41 48 83 86 17 | 83 86  6 31 17  9 48 53

	for (const line of input.split('\n')) {
		// Split the line into two sections, the card's winning numbers and your numbers
		let [cardStr, yoursStr] = line.split(' | ');
		const card: number[] = cardStr.split(' ').map(Number).filter(Boolean);
		const yours: number[] = yoursStr.split(' ').map(Number).filter(Boolean);

		// Find the amount of winning numbers that you chose
		let matches: number = 0;
		for (const number of yours) {
			if (card.includes(number)) {
				matches++;
			}
		}

		// totalPoints for one card starts at 1 for the first match then doubles for each match after
		let totalPoints: number = 1;
		for (let i = 1; i < matches; i++) {
			totalPoints *= 2;
		}

		if (matches === 0) totalPoints = 0;

		// Add the totalPoints to the result
		result += totalPoints;
	}

	return result;
}

function part2(): number {
	const input: string = fs.readFileSync(path.join(__dirname, 'input.txt'), 'utf8');
	let result: number = 0;

	// Lines look like this:
	// Card 1: 41 48 83 86 17 | 83 86  6 31 17  9 48 53

	const cardMatches: CardMatch[] = []; // [ { card1: 2 }, { card2: 3 },... ]

	for (const line of input.split('\n')) {
		// Split the line into two sections, the card's winning numbers and your numbers
		let [cardStr, yoursStr] = line.split(' | ');
		const card: number[] = cardStr.split(' ').map(Number).filter(Boolean);
		const yours: number[] = yoursStr.split(' ').map(Number).filter(Boolean);

		// Find the amount of winning numbers that you chose
		let matches: number = 0;
		for (const number of yours) {
			if (card.includes(number)) {
				matches++;
			}
		}

		cardMatches.push({ index: cardMatches.length, matches: matches });
	}

	// For each card, each match means that you'll get <num matches> copies of all the cards after it. Find the final amount of cards in total
	const fullCards: CardMatch[] = cardMatches; // [ { card1: 2 }, { card2: 3 },... ]
	for (const card of cardMatches) {
		card.copies = 1;
	}

	for (let i = 0; i < fullCards.length; i++) {
		const numCopies: number = fullCards[i].matches;
		for (let j = 0; j < numCopies; j++) {
			if (fullCards[i + j + 1]) {
				fullCards[i + j + 1].copies! += fullCards[i].copies!;
			}
		}
	}

	// Sum up all the copies
	for (const card of fullCards) {
		result += card.copies || 0;
	}

	return result;
}

export interface Solution {
	part1: () => number;
	part2: () => number;
}

export default {
	part1,
	part2,
} as Solution;
