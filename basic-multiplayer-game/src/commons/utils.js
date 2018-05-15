import {MAP, MAP_WIDTH, MAP_HEIGHT, TILE_HEIGHT, TILE_WIDTH, TILES} from './constants';

export const getIndex = (row, col) => row * MAP_WIDTH + col;
export const isCollision = (nextX, nextY) =>  nextX < 0 || nextY < 0 || nextX > MAP_WIDTH - 1 || nextY > MAP_HEIGHT - 1 || (MAP[getIndex(nextX, nextY)] !== 0 && MAP[getIndex(nextX, nextY)] !== 2);
export const isGoal = (x, y) => MAP[getIndex(x, y)] === 2;

export const drawPlayer = (ctx, img, player, mapX, mapY) => {
	const {x, y, w, h} = TILES[player.tile];
	ctx.drawImage(img, x, y, w, h, mapX, mapY, w, h);
}