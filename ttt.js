let canvas = document.getElementById('ttt'),
    ctx = canvas.getContext('2d'),
    msg = document.getElementById('message'),
    rst = document.getElementById('reset'),
    cellSize = 100,
    map = [
        0, 0, 0,
        0, 0, 0,
        0, 0, 0,
    ],
    winPatterns = [
        0b111000000, 0b000111000, 0b000000111, // Rows
        0b100100100, 0b010010010, 0b001001001, // Columns
        0b100010001, 0b001010100, // Diagonals
    ],
    BLANK = 0, X = 1, O = -1,
    mouse = {
        x: -1,
        y: -1,
    },
    currentPlayer = X,
    gameOver = false,
    winCells = [],
    moves = 0;


canvas.width = canvas.height = 3 * cellSize;

rst.addEventListener('click', function (e) {
    e.preventDefault();
    map = [
        0, 0, 0,
        0, 0, 0,
        0, 0, 0,
    ]
    gameOver = false;
    msg.textContent = "X's turn."
    winCells = [];
    currentPlayer = X;
    moves = 0;

})

canvas.addEventListener('mouseout', function () {
    mouse.x = mouse.y = -1;
});

canvas.addEventListener('mousemove', function (e) {
    let x = e.pageX - canvas.offsetLeft,
        y = e.pageY - canvas.offsetTop;

    mouse.x = x;
    mouse.y = y;
});

canvas.addEventListener('click', function (e) {
    play(getCellByCoords(mouse.x, mouse.y));
});

displayTurn();

function displayTurn () {
    msg.textContent = ((currentPlayer == X)? 'X': 'O') + '\'s turn.';
}

function play (cell) {
    if (gameOver) return;
    if (map[cell] != BLANK) {
        msg.textContent = 'Position taken.';
        return;
    }

    map[cell] = currentPlayer;
    moves++;
    let winCheck = checkWin(currentPlayer);
    winChecker(winCheck);
    if (gameOver) return;

    displayTurn();
    currentPlayer *= -1;
    compMove();
    winCheck = checkWin(currentPlayer);
    winChecker(winCheck);
    if (gameOver) return;
    currentPlayer *= -1;
    displayTurn();
}

function winChecker (winCheck) {
    if (winCheck != 0) {
        gameOver = true;
        msg.textContent = ((currentPlayer == X)? 'X': 'O') + ' wins!';

        let bit = 1;
        for (let i = map.length - 1; i >= 0; i--) {
            if ((bit & winCheck) === bit) {
                winCells.push(i);
            }
            bit <<= 1;
        }
        return;
    } else if (map.indexOf(BLANK) == -1) {
        gameOver = true;
        msg.textContent = 'Tie!';
        return;
    }
}
function checkWin (player) {
    let playerMapBitMask = 0;
    for (let i = 0; i < map.length; i++) {
        playerMapBitMask <<= 1;
        if (map[i] == player)
            playerMapBitMask += 1;
    }

    for (let i = 0; i < winPatterns.length; i++) {
        if ((playerMapBitMask & winPatterns[i]) == winPatterns[i]) {
            return winPatterns[i];
        }
    }

    return 0;
}

function draw () {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawMouseHighlight();
    drawWinHighlight();
    drawBoard();
    fillBoard();

    function drawMouseHighlight () {
        if (gameOver) return;

        let cellNum = getCellByCoords(mouse.x, mouse.y),
            cellCoords = getCellCoords(cellNum);

        if (map[cellNum] == BLANK) {
            ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
            ctx.fillRect(cellCoords.x, cellCoords.y, cellSize, cellSize);

            ctx.save();

            ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
            ctx.translate(cellCoords.x + cellSize / 2, cellCoords.y + cellSize / 2);

            if (currentPlayer == X)
                drawX();
            else
                drawO();

            ctx.restore();
        } else {
            ctx.fillStyle = 'rgba(255, 0, 0, 0.3)';
            ctx.fillRect(cellCoords.x, cellCoords.y, cellSize, cellSize);
        }
    }

    function drawWinHighlight () {
        if (gameOver) {
            ctx.fillStyle = 'rgba(0, 255, 0, 0.3)';
            winCells.forEach(function (i) {
                let cellCoords = getCellCoords(i);
                ctx.fillRect(cellCoords.x, cellCoords.y, cellSize, cellSize);
            });
        }
    }

    function drawBoard () {
        ctx.strokeStyle = 'white';
        ctx.lineWidth = 10;

        ctx.beginPath();
        ctx.moveTo(cellSize, 0);
        ctx.lineTo(cellSize, canvas.height);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(cellSize * 2, 0);
        ctx.lineTo(cellSize * 2, canvas.height);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(0, cellSize);
        ctx.lineTo(canvas.width, cellSize);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(0, cellSize * 2);
        ctx.lineTo(canvas.width, cellSize * 2);
        ctx.stroke();
    }

    function fillBoard () {
        ctx.strokeStyle = 'white';
        ctx.lineWidth = 5;
        for (let i = 0; i < map.length; i++) {
            let coords = getCellCoords(i);

            ctx.save();
            ctx.translate(coords.x + cellSize / 2, coords.y + cellSize / 2);
            if (map[i] == X) {
                drawX();
            } else if (map[i] == O) {
                drawO();
            }
            ctx.restore();
        }
    }

    function drawX () {
        ctx.beginPath();
        ctx.moveTo(-cellSize / 3, -cellSize / 3);
        ctx.lineTo(cellSize / 3, cellSize / 3);
        ctx.moveTo(cellSize / 3, -cellSize / 3);
        ctx.lineTo(-cellSize / 3, cellSize / 3);
        ctx.stroke();
    }

    function drawO () {
        ctx.beginPath();
        ctx.arc(0, 0, cellSize / 3, 0, Math.PI * 2);
        ctx.stroke();
    }

    requestAnimationFrame(draw);
}

