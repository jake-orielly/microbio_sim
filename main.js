var c = document.getElementById("myCanvas");
var ctx = c.getContext("2d");
var canvasWidth = 620;
var canvasHeight = 620;
var boardWidth = 62;
var boardHeight = 62;
var board,newBoard,scale,currNeighbors;
var intervalTime = 250;

var colorMap = ['','red']

function initSimulation() {
    initBoard();
    initCanvas();
    setInterval(()=>{
        refreshCanvas();
    },intervalTime);
    refreshCanvas();
}

function clearCanvas() {
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, c.width, c.height);
}

function refreshCanvas() {
    clearCanvas();
    newBoard = [];
    console.log(board)
    for (let i = 0; i < boardWidth; i++) {
        newBoard[i] = [];
        for (let j = 0; j < boardHeight; j++) {
            if (board[i][j] > 0) {
                ctx.fillStyle = colorMap[board[i][j]];
                ctx.fillRect(
                    c.width - ((boardWidth - i) * scale), 
                    c.height - ((boardHeight - j) * scale), 
                    scale, 
                    scale
                );
            }
            currNeighbors = neighbors(i,j);
            if (currNeighbors == 2 || currNeighbors == 3)
                newBoard[i][j] = 1;
            else
                newBoard[i][j] = 0;
        }
    }
    board = newBoard;
}

function neighbors(x,y) {
    let currX, currY;
    let neighbors = 0;
    for (let i = -1; i < 2; i++)
        for (let j = -1; j < 2; j++) {
            currX = x + i;
            currY = y + j;
            if (onBoard(currX,currY) && 
                (currX || currY) && 
                board[currX][currY] == 1)
                neighbors++;
        }
    return neighbors;
}

function onBoard(x,y) {
    return (x >= 0 && x < boardWidth &&
            y >= 0 && y < boardHeight);
}

function initBoard() {
    board = [];
    scale = canvasHeight/boardHeight;
    for (let i = 0; i < boardWidth; i++) {
        board[i] = [];
        for (let j = 0; j < boardHeight; j++)
            board[i][j] = 0;
    }
    board[30][30] = 1;
    board[31][31] = 1;
}

function initCanvas() {
    c.width = canvasWidth;
    c.height = canvasHeight;
    //ctx.fillStyle = "blue";
    //ctx.fillRect(0, 0, c.width, c.height);
}

initSimulation();