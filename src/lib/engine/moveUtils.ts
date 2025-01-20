import { makeMove } from "./cchess";
import { BoardState, Position, MoveValidationResult, Piece, PlayerColor } from "./types";
import { isRed, isBlack, getPieceColor } from "./utils";
import { isSamePosition } from "./utils";
// 棋子走法验证规则

// Shared helper functions for both validation and generation
export function isOnBoard(pos: Position): boolean {
    return pos.x >= 0 && pos.x < 9 && pos.y >= 0 && pos.y < 10;
}

export function isInPalace(pos: Position, color: PlayerColor): boolean {
    if (pos.x < 3 || pos.x > 5) return false;
    if (color === 'red') {
        return pos.y >= 7 && pos.y <= 9;
    } else {
        return pos.y >= 0 && pos.y <= 2;
    }
}

export function hasCrossedRiver(pos: Position, color: PlayerColor): boolean {
    return color === 'red' ? pos.y <= 4 : pos.y >= 5;
}

// Helper to check if a path is clear between two positions
export function isPathClear(
    board: (Piece | null)[][],
    from: Position,
    to: Position,
    skipFirst: boolean = false
): boolean {
    const dx = Math.sign(to.x - from.x);
    const dy = Math.sign(to.y - from.y);
    let x = from.x + (skipFirst ? dx : 0);
    let y = from.y + (skipFirst ? dy : 0);

    while (x !== to.x || y !== to.y) {
        if (board[y][x] !== null) {
            return false;
        }
        x += dx;
        y += dy;
    }
    return true;
}

// Helper to count pieces between two positions
export function countPiecesBetween(
    board: (Piece | null)[][],
    from: Position,
    to: Position
): number {
    let count = 0;
    const dx = Math.sign(to.x - from.x);
    const dy = Math.sign(to.y - from.y);
    let x = from.x + dx;
    let y = from.y + dy;

    while (x !== to.x || y !== to.y) {
        if (board[y][x] !== null) {
            count++;
        }
        x += dx;
        y += dy;
    }
    return count;
}

// 将/帅走法验证
// 规则：
// 1. 只能在九宫格内移动
// 2. 每次只能走一步（上下左右）
// 3. 不能与对方老将对面（将帅对面）
// 4. 不能送将（移动后不能被将军）
const isValidGeneralMove = (
  piece: Piece,
  from: Position,
  to: Position
): boolean => {
  if (!isInPalace(to, getPieceColor(piece))) return false;
  const dx = Math.abs(to.x - from.x);
  const dy = Math.abs(to.y - from.y);
  return (dx === 1 && dy === 0) || (dx === 0 && dy === 1);
};

// 士/仕走法验证
// 规则：
// 1. 只能在九宫格内移动
// 2. 只能斜着走，每次一格
// 3. 不能离开己方区域
// 4. 不能吃自己的子
const isValidAdvisorMove = (
  state: BoardState,
  piece: Piece,
  from: Position,
  to: Position
): boolean => {
  // Must stay in palace
  if (!isInPalace(to, getPieceColor(piece))) return false;

  // Must move diagonally one step
  const dx = Math.abs(to.x - from.x);
  const dy = Math.abs(to.y - from.y);
  if (dx !== 1 || dy !== 1) return false;

  // Check target position
  const targetPiece = state.board[to.y][to.x];
  if (targetPiece && getPieceColor(targetPiece) === getPieceColor(piece)) {
    return false; // Cannot capture own piece
  }

  return true;
};

// 车/俥走法验证
// 规则：
// 1. 直线走，横向或纵向，步数不限
// 2. 不能越过其他棋子
const isValidChariotMove = (
  state: BoardState,
  piece: Piece,
  from: Position,
  to: Position
): boolean => {
  const dx = Math.abs(to.x - from.x);
  const dy = Math.abs(to.y - from.y);
  if (dx !== 0 && dy !== 0) return false; // Chariot moves in a straight line

  const stepX = to.x > from.x ? 1 : to.x < from.x ? -1 : 0;
  const stepY = to.y > from.y ? 1 : to.y < from.y ? -1 : 0;

  let x = from.x + stepX;
  let y = from.y + stepY;
  while (x !== to.x || y !== to.y) {
    if (state.board[y][x] !== null) {
      return false; // Blocked by another piece
    }
    x += stepX;
    y += stepY;
  }

  return true;
};

