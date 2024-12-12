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