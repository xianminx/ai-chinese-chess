/**
 * ### The HalvingNumber Game
 * 
 * **Game Rules:**  
 * Two players take turns performing actions on a starting number. 
 * On each turn, a player can either halve the number '/2' or subtract 1 from it. 
 * The objective is to avoid being the player who reduces the number to 0.
 * 
 * **Mathematics:**
 * In fact, the game is deterministic and the result is predictable. When a player is given a number N, the result is predictable.
 * We can use a simple function to compute the result.
 * The function is defined as follows:
 * 1. if N = 1, the result is false, since either the player half the number or subtract 1 from it, the number will be 0.
 * 2. if N = 2, the result is true, since the player can halve the number to 1, and the opponent will be the one who reduces the number to 0.
 * 3. if N > 2, 
 *    - if the player halve the number, the opponent will be given ⌊N/2⌋.  The result is the negation of the result of ⌊N/2⌋.
 *    - if the player subtract 1, the opponent will be given [N-1].  The result is the negation of the result of N-1.
 *    - As long as the opponent in one case lose, the player will win. So 
 */

/**
 * Stores the memoized results of the game outcomes
 * true = first player wins, false = second player wins
 */
const gameResults: boolean[] = new Array(3).fill(false);
gameResults[2] = true;

/**
 * Computes whether the first player can win the game starting from number n
 * @param n The starting number
 * @returns true if the first player can win, false if the second player can win
 */
export function computeWinner(n: number): boolean {
    // Input validation
    if (n < 0) throw new Error('Input must be a non-negative number');
    if (!Number.isInteger(n)) throw new Error('Input must be an integer');

    // Base cases
    if (n < 2) return false;
    if (n === 2) return true;

    // Check memoized result
    if (gameResults[n] !== undefined) return gameResults[n];

    // Calculate and memoize the result
    gameResults[n] = !computeWinner(n - 1) || !computeWinner(Math.floor(n / 2));
    return gameResults[n];
}

/**
 * Prints the game results for numbers from 0 to limit
 * @param limit The upper limit of numbers to compute (exclusive)
 */
function printGameResults(limit: number = 100): void {
    computeWinner(limit - 1); // Ensure all results are computed
    for (let i = 0; i < limit; i++) {
        console.log(`${i}: ${gameResults[i] ? '🏆' : '💩'}`);
    }
}

