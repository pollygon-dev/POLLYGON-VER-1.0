// SnakeGame.js
"use strict";

// Global direction state - this ensures we can control the snake regardless of React's state
window.currentDirection = 'RIGHT';
window.gameActive = false;

// Global keyboard handler
window.handleSnakeControls = function(e) {
    if (!window.gameActive) return;
    
    console.log('Key pressed:', e.key);
    
    switch (e.key) {
        case 'ArrowUp':
            if (window.currentDirection !== 'DOWN') window.currentDirection = 'UP';
            break;
        case 'ArrowDown':
            if (window.currentDirection !== 'UP') window.currentDirection = 'DOWN';
            break;
        case 'ArrowLeft':
            if (window.currentDirection !== 'RIGHT') window.currentDirection = 'LEFT';
            break;
        case 'ArrowRight':
            if (window.currentDirection !== 'LEFT') window.currentDirection = 'RIGHT';
            break;
    }
};

// Define initialization functions first
window.initSnakeGame = window.initSnakeGame || function(windowId) {
    console.log('Snake game initialization requested for:', windowId);
    const container = document.querySelector(`#${windowId} #snake-root`);
    if (!container) {
        console.error('Snake game container not found!');
        return;
    }
    
    // Add keyboard listener when game initializes
    window.gameActive = true;
    window.currentDirection = 'RIGHT';
    window.addEventListener('keydown', window.handleSnakeControls);
    
    const root = ReactDOM.createRoot(container);
    root.render(React.createElement(window.SnakeGame));
};

window.cleanupSnakeGame = window.cleanupSnakeGame || function(windowId) {
    window.gameActive = false;
    window.removeEventListener('keydown', window.handleSnakeControls);
    
    const container = document.querySelector(`#${windowId} #snake-root`);
    if (container) {
        const root = ReactDOM.createRoot(container);
        root.unmount();
    }
};

