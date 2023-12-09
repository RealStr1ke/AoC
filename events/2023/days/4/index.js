const fs = require('fs');

function part1() {
    fs.open('input.txt', 'r', (err, fd) => {
        // Any variables
        let result = 0;
        // let result;

        // Lines look like this:
        // Card 1: 41 48 83 86 17 | 83 86  6 31 17  9 48 53
        
        for (const line of fs.readFileSync(fd, 'utf8').split('\n')) {
            // Split the line into two sections, the card's winning numbers and your numbers
            let [card, yours] = line.split(' | ');
            card = card.split(' ').map(Number);
            yours = yours.split(' ').map(Number);
            // Omit any NaN Values
            card = card.filter(Boolean);
            yours = yours.filter(Boolean);

            // Find the amount of winning numbers that you chose
            let matches = 0;
            for (const number of yours) {
                if (card.includes(number)) {
                    matches++;
                }
            }

            // totalPoints for one card starts at 1 for the first match then doubles for each match after
            let totalPoints = 1;
            for (let i = 1; i < matches; i++) {
                totalPoints *= 2;
            }

            if (matches === 0) totalPoints = 0;



            // Add the totalPoints to the result
            result += totalPoints;

            // console.log(card, yours);

            
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

        // Lines look like this:
        // Card 1: 41 48 83 86 17 | 83 86  6 31 17  9 48 53

        let cardMatches = []; // [ { card1: 2 }, { card2: 3 },... ]
        
        for (const line of fs.readFileSync(fd, 'utf8').split('\n')) {
            // Split the line into two sections, the card's winning numbers and your numbers
            let [card, yours] = line.split(' | ');
            card = card.split(' ').map(Number);
            yours = yours.split(' ').map(Number);
            // Omit any NaN Values
            card = card.filter(Boolean);
            yours = yours.filter(Boolean);

            // Find the amount of winning numbers that you chose
            let matches = 0;
            for (const number of yours) {
                if (card.includes(number)) {
                    matches++;
                }
            }

            cardMatches.push({ index: cardMatches.length, matches: matches  });

        }

        // For each card, each match means that you'll get <num matches> copies of all the cards after it. Find the final amount of cards in total
        let fullCards = cardMatches; // [ { card1: 2 }, { card2: 3 },... ]
        for (const card of cardMatches) {
            card.copies = 1;
        }

        for (let i = 0; i < fullCards.length; i++) {
            let numCopies = fullCards[i].matches;
            for (let j = 0; j < numCopies; j++) {
                fullCards[i + j + 1].copies += fullCards[i].copies;
            }
        }
        // console.log(fullCards)

        // Sum up all the copies
        for (const card of fullCards) {
            result += card.copies;
        }

        
    
        // Print the result
        console.log(`Part 2 Result: ${result}`);
    });
}

module.exports = {
    part1,
    part2
};