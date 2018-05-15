const getId = () => Math.random().toString(36).substring(7);
const randomBetween = (max, min = 0) => Math.floor(Math.random() * (max - min + 1)) + min;

module.exports = {
	randomBetween,
	getId
}