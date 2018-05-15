const TOOLS = require('./tools');

const generatePlayer = () => ({
	id: TOOLS.getId(),
	x: 1,
	y: 1,
	tile: TOOLS.randomBetween(6, 3)
});

module.exports = generatePlayer;