// 马走法验证
// 规则：
// 1. 走"日"字，即两格直线加一格侧面
// 2. 不能蹩马腿（马腿位置不能有棋子）
const isValidHorseMove = (
  state: BoardState,
  piece: Piece,
  from: Position,
  to: Position
): boolean => {
  const dx = Math.abs(to.x - from.x);
  const dy = Math.abs(to.y - from.y);

  if (!((dx === 1 && dy === 2) || (dx === 2 && dy === 1))) return false;

  // Check for blocking piece at the "horse leg" position
  const legX = from.x + (dx === 2 ? (to.x > from.x ? 1 : -1) : 0);
  const legY = from.y + (dy === 2 ? (to.y > from.y ? 1 : -1) : 0);

  return state.board[legY][legX] === null;
};

// 兵/卒走法验证
// 规则：
// 1. 未过河只能向前走
// 2. 过河后可以横着走
// 3. 不能后退
// 4. 每次只能走一步
// 5. 不能吃自己的子
const isValidSoldierMove = (
  state: BoardState,
  piece: Piece,
  from: Position,
  to: Position
): boolean => {
  const dx = Math.abs(to.x - from.x);
  const dy = to.y - from.y; // Not using abs() to check direction

  // Red moves up (-1), Black moves down (+1)
  const forwardDirection = isRed(piece) ? -1 : 1;

  // Check if crossed river (红子过河线是4，黑子过河线是5)
  const hasCrossedRiver = isRed(piece) ? from.y <= 4 : from.y >= 5;

  // Target position check
  const targetPiece = state.board[to.y][to.x];
  if (targetPiece && getPieceColor(targetPiece) === getPieceColor(piece)) {
    return false; // Cannot capture own piece
  }

  if (!hasCrossedRiver) {
    // Before crossing river: can only move forward one step
    return dx === 0 && dy === forwardDirection;
  } else {
    // After crossing river: can move forward or sideways one step
    return (
      (dx === 0 && dy === forwardDirection) || // Forward
      (dy === 0 && dx === 1)
    ); // Sideways
  }
};

// 炮走法验证
// 规则：
// 1. 直线走，横向或纵向，步数不限
// 2. 不吃子时不能越过任何棋子
// 3. 吃子时必须越过一个棋子（炮架）且只能越过一个
const isValidCannonMove = (
  state: BoardState,
  piece: Piece,
  from: Position,
  to: Position
): boolean => {
  const dx = Math.abs(to.x - from.x);
  const dy = Math.abs(to.y - from.y);

  if (dx !== 0 && dy !== 0) return false; // Must move in straight line

  const stepX = to.x > from.x ? 1 : to.x < from.x ? -1 : 0;
  const stepY = to.y > from.y ? 1 : to.y < from.y ? -1 : 0;

  let x = from.x + stepX;
  let y = from.y + stepY;
  let foundPiece = false;

  // Count pieces between from and to positions
  while (x !== to.x || y !== to.y) {
    const pieceAtPosition = state.board[y][x];
    if (pieceAtPosition) {
      if (foundPiece) {
        return false; // Cannot jump over more than one piece
      }
      foundPiece = true;
    }
    x += stepX;
    y += stepY;
  }

  // Get target position piece
  const targetPiece = state.board[to.y][to.x];

  if (targetPiece) {
    // If capturing, must jump exactly one piece
    if (!foundPiece || getPieceColor(targetPiece) === getPieceColor(piece)) {
      return false;
    }
    return true;
  } else {
    // If not capturing, cannot jump any pieces
    return !foundPiece;
  }
};

// 相/象走法验证
// 规则：
// 1. 走"田"字，即斜着走两格
// 2. 不能过河
// 3. 不能塞象眼（象眼位置不能有棋子）
const isValidElephantMove = (
  state: BoardState,
  piece: Piece,
  from: Position,
  to: Position
): boolean => {
  const dx = Math.abs(to.x - from.x);
  const dy = Math.abs(to.y - from.y);

  // Must move exactly 2 steps diagonally
  if (dx !== 2 || dy !== 2) return false;

  // Cannot cross the river
  if (isRed(piece) && to.y < 5) return false;
  if (isBlack(piece) && to.y > 4) return false;

  // Check if the "elephant eye" (middle point) is blocked
  const midX = (from.x + to.x) / 2;
  const midY = (from.y + to.y) / 2;
  if (state.board[midY][midX] !== null) return false;

  return true;
};

