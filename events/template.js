const fs = require('fs');
const path = require('path');

function part1() {
    const data = fs.readFileSync(path.join(__dirname, 'input.txt'), 'utf8');
    let result = 0;

    for (const line of data.split('\n')) {
        
    }

    return result;
}

function part2() {
    const data = fs.readFileSync(path.join(__dirname, 'input.txt'), 'utf8');
    let result = 0;

    for (const line of data.split('\n')) {
        
    }

    return result;
}

// console.log(`Part 1: ${part1()}`);
// console.log(`Part 2: ${part2()}`);

module.exports = {
    part1,
    part2
};