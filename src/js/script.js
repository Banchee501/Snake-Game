'use strict'

const canvas = document.querySelector("#canvas");
const ctx = canvas.getContext("2d");

const width = canvas.width;
const height = canvas.height;
const blockSize = 20;

const widthInBlocks = width / blockSize;
const heightInBlocks = height / blockSize;

let score = 0;

function drawBorder() {
    ctx.fillStyle = "rgb(1, 212, 4)";
    ctx.fillRect(0, 0, width, blockSize);
    ctx.fillRect(0, height - blockSize, width, blockSize);
    ctx.fillRect(0, 0, blockSize, height);
    ctx.fillRect(width - blockSize, 0, blockSize, height);
};

function drawScore() {
    const scoreElement = document.querySelector('h3');
    scoreElement.textContent = `Score: ${score}`;
};

function gameOver() {
    const text = document.querySelector("h1");
    text.style.display = 'block';
    canvas.classList.remove('activeGame');
    canvas.classList.add('overGame');
    clearInterval(intervalId);
};

function circle(x, y, radius, fillCircle) {
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2, false);
    if (fillCircle) {
        ctx.fill();
    } else {
        ctx.stroke();
    }
};

class Block {
    constructor(col, row) {
        this.col = col;
        this.row = row;
    }
};

Block.prototype.drawSquare = function (color) {
    const x = this.col * blockSize;
    const y = this.row * blockSize;
    ctx.fillStyle = color;
    ctx.fillRect(x, y, blockSize, blockSize);
};

Block.prototype.drawCircle = function (color) {
    const centerX = this.col * blockSize + blockSize / 2;
    const centerY = this.row * blockSize + blockSize / 2;
    ctx.fillStyle = color;
    circle(centerX, centerY, blockSize / 2, true);
};

Block.prototype.equal = function (otherBlock) {
    return this.col === otherBlock.col && this.row === otherBlock.row;
};

class Snake {
    segments = [
        new Block(7, 5),
        new Block(6, 5),
        new Block(5, 5)
    ];
    direction = "right";
    nextDirection = "right";
};

Snake.prototype.draw = function () {
    for (let i = 0; i < this.segments.length; i++) {
        this.segments[i].drawSquare("Green");
    }
};

Snake.prototype.move = function () {
    const head = this.segments[0];
    let newHead;
    this.direction = this.nextDirection;

    switch (this.direction) {
        case "right":
            newHead = new Block(head.col + 1, head.row);
            break;
        case "down":
            newHead = new Block(head.col, head.row + 1);
            break;
        case "left":
            newHead = new Block(head.col - 1, head.row);
            break;
        case "up":
            newHead = new Block(head.col, head.row - 1);
            break;
    }
    if (this.checkCollision(newHead)) {
        gameOver();
        return;
    }

    this.segments.unshift(newHead);

    if (newHead.equal(apple.position)) {
        score++;
        apple.move();
    } else {
        this.segments.pop();
    }
};

Snake.prototype.checkCollision = function (head) {
    const leftCollision = (head.col === 0);
    const topCollision = (head.row === 0);
    const rightCollision = (head.col === widthInBlocks - 1);
    const bottomCollision = (head.row === heightInBlocks - 1);
    const wallCollision = leftCollision || topCollision || rightCollision || bottomCollision;
    let selfCollision = false;
    for (let i = 0; i < this.segments.length; i++) {
        if (head.equal(this.segments[i])) {
            selfCollision = true;
        }
    }
    return wallCollision || selfCollision;
};

Snake.prototype.setDirection = function (newDirection) {
    if (this.direction === "up" && newDirection === "down") {
        return;
    } else if (this.direction === "right" && newDirection === "left") {
        return;
    } else if (this.direction === "down" && newDirection === "up") {
        return;
    } else if (this.direction === "left" && newDirection === "right") {
        return;
    }
    this.nextDirection = newDirection;
};

class Apple {
    position = new Block(10, 10);
};

Apple.prototype.draw = function () {
    this.position.drawCircle("LimeGreen");
};

Apple.prototype.move = function () {
    const randomCol = Math.floor(Math.random() * (widthInBlocks - 2)) + 1;
    const randomRow = Math.floor(Math.random() * (heightInBlocks - 2)) + 1;
    if (this.position !== this.segments) {
        this.position = new Block(randomCol, randomRow);
    }
};

const snake = new Snake();
const apple = new Apple();

const intervalId = setInterval(function () {
    ctx.clearRect(0, 0, width, height);
    drawScore();
    snake.move();
    snake.draw();
    apple.draw();
    drawBorder();
}, 100);

const directions = {
    37: "left",
    38: "up",
    39: "right",
    40: "down"
};

document.body.addEventListener("keydown", (event) => {
    const newDirection = directions[event.keyCode];
    if (newDirection !== undefined) {
        snake.setDirection(newDirection);
    }
});