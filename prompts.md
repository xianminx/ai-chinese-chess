
### **Project Instructions for Cursor Composer**

**Project Overview:**
Develop a Chinese Chess (象棋) web app using React. The app should include a visually appealing chessboard, functional chess pieces, and enforce the rules of Chinese Chess. It should be interactive and work seamlessly on both desktop and mobile devices.

---

### **Instructions for Cursor Composer**

#### **1. Set Up the React Project**
1. **Initialize Project**: 
   - Create a new React project using `create-react-app` or Vite.
   - Use TypeScript for better type safety.
   - Install necessary dependencies:
     ```bash
     npm install react react-dom typescript @mui/material @emotion/react @emotion/styled
     ```

2. **Project Structure**:
   - Organize files:
     ```
     src/
     ├── components/       // UI components
     ├── utils/            // Utility functions
     ├── styles/           // CSS or styled-components
     ├── assets/           // Images or icons
     └── App.tsx           // Main app entry point
     ```

---

#### **2. Design the UI**
1. **Chessboard Design**:
   - Create a `Chessboard` component that renders a 9x10 grid.
   - Use CSS Grid or a library like MUI Grid for layout.
   - Add grid lines to mimic a traditional Chinese Chess board.
   - Include a river in the middle and add landmarks (e.g., "楚河" and "汉界").

2. **Chess Pieces**:
   - Create a `ChessPiece` component.
   - Use SVG or PNG images for the pieces (e.g., 将, 士, 象, 马, 车, 炮, 卒).
   - Add styles to distinguish between red and black pieces.

3. **Responsive Design**:
   - Ensure the board and pieces scale proportionally for different screen sizes.
   - Test on mobile and desktop.

---

#### **3. Implement Core Features**
1. **Game Logic**:
   - Use a `GameState` object in a context or Redux store to track:
     - Positions of pieces.
     - Turn (red or black).
     - Game status (ongoing, checkmate, stalemate).
   - Validate moves based on Chinese Chess rules.

2. **Piece Movement**:
   - Enable drag-and-drop functionality using libraries like `react-dnd` or implement custom handlers.
   - Highlight valid moves for the selected piece.

3. **Rule Enforcement**:
   - Implement checks for:
     - Valid moves per piece type.
     - Turn alternation.
     - General (king) confrontation rule.

4. **Reset and Undo**:
   - Add buttons for "Reset Game" and "Undo Move."
   - Maintain a move history stack for undo functionality.

---

#### **4. Add Advanced Features**
1. **AI Opponent**:
   - Implement an AI opponent with a simple heuristic algorithm for move selection.
   - Use a library like `chess.js` for move validation or write custom logic.

2. **Multiplayer Mode**:
   - Add a two-player mode where users can play on the same device or online.
   - For online multiplayer:
     - Use Firebase or WebSocket for real-time updates.
     - Sync game states between players.

3. **Save and Load Games**:
   - Allow users to save their game progress locally or to a database.
   - Implement a feature to load saved games.

---

#### **5. Enhance the User Experience**
1. **UI Enhancements**:
   - Use animations for piece movement.
   - Add sound effects for piece selection and movement.
   - Show tooltips or guides for beginners.

2. **Error Handling**:
   - Display messages for invalid moves.
   - Provide visual indicators for check/checkmate states.

3. **Theming**:
   - Add a light/dark mode toggle.
   - Customize piece designs for different themes.

---

#### **6. Deployment**
1. **Optimize for Performance**:
   - Use `React.memo` for performance optimization.
   - Lazy load components where applicable.

2. **Host the App**:
   - Deploy the app to Vercel or Netlify for easy hosting.
   - Ensure the app works on HTTPS with a custom domain.

3. **Testing**:
   - Write unit tests for game logic using Jest.
   - Perform end-to-end testing with Cypress.

---

### **Suggested Step-by-Step Workflow for Cursor Composer**
1. **Initial Setup**:
   - Set up a React project with a chessboard component and placeholder pieces.

2. **Implement Movement**:
   - Add drag-and-drop functionality and enforce movement rules.

3. **Add Game Logic**:
   - Build the game state and validate moves.

4. **Enhance UI**:
   - Add animations, sound, and responsive design.

5. **Deploy and Test**:
   - Deploy to Vercel or Netlify and write test cases.
