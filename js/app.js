// constants
const H_STEP = 101, V_STEP = 83;
const PLAYER_Y_PADDING = 15, PLAYER_X_PADDING = 18;
const ENEMY_Y_PADDING = 25, ENEMY_X_PADDING = 3;

// variables
let thereIsCollision = false;
let reachedRiver = false;

// Select the background screen and body element
const background = document.querySelector('.background--screen');
const body = document.querySelector('body');

/*
 *
 * Enemy class
 *
 */ 

// Enemies our player must avoid
var Enemy = function (x, y, speed) {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';
    this.x = x;
    this.y = y;
    this.height = 65;
    this.width = 95;
    this.speed = speed;
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function (dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.

    this.x += this.speed * dt;
    if (this.x > 606) {
        this.x = -101;
        let randomSpeed = Math.floor(Math.random() * (4) + 1);
        this.speed = 100 * randomSpeed * (player.stars + 1);  // increase the speed acording to the stars number
    }
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function () {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

/*
 *
 * Player class
 *
 */

class Player {
    constructor(x, y, sprite) {
        this.sprite = sprite;
        this.x = x;
        this.y = y;
        this.height = 75;
        this.width = 65;
        this.lives = 3;
        this.stars = 0;
    }

    update() {
        // check the collision
        if (thereIsCollision) {
            this.restPosition();
            this.killOneLive();
            thereIsCollision = false;
        }

        // check if reached to the river to add a star
        if (reachedRiver) {
            this.addStar();
        }

        // Check if the game is over
        if (game.gameOver) {
            this.stars === 3 ? game.endTheGame('pass') : game.endTheGame('died');
        }
    }

    render() {
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    }

    handleInput(direction) {
        switch (direction) {
            case 'left':
                this.x >= H_STEP ? this.x -= H_STEP : this.x -= 0;
                break;
            case 'right':
                this.x < (H_STEP * 4) ? this.x += H_STEP : this.x += 0;
                break;
            case 'up':
                this.y -= V_STEP;
                // does the player reached to the river?
                if (this.y < 55) {
                    this.restPosition();
                    reachedRiver = true;
                }
                break;
            case 'down':
                this.y <= (V_STEP * 4) ? this.y += V_STEP : this.y += 0;
                break;
        }
    }

    restPosition() {
        this.x = H_STEP * 2;
        this.y = V_STEP * 5 - PLAYER_Y_PADDING;
    }

    killOneLive() {
        const hearts = document.querySelectorAll('.heart');

        hearts[--this.lives].classList.add('hidden');
        this.lives === 0 ? game.gameOver = true : game.gameOver = false;
    }

    showLives() {
        const hearts = document.querySelectorAll('.heart');
        for (let heart of hearts) {
            heart.classList.remove('hidden');
        }
    }

    addStar() {
        const stars = document.querySelectorAll('.star');
        stars[2 - this.stars++].classList.remove('hidden');
        reachedRiver = false;

        this.stars === 3 ? game.gameOver = true : game.gameOver = false;
    }

    hideStars() {
        const stars = document.querySelectorAll('.star');
        for (let star of stars) {
            star.classList.add('hidden');
        }
    }
}

// Game class
class Game {
    constructor() {
        this.gameOver = false;
        this.lives = 3;
        this.stars = 0;
        this.speed = 0;
        this.allEnemies = [];
        this.enemiesPosition = [
            V_STEP * 1 - ENEMY_Y_PADDING,
            V_STEP * 2 - ENEMY_Y_PADDING,
            V_STEP * 3 - ENEMY_Y_PADDING
        ]
    }

    initNewGame() {
        player.lives = this.lives;
        player.stars = this.stars;
        player.restPosition();
        player.hideStars();
        player.showLives();

        this.allEnemies = this.enemiesPosition.map((y, index) => {
            return new Enemy(-80 * (Math.floor(Math.random() * (index + 4) + 1)), y, 150);
        });
    }

    startTheGame() {
        this.hideScreen(background);
        this.initNewGame();

        document.addEventListener('keyup', arrowKeiesHandeler);

    }

    endTheGame(result) {
        let heading = document.querySelector('.exit--screen > h1');

        this.allEnemies = [];
        this.showScreen(background, 'exit');
        switch (result) {
            case 'pass':
                heading.textContent = 'Congratulation! You Passed!';
                break;

            case 'died':
                heading.textContent = 'Game Over! You Died';
                break;
        }
        game.gameOver = false;

        document.removeEventListener('keyup', arrowKeiesHandeler);
    }

    restartTheGame() {
        this.showScreen(background, 'welcom');
    }

    hideScreen(elementName) {
        elementName.classList.add('hide');
    }

    showScreen(elementName, screenName) {
        elementName.classList.remove('hide');

        switch (screenName) {
            case 'welcom':
                document.querySelector('.welcom--screen').classList.remove('hide');
                document.querySelector('.exit--screen').classList.add('hide');
                break;
            case 'exit':
                document.querySelector('.exit--screen').classList.remove('hide');
                document.querySelector('.welcom--screen').classList.add('hide');
                break;
        }
    }
}

// create a new instance of game and player
let game = new Game();
let player = new Player(H_STEP * 2, V_STEP * 5 - PLAYER_Y_PADDING, 'images/char-boy.png')

// add event listerer to the body element
body.addEventListener('click', function (e) {
    clickedElement = e.target;

    if (clickedElement.classList.contains('start--button')) {
        game.startTheGame();
    } else if (clickedElement.classList.contains('restart--button')) {
        game.restartTheGame();
    }
    else if (clickedElement.classList.contains('exit--button')) {
        if (confirm('Do you want to exit?')) {
            window.close();
        }
    }
});


/*
*
* Function declaration section
*
*/

// function for the listenser
function arrowKeiesHandeler(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
}

// checking collision function
function checkCollisions() {
    for (let enemy of game.allEnemies) {
        let maxWidth = enemy.width + player.width;
        // the distance between the bug and the player without paddings
        let distanceX = (player.x + PLAYER_X_PADDING + player.width) - (enemy.x + ENEMY_X_PADDING);
        let enemyDistanceY = enemy.y + ENEMY_Y_PADDING;
        let playerDistanceY = player.y + PLAYER_Y_PADDING;

        // check if the player and an enemy are on the same line 
        if (enemyDistanceY === playerDistanceY &&
            distanceX >= 0 &&
            distanceX <= maxWidth) {
            thereIsCollision = true;
            break;
        }
    }
}