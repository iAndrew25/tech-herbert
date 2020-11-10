import patternMock from 'pattern-mock';
import * as d3 from 'd3';

const DOT = 3;

const getRandomDataset = (length = 30) => {
	return patternMock({
		dataset: {
			__pattern__: ['CUSTOM_NUMBER_1-100'],
			__config__: {
				length,
				decorate: dataset => dataset.sort((a, b) => a - b)
			}
		}
	}).dataset
};

const getLineChart = (dataset, chartWidth, chartHeight, margin) => {
	const scaleX = d3
		.scaleLinear()
		.domain([0, dataset.length - 1])
		.range([0, chartWidth - margin]);

	const scaleY = d3
		.scaleLinear()
		.domain([
			d3.min(dataset),
			d3.max(dataset)
		])
		.range([chartHeight - margin, 0]);

	const linePath = d3
		.line()
		.defined(value => value !== null)
		.x((_, key) => scaleX(key))
		.y(value => scaleY(value))
		.curve(d3.curveCatmullRom)(dataset);

	return {
		scaleX,
		scaleY,
		linePath,
		BANDWIDTH: Math.floor((chartWidth - margin) / dataset.length),
	};
}

const getPointerPath = (selectedDay, dataset, scaleX, scaleY) => {
	const path = d3.path();

	path.arc(scaleX(selectedDay), scaleY(dataset[selectedDay]), DOT, 0, Math.PI * 2)

	return path.toString();
}

const clamp = (value, max, min) => Math.min(Math.max(value, min), max);

const getHoveredIndex = (value, dataset, margin, bandwidth) => {
	const index = Math.floor((value - margin * 2) / bandwidth);

	return clamp(index, dataset.length - 1, 0);
}

export {
	getRandomDataset,
	getHoveredIndex,
	getPointerPath,
	getLineChart
};
