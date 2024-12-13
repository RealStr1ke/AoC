/**
 * ==============================
 *     Advent of Code - Utils
 * ==============================
 */


/**
 * ===========> Util Variables <===========
 */

export const EMPTY = '';
export const alphabet = 'abcdefghijklmnopqrstuvwxyz';
export const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
export const digits = '0123456789';
export const hex = '0123456789abcdef';
export const directions = [[0, 1], [1, 0], [0, -1], [-1, 0]];
export const diagonals = [[1, 1], [1, -1], [-1, 1], [-1, -1]];
export const allDirections = [...directions, ...diagonals];
export const compass = ['N', 'E', 'S', 'W'];
export const cardinals = ['NORTH', 'EAST', 'SOUTH', 'WEST'];

export const punctuation = '.,!?;:\'"`-_()[]{}';
export const whitespace = ' \t\n\r';
export const symbols = '!@#$%^&*()-=_+[]{}\\|;:\'",.<>/?`~';

export const binaryDigits = '01';
export const octalDigits = '01234567';
export const base64 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';

export const vowels = 'aeiou';
export const consonants = 'bcdfghjklmnpqrstvwxyz';
export const VOWELS = 'AEIOU';
export const CONSONANTS = 'BCDFGHJKLMNPQRSTVWXYZ';

/**
 * Array containing the short names of all months in the Gregorian calendar in English.
 * The array is zero-based indexed, where January is at index 0 and December is at index 11.
 * @type {readonly string[]}
 * @example
 * ```typescript
 * console.log(months[0]); // "Jan"
 * console.log(months[11]); // "Dec"
 * ```
 */
export const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

/**
 * Array containing the full names of all months in the Gregorian calendar in English.
 * The array is zero-based indexed, where January is at index 0 and December is at index 11.
 * @type {readonly string[]}
 * @example
 * ```typescript
 * console.log(fullMonths[0]); // "January"
 * console.log(fullMonths[11]); // "December"
 * ```
 */
export const fullMonths = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

/**
 * Array containing the short names of all days in the Gregorian calendar in English.
 * The array is zero-based indexed, where Sunday is at index 0 and Saturday is at index 6.
 * @type {readonly string[]}
 * @example
 * ```typescript
 * console.log(days[0]); // "Sun"
 * console.log(days[6]); // "Sat"
 * ```
 */
export const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

/**
 * Array containing the full names of all days in the Gregorian calendar in English.
 * The array is zero-based indexed, where Sunday is at index 0 and Saturday is at index 6.
 * @type {readonly string[]}
 * @example
 * ```typescript
 * console.log(fullDays[0]); // "Sunday"
 * console.log(fullDays[6]); // "Saturday"
 * ```
 */
export const fullDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];


/**
 * Array containing the names of all colors in the rainbow.
 * @type {readonly string[]}
 * @example
 * ```typescript
 * console.log(rainbow[0]); // "red"
 * console.log(rainbow[6]); // "violet"
 * ```
 */
export const colors = ['red', 'green', 'blue', 'yellow', 'purple', 'cyan', 'white', 'black'];

/**
 * Array containing the names of all suits in a standard deck of playing cards.
 * @type {readonly string[]}
 * @example
 * ```typescript
 * console.log(suits[0]); // "♠"
 * console.log(suits[3]); // "♣"
 * ```
 */
export const suits = ['♠', '♥', '♦', '♣'];

/**
 * Array containing the names of all cards in a standard deck of playing cards.
 * @type {readonly string[]}
 * @example
 * ```typescript
 * console.log(cards[0]); // "A"
 * console.log(cards[12]); // "K"
 * ```
 */
export const cards = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];

/**
 * Array containing the names of all lowercase Greek letters.
 * @type {readonly string}
 * @example
 * ```typescript
 * console.log(greek[0]); // "α"
 * console.log(greek[23]); // "ω"
 * ```
 */
export const greek = 'αβγδεζηθικλμνξοπρστυφχψω';

/**
 * Array containing the names of all uppercase Greek letters.
 * @type {readonly string}
 * @example
 * ```typescript
 * console.log(GREEK[0]); // "Α"
 * console.log(GREEK[23]); // "Ω"
 * ```
 */
export const GREEK = 'ΑΒΓΔΕΖΗΘΙΚΛΜΝΞΟΠΡΣΤΥΦΧΨΩ';

/**
 * Number representing positive infinity.
 * @type {number}
 * @example
 * ```typescript
 * console.log(infinity); // Infinity
 * ```
 */
export const infinity = Number.POSITIVE_INFINITY;

/**
 * Number representing negative infinity.
 * @type {number}
 * @example
 * ```typescript
 * console.log(negInfinity); // -Infinity
 * ```
 */
export const negInfinity = Number.NEGATIVE_INFINITY;

/**
 * Number representing epsilon
 * @type {number}
 * @example
 * ```typescript
 * console.log(epsilon); // 2.220446049250313e-16
 * ```
 */
export const epsilon = Number.EPSILON;

/**
 * Number representing pi
 * @type {number}
 * @example
 * ```typescript
 * console.log(pi); // 3.141592653589793
 * ```
 */
export const pi = Math.PI;

/**
 * Number representing tau
 * @type {number}
 * @example
 * ```typescript
 * console.log(tau); // 6.283185307179586
 * ```
 */
export const tau = Math.PI * 2;

/**
 * Number representing the euler constant
 * @type {number}
 * @example
 * ```typescript
 * console.log(e); // 2.718281828459045
 * ```
 */
export const e = Math.E;

/**
 * ===========> Util Functions <===========
 */

