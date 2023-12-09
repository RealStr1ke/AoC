const fs = require('fs');

function isNum(char) {
	return char.match(/[0-9]/);
}

function part1() {
	fs.open('input.txt', 'r', (err, fd) => {
		// Any variables
		let result = 0;
		// let result;

		const hands = []; // [{ cards: Array, bid: Number }]
		for (let line of fs.readFileSync(fd, 'utf8').split('\n')) {
			line = line.split(' ');
			const cards = line[0].split('');
			const bid = Number(line[1]);
			// console.log(cards, bid)
			hands.push({ cards: cards, bid: bid });
		}

		// A hand consists of five cards labeled one of A, K, Q, J, T, 9, 8, 7, 6, 5, 4, 3, or 2. The relative strength of each card follows this order, where A is the highest and 2 is the lowest.
		const cardRanks = ['A', 'K', 'Q', 'J', 'T', '9', '8', '7', '6', '5', '4', '3', '2']; // Strongest to weakest
		const handTypes = ['5OAK', '4OAK', 'FH', '3OAK', '2P', '1P', 'HC']; // Strongest to weakest
		for (let i = 0; i < hands.length; i++) {
			hands[i].stats = { type: '', rank: 0 };

			// If all values in the hand are the same, type = "5OAK" for five of a kind
			// If 4 values in the hand are the same, type = "4OAK" for four of a kind
			// If 3 of the values are the same and the other 2 are the same, type = "FH" for full house
			// If 3 of the values are the same, type = "3OAK" for three of a kind
			// If 2 of the values are the same and 2 of the other values are the same, type = "2P" for two pair
			// If 2 of the values are the same, type = "1P" for one pair
			// If none of the above, type = "HC" for high card
			// There are always 5 cards in a hand
			const frequencies = {};
			for (const card of hands[i].cards) {
				if (frequencies[card]) {
					frequencies[card]++;
				} else {
					frequencies[card] = 1;
				}
			}
			const frequencyValues = Object.values(frequencies);
			const frequencyKeys = Object.keys(frequencies);

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
		}

		// Sort the hands by type (using handTypes) and then by the cards (using cardRanks) (Sort from strongest to weakest)
		// If the first cards are equal, sort by the second cards, then the third, etc.
		hands.sort((a, b) => {
			if (handTypes.indexOf(a.stats.type) > handTypes.indexOf(b.stats.type)) {
				return -1;
			} else if (handTypes.indexOf(a.stats.type) < handTypes.indexOf(b.stats.type)) {
				return 1;
			} else {
				for (let i = 0; i < a.cards.length; i++) {
					if (cardRanks.indexOf(a.cards[i]) > cardRanks.indexOf(b.cards[i])) {
						return -1;
					} else if (cardRanks.indexOf(a.cards[i]) < cardRanks.indexOf(b.cards[i])) {
						return 1;
					}
				}
			}
		});

		// Flip the hands array so it is sorted from weakest to strongest
		// hands.reverse();

		// Calculate the ranks of each hand (index of hand in hands array + 1)
		for (let i = 0; i < hands.length; i++) {
			hands[i].stats.rank = i + 1;
		}

		console.log(hands[0]);
		console.log(hands[1]);
		console.log(hands[2]);
		console.log(hands[3]);
		console.log(hands[4]);

		// Calculate the winnings for each hand and add it to the result
		for (const hand of hands) {
			result += hand.stats.rank * hand.bid;
		}

		// Print the result
		console.log(`Part 1 Result: ${result}`);
	});
}

function solveJokers(hand, cardRanks) {
	// Given a hand with jokers, return the best possible hand
	// The jokers are wild and can act like whatever card that would make the best hand, so
	// There are always 5 cards in a hand

	// Get the current type of the hand
	const type = hand.stats.type;

	// Get the frequencies of the cards in the hand
	const frequencies = [
		{ 'A': 0 },
		{ 'K': 0 },
		{ 'Q': 0 },
		{ 'T': 0 },
		{ '9': 0 },
		{ '8': 0 },
		{ '7': 0 },
		{ '6': 0 },
		{ '5': 0 },
		{ '4': 0 },
		{ '3': 0 },
		{ '2': 0 },
		{ 'J': 0 },
	];

	for (const card of hand.cards) {
		for (let i = 0; i < frequencies.length; i++) {
			if (frequencies[i][card]) {
				frequencies[i][card]++;
			}
		}
	}
	// console.log(frequencies);

	// Calculate the most frequent cards in the hand
	const mostFreqCards = [];
	const frequencyKeys = cardRanks;
	const frequencyValues = [];
	for (let i = 0; i < frequencies.length; i++) {
		frequencyValues[i] = frequencies[i][frequencyKeys[i]];
	}
	for (let i = 0; i < frequencyValues.length; i++) {
		
	}
	
	console.log(mostFreqCards);

	let jokerReplacement = '';
	if (mostFreqCards.length === 1) {
		jokerReplacement = mostFreqCards[0];
	} else {
		let topCard = mostFreqCards[0];
		for (const card of mostFreqCards) {
			if (cardRanks.indexOf(card) < cardRanks.indexOf(topCard)) topCard = card;
		}
		jokerReplacement = topCard;

	}

	// if (mostFreqCard === 'J') mostFreqCard = cardRanks[0];
	// If mostFreqCard === "J" and it's equal to 2, replace it with the highest ranked card in the hand
	// if (mostFreqCard === 'J') {
	// 	let highestCard = 'J';
	// 	for (const card of hand.cards) {
	// 		if (cardRanks.indexOf(card) > cardRanks.indexOf(highestCard)) {
	// 			highestCard = card;
	// 		}
	// 	}
	// 	mostFreqCard = highestCard;
	// }
	for (let i = 0; i < hand.cards.length; i++) {
		if (hand.cards[i] === 'J') {
			hand.cards[i] = jokerReplacement;
		}
	}

	// Recalculate the type of the hand
	// If all values in the hand are the same, type = "5OAK" for five of a kind
	// If 4 values in the hand are the same, type = "4OAK" for four of a kind
	// If 3 of the values are the same and the other 2 are the same, type = "FH" for full house
	// If 3 of the values are the same, type = "3OAK" for three of a kind
	// If 2 of the values are the same and 2 of the other values are the same, type = "2P" for two pair
	// If 2 of the values are the same, type = "1P" for one pair
	// If none of the above, type = "HC" for high card
	// There are always 5 cards in a hand
	const newFrequencies = {};
	for (const card of hand.cards) {
		if (newFrequencies[card]) {
			newFrequencies[card]++;
		} else {
			newFrequencies[card] = 1;
		}
	}
	const newFrequencyValues = Object.values(newFrequencies);
	const newFrequencyKeys = Object.keys(newFrequencies);

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

	// Return the hand
	return hand;
}

