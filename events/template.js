const fs = require('fs');

function part1() {
    fs.open('input.txt', 'r', (err, fd) => {
        // Any variables
        // let result = 0;
        let result;
        
        for (const line of fs.readFileSync(fd, 'utf8').split('\n')) {
            
            
        }
    
        // Print the result
        console.log(`Part 1 Result: ${result}`);
    });
}

function part2() {
    fs.open('input.txt', 'r', (err, fd) => {
        // Any variables
        // let result = 0;
        let result;
        
        for (const line of fs.readFileSync(fd, 'utf8').split('\n')) {
            
            
        }
    
        // Print the result
        console.log(`Part 2 Result: ${result}`);
    });
}

part1();
part2();