function getCellCoords (cell) {
    let x = (cell % 3) * cellSize,
        y = Math.floor(cell / 3) * cellSize;
    
    return {
        'x': x,
        'y': y,
    };
}

function getCellByCoords (x, y) {
    return (Math.floor(x / cellSize) % 3) + Math.floor(y / cellSize) * 3;
}


function compMove() {
    let possibleMoves = [],
    cloneMap = [];
    for (let i = 0; i <= map.length; i++)
    {
        if (map[i] == 0){
            possibleMoves.push(i);
        }
    }
    console.log(possibleMoves);
    //win
    for (let j = 0; j <= possibleMoves.length - 1; j++)
    {   
        cloneMap = [];
        cloneMap = [...map];
        cloneMap[possibleMoves[j]] = currentPlayer;

        if(protoWin(currentPlayer))
        {
            map[possibleMoves[j]] = currentPlayer;
            return;
        }
    }
    //lose
    for (let k = 0; k <= possibleMoves.length - 1; k++)
    {
        cloneMap = [];
        cloneMap = [...map];
        cloneMap[possibleMoves[k]] = currentPlayer * -1;
        if(protoWin(currentPlayer * -1))
        {
            map[possibleMoves[k]] = currentPlayer;
            return;
        }
    }
    //center
    if(possibleMoves.includes(4)){
        map[4] = currentPlayer;
        return;       
    }
    if((map[0] == 1 && map[8] == 1) || (map[2] == 1 && map[6] == 1))
    {
        for (let m = 0; m <= possibleMoves.length -1; m++)
        {
            if(possibleMoves[m] == 1 || possibleMoves[m] == 3 || possibleMoves[m] == 5 || possibleMoves[m] == 7){
                console.log(`out`);
                map[possibleMoves[m]] = currentPlayer;
                return;
            }
        }
    }

    if(moves == 2)
    {
        if ((map[0] == 1) && (map[7]) == 1)
        {
            map[6] = currentPlayer;
            return;  
        }
        else if ((map[2] == 1) && (map[7]) == 1)
        {
            map[8] = currentPlayer;
            return;
        }
        else if ((map[6] == 1) && (map[5]) == 1)
        {
            map[8] = currentPlayer;
            return;
        }
        if ((map[3] == 1) && (map[7]) == 1)
        {
            map[6] = currentPlayer;
            return;  
        }
        else if ((map[5] == 1) && (map[7]) == 1)
        {
            map[8] = currentPlayer;
            return;
        }
        
    }
    //corner
    for (let l = 0; l <= possibleMoves.length - 1; l++)
    {
        if(possibleMoves[l] == 0 || possibleMoves[l] == 2 || possibleMoves[l] == 6 || possibleMoves[l] == 8){
            console.log(`corner`);
            map[possibleMoves[l]] = currentPlayer;
            return;
        }
    }
    //out
    for (let m = 0; m <= possibleMoves.length -1; m++)
    {
        if(possibleMoves[m] == 1 || possibleMoves[m] == 3 || possibleMoves[m] == 5 || possibleMoves[m] == 7){
            console.log(`out`);
            map[possibleMoves[m]] = currentPlayer;
            return;
        }
    }

    function protoWin (player) {
        let playerMapBitMask = 0;
        for (let i = 0; i < map.length; i++) {
            playerMapBitMask <<= 1;
            if (cloneMap[i] == player)
                playerMapBitMask += 1;
        }
    
        for (let i = 0; i < winPatterns.length; i++) {
            if ((playerMapBitMask & winPatterns[i]) == winPatterns[i]) {
                return winPatterns[i];
            }
        }
    
        return 0;
    }
}

draw();