// 将帅对面检查
// 规则：
// 1. 将帅不能在同一列直接对面
// 2. 如果在同一列，中间必须有其他棋子
const isGeneralsFacing = (
  state: BoardState,
  from: Position,
  to: Position
): boolean => {
  let redGeneral: Position | null = null;
  let blackGeneral: Position | null = null;

  // Find current positions of both generals
  for (let y = 0; y < state.board.length; y++) {
    for (let x = 0; x < state.board[y].length; x++) {
      const piece = state.board[y][x];
      if (piece) {
        if (piece === 'K') {
          redGeneral = { x, y };
        } else if (piece === 'k') {
          blackGeneral = { x, y };
        }
      }
    }
  }

  // Update position if we're moving a general
  const movingPiece = state.board[from.y][from.x];
  if (movingPiece === 'K') {
    redGeneral = to;
  } else if (movingPiece === 'k') {
    blackGeneral = to;
  }

  if (!redGeneral || !blackGeneral) return false;

  // Check if generals would be in same column
  if (redGeneral.x !== blackGeneral.x) return false;

  // Check if there are any pieces between them
  const startY = Math.min(redGeneral.y, blackGeneral.y) + 1;
  const endY = Math.max(redGeneral.y, blackGeneral.y);

  for (let y = startY; y < endY; y++) {
    if (state.board[y][redGeneral.x] !== null) {
      return false; // There's a piece between them
    }
  }

  return true; // Generals are facing each other
};

// 主要走法验证函数
// 规则：
// 1. 检查是否轮到该方走子
// 2. 检查目标位置是否在棋盘内
// 3. 检查目标位置是否有己方棋子
// 4. 根据不同棋子类型验证走法
export const isValidMove = (
  state: BoardState,
  from: Position,
  to: Position
): MoveValidationResult => {
  const piece = state.board[from.y][from.x];

  if (!piece) {
    return { isValid: false, reason: "没有选中任何棋子" };
  }

  if (getPieceColor(piece) !== state.currentTurn) {
    return {
      isValid: false,
      reason:
        "现在是" + (state.currentTurn === "red" ? "红" : "黑") + "方走子",
    };
  }

  if (!isOnBoard(to)) {
    return { isValid: false, reason: "目标位置超出棋盘范围" };
  }

  if (isSamePosition(from, to)) {
    return { isValid: false, reason: "起始位置和目标位置相同" };
  }

  const targetPiece = state.board[to.y][to.x];
  if (targetPiece && getPieceColor(targetPiece) === getPieceColor(piece)) {
    return { isValid: false, reason: "不能吃自己的子" };
  }

  // 验证各种棋子的走法
  switch (piece.toUpperCase()) {
    case "K": {
      if (!isValidGeneralMove(piece, from, to)) {
        return { isValid: false, reason: "将/帅只能在九宫格内一步直行" };
      }
      if (isGeneralsFacing(state, from, to)) {
        return { isValid: false, reason: "将帅不能面对面" };
      }
      const newState = makeMove(state, { piece, from, to });
      if (isKingInCheck(newState, getPieceColor(piece))) {
        return { isValid: false, reason: "不能送将" };
      }
      return { isValid: true };
    }
    case "A": {
      if (!isValidAdvisorMove(state, piece, from, to)) {
        return { isValid: false, reason: "士/仕只能在九宫格内斜走一格" };
      }
      return { isValid: true };
    }
    case "R": {
      if (!isValidChariotMove(state, piece, from, to)) {
        return { isValid: false, reason: "车只能直行，且不能越过其他棋子" };
      }
      return { isValid: true };
    }
    case "H": {
      if (!isValidHorseMove(state, piece, from, to)) {
        return { isValid: false, reason: "马走日，且不能蹩马腿" };
      }
      return { isValid: true };
    }
    case "P": {
      if (!isValidSoldierMove(state, piece, from, to)) {
        return { isValid: false, reason: "兵/卒只能向前，过河后可横行" };
      }
      return { isValid: true };
    }
    case "C": {
      if (!isValidCannonMove(state, piece, from, to)) {
        return {
          isValid: false,
          reason: "炮移动时不能越子，吃子时需要一个炮架",
        };
      }
      return { isValid: true };
    }
    case "E": {
      if (!isValidElephantMove(state, piece, from, to)) {
        return { isValid: false, reason: "相/象走田字且不能过河，不能塞象眼" };
      }
      return { isValid: true };
    }
    default:
      return { isValid: false, reason: "无效的棋子类型" };
  }
};

function findKingPosition(state: BoardState, color: PlayerColor): Position | null {  
  const kingPiece = color === 'red' ? 'K' : 'k';
  for (let y = 0; y < 10; y++) {
      for (let x = 0; x < 9; x++) {
          if (state.board[y][x] === kingPiece) {
              return { x, y };
          }
      }
  }

  return null;
}

export function isKingInCheck(
    state: BoardState,
    kingColor: PlayerColor
): boolean {
    const kingPos = findKingPosition(state, kingColor);
    if (!kingPos) return false;

    // Check if any opponent piece can capture the king
    for (let y = 0; y < state.board.length; y++) {
        for (let x = 0; x < state.board[y].length; x++) {
            const piece = state.board[y][x];
            if (piece && getPieceColor(piece) !== kingColor) {
                const result = isValidMove(state, { x, y }, kingPos);
                if (result.isValid) {
                    return true;
                }
            }
        }
    }

    return false;
}