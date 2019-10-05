import * as React from 'react';
import { Animated, View, Text, Dimensions } from 'react-native';
import {
	PanGestureHandler,
	PanGestureHandlerGestureEvent,
	PanGestureHandlerStateChangeEvent,
	State,
} from 'react-native-gesture-handler';

const { width } = Dimensions.get('window');

export class MainScreen extends React.Component {
	cardStatus = new Animated.Value(0);
	cardTranslateX = this.cardStatus.interpolate({
		inputRange: [-1, 0, 1],
		outputRange: [-width, 0, width],
	});

	onPan = ({ nativeEvent: { translationX, state } }: PanGestureHandlerGestureEvent) => {
		const factor = translationX / width;
		this.cardStatus.setValue(factor);
	};

	onPanStateChange = ({
		nativeEvent: { translationX, state },
	}: PanGestureHandlerStateChangeEvent) => {
		const factor = translationX / width;
		if (state === State.CANCELLED || state === State.END) {
			if (Math.abs(factor) < 0.5) {
				Animated.spring(this.cardStatus, {
					toValue: 0,
					useNativeDriver: true,
				}).start();
				return;
			}
			if (factor > 0.5) {
				Animated.spring(this.cardStatus, {
					toValue: 1,
					useNativeDriver: true,
				}).start();
				return;
			}
			if (factor < -0.5) {
				Animated.spring(this.cardStatus, {
					toValue: -1,
					useNativeDriver: true,
				}).start();
				return;
			}
		}
	};

	render() {
		return (
			<View
				style={{ flex: 1, alignItems: 'center', justifyContent: 'center', marginVertical: 150 }}>
				<PanGestureHandler onGestureEvent={this.onPan} onHandlerStateChange={this.onPanStateChange}>
					<Animated.View
						style={{
							flex: 1,
							width: '90%',
							backgroundColor: 'red',
							borderRadius: 10,
							padding: 20,
							transform: [{ translateX: this.cardTranslateX }],
						}}>
						<Text>Test</Text>
					</Animated.View>
				</PanGestureHandler>
			</View>
		);
	}
}
