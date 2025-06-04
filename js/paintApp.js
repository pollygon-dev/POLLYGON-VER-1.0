// Define initialization functions first
window.initPaintApp = window.initPaintApp || function(windowId) {
    console.log('Paint initialization requested for:', windowId);
    const container = document.querySelector(`#${windowId} #paint-root`);
    if (!container) {
        console.error('Paint container not found!');
        return;
    }
    const root = ReactDOM.createRoot(container);
    root.render(React.createElement(window.PaintComponent));
};

window.cleanupPaintApp = window.cleanupPaintApp || function(windowId) {
    const container = document.querySelector(`#${windowId} #paint-root`);
    if (container) {
        const root = ReactDOM.createRoot(container);
        root.unmount();
    }
};

// Define Paint Component with our nice UI
window.PaintComponent = function PaintComponent() {
    const canvasRef = React.useRef(null);
    const [isDrawing, setIsDrawing] = React.useState(false);
    const [color, setColor] = React.useState('#ff0000');
    const [brushSize, setBrushSize] = React.useState(5);
    const [opacity, setOpacity] = React.useState(1);
    const [tool, setTool] = React.useState('brush');
    const [startPos, setStartPos] = React.useState({ x: 0, y: 0 });
    const [history, setHistory] = React.useState([]);
    const [historyIndex, setHistoryIndex] = React.useState(-1);

    React.useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        saveState();
    }, []);

    const saveState = () => {
        const canvas = canvasRef.current;
        const imageData = canvas.toDataURL();
        setHistory(prev => [...prev.slice(0, historyIndex + 1), imageData]);
        setHistoryIndex(prev => prev + 1);
    };

    const floodFill = (startX, startY) => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const pixels = imageData.data;
        
        const startPos = (startY * canvas.width + startX) * 4;
        const startR = pixels[startPos];
        const startG = pixels[startPos + 1];
        const startB = pixels[startPos + 2];
        const startA = pixels[startPos + 3];
        
        const tempCanvas = document.createElement('canvas');
        const tempCtx = tempCanvas.getContext('2d');
        tempCtx.fillStyle = color;
        tempCtx.fillRect(0, 0, 1, 1);
        const fillRGBA = tempCtx.getImageData(0, 0, 1, 1).data;
        
        const tolerance = 30;
        
        const matchesStart = (r, g, b, a) => {
            return Math.abs(r - startR) <= tolerance &&
                   Math.abs(g - startG) <= tolerance &&
                   Math.abs(b - startB) <= tolerance &&
                   Math.abs(a - startA) <= tolerance;
        };
        
        const stack = [[startX, startY]];
        const visited = new Set();
        
        while (stack.length) {
            const [x, y] = stack.pop();
            const pos = (y * canvas.width + x) * 4;
            
            const key = `${x},${y}`;
            if (visited.has(key)) continue;
            if (!matchesStart(pixels[pos], pixels[pos + 1], pixels[pos + 2], pixels[pos + 3])) continue;
            
            pixels[pos] = fillRGBA[0];
            pixels[pos + 1] = fillRGBA[1];
            pixels[pos + 2] = fillRGBA[2];
            pixels[pos + 3] = fillRGBA[3];
            
            visited.add(key);
            
            if (x > 0) stack.push([x - 1, y]);
            if (x < canvas.width - 1) stack.push([x + 1, y]);
            if (y > 0) stack.push([x, y - 1]);
            if (y < canvas.height - 1) stack.push([x, y + 1]);
        }
        
        ctx.putImageData(imageData, 0, 0);
        saveState();
    };

    const startDrawing = (e) => {
        const canvas = canvasRef.current;
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        if (tool === 'fill') {
            floodFill(Math.floor(x), Math.floor(y));
            return;
        }

        setStartPos({ x, y });
        setIsDrawing(true);

        if (tool === 'brush' || tool === 'eraser') {
            const ctx = canvas.getContext('2d');
            ctx.beginPath();
            ctx.moveTo(x, y);
        }
    };

    const draw = (e) => {
        if (!isDrawing || tool === 'fill') return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        if (tool === 'brush' || tool === 'eraser') {
            ctx.globalAlpha = opacity;
            ctx.lineTo(x, y);
            ctx.strokeStyle = tool === 'eraser' ? '#ffffff' : color;
            ctx.lineWidth = brushSize;
            ctx.lineCap = 'round';
            ctx.stroke();
        } else {
            // For shapes, we need to redraw from the saved state each time
            const img = new Image();
            img.src = history[historyIndex];
            img.onload = () => {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                ctx.drawImage(img, 0, 0);
                
                // Now draw the current shape
                ctx.beginPath();
                ctx.strokeStyle = color;
                ctx.lineWidth = brushSize;
                ctx.globalAlpha = opacity;

                switch (tool) {
                    case 'rectangle':
                        ctx.strokeRect(startPos.x, startPos.y, x - startPos.x, y - startPos.y);
                        break;
                    case 'circle':
                        const radius = Math.sqrt(Math.pow(x - startPos.x, 2) + Math.pow(y - startPos.y, 2));
                        ctx.beginPath();
                        ctx.arc(startPos.x, startPos.y, radius, 0, 2 * Math.PI);
                        ctx.stroke();
                        break;
                    case 'line':
                        ctx.beginPath();
                        ctx.moveTo(startPos.x, startPos.y);
                        ctx.lineTo(x, y);
                        ctx.stroke();
                        break;
                }
            };
        }
    };

    const stopDrawing = () => {
        if (isDrawing) {
            setIsDrawing(false);
            saveState();
        }
    };

    const clearCanvas = () => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = '#ffffff';
        ctx.globalAlpha = 1;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        saveState();
    };

    const undo = () => {
        if (historyIndex > 0) {
            setHistoryIndex(prev => prev - 1);
            loadState(historyIndex - 1);
        }
    };

    const redo = () => {
        if (historyIndex < history.length - 1) {
            setHistoryIndex(prev => prev + 1);
            loadState(historyIndex + 1);
        }
    };

    const loadState = (index) => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        const img = new Image();
        img.src = history[index];
        img.onload = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(img, 0, 0);
        };
    };

    const downloadCanvas = () => {
        const canvas = canvasRef.current;
        const link = document.createElement('a');
        link.download = 'painting.png';
        link.href = canvas.toDataURL();
        link.click();
    };

    const tools = [
        { id: 'brush', icon: 'paint-brush', label: 'Brush' },
        { id: 'fill', icon: 'fill-drip', label: 'Fill' },
        { id: 'eraser', icon: 'eraser', label: 'Eraser' },
        { id: 'rectangle', icon: 'square', label: 'Square' },
        { id: 'circle', icon: 'circle', label: 'Circle' },
        { id: 'line', icon: 'minus', label: 'Line' }
    ];

    // Main layout using React.createElement
    return React.createElement("div", {
        className: "w-full h-full bg-gradient-to-b from-pink-300 to-pink-400 p-4"
    }, 
        React.createElement("div", {
            className: "bg-white rounded-[2rem] border-4 border-pink-200 overflow-hidden shadow-lg"
        }, [
            // Header with title
            React.createElement("div", {
                key: "header",
                className: "bg-gradient-to-r from-pink-100 to-pink-200 p-3"
            }, 
                React.createElement("div", {
                    className: "flex items-center gap-2 text-2xl text-pink-600 font-bold mb-6",
                    style: { textShadow: '2px 2px 0px rgba(255,255,255,0.5)' }
                }, [
                    React.createElement("i", {
                        key: "palette-icon",
                        className: "fas fa-palette h-8 w-8"
                    }),
                    "Polly Paint ⭐"
                ])
            ),

            // Main content area with sidebar and canvas
            React.createElement("div", {
                key: "content",
                className: "flex flex-1"
            }, [
                // Left sidebar with tools
                React.createElement("div", {
                    key: "sidebar",
                    className: "w-44 bg-pink-50 p-3 border-r-2 border-pink-200"
                }, [
                    // Tools grid
                    React.createElement("div", {
                        key: "tools",
                        className: "bg-white p-3 rounded-xl border-2 border-pink-200 shadow-inner"
                    }, 
                        React.createElement("div", {
                            className: "grid grid-cols-2 gap-2"
                        }, tools.map(({ id, icon, label }) =>
                            React.createElement("button", {
                                key: id,
                                onClick: () => setTool(id),
                                className: `p-2 rounded-lg flex flex-col items-center gap-1 border-2 transition-all text-sm
                                    ${tool === id 
                                        ? 'bg-pink-400 text-white border-pink-500 shadow-inner' 
                                        : 'bg-white text-pink-500 border-pink-200 hover:bg-pink-100 shadow hover:-translate-y-0.5'
                                    }`
                            }, [
                                React.createElement("i", {
                                    key: `${id}-icon`,
                                    className: `fas fa-${icon} text-lg`
                                }),
                                React.createElement("span", {
                                    key: `${id}-label`,
                                    className: "font-bold text-xs"
                                }, label)
                            ])
                        ))
                    ),

                    // Color and size controls
                    React.createElement("div", {
                        key: "controls",
                        className: "bg-white p-3 rounded-xl border-2 border-pink-200 shadow-inner space-y-3 mt-4"
                    }, [
                        React.createElement("div", {
                            key: "color-control",
                            className: "flex items-center gap-2"
                        }, [
                            React.createElement("span", {
                                className: "text-pink-600 text-sm font-bold"
                            }, "Color:"),
                            React.createElement("input", {
                                type: "color",
                                value: color,
                                onChange: (e) => setColor(e.target.value),
                                className: "w-10 h-10 rounded-lg"
                            })
                        ]),
                        React.createElement("div", {
                            key: "size-control",
                            className: "space-y-1"
                        }, [
                            React.createElement("span", {
                                className: "text-pink-600 text-sm font-bold"
                            }, `Size: ${brushSize}px`),
                            React.createElement("input", {
                                type: "range",
                                min: "1",
                                max: "50",
                                value: brushSize,
                                onChange: (e) => setBrushSize(Number(e.target.value)),
                                className: "w-full"
                            })
                        ])
                    ])
                ]),

                // Main canvas area
                React.createElement("div", {
                    key: "main",
                    className: "flex-1 p-4 bg-pink-50"
                }, [
                    // Action buttons
                    React.createElement("div", {
                        key: "actions",
                        className: "flex gap-2 mb-4"
                    }, [
                        React.createElement("button", {
                            key: "undo",
                            onClick: undo,
                            disabled: historyIndex <= 0,
                            className: "p-2 rounded-lg bg-white text-pink-500 border-2 border-pink-200 hover:bg-pink-100 shadow hover:-translate-y-0.5 transition-all flex items-center gap-1 text-sm font-bold disabled:opacity-50"
                        }, [
                            React.createElement("i", { 
                                key: "undo-icon",
                                className: "fas fa-undo" 
                            }),
                            "Undo"
                        ]),
                        React.createElement("button", {
                            key: "redo",
                            onClick: redo,
                            disabled: historyIndex >= history.length - 1,
                            className: "p-2 rounded-lg bg-white text-pink-500 border-2 border-pink-200 hover:bg-pink-100 shadow hover:-translate-y-0.5 transition-all flex items-center gap-1 text-sm font-bold disabled:opacity-50"
                        }, [
                            React.createElement("i", { 
                                key: "redo-icon",
                                className: "fas fa-redo" 
                            }),
                            "Redo"
                        ]),
                        React.createElement("button", {
                            key: "clear",
                            onClick: clearCanvas,
                            className: "p-2 rounded-lg bg-white text-pink-500 border-2 border-pink-200 hover:bg-pink-100 shadow hover:-translate-y-0.5 transition-all flex items-center gap-1 text-sm font-bold"
                        }, [
                            React.createElement("i", { 
                                key: "clear-icon",
                                className: "fas fa-trash" 
                            }),
                            "Clear"
                        ]),
                        React.createElement("button", {
                            key: "save",
                            onClick: downloadCanvas,
                            className: "p-2 rounded-lg bg-white text-pink-500 border-2 border-pink-200 hover:bg-pink-100 shadow hover:-translate-y-0.5 transition-all flex items-center gap-1 text-sm font-bold"
                        }, [
                            React.createElement("i", { 
                                key: "save-icon",
                                className: "fas fa-download" 
                            }),
                            "Save"
                        ])
                    ]),

                    // Canvas
                    React.createElement("div", {
                        key: "canvas-container",
                        className: "rounded-2xl overflow-hidden shadow-lg border-4 border-pink-200"
                    }, 
                        React.createElement("canvas", {
                            ref: canvasRef,
                            width: 1165,
                            height: 890,
                            className: "bg-white cursor-crosshair touch-none",
                            onMouseDown: startDrawing,
                            onMouseMove: draw,
                            onMouseUp: stopDrawing,
                            onMouseOut: stopDrawing
                        })
                    )
                ])
            ])
        ])
    );
};

// Log successful load
console.log('Paint app script loaded successfully');