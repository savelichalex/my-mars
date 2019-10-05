import * as React from 'react';
import { Animated, View, Text, Dimensions } from 'react-native';
import { PanGestureHandler, PanGestureHandlerGestureEvent } from 'react-native-gesture-handler';

const { width } = Dimensions.get('window');

export class MainScreen extends React.Component {

	cardStatus = new Animated.Value(0);
	cardTranslateX = this.cardStatus.interpolate({
		inputRange: [-1, 0, 1],
		outputRange: [-width, 0, width],
	});

	onPan = ({ nativeEvent: { translationX }}: PanGestureHandlerGestureEvent) => {
		this.cardStatus.setValue(translationX / width);
	}
	
	render() {
		return (
			<View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', marginVertical: 150 }}>
				<PanGestureHandler onGestureEvent={this.onPan}>
					<Animated.View style={{ flex: 1, width: '60%', backgroundColor: 'red', borderRadius: 10, padding: 20, transform: [{translateX: this.cardTranslateX}] }}>
						<Text>Test</Text>
					</Animated.View>
				</PanGestureHandler>
			</View>
		)
	}
}
