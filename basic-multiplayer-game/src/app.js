import {MAP, MAP_WIDTH, MAP_HEIGHT, TILE_HEIGHT, TILE_WIDTH, TILES, KEYS} from './commons/constants';
import {isCollision, isGoal, getIndex, drawPlayer} from './commons/utils';
import socketSubscribe from './commons/socket-subscribe';
import socket from './commons/socket';

let currentPlayer,
	players,
	ctx,
	cvs,
	img;

const gameWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth,
	gameHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;

const clearScreen = () => ctx.clearRect(0, 0, cvs.width, cvs.height);

const sw = socket.getInstance(),
	updatePlayerUser = user => currentPlayer = user,
	updatePlayers = users => {
		currentPlayer = users.find(player => currentPlayer.id === player.id);
		players = users;
	};

socketSubscribe.subscribe('app.js', {
	GET_PLAYERS: updatePlayers,
	GET_ME: updatePlayerUser
});

function drawPlayers(i, j, mapX, mapY) {
	players.forEach(player => {
		if(i === player.x && j === player.y) {
			drawPlayer(ctx, img, player, mapX, mapY);			
		}
	});
}

window.addEventListener('load', () => {
	cvs = document.getElementById('game');

	cvs.height = gameHeight - 40;
	cvs.width = gameWidth - 40;

	ctx = cvs.getContext('2d');

	img = new Image();
	img.src = 'assets/images/tiles.png';

	img.onload = function() {
		update();
	}	
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

			ctx.drawImage(
				img,
				x,
				y,
				w,
				h,
				mapX,
				mapY,
				w,
				h
			);
			
			drawPlayers(i, j, mapX, mapY);
		}
	}
}

document.addEventListener('keydown', ({keyCode, which}) => {
	let keyPressed = keyCode || which;

	if(keyPressed === KEYS.LEFT && !isCollision(currentPlayer.x - 1, currentPlayer.y)) {
		currentPlayer.x -= 1;
		sw.send(JSON.stringify({type:'PLAYER_MOVE', payload: currentPlayer}));
	} else if(keyPressed === KEYS.RIGHT && !isCollision(currentPlayer.x + 1, currentPlayer.y)) {
		currentPlayer.x += 1;
		sw.send(JSON.stringify({type:'PLAYER_MOVE', payload: currentPlayer}));
	} else if(keyPressed === KEYS.BOTTOM && !isCollision(currentPlayer.x, currentPlayer.y + 1)) {
		currentPlayer.y += 1;
		sw.send(JSON.stringify({type:'PLAYER_MOVE', payload: currentPlayer}));
	} else if(keyPressed === KEYS.TOP && !isCollision(currentPlayer.x, currentPlayer.y - 1)) {
		currentPlayer.y -= 1;
		sw.send(JSON.stringify({type:'PLAYER_MOVE', payload: currentPlayer}));
	}

	if(isGoal(currentPlayer.x, currentPlayer.y)) {
		sw.send(JSON.stringify({type:'RESET_PLAYERS'}));
		return;
	}
});