/**
 * Creates an array from a string input, splitting on newlines
 * @param input String with newlines
 * @param delimiter Delimiter to split on, default is newline (\n)
 * @returns Array of strings
 */
export function createArray(input: string, delimiter: string = '\n'): string[] {
	return input.trim().split(delimiter);
}

/**
 * Creates an array of numbers from a string input, splitting on newlines
 * @param input String with newlines
 * @param delimiter Delimiter to split on, default is newline (\n)
 * @returns Array of numbers
 */
export function createNumberArray(input: string, delimiter: string = '\n'): number[] {
	return input.trim().split(delimiter).map(Number);
}

/**
 * Creates a 2D grid from a string input where each line represents a row
 * @param input String with newlines representing rows
 * @returns 2D array of characters
 */
export function createGrid(input: string): string[][] {
	return input
		.trim()
		.split('\n')
		.map(line => line.split(''));
}

/**
 * Creates a 2D number grid from a string input where each character is a digit
 * @param input String with newlines representing rows
 * @returns 2D array of numbers
 */
export function createNumberGrid(input: string): number[][] {
	return input
		.trim()
		.split('\n')
		.map(line => line.split('').map(Number));
}

/**
 * Creates a deep copy of an array
 * @param arr Array to copy
 * @returns Deep copy of array
 */
export function copyArray<T>(arr: T[]): T[] {
	return [...arr];
}

/**
 * Creates a deep copy of a 2D array
 * @param grid 2D array to copy
 * @returns Deep copy of 2D array
 */
export function copyGrid<T>(grid: T[][]): T[][] {
	return grid.map(row => [...row]);
}

/**
 * Calculates the Greatest Common Divisor of two numbers
 * @param a First number
 * @param b Second number
 * @returns Greatest Common Divisor
 */
export function gcd2(a: number, b: number): number {
	while (b) {
		[a, b] = [b, a % b];
	}
	return a;
}

/**
 * Calculates the Greatest Common Divisor of multiple numbers
 * @param args Numbers to calculate GCD of
 * @returns Greatest Common Divisor
 */
export function gcd(...args: number[]): number {
	return args.reduce(gcd2, 0);
}

/**
 * Calculates the Least Common Multiple of two numbers
 * @param a First number
 * @param b Second number
 */
export function lcm2(a: number, b: number): number {
	return a && b ? a * (b / gcd2(a, b)) : 0;
}

/**
 * Calculates the Least Common Multiple of multiple numbers
 * @param args Numbers to calculate LCM of
 * @returns Least Common Multiple
 */
export function lcm(...args: number[]): number {
	return args.reduce(lcm2, 1);
}

/**
 * Checks if a number is prime
 * @param n Number to check
 * @returns Whether the number is prime
 */
export function isPrime(n: number): boolean {
	for (let i = 2; i * i <= n; i++) {
		if (n % i === 0) {
			return false;
		}
	}
	return true;
}

/**
 * Returns an array of prime factors of a number
 * @param n Number to find prime factors of
 * @returns Array of prime factors
 */
export function primeFactors(n: number): number[] {
	const arr: number[] = [];
	for (let i = 2; n > 1;) {
		if (i * i > n) {
			arr.push(n);
			break;
		} else if (n % i === 0) {
			arr.push(i);
			n /= i;
		} else {
			i++;
		}
	}
	return arr;
}

/**
 * Returns an array of all factors of a number
 * @param n Number to find factors of
 * @returns Array of factors
 */
export function factors(n: number): number[] {
	const arr: number[] = [];
	const arr2: number[] = [];
	for (let i = 1; i * i <= n; i++) {
		if (n % i === 0) {
			arr.push(i);
			if (i !== n / i) {
				arr2.unshift(n / i);
			}
		}
	}
	return arr.concat(arr2);
}

/**
 * Checks if coordinates exist on a 2D grid
 * @param grid The 2D grid to check
 * @param row Row coordinate
 * @param col Column coordinate
 * @returns Whether the coordinates exist on the grid
 */
export function coordsExist<T>(grid: T[][], row: number, col: number): boolean {
	return row >= 0 && row < grid.length && col >= 0 && col < grid[0].length;
}

/**
 * Gets elements from a 2D array based on relative coordinates from a starting position
 * @param grid The 2D grid to get elements from
 * @param coord Starting position [row, col]
 * @param coords Array of relative coordinates [row, col]
 * @returns Array of elements at the relative coordinates, excluding out of bounds positions
 */
export function getRelativeElements<T>(grid: T[][], coord: [number, number], coords: number[][]): [number, number][] {
	const row: number = coord[0];
	const col: number = coord[1];
	const elements: [number, number][] = [];
	for (const [dRow, dCol] of coords) {
		const newRow = row + dRow;
		const newCol = col + dCol;
		if (coordsExist(grid, newRow, newCol)) {
			elements.push([newRow, newCol]);
		}
	}
	return elements;
}

/**
 * Expands a 2D grid by turning each cell into a block of identical cells based on the given scale
 * @param grid The 2D grid to expand
 * @param scale The scale to expand each cell, default is 2
 * @returns Expanded 2D grid where each cell is duplicated into a block of size scale x scale
 */
export function expandGrid<T>(grid: T[][], scale: number = 2): T[][] {
	const newGrid: T[][] = [];
	for (const row of grid) {
		for (let s = 0; s < scale; s++) {
			const newRow: T[] = [];
			for (const cell of row) {
				for (let t = 0; t < scale; t++) {
					newRow.push(cell);
				}
			}
			newGrid.push(newRow);
		}
	}
	return newGrid;
}