// Define Snake Game Component
window.SnakeGame = function SnakeGame() {
    const [snake, setSnake] = React.useState([{ x: 10, y: 10 }]);
    const [food, setFood] = React.useState({ x: 5, y: 5 });
    const [gameOver, setGameOver] = React.useState(false);
    const [score, setScore] = React.useState(0);
    const [isPaused, setIsPaused] = React.useState(false);
    const [speed, setSpeed] = React.useState(150);
    const [gridSize] = React.useState({ width: 20, height: 20 });
    const [highScore, setHighScore] = React.useState(() => {
        const saved = localStorage.getItem('snakeHighScore');
        return saved ? parseInt(saved) : 0;
    });
    
    const gameLoopRef = React.useRef();
    
    const getRandomPosition = () => ({
        x: Math.floor(Math.random() * gridSize.width),
        y: Math.floor(Math.random() * gridSize.height)
    });
    
    const checkCollision = (piece, snk = snake) => {
        if (piece.x < 0 || piece.x >= gridSize.width || 
            piece.y < 0 || piece.y >= gridSize.height) {
            return true;
        }
        
        for (const segment of snk) {
            if (piece.x === segment.x && piece.y === segment.y) {
                return true;
            }
        }
        return false;
    };
    
    const moveSnake = React.useCallback(() => {
        if (gameOver || isPaused) return;
        
        setSnake(prevSnake => {
            const head = { ...prevSnake[0] };
            
            // Use the global direction state
            switch (window.currentDirection) {
                case 'UP': head.y -= 1; break;
                case 'DOWN': head.y += 1; break;
                case 'LEFT': head.x -= 1; break;
                case 'RIGHT': head.x += 1; break;
            }
            
            if (checkCollision(head)) {
                setGameOver(true);
                window.gameActive = false;
                if (score > highScore) {
                    setHighScore(score);
                    localStorage.setItem('snakeHighScore', score.toString());
                }
                return prevSnake;
            }
            
            const newSnake = [head, ...prevSnake];
            
            if (head.x === food.x && head.y === food.y) {
                setScore(prev => prev + 1);
                setSpeed(prev => Math.max(prev - 5, 50));
                
                let newFood;
                do {
                    newFood = getRandomPosition();
                } while (checkCollision(newFood, newSnake));
                setFood(newFood);
            } else {
                newSnake.pop();
            }
            
            return newSnake;
        });
    }, [gameOver, isPaused, food, score, highScore]);
    
    React.useEffect(() => {
        if (!gameOver && !isPaused) {
            gameLoopRef.current = setInterval(moveSnake, speed);
        }
        return () => clearInterval(gameLoopRef.current);
    }, [gameOver, isPaused, speed, moveSnake]);
    
    const resetGame = () => {
        setSnake([{ x: 10, y: 10 }]);
        setFood(getRandomPosition());
        window.currentDirection = 'RIGHT';
        window.gameActive = true;
        setGameOver(false);
        setScore(0);
        setSpeed(150);
        setIsPaused(false);
    };

    // Handle pause with a global window listener
    React.useEffect(() => {
        const handlePause = (e) => {
            if (e.key === ' ' || e.key.toLowerCase() === 'p') {
                setIsPaused(prev => !prev);
            }
        };
        
        window.addEventListener('keydown', handlePause);
        return () => window.removeEventListener('keydown', handlePause);
    }, []);

    return React.createElement("div", {
        className: "w-full h-full bg-gradient-to-b from-purple-300 to-purple-400 p-4"
    },
        React.createElement("div", {
            className: "bg-white rounded-xl border-4 border-purple-200 overflow-hidden shadow-lg h-full flex flex-col"
        }, [
            // Instructions
            React.createElement("div", {
                key: "instructions",
                className: "bg-purple-50 px-3 py-1 text-xs text-purple-600 text-center"
            }, "Use Arrow Keys to move • Space/P to pause"),
            
            // Header
            React.createElement("div", {
                key: "header",
                className: "bg-gradient-to-r from-purple-100 to-purple-200 p-3"
            },
                React.createElement("div", {
                    className: "flex justify-between items-center"
                }, [
                    React.createElement("div", {
                        key: "scores",
                        className: "space-y-1"
                    }, [
                        React.createElement("div", {
                            key: "current-score",
                            className: "text-xl font-bold text-purple-800"
                        }, `Score: ${score}`),
                        React.createElement("div", {
                            key: "high-score",
                            className: "text-sm text-purple-600"
                        }, `High Score: ${highScore}`)
                    ]),
                    React.createElement("div", {
                        key: "controls",
                        className: "flex gap-2"
                    }, [
                        React.createElement("button", {
                            key: "pause",
                            onClick: () => setIsPaused(prev => !prev),
                            className: "px-3 py-1 rounded-lg bg-white text-purple-600 border-2 border-purple-300 hover:bg-purple-50 shadow transition-colors"
                        }, isPaused ? "Resume" : "Pause"),
                        React.createElement("button", {
                            key: "reset",
                            onClick: resetGame,
                            className: "px-3 py-1 rounded-lg bg-white text-purple-600 border-2 border-purple-300 hover:bg-purple-50 shadow transition-colors"
                        }, "New Game")
                    ])
                ])
            ),
            
            // Game Board
            React.createElement("div", {
                key: "board",
                className: "flex-1 relative p-4"
            }, [
                React.createElement("div", {
                    key: "grid",
                    className: "h-full grid gap-px bg-purple-100 p-2 rounded-lg",
                    style: {
                        gridTemplateColumns: `repeat(${gridSize.width}, minmax(0, 1fr))`,
                        aspectRatio: `${gridSize.width}/${gridSize.height}`
                    }
                }, [...Array(gridSize.height * gridSize.width)].map((_, index) => {
                    const x = index % gridSize.width;
                    const y = Math.floor(index / gridSize.width);
                    const isSnake = snake.some(segment => segment.x === x && segment.y === y);
                    const isFood = food.x === x && food.y === y;
                    const isHead = snake[0].x === x && snake[0].y === y;
                    
                    return React.createElement("div", {
                        key: `cell-${x}-${y}`,
                        className: `aspect-square rounded-sm ${
                            isHead ? 'bg-purple-800' :
                            isSnake ? 'bg-purple-600' :
                            isFood ? 'bg-red-500' :
                            'bg-white'
                        } transition-colors duration-100`
                    });
                })),
                
                // Game Over Overlay
                gameOver && React.createElement("div", {
                    key: "overlay",
                    className: "absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center"
                },
                    React.createElement("div", {
                        className: "bg-white p-6 rounded-xl text-center space-y-4"
                    }, [
                        React.createElement("h2", {
                            key: "title",
                            className: "text-2xl font-bold text-purple-800"
                        }, "Game Over!"),
                        React.createElement("p", {
                            key: "final-score",
                            className: "text-lg text-purple-600"
                        }, `Final Score: ${score}`),
                        score === highScore && React.createElement("p", {
                            key: "new-high-score",
                            className: "text-sm text-purple-500 font-bold"
                        }, "🎉 New High Score! 🎉"),
                        React.createElement("button", {
                            key: "play-again",
                            onClick: resetGame,
                            className: "px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
                        }, "Play Again")
                    ])
                )
            ])
        ])
    );
};

// Log successful load
console.log('Snake game script loaded successfully');