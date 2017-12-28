let ctx,
	img;

const 
	TILE_HEIGHT = 45,
	TILE_WIDTH = 64,
	MAP_WIDTH = 10,
	MAP_HEIGHT = 10,
	MAP = getMap(),
	TILES = {
		0: {
			type: 'grass',
			x: 0,
			y: 0
		},
		1: {
			type: 'water',
			x: 64,
			y: 0
		}
	};

window.onload = function() {

	ctx = document.getElementById('game').getContext('2d');

	img = new Image();
	img.src = 'tiles.png';

	img.onload = function() {
		drawMap();
	}


}	

function drawMap() {
	for(let i = 0; i < MAP_HEIGHT; i++) {
		for(let j = 0; j < MAP_WIDTH; j++) {

			let x = (i-j) * TILE_WIDTH/2 + 300;
			let y = (i+j) * TILE_WIDTH/4;

			ctx.drawImage(
				img,
				TILES[MAP[getIndex(i,j)]].x,
				TILES[MAP[getIndex(i,j)]].y,
				TILE_WIDTH,
				TILE_HEIGHT,
				x,
				y,
				TILE_WIDTH,
				TILE_HEIGHT
			);

		}
	}
}

function getIndex(row, col) {
	return row * MAP_WIDTH + col;
}

function getMap() {
	let map = [];
	for(let i = 0; i < MAP_WIDTH * MAP_HEIGHT; i++) {
		map.push(Math.round(Math.random()));
	}

	return map;
}
