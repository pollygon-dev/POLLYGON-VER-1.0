// TetrisGame.js
"use strict";

// Global game state
window.gameActive = false;

// Tetromino shapes and their rotations
const TETROMINOES = {
    I: {
        shape: [
            [0, 0, 0, 0],
            [1, 1, 1, 1],
            [0, 0, 0, 0],
            [0, 0, 0, 0]
        ],
        color: 'bg-pink-400'  // Using confirmed working pink
    },
    J: {
        shape: [
            [1, 0, 0],
            [1, 1, 1],
            [0, 0, 0]
        ],
        color: 'bg-pink-600'  // Darker pink
    },
    L: {
        shape: [
            [0, 0, 1],
            [1, 1, 1],
            [0, 0, 0]
        ],
        color: 'bg-red-400'  // Light red
    },
    O: {
        shape: [
            [1, 1],
            [1, 1]
        ],
        color: 'bg-red-500'  // Using confirmed working red
    },
    S: {
        shape: [
            [0, 1, 1],
            [1, 1, 0],
            [0, 0, 0]
        ],
        color: 'bg-pink-500'  // Medium pink
    },
    T: {
        shape: [
            [0, 1, 0],
            [1, 1, 1],
            [0, 0, 0]
        ],
        color: 'bg-red-600'  // Dark red
    },
    Z: {
        shape: [
            [1, 1, 0],
            [0, 1, 1],
            [0, 0, 0]
        ],
        color: 'bg-pink-700'  // Very dark pink
    }
};

// Global keyboard handler
window.handleTetrisControls = function(e) {
    if (!window.gameActive) return;
    
    // Prevent default behavior for arrow keys
    if (e.key.startsWith('Arrow') || e.key === ' ') {
        e.preventDefault();
    }
    
    // Dispatch custom event that React component will listen to
    const event = new CustomEvent('tetris-control', { detail: { key: e.key } });
    window.dispatchEvent(event);
};

// Define initialization functions
window.initTetrisGame = window.initTetrisGame || function(windowId) {
    console.log('Tetris game initialization requested for:', windowId);
    const container = document.querySelector(`#${windowId} #tetris-root`);
    if (!container) {
        console.error('Tetris game container not found!');
        return;
    }
    
    window.gameActive = true;
    window.addEventListener('keydown', window.handleTetrisControls);
    
    const root = ReactDOM.createRoot(container);
    root.render(React.createElement(window.TetrisGame));
};

window.cleanupTetrisGame = window.cleanupTetrisGame || function(windowId) {
    window.gameActive = false;
    window.removeEventListener('keydown', window.handleTetrisControls);
    
    const container = document.querySelector(`#${windowId} #tetris-root`);
    if (container) {
        const root = ReactDOM.createRoot(container);
        root.unmount();
    }
};

