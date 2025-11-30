import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

type HandType = '5OAK' | '4OAK' | 'FH' | '3OAK' | '2P' | '1P' | 'HC';
type Card = 'A' | 'K' | 'Q' | 'J' | 'T' | '9' | '8' | '7' | '6' | '5' | '4' | '3' | '2';

interface HandStats {
	type: HandType;
	rank: number;
}

interface Hand {
	cards: Card[];
	bid: number;
	stats: HandStats;
}

type CardFrequency = Record<string, number>;

function part1(inputSource?: string | { file: string }): number {
	let input: string;
	if (!inputSource) {
		input = fs.readFileSync(path.join(__dirname, 'input.txt'), 'utf8');
	} else if (typeof inputSource === 'string') {
		input = inputSource;
	} else {
		input = fs.readFileSync(path.join(__dirname, inputSource.file), 'utf8');
	}
	const hands: Hand[] = [];
	
	for (const line of input.split('\n')) {
		const parts = line.split(' ');
		const cards = parts[0].split('') as Card[];
		const bid = Number(parts[1]);
		hands.push({ cards, bid, stats: { type: 'HC', rank: 0 } });
	}

	const cardRanks: Card[] = ['A', 'K', 'Q', 'J', 'T', '9', '8', '7', '6', '5', '4', '3', '2']; // Strongest to weakest
	const handTypes: HandType[] = ['5OAK', '4OAK', 'FH', '3OAK', '2P', '1P', 'HC']; // Strongest to weakest
	
	for (const hand of hands) {
		const frequencies: CardFrequency = {};
		for (const card of hand.cards) {
			frequencies[card] = (frequencies[card] || 0) + 1;
		}
		
		const frequencyValues = Object.values(frequencies);

		if (frequencyValues.length === 1) {
			hand.stats.type = '5OAK';
		} else if (frequencyValues.length === 2) {
			if (frequencyValues.includes(4)) {
				hand.stats.type = '4OAK';
			} else {
				hand.stats.type = 'FH';
			}
		} else if (frequencyValues.length === 3) {
			if (frequencyValues.includes(3)) {
				hand.stats.type = '3OAK';
			} else {
				hand.stats.type = '2P';
			}
		} else if (frequencyValues.length === 4) {
			hand.stats.type = '1P';
		} else {
			hand.stats.type = 'HC';
		}
	}

	// Sort the hands by type and then by cards (strongest to weakest)
	hands.sort((a, b) => {
		const typeComparison = handTypes.indexOf(a.stats.type) - handTypes.indexOf(b.stats.type);
		if (typeComparison !== 0) {
			return typeComparison > 0 ? -1 : 1;
		}
		
		for (let i = 0; i < a.cards.length; i++) {
			const cardComparison = cardRanks.indexOf(a.cards[i]) - cardRanks.indexOf(b.cards[i]);
			if (cardComparison !== 0) {
				return cardComparison > 0 ? -1 : 1;
			}
		}
		return 0;
	});

	// Calculate the ranks and result
	let result = 0;
	for (let i = 0; i < hands.length; i++) {
		hands[i].stats.rank = i + 1;
		result += hands[i].stats.rank * hands[i].bid;
	}

	return result;
}

