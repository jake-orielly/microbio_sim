var c = document.getElementById("myCanvas");
var ctx = c.getContext("2d");
var canvasWidth = 620;
var canvasHeight = 620;
var boardWidth = 62;
var boardHeight = 62;
var board,newBoard,scale;
var intervalTime = 100;

var colorMap = ['','red','blue']

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
    let curr;
    clearCanvas();
    newBoard = [];
    for (let i = 0; i < boardWidth; i++) {
        newBoard[i] = [];
        for (let j = 0; j < boardHeight; j++)
            newBoard[i][j] = 0;
    }

    for (let i = 0; i < boardWidth; i++) {
        for (let j = 0; j < boardHeight; j++) {
            if (board[i][j] != 0) {
                curr = board[i][j];
                if (curr.func)
                    curr.func();
                newBoard[curr.x][curr.y] = curr;
            }
        }
    }
    board = newBoard;

    for (let i = 0; i < boardWidth; i++) {
        for (let j = 0; j < boardHeight; j++) {
            if (board[i][j] != 0) {
                curr = board[i][j];
                ctx.fillStyle = colorMap[curr.val];
                ctx.fillRect(
                    c.width - ((boardWidth - i) * scale), 
                    c.height - ((boardHeight - j) * scale), 
                    scale, 
                    scale
                );
            }
        }
    }
}

/*function neighbors(x,y) {
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
}*/

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
    newEntity({x:2,y:2,val:1});
    newEntity({x:3,y:5,val:2});
    newEntity({x:3,y:5,val:2});
    newEntity({x:13,y:25,val:2});
    newEntity({x:20,y:10,val:2});
    newEntity({x:35,y:31,val:2});
}

function newEntity(obj) {
    let curr = {x:obj.x,y:obj.y,val:obj.val}
    let next;
    if (curr.val == 1) {
        curr.hunger = 0;
        curr.maxReproCooldown = 50;
        curr.reproCooldown = curr.maxReproCooldown;
        curr.func = function(){
            if (!this.goal)
                this.goal = 'food';
            if (!this.currentGoal)
                this.currentGoal = this.findClosest(this.goal);
            next = this.pathFind(this.currentGoal)
            this.move(next);
            if (this.x == this.currentGoal.x && this.y == this.currentGoal.y) {
                this.currentGoal = undefined;
                this.hunger = 0;
                this.reproduce();
            }
            this.hunger++;
            if (this.reproCooldown)
                this.reproCooldown--;
        }
        curr.findClosest = function(type) {
            type = 2;
            for (let searchAreaSize = 1; searchAreaSize < boardHeight/2-1; searchAreaSize++)
                for (let i = Math.max(this.x - searchAreaSize,0); 
                i < Math.min(this.x + searchAreaSize + 1, boardWidth); i++)
                        for (let j = Math.max(this.y - searchAreaSize,0); 
                        j < Math.min(this.y + searchAreaSize + 1, boardWidth); j++)
                            if (board[i][j].val == type)
                                return {x:i,y:j}; 
            return {x:this.x,y:this.y}
        }
        curr.pathFind = function(goal) {
            let xDiff = goal.x - this.x;
            let yDiff = goal.y - this.y;
            if (!(xDiff || yDiff))
                return {x:0,y:0}
            else if (Math.abs(xDiff) > Math.abs(yDiff))
                return {x:(xDiff/Math.abs(xDiff)) * 1, y:0};
            else
                return {x:0, y:(yDiff/Math.abs(yDiff)) * 1};
        }
        curr.move = function(obj) {
            if (board[this.x + obj.x][this.y + obj.y] != 2) {
                this.x += obj.x;
                this.y += obj.y;
                board[this.x][this.y] = 0;
            }
        }
        curr.reproduce = function() {
            newEntity({x:52,y:2,val:1});
        }
    }
    board[obj.x][obj.y] = curr;
}

function initCanvas() {
    c.width = canvasWidth;
    c.height = canvasHeight;
    //ctx.fillStyle = "blue";
    //ctx.fillRect(0, 0, c.width, c.height);
}

initSimulation();