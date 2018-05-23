import {MAP, MAP_WIDTH, MAP_HEIGHT, TILE_HEIGHT, TILE_WIDTH, TILES, KEYS} from './commons/constants';
import {isCollision, isGoal, getIndex, drawPlayer} from './commons/utils';
import socketSubscribe from './commons/socket-subscribe';
import socket from './commons/socket';

let currentPlayer,
	players = [],
	ctx,
	cvs,
	img;

const gameWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth,
	gameHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;

const clearScreen = () => ctx.clearRect(0, 0, cvs.width, cvs.height);

const updateCurrentUser = user => currentPlayer = user;
const updatePlayers = allPlayers => {
	currentPlayer = allPlayers.find(player => player.id === currentPlayer.id);
	players = allPlayers;
}

const sw = socket.getInstance();

socketSubscribe.subscribe('app.js', {
	GET_PLAYERS: updatePlayers,
	GET_ME: updateCurrentUser
});

function drawPlayers(i, j, mapX, mapY) {
	players.forEach(player => {
		if(player.x === i && player.y === j) {
			drawPlayer(ctx, img, player, mapX, mapY);
		}
	})
}

window.addEventListener('load', () => {
	cvs = document.getElementById('game');
	cvs.height = gameHeight;
	cvs.width = gameWidth;

	ctx = cvs.getContext('2d');

	img = new Image();
	img.src = 'assets/images/tiles.png';
	img.onload = update;
});

function update() {
	clearScreen();
	drawMap();
	requestAnimationFrame(update);
}

function drawMap() {
	for(let i = 0; i < MAP_HEIGHT; i++) {
		for(let j = 0; j < MAP_WIDTH; j++) {
			let mapX = (i - j) * TILE_WIDTH / 2 + gameWidth / 2,
				mapY = (i + j) * TILE_WIDTH / 4 + gameHeight / 4,
				{type, x, y, w, h} = TILES[MAP[getIndex(i, j)]];

				if(type === 'wall') {
					mapY -= 10;
				}

				ctx.drawImage(img, x, y, w, h, mapX, mapY, w, h);
				drawPlayers(i, j, mapX - 10, mapY - 15);
		}
	}
}

window.addEventListener('keydown', ({keyCode}) => {
	if(keyCode === KEYS.LEFT || keyCode === KEYS.RIGHT || keyCode === KEYS.TOP || keyCode === KEYS.BOTTOM) {
		if(keyCode === KEYS.LEFT && !isCollision(currentPlayer.x - 1, currentPlayer.y)) {
			currentPlayer.x -= 1;
		} else if(keyCode === KEYS.RIGHT && !isCollision(currentPlayer.x + 1, currentPlayer.y)) {
			currentPlayer.x += 1;
		} else if(keyCode === KEYS.BOTTOM && !isCollision(currentPlayer.x, currentPlayer.y + 1)) {
			currentPlayer.y += 1;
		} else if(keyCode === KEYS.TOP && !isCollision(currentPlayer.x, currentPlayer.y - 1)) {
			currentPlayer.y -= 1;
		}

		if(isGoal(currentPlayer)) {
			sw.send(JSON.stringify({type: 'RESET_PLAYERS'}));
			alert('Ai câștigat!');
		} else {
			sw.send(JSON.stringify({type: 'PLAYER_MOVE', payload: currentPlayer}));
		}
	}
});