// function solveJokers(hand, cardRanks) {
//     let frequencies = {};
//     let mostFreqCard = null;
//     let maxFreq = 0;


//     for (let card of hand.cards) {
//         if (card !== 'J') {
//             frequencies[card] = (frequencies[card] || 0) + 1;
//             if (frequencies[card] > maxFreq ||
//                 (frequencies[card] === maxFreq && cardRanks.indexOf(card) > cardRanks.indexOf(mostFreqCard))) {
//                 mostFreqCard = card;
//                 maxFreq = frequencies[card];
//             }
//         }
//     }

//     // If all cards are jokers, replace with 'A' (highest card)
//     if (mostFreqCard === null) {
//         mostFreqCard = 'A';
//     }

//     // Replace jokers with the most frequent card
//     hand.cards = hand.cards.map(card => card === 'J' ? mostFreqCard : card);
//     return hand;
// }

function part2() {
	fs.open('input.txt', 'r', (err, fd) => {
		// Any variables
		let result = 0;
		// let result;

		const hands = []; // [{ cards: Array, bid: Number }]
		for (let line of fs.readFileSync(fd, 'utf8').split('\n')) {
			line = line.split(' ');
			const cards = line[0].split('');
			const bid = Number(line[1]);
			// console.log(cards, bid)
			hands.push({ cards: cards, bid: bid });
		}

		// A hand consists of five cards labeled one of A, K, Q, J, T, 9, 8, 7, 6, 5, 4, 3, or 2. The relative strength of each card follows this order, where A is the highest and 2 is the lowest.
		const cardRanks = ['A', 'K', 'Q', 'T', '9', '8', '7', '6', '5', '4', '3', '2', 'J']; // Strongest to weakest
		const handTypes = ['5OAK', '4OAK', 'FH', '3OAK', '2P', '1P', 'HC']; // Strongest to weakest
		for (let i = 0; i < hands.length; i++) {
			hands[i].stats = { type: '', rank: 0 };

			// If all values in the hand are the same, type = "5OAK" for five of a kind
			// If 4 values in the hand are the same, type = "4OAK" for four of a kind
			// If 3 of the values are the same and the other 2 are the same, type = "FH" for full house
			// If 3 of the values are the same, type = "3OAK" for three of a kind
			// If 2 of the values are the same and 2 of the other values are the same, type = "2P" for two pair
			// If 2 of the values are the same, type = "1P" for one pair
			// If none of the above, type = "HC" for high card
			// The jokers are wild and can act like whatever card that would make the best hand, so
			// There are always 5 cards in a hand
			const frequencies = {};
			for (const card of hands[i].cards) {
				if (frequencies[card]) {
					frequencies[card]++;
				} else {
					frequencies[card] = 1;
				}
			}
			const frequencyValues = Object.values(frequencies);
			const frequencyKeys = Object.keys(frequencies);

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


		// Sort the hands by type (using handTypes) and then by the cards (using cardRanks) (Sort from strongest to weakest)
		// If the first cards are equal, sort by the second cards, then the third, etc.
		hands.sort((a, b) => {
			if (handTypes.indexOf(a.stats.type) > handTypes.indexOf(b.stats.type)) {
				return -1;
			} else if (handTypes.indexOf(a.stats.type) < handTypes.indexOf(b.stats.type)) {
				return 1;
			} else {
				for (let i = 0; i < a.cards.length; i++) {
					if (cardRanks.indexOf(a.cards[i]) > cardRanks.indexOf(b.cards[i])) {
						return -1;
					} else if (cardRanks.indexOf(a.cards[i]) < cardRanks.indexOf(b.cards[i])) {
						return 1;
					}
				}
			}
		});

		// Flip the hands array so it is sorted from weakest to strongest
		// hands.reverse();

		// Calculate the ranks of each hand (index of hand in hands array + 1)
		for (let i = 0; i < hands.length; i++) {
			hands[i].stats.rank = i + 1;
		}

		// Calculate the winnings for each hand and add it to the result
		for (const hand of hands) {
			result += hand.stats.rank * hand.bid;
		}

		hands.reverse();
		console.log(hands[0]);
		console.log(hands[1]);
		console.log(hands[2]);
		console.log(hands[3]);
		console.log(hands[4]);

		// Print the result
		console.log(`Part 1 Result: ${result}`);
		// if (result != 248747492) console.log("THE RESULT IS WRONG")
	});
}

module.exports = {
    part1,
    part2
};