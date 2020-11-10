import React, {useState} from 'react';
import {View, Text, StyleSheet, PanResponder, useWindowDimensions} from 'react-native';
import {Group, Surface, Shape} from '@react-native-community/art';

import {getRandomDataset, getHoveredIndex, getPointerPath, getLineChart} from './app-utils';

const MARGIN = 16;
const PRIMARY = '#6436E2';
const DATASET = getRandomDataset();

function App() {
	const WINDOW_WIDTH = useWindowDimensions().width;
	const CHART_WIDTH = WINDOW_WIDTH - (2 * 16);
	const CHART_HEIGHT = CHART_WIDTH / 2;
	const [selectedDay, setSelectedDay] = useState(DATASET.length - 1);

	const {linePath, BANDWIDTH, scaleX, scaleY} = getLineChart(DATASET, CHART_WIDTH, CHART_HEIGHT, MARGIN * 2);

	const panResponder = PanResponder.create({
		onStartShouldSetPanResponder: (evt, gestureState) => true,
		onPanResponderGrant: (_, {x0}) => setSelectedDay(getHoveredIndex(x0, DATASET, MARGIN, BANDWIDTH)),
		onPanResponderMove: (_, {moveX}) => setSelectedDay(getHoveredIndex(moveX, DATASET, MARGIN, BANDWIDTH))
	});

	return (
		<View style={styles.wrapper}>
			<Text style={styles.title}>Number of ??? per day.</Text>
			<View style={styles.result}>
				<Text style={styles.resultText}>Total number of ??? on day {selectedDay + 1} was {DATASET[selectedDay]}</Text>
			</View>
			<View style={[styles.chart, { margin: MARGIN }]} {...panResponder.panHandlers}>
				<Surface width={CHART_WIDTH} height={CHART_HEIGHT}>
					<Group x={MARGIN} y={MARGIN}>
						<Shape d={linePath} stroke={PRIMARY} strokeWidth={1} />
						<Shape d={getPointerPath(selectedDay, DATASET, scaleX, scaleY)} fill={PRIMARY} />
					</Group>
				</Surface>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	wrapper: {
		flex: 1,
		backgroundColor: '#F2F6FB'
	},
	title: {
		textAlign: 'center',
		fontSize: 18,
		margin: MARGIN
	},
	result: {
		backgroundColor: '#FFFFFF',
		borderRadius: MARGIN / 2,
		marginHorizontal: MARGIN,
		padding: MARGIN / 2
	},
	resultText: {
		textAlign: 'center'
	},
	chart: {
		backgroundColor: '#FFFFFF',
		borderRadius: MARGIN / 2,
	}
});

export default App;