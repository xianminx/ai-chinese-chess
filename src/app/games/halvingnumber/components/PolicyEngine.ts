export type Turn = 'human' | 'ai'
export type Action = "/" | "-";
export type Player = 'player1' | 'player2'
type State = {turn: Player, value: number}

export class HalfingGame {
    value: number
    constructor(value: number) {
        this.value = value
    }

    // state = (player, number)
    startState(): State {
        return {turn: 'player1', value: this.value}
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    actions(state: State): Action[] {
        return ['-', '/']
    }

    succ(state: State, action: Action): State {
        const {turn, value} = state
        if (action === '-') {
            return {turn: turn === 'player1' ? 'player2' : 'player1', value: value - 1}
        } else if (action === '/') {
            return {turn: turn === 'player1' ? 'player2' : 'player1', value: Math.floor(value / 2)}
        }
        throw new Error(`Invalid action ${action}`)
    }

    isEnd(state: State): boolean {
        return state.value === 0
    }

    utility(state: State): number {
        const {turn} = state
        return turn === 'player1' ? Infinity : -Infinity
    }   

    player(state: State): Player {
        return state.turn
    }
}

export function simplePolicy(game: HalfingGame, state: State): Action {
    const actions = game.actions(state)
    const randomIndex = Math.floor(Math.random() * actions.length)
    const action = actions[randomIndex]
    console.log(`simplePolicy: state ${state.value} => action ${action}`)
    return action as Action
}

export function humanPolicy(game: HalfingGame, state: State): Action {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const question = (prompt: string) => {
        return '-';
    }
    while (true) {
        const action = question(`humanPolicy: Enter move for state ${state.value}: `).trim()
        if (game.actions(state).includes(action as Action)) {
            return action as Action
        }
        console.log(`Invalid action. Available actions: ${game.actions(state).join(', ')}`)
    }
}

export function minimaxPolicy(game: HalfingGame, state: State): Action {

    // Return (utility of that state, action that achieves that utility)
    function recurse(state: State): {utility: number, action?: Action} {
        if (game.isEnd(state)) {
            return {utility: game.utility(state), action: undefined  }
        }
        const candidates = game.actions(state).map(action => {
            const successor = game.succ(state, action)
            const {utility} = recurse(successor)
            return {utility, action}
        })
        console.log(`minimaxPolicy: state ${state.value} => candidates ${JSON.stringify(candidates)}`)

        const player = game.player(state)
        if (player === 'player1') {
            // for player 1, it maximizes utility
            const max = candidates.reduce((max, candidate) => 
                candidate.utility > max.utility ? candidate : max, 
                {utility: -Infinity}
            )
            return max
        } else {
            // for player 2 (opponent), it minimizes utility
            // So for the real game design, we may implement a function to simulate the opponent's policy
            return candidates.reduce((min, candidate) => 
                candidate.utility < min.utility ? candidate : min, 
                {utility: Infinity}
            )
        }
    }

    const {utility, action} = recurse(state)
    console.log(`minimaxPolicy: state ${state.value} => action '${action}' with utility ${utility}`)
    return action as Action
}

export interface GameState {
  value: number;
  turn: Turn;
  history: { value: number; action?: Action; }[];
  gameOver: boolean;
}

const policies = {
    "simple": simplePolicy,
    "minimax": minimaxPolicy,
}

export function askForAction(gameState: GameState, policy: 'simple' | 'minimax'): Action {
    const p = policies[policy];
    const {value} = gameState
    const gameEngine = new HalfingGame(value)
    const action = p(gameEngine, {value, turn: 'player1'})
    return action
}


// const policies: Record<string, (game: HalfingGame, state: State) => Action> = {
//     "player1": humanPolicy,
//     // "player2": simplePolicy,
//     "player2": minimaxPolicy,
// }

// const game = new HalfingGame(30)
// let state = game.startState()
// while (!game.isEnd(state)) {
//     const player = state.turn
//     const policy = policies[player]
//     const action = policy(game, state)
//     state = game.succ(state, action)
// }

// console.log(`${state.turn} wins! Final utility of game is ${game.utility(state)}`)