// Define Tetris Game Component
window.TetrisGame = function TetrisGame() {
    const [board, setBoard] = React.useState(createEmptyBoard());
    const [currentPiece, setCurrentPiece] = React.useState(null);
    const [currentPosition, setCurrentPosition] = React.useState({ x: 0, y: 0 });
    const [gameOver, setGameOver] = React.useState(false);
    const [score, setScore] = React.useState(0);
    const [level, setLevel] = React.useState(1);
    const [isPaused, setIsPaused] = React.useState(false);
    const [highScore, setHighScore] = React.useState(() => {
        const saved = localStorage.getItem('tetrisHighScore');
        return saved ? parseInt(saved) : 0;
    });
    const [nextPiece, setNextPiece] = React.useState(null);
    
    const gameLoopRef = React.useRef();
    const lastMoveDownRef = React.useRef(0);
    const lastMoveRef = React.useRef(0);  // For rate limiting horizontal moves

    function createEmptyBoard() {
        return Array(20).fill().map(() => Array(10).fill(null));
    }

    function getRandomPiece() {
        const pieces = Object.keys(TETROMINOES);
        const randomKey = pieces[Math.floor(Math.random() * pieces.length)];
        const piece = TETROMINOES[randomKey];
        console.log('Generated piece:', randomKey, piece.color); // Debug log
        return {
            shape: [...piece.shape], // Create a new array to avoid reference issues
            color: piece.color
        };
    }

    const rotatePiece = (piece) => {
        // Create a new rotated shape
        const rotated = piece.shape[0].map((_, i) => 
            piece.shape.map(row => row[i]).reverse()
        );
        
        // Try the rotation
        const tryRotation = { ...piece, shape: rotated };
        
        // Wall kicks - try to adjust position if rotation would cause collision
        const kicks = [
            { x: 0, y: 0 },   // Normal position
            { x: -1, y: 0 },  // Try left
            { x: 1, y: 0 },   // Try right
            { x: 0, y: -1 },  // Try up
            { x: -2, y: 0 },  // Try far left (for I piece)
            { x: 2, y: 0 },   // Try far right (for I piece)
        ];

        for (const kick of kicks) {
            const testPos = {
                x: currentPosition.x + kick.x,
                y: currentPosition.y + kick.y
            };
            if (isValidMove(tryRotation, testPos)) {
                setCurrentPosition(testPos);
                return tryRotation;
            }
        }
        
        return piece; // If no rotation works, return original piece
    };

    const isValidMove = (piece, position) => {
        return piece.shape.every((row, dy) =>
            row.every((cell, dx) => {
                if (!cell) return true;
                const newX = position.x + dx;
                const newY = position.y + dy;
                return (
                    newX >= 0 &&
                    newX < 10 &&
                    newY < 20 &&
                    newY >= 0 &&
                    !board[newY][newX]
                );
            })
        );
    };

    const mergePieceWithBoard = () => {
        const newBoard = board.map(row => [...row]);
        console.log('Current piece color:', currentPiece?.color); // Debug log
        currentPiece.shape.forEach((row, dy) => {
            row.forEach((cell, dx) => {
                if (cell) {
                    const newY = currentPosition.y + dy;
                    const newX = currentPosition.x + dx;
                    if (newY >= 0 && newY < 20 && newX >= 0 && newX < 10) {
                        newBoard[newY][newX] = currentPiece.color;
                        console.log(`Setting color at ${newX},${newY} to ${currentPiece.color}`); // Debug log
                    }
                }
            });
        });
        return newBoard;
    };

    const clearLines = (boardToClear) => {
        let linesCleared = 0;
        const newBoard = boardToClear.filter(row => {
            if (row.every(cell => cell)) {
                linesCleared++;
                return false;
            }
            return true;
        });
        
        while (newBoard.length < 20) {
            newBoard.unshift(Array(10).fill(null));
        }
        
        if (linesCleared > 0) {
            const points = [0, 100, 300, 500, 800][linesCleared] * level;
            setScore(prev => {
                const newScore = prev + points;
                if (newScore > highScore) {
                    setHighScore(newScore);
                    localStorage.setItem('tetrisHighScore', newScore.toString());
                }
                return newScore;
            });
            
            // Update level every 10 lines
            const totalLines = Math.floor(score / 100) + linesCleared;
            const newLevel = Math.floor(totalLines / 10) + 1;
            setLevel(newLevel);
        }
        
        return newBoard;
    };

    const moveDown = React.useCallback(() => {
        if (gameOver || isPaused) return false;

        const newPosition = { ...currentPosition, y: currentPosition.y + 1 };
        
        if (currentPiece && isValidMove(currentPiece, newPosition)) {
            setCurrentPosition(newPosition);
            return true;
        } else if (currentPiece) {
            // Lock the piece
            const newBoard = mergePieceWithBoard();
            const clearedBoard = clearLines(newBoard);
            setBoard(clearedBoard);
            
            // Spawn new piece
            if (nextPiece && !isValidMove(nextPiece, { x: 3, y: 0 })) {
                setGameOver(true);
                window.gameActive = false;
            } else {
                setCurrentPiece(nextPiece);
                setNextPiece(getRandomPiece());
                setCurrentPosition({ x: 3, y: 0 });
            }
            return false;
        }
        return false;
    }, [currentPiece, currentPosition, board, gameOver, isPaused, nextPiece]);

    React.useEffect(() => {
        if (!currentPiece) {
            setCurrentPiece(getRandomPiece());
            setNextPiece(getRandomPiece());
            setCurrentPosition({ x: 3, y: 0 });
        }
        
        if (!gameOver && !isPaused) {
            const speed = Math.max(100, 800 - (level - 1) * 50); // Adjusted speed formula
            
            const gameLoop = () => {
                const now = Date.now();
                if (now - lastMoveDownRef.current > speed) {
                    moveDown();
                    lastMoveDownRef.current = now;
                }
                gameLoopRef.current = requestAnimationFrame(gameLoop);
            };
            
            gameLoopRef.current = requestAnimationFrame(gameLoop);
        }
        
        return () => {
            if (gameLoopRef.current) {
                cancelAnimationFrame(gameLoopRef.current);
            }
        };
    }, [currentPiece, gameOver, isPaused, level, moveDown]);

    React.useEffect(() => {
        const handleControl = (e) => {
            if (gameOver || isPaused) return;
            
            const now = Date.now();
            const moveDelay = 50; // Minimum time between moves

            switch (e.detail.key) {
                case 'ArrowLeft': {
                    if (now - lastMoveRef.current > moveDelay) {
                        const newPos = { ...currentPosition, x: currentPosition.x - 1 };
                        if (isValidMove(currentPiece, newPos)) {
                            setCurrentPosition(newPos);
                            lastMoveRef.current = now;
                        }
                    }
                    break;
                }
                case 'ArrowRight': {
                    if (now - lastMoveRef.current > moveDelay) {
                        const newPos = { ...currentPosition, x: currentPosition.x + 1 };
                        if (isValidMove(currentPiece, newPos)) {
                            setCurrentPosition(newPos);
                            lastMoveRef.current = now;
                        }
                    }
                    break;
                }
                case 'ArrowDown': {
                    moveDown();
                    lastMoveDownRef.current = now;
                    break;
                }
                case 'ArrowUp': {
                    if (now - lastMoveRef.current > moveDelay) {
                        const rotated = rotatePiece(currentPiece);
                        if (rotated !== currentPiece) {
                            setCurrentPiece(rotated);
                            lastMoveRef.current = now;
                        }
                    }
                    break;
                }
                case ' ': {
                    if (currentPiece && !gameOver && !isPaused) {
                        let newPos = { ...currentPosition };
                        // Find lowest valid position
                        while (isValidMove(currentPiece, { ...newPos, y: newPos.y + 1 })) {
                            newPos.y++;
                        }
                        
                        // Lock piece at final position immediately
                        setCurrentPosition(newPos);
                        const newBoard = board.map(row => [...row]);
                        currentPiece.shape.forEach((row, dy) => {
                            row.forEach((cell, dx) => {
                                if (cell) {
                                    const y = newPos.y + dy;
                                    const x = newPos.x + dx;
                                    if (y >= 0) {
                                        newBoard[y][x] = currentPiece.color;
                                    }
                                }
                            });
                        });
                        
                        // Clear lines and spawn new piece
                        const clearedBoard = clearLines(newBoard);
                        setBoard(clearedBoard);
                        
                        // Spawn new piece
                        if (nextPiece && !isValidMove(nextPiece, { x: 3, y: 0 })) {
                            setGameOver(true);
                            window.gameActive = false;
                        } else {
                            setCurrentPiece(nextPiece);
                            setNextPiece(getRandomPiece());
                            setCurrentPosition({ x: 3, y: 0 });
                        }
                        
                        lastMoveDownRef.current = Date.now();
                    }
                    break;
                }
                case 'p':
                case 'P': {
                    setIsPaused(prev => !prev);
                    break;
                }
            }
        };

        window.addEventListener('tetris-control', handleControl);
        return () => window.removeEventListener('tetris-control', handleControl);
    }, [currentPiece, currentPosition, gameOver, isPaused, moveDown]);

    const resetGame = () => {
        setBoard(createEmptyBoard());
        setCurrentPiece(getRandomPiece());
        setNextPiece(getRandomPiece());
        setCurrentPosition({ x: 3, y: 0 });
        setGameOver(false);
        setScore(0);
        setLevel(1);
        setIsPaused(false);
        window.gameActive = true;
        lastMoveDownRef.current = 0;
        lastMoveRef.current = 0;
    };

    // Render game board with current piece
    const renderBoard = () => {
        const displayBoard = board.map(row => [...row]);
        
        if (currentPiece) {
            currentPiece.shape.forEach((row, dy) => {
                row.forEach((cell, dx) => {
                    if (cell) {
                        const y = currentPosition.y + dy;
                        const x = currentPosition.x + dx;
                        if (y >= 0 && y < 20 && x >= 0 && x < 10) {
                            displayBoard[y][x] = currentPiece.color;
                        }
                    }
                });
            });

            // Show ghost piece
            let ghostY = currentPosition.y;
            while (ghostY < 20 && isValidMove(currentPiece, { x: currentPosition.x, y: ghostY + 1 })) {
                ghostY++;
            }
            if (ghostY !== currentPosition.y) {
                currentPiece.shape.forEach((row, dy) => {
                    row.forEach((cell, dx) => {
                        if (cell) {
                            const y = ghostY + dy;
                            const x = currentPosition.x + dx;
                            if (y >= 0 && y < 20 && x >= 0 && x < 10) {
                                displayBoard[y][x] = 'bg-gray-200';
                            }
                        }
                    });
                });
            }
        }

        return displayBoard;
    };

    // Render next piece preview
    const renderNextPiece = () => {
        if (!nextPiece) return null;
        
        return React.createElement("div", {
            className: "grid gap-px bg-gray-100 p-2",
            style: {
                gridTemplateColumns: `repeat(${nextPiece.shape[0].length}, minmax(0, 1fr))`
            }
        }, nextPiece.shape.flat().map((cell, i) => 
            React.createElement("div", {
                key: `preview-${i}`,
                className: `aspect-square ${cell ? nextPiece.color : 'bg-white'}`
            })
        ));
    };

    return React.createElement("div", {
        className: "w-full h-full bg-gradient-to-b from-pink-300 to-pink-400 p-4"
    },
        React.createElement("div", {
            className: "bg-white rounded-xl border-4 border-pink-200 overflow-hidden shadow-lg h-full flex flex-col"
        }, [
            // Instructions
            React.createElement("div", {
                key: "instructions",
                className: "bg-pink-50 px-3 py-1 text-xs text-pink-600 text-center"
            }, "↑ Rotate • ← → Move • ↓ Soft Drop • Space Hard Drop • P to Pause"),
            
            // Game Header
            React.createElement("div", {
                key: "header",
                className: "bg-gradient-to-r from-pink-100 to-pink-200 p-3"
            },
                React.createElement("div", {
                    className: "flex justify-between items-center"
                }, [
                    React.createElement("div", {
                        key: "info",
                        className: "space-y-1"
                    }, [
                        React.createElement("div", {
                            className: "text-xl font-bold text-pink-800"
                        }, `Score: ${score}`),
                        React.createElement("div", {
                            className: "text-sm text-pink-600"
                        }, `Level: ${level}`),
                        React.createElement("div", {
                            className: "text-sm text-pink-600"
                        }, `High Score: ${highScore}`)
                    ]),
                    React.createElement("div", {
                        key: "controls",
                        className: "flex gap-2"
                    }, [
                        React.createElement("button", {
                            onClick: () => setIsPaused(p => !p),
                            className: "px-3 py-1 rounded-lg bg-white text-pink-600 border-2 border-pink-300 hover:bg-pink-50 shadow transition-colors"
                        }, isPaused ? "Resume" : "Pause"),
                        React.createElement("button", {
                            onClick: resetGame,
                            className: "px-3 py-1 rounded-lg bg-white text-pink-600 border-2 border-pink-300 hover:bg-pink-50 shadow transition-colors"
                        }, "New Game")
                    ])
                ])
            ),
            
            // Game Area
            React.createElement("div", {
                key: "game-area",
                className: "flex-1 relative p-4 flex gap-4"
            }, [
                // Main Board
                React.createElement("div", {
                    key: "board",
                    className: "flex-1 grid gap-px bg-gray-100 p-2 rounded-lg",
                    style: {
                        gridTemplateColumns: "repeat(10, minmax(0, 1fr))"
                    }
                }, renderBoard().flat().map((cell, i) => 
                    React.createElement("div", {
                        key: `cell-${i}`,
                        className: `aspect-square ${cell || 'bg-white'} transition-colors duration-100`
                    })
                )),

                // Side Panel
                React.createElement("div", {
                    key: "side-panel",
                    className: "w-32 space-y-4"
                }, [
                    React.createElement("div", {
                        key: "next-piece",
                        className: "bg-white rounded-lg p-2 shadow-inner border-2 border-pink-200"
                    }, [
                        React.createElement("div", {
                            key: "next-label",
                            className: "text-sm font-bold text-pink-600 mb-2 text-center"
                        }, "Next Piece"),
                        renderNextPiece()
                    ])
                ])
            ]),
            
            // Pause Overlay
            isPaused && React.createElement("div", {
                key: "pause-overlay",
                className: "absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center"
            },
                React.createElement("div", {
                    className: "bg-white p-6 rounded-xl text-center"
                }, [
                    React.createElement("h2", {
                        key: "pause-title",
                        className: "text-2xl font-bold text-pink-800 mb-4"
                    }, "Paused"),
                    React.createElement("button", {
                        key: "resume-button",
                        onClick: () => setIsPaused(false),
                        className: "px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors"
                    }, "Resume Game")
                ])
            ),
            
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
                        className: "text-2xl font-bold text-pink-800"
                    }, "Game Over!"),
                    React.createElement("p", {
                        key: "final-score",
                        className: "text-lg text-pink-600"
                    }, `Final Score: ${score}`),
                    score === highScore && React.createElement("p", {
                        key: "new-high-score",
                        className: "text-sm text-pink-500 font-bold"
                    }, "🎉 New High Score! 🎉"),
                    React.createElement("button", {
                        key: "play-again",
                        onClick: resetGame,
                        className: "px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors"
                    }, "Play Again")
                ])
            )
        ])
    );
};

// Log successful load
console.log('Tetris game script loaded successfully');