class Game2048 {
    constructor() {
        this.grid = Array(16).fill(0);
        this.score = 0;
        this.gridContainer = document.querySelector('.grid-container');
        this.scoreElement = document.getElementById('score');
        this.init();
    }

    init() {
        this.grid = Array(16).fill(0);
        this.score = 0;
        this.scoreElement.textContent = '0';
        this.addNewTile();
        this.addNewTile();
        this.updateDisplay();
    }

    addNewTile() {
        const emptyCells = this.grid.reduce((acc, curr, idx) => {
            if (curr === 0) acc.push(idx);
            return acc;
        }, []);
        
        if (emptyCells.length > 0) {
            const randomCell = emptyCells[Math.floor(Math.random() * emptyCells.length)];
            this.grid[randomCell] = Math.random() < 0.9 ? 2 : 4;
        }
    }

    updateDisplay() {
        // Clear existing tiles
        const tiles = document.querySelectorAll('.tile');
        tiles.forEach(tile => tile.remove());

        // Create new tiles
        this.grid.forEach((value, index) => {
            if (value !== 0) {
                const tile = document.createElement('div');
                tile.className = 'tile';
                tile.dataset.value = value;
                tile.textContent = value;
                
                const row = Math.floor(index / 4);
                const col = index % 4;
                
                // Calculate position considering the 15px gap
                // Each tile takes up 25% of the container width/height
                // The gap is 15px, so we need to account for that in our calculations
                const gapSize = 15; // matches the gap size in CSS
                const tileSize = 25; // 25% of container
                
                tile.style.top = `calc(${row * tileSize}% + ${gapSize}px)`;
                tile.style.left = `calc(${col * tileSize}% + ${gapSize}px)`;
                
                this.gridContainer.appendChild(tile);
            }
        });
    }

    move(direction) {
        const previousGrid = [...this.grid];
        let moved = false;

        // Helper function to merge tiles
        const mergeTiles = (line) => {
            const merged = [];
            for (let i = 0; i < line.length; i++) {
                if (line[i] === 0) continue;
                if (line[i] === line[i + 1]) {
                    merged.push(line[i] * 2);
                    this.score += line[i] * 2;
                    i++;
                } else {
                    merged.push(line[i]);
                }
            }
            return merged;
        };

        // Helper function to handle one line
        const processLine = (line) => {
            const nonZero = line.filter(cell => cell !== 0);
            const merged = mergeTiles(nonZero);
            const newLine = [...merged, ...Array(4 - merged.length).fill(0)];
            return newLine;
        };

        // Process all rows/columns based on direction
        if (direction === 'left' || direction === 'right') {
            for (let row = 0; row < 4; row++) {
                let line = this.grid.slice(row * 4, (row + 1) * 4);
                if (direction === 'right') line.reverse();
                line = processLine(line);
                if (direction === 'right') line.reverse();
                
                for (let col = 0; col < 4; col++) {
                    const newValue = line[col];
                    if (this.grid[row * 4 + col] !== newValue) {
                        moved = true;
                        this.grid[row * 4 + col] = newValue;
                    }
                }
            }
        } else {
            for (let col = 0; col < 4; col++) {
                let line = [
                    this.grid[col],
                    this.grid[col + 4],
                    this.grid[col + 8],
                    this.grid[col + 12]
                ];
                if (direction === 'down') line.reverse();
                line = processLine(line);
                if (direction === 'down') line.reverse();
                
                for (let row = 0; row < 4; row++) {
                    const newValue = line[row];
                    if (this.grid[row * 4 + col] !== newValue) {
                        moved = true;
                        this.grid[row * 4 + col] = newValue;
                    }
                }
            }
        }

        if (moved) {
            this.addNewTile();
            this.scoreElement.textContent = this.score;
        }

        this.updateDisplay();
        return moved;
    }

    checkGameOver() {
        // Check for empty cells
        if (this.grid.includes(0)) return false;

        // Check for possible merges
        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {
                const current = this.grid[i * 4 + j];
                if (j < 3 && current === this.grid[i * 4 + j + 1]) return false;
                if (i < 3 && current === this.grid[(i + 1) * 4 + j]) return false;
            }
        }
        return true;
    }
}

// Game initialization
document.addEventListener('DOMContentLoaded', () => {
    const game = new Game2048();

    // Handle keyboard events
    document.addEventListener('keydown', (e) => {
        switch(e.key) {
            case 'ArrowLeft':
                e.preventDefault();
                game.move('left');
                break;
            case 'ArrowRight':
                e.preventDefault();
                game.move('right');
                break;
            case 'ArrowUp':
                e.preventDefault();
                game.move('up');
                break;
            case 'ArrowDown':
                e.preventDefault();
                game.move('down');
                break;
        }

        if (game.checkGameOver()) {
            alert('Game Over! Your score: ' + game.score);
        }
    });

    // Handle New Game button
    document.getElementById('new-game').addEventListener('click', () => {
        game.init();
    });
});
