let currBoard;
let answerCount;
let canMove = false;
let rmb = false;

document.addEventListener('DOMContentLoaded', function() {
	document.body.onmouseup = handleMouseUp;
	document.getElementById("startBtn").onclick = startGame;
	document.getElementById("checkBtn").onclick = checkAnswer;
	startGame();
});

document.addEventListener('keypress', function(e) {
	if(e.keyCode === 13) {
		startGame();
	}
});

function startGame() {
    document.getElementById("err").textContent = "";
	currBoard = makeBoard(10);
	const top = getTop(currBoard);
	const side = getSide(currBoard);
	actuallyMakeBoard(currBoard, top, side);
    answerCount = 0;
    toVisible();
}

function actuallyMakeBoard(board, top, side) {
	const table = document.getElementById("table");
	table.innerHTML = "";

	const topRow = table.insertRow();
	topRow.insertCell();
	for(const stub of top) {
		const cell = topRow.insertCell();
		cell.innerText = stub.length > 0 ? stub.join('\n') : '0';
		cell.classList.add("top", "noselect");
	}
	for(let r=0; r<board.length;r++) {
		const row = table.insertRow();
		const stub = row.insertCell();
		stub.innerText = side[r].length > 0 ? side[r].join(',') : '0';
		stub.classList.add("side", "noselect");

		for(let c=0;c<board[0].length;c++) {
			cell = row.insertCell();
			cell.dataset.y = r;
			cell.dataset.x = c;
			cell.classList.add("unclicked");
			cell.addEventListener('mousedown', handleMouseDown);
			cell.addEventListener('contextmenu', e => {
				e.preventDefault();
			});
			cell.addEventListener('mouseover', handleMouseOver);
		}
	}
}

function makeBoard(size) {
	let board = [];
	for(let y=0;y<size;y++) {
		board.push([]);
		for(let x=0;x<size;x++) {
			board[y][x] = randInt();
		}
	}
	return board;
}

function randInt() {
	return Math.round(Math.random());
}

function getTop(grid) {
	const cols = grid[0].map((col,i) => grid.map((row) => row[i]));
	return cols.map((col) => stubValues(col));
}

function getSide(grid) {
	const rows = grid;
	return rows.map((row) => stubValues(row));
}

function stubValues(arr) {
	const values = [arr[0]];
    for(let i=1;i<arr.length;i++) {	
        arr[i] == 0 ? values.push(arr[i]) : values[values.length - 1] += 1;
	}
	return filterZero(values);
}

function filterZero(arr) {
	return arr.filter((x) => x != 0);
}

function handleClick(evn) {
	const target = evn.target;
	if(target.classList.contains("unclicked")) {
        if(currBoard[target.dataset.y][target.dataset.x] == 1) answerCount++;
		target.classList.replace("unclicked", "clicked");
	}
	else if(target.classList.contains("right-clicked")) {
        if(currBoard[target.dataset.y][target.dataset.x] == 1) answerCount++;
		target.classList.replace("right-clicked", "clicked");
	}
	else {
        if(currBoard[target.dataset.y][target.dataset.x] == 1) answerCount--;
		target.classList.replace("clicked", "unclicked");
    }
}

function handleMouseOver(evn) {
	if(canMove == false) return;

	const target = evn.target;
	
	if(!rmb) handleClick(evn);
	if(rmb) handleRightClick(evn);
}

function handleMouseDown(evn) {
	canMove = true;
	if(evn.which == 1) {
		handleClick(evn);
		rmb = false;
	}
	if(evn.which == 3) {
		handleRightClick(evn, false);
		rmb = true;
	}
}

function handleMouseUp() {
	canMove = false;
}

function handleRightClick(evn) {
	const target = evn.target;

	if(target.classList.contains("unclicked")) {
		target.classList.replace("unclicked", "right-clicked");
	}
	else if(target.classList.contains("clicked")) {
        if(currBoard[target.dataset.y][target.dataset.x] == 1) answerCount--;
		target.classList.replace("clicked", "right-clicked");
	}
	else {
		target.classList.replace("right-clicked", "unclicked");
    }

	return false;
}

function handleRMB(evn) {
	evn.target.preventDefault();
	
	return false;
}

function toVisible() {
	const table = document.getElementById("table");
	const check = document.getElementById("check");
	if(table.classList.contains("hid")) {
		table.classList.toggle("hid");
	}
	if(check.classList.contains("hid")) {
		check.classList.toggle("hid");
	}
}

function checkAnswer() {
    let count = 0;
    const output = document.getElementById("err");

	for(row of currBoard) {
        for(val of row) {
            if(val == 1) count += 1
        }
    }
    output.textContent = `${count - (count - answerCount)}/${count} tiles correct.`;
}