function solveJokers(hand: Hand, cardRanks: Card[]): Hand {
	const frequencies: CardFrequency = {};
	for (const card of hand.cards) {
		frequencies[card] = (frequencies[card] || 0) + 1;
	}

	let mostFreqCard: Card | null = null;
	let maxFreq = 0;

	// Find the most frequent non-joker card
	for (const card of hand.cards) {
		if (card !== 'J') {
			if (frequencies[card] > maxFreq ||
				(frequencies[card] === maxFreq && (!mostFreqCard || cardRanks.indexOf(card) < cardRanks.indexOf(mostFreqCard)))) {
				mostFreqCard = card;
				maxFreq = frequencies[card];
			}
		}
	}

	// If all cards are jokers, replace with 'A' (highest card)
	if (mostFreqCard === null) {
		mostFreqCard = 'A';
	}

	// Replace jokers with the most frequent card
	hand.cards = hand.cards.map(card => card === 'J' ? mostFreqCard! : card) as Card[];

	// Recalculate the type of the hand
	const newFrequencies: CardFrequency = {};
	for (const card of hand.cards) {
		newFrequencies[card] = (newFrequencies[card] || 0) + 1;
	}
	
	const newFrequencyValues = Object.values(newFrequencies);

	if (newFrequencyValues.length === 1) {
		hand.stats.type = '5OAK';
	} else if (newFrequencyValues.length === 2) {
		if (newFrequencyValues.includes(4)) {
			hand.stats.type = '4OAK';
		} else {
			hand.stats.type = 'FH';
		}
	} else if (newFrequencyValues.length === 3) {
		if (newFrequencyValues.includes(3)) {
			hand.stats.type = '3OAK';
		} else {
			hand.stats.type = '2P';
		}
	} else if (newFrequencyValues.length === 4) {
		hand.stats.type = '1P';
	} else {
		hand.stats.type = 'HC';
	}

	return hand;
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
	const hands: Hand[] = [];
	
	for (const line of input.split('\n')) {
		const parts = line.split(' ');
		const cards = parts[0].split('') as Card[];
		const bid = Number(parts[1]);
		hands.push({ cards, bid, stats: { type: 'HC', rank: 0 } });
	}

	const cardRanks: Card[] = ['A', 'K', 'Q', 'T', '9', '8', '7', '6', '5', '4', '3', '2', 'J']; // Strongest to weakest, J is weakest
	const handTypes: HandType[] = ['5OAK', '4OAK', 'FH', '3OAK', '2P', '1P', 'HC']; // Strongest to weakest
	
	for (let i = 0; i < hands.length; i++) {
		const frequencies: CardFrequency = {};
		for (const card of hands[i].cards) {
			frequencies[card] = (frequencies[card] || 0) + 1;
		}
		
		const frequencyValues = Object.values(frequencies);

		if (frequencyValues.length === 1) {
			hands[i].stats.type = '5OAK';
		} else if (frequencyValues.length === 2) {
			if (frequencyValues.includes(4)) {
				hands[i].stats.type = '4OAK';
			} else {
				hands[i].stats.type = 'FH';
			}
		} else if (frequencyValues.length === 3) {
			if (frequencyValues.includes(3)) {
				hands[i].stats.type = '3OAK';
			} else {
				hands[i].stats.type = '2P';
			}
		} else if (frequencyValues.length === 4) {
			hands[i].stats.type = '1P';
		} else {
			hands[i].stats.type = 'HC';
		}

		// Solve the hands with jokers
		hands[i] = solveJokers(hands[i], cardRanks);
	}

	// Sort the hands by type and then by cards (strongest to weakest)
	hands.sort((a, b) => {
		const typeComparison = handTypes.indexOf(a.stats.type) - handTypes.indexOf(b.stats.type);
		if (typeComparison !== 0) {
			return typeComparison > 0 ? -1 : 1;
		}
		
		for (let i = 0; i < a.cards.length; i++) {
			const cardComparison = cardRanks.indexOf(a.cards[i]) - cardRanks.indexOf(b.cards[i]);
			if (cardComparison !== 0) {
				return cardComparison > 0 ? -1 : 1;
			}
		}
		return 0;
	});

	// Calculate the ranks and result
	let result = 0;
	for (let i = 0; i < hands.length; i++) {
		hands[i].stats.rank = i + 1;
		result += hands[i].stats.rank * hands[i].bid;
	}

	return result;
}

interface Solution {
	part1: (inputSource?: string | { file: string }) => number;
	part2: (inputSource?: string | { file: string }) => number;
}

const solution: Solution = {
	part1,
	part2,
};

export default solution;
