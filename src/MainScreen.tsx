import * as React from 'react';
import { Animated, View, Text, Dimensions, StyleSheet, LayoutChangeEvent } from 'react-native';
import {
	PanGestureHandler,
	PanGestureHandlerGestureEvent,
	PanGestureHandlerStateChangeEvent,
	State,
} from 'react-native-gesture-handler';

enum PositionInStack {
	Front = 0,
	Second = 1,
	Third = 2,
}

const { width } = Dimensions.get('window');

export class MainScreen extends React.Component {
	state = {
		cardHeight: null,
	};

	cardStatus = new Animated.Value(0);
	cardTranslateX = this.cardStatus.interpolate({
		inputRange: [-1, 0, 1],
		outputRange: [-width, 0, width],
	});

	leftButtonScale = this.cardStatus.interpolate({
		inputRange: [-0.5, 0],
		outputRange: [1.3, 1],
		extrapolate: 'clamp',
	});
	leftButtonOpacity = this.cardStatus.interpolate({
		inputRange: [0, 0.5],
		outputRange: [1, 0.5],
		extrapolate: 'clamp',
	});
	rightButtonScale = this.cardStatus.interpolate({
		inputRange: [0, 0.5],
		outputRange: [1, 1.3],
		extrapolate: 'clamp',
	});
	rightButtonOpacity = this.cardStatus.interpolate({
		inputRange: [-0.5, 0],
		outputRange: [0.5, 1],
		extrapolate: 'clamp',
	});

	onPan = index => ({ nativeEvent: { translationX, state } }: PanGestureHandlerGestureEvent) => {
		const factor = translationX / width;
		this.cards[index].cardHorizontalStatus.setValue(factor);
	};

	onPanStateChange = index => ({
		nativeEvent: { translationX, state },
	}: PanGestureHandlerStateChangeEvent) => {
		const factor = translationX / width;
		if (state === State.CANCELLED || state === State.END) {
			if (Math.abs(factor) < 0.5) {
				Animated.spring(this.cards[index].cardHorizontalStatus, {
					toValue: 0,
					useNativeDriver: true,
				}).start();
				return;
			}
			if (factor > 0.5) {
				Animated.spring(this.cards[index].cardHorizontalStatus, {
					toValue: 1,
					useNativeDriver: true,
				}).start();
				this.cards[index - 1] != null &&
					Animated.spring(this.cards[index - 1].positionInStack, {
						toValue: PositionInStack.Front,
						useNativeDriver: true,
					}).start();
				this.cards[index - 2] != null &&
					Animated.spring(this.cards[index - 2].positionInStack, {
						toValue: PositionInStack.Second,
						useNativeDriver: true,
					}).start();
				return;
			}
			if (factor < -0.5) {
				Animated.spring(this.cards[index].cardHorizontalStatus, {
					toValue: -1,
					useNativeDriver: true,
				}).start();
				this.cards[index - 1] != null &&
					Animated.spring(this.cards[index - 1].positionInStack, {
						toValue: PositionInStack.Front,
						useNativeDriver: true,
					}).start();
				this.cards[index - 2] != null &&
					Animated.spring(this.cards[index - 2].positionInStack, {
						toValue: PositionInStack.Second,
						useNativeDriver: true,
					}).start();
				return;
			}
		}
	};

	getCards = height => [
		(() => {
			const positionInStack = new Animated.Value(PositionInStack.Third);
			const cardHorizontalStatus = new Animated.Value(0);
			return {
				positionInStack,
				scaleX: positionInStack.interpolate({
					inputRange: [PositionInStack.Front, PositionInStack.Second, PositionInStack.Third],
					outputRange: [1, 0.9, 0.8],
				}),
				scaleY: positionInStack.interpolate({
					inputRange: [PositionInStack.Front, PositionInStack.Second, PositionInStack.Third],
					outputRange: [1, 0.96, 0.92],
				}),
				translateY: positionInStack.interpolate({
					inputRange: [PositionInStack.Front, PositionInStack.Second, PositionInStack.Third],
					outputRange: [0, -1 * (height * 0.02) - 16, -1 * (height * 0.04) - 32],
				}),
				cardHorizontalStatus,
				translateX: cardHorizontalStatus.interpolate({
					inputRange: [-1, 0, 1],
					outputRange: [-width, 0, width],
				}),
			};
		})(),
		(() => {
			const positionInStack = new Animated.Value(PositionInStack.Second);
			const cardHorizontalStatus = new Animated.Value(0);
			return {
				positionInStack,
				scaleX: positionInStack.interpolate({
					inputRange: [PositionInStack.Front, PositionInStack.Second, PositionInStack.Third],
					outputRange: [1, 0.9, 0.8],
				}),
				scaleY: positionInStack.interpolate({
					inputRange: [PositionInStack.Front, PositionInStack.Second, PositionInStack.Third],
					outputRange: [1, 0.96, 0.92],
				}),
				translateY: positionInStack.interpolate({
					inputRange: [PositionInStack.Front, PositionInStack.Second, PositionInStack.Third],
					outputRange: [0, -1 * (height * 0.02) - 16, -1 * (height * 0.04) - 32],
				}),
				cardHorizontalStatus,
				translateX: cardHorizontalStatus.interpolate({
					inputRange: [-1, 0, 1],
					outputRange: [-width, 0, width],
				}),
			};
		})(),
		(() => {
			const positionInStack = new Animated.Value(PositionInStack.Front);
			const cardHorizontalStatus = new Animated.Value(0);
			return {
				positionInStack,
				scaleX: positionInStack.interpolate({
					inputRange: [PositionInStack.Front, PositionInStack.Second, PositionInStack.Third],
					outputRange: [1, 0.9, 0.8],
				}),
				scaleY: positionInStack.interpolate({
					inputRange: [PositionInStack.Front, PositionInStack.Second, PositionInStack.Third],
					outputRange: [1, 0.96, 0.92],
				}),
				translateY: positionInStack.interpolate({
					inputRange: [PositionInStack.Front, PositionInStack.Second, PositionInStack.Third],
					outputRange: [0, -1 * (height * 0.02) - 16, -1 * (height * 0.04) - 32],
				}),
				cardHorizontalStatus,
				translateX: cardHorizontalStatus.interpolate({
					inputRange: [-1, 0, 1],
					outputRange: [-width, 0, width],
				}),
			};
		})(),
	];
	cards = this.getCards(0);

	render() {
		return (
			<View
				style={[styles.container, { opacity: this.state.cardHeight == null ? 0 : 1 }]}
				onLayout={({
					nativeEvent: {
						layout: { height },
					},
				}: LayoutChangeEvent) => {
					this.setState({ cardHeight: height });
					this.cards = this.getCards(height);
				}}>
				{this.cards.map((i, index) => (
					<PanGestureHandler
						key={index}
						onGestureEvent={this.onPan(index)}
						onHandlerStateChange={this.onPanStateChange(index)}>
						<Animated.View
							style={[
								styles.card,
								{
									transform: [
										{ scaleX: i.scaleX },
										{ scaleY: i.scaleY },
										{ translateX: i.translateX },
										{ translateY: i.translateY },
									],
								},
							]}>
							<Text>Test {index}</Text>
						</Animated.View>
					</PanGestureHandler>
				))}
				<View style={styles.buttonsWrapper}>
					<View style={styles.buttonWrapper}>
						<Animated.View
							style={[
								styles.button,
								styles.buttonLeft,
								{
									opacity: this.leftButtonOpacity,
									transform: [{ scale: this.leftButtonScale }],
								},
							]}
						/>
					</View>
					<View style={styles.buttonWrapper}>
						<Animated.View
							style={[
								styles.button,
								styles.buttonRight,
								{
									opacity: this.rightButtonOpacity,
									transform: [{ scale: this.rightButtonScale }],
								},
							]}
						/>
					</View>
				</View>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		marginVertical: 150,
		position: 'relative',
		//paddingTop: 32, // for Android
	},
	card: {
		flex: 1,
		position: 'absolute',
		top: 0,
		bottom: 0,
		left: '5%',
		right: '5%',
		backgroundColor: 'yellow',
		borderRadius: 8,
		padding: 20,
		shadowColor: 'rgb(16, 32, 39)',
		shadowOpacity: 0.16,
		shadowRadius: 24,
		shadowOffset: {
			width: 0,
			height: 16,
		},
	},
	buttonsWrapper: {
		position: 'absolute',
		bottom: -28,
		flexDirection: 'row',
	},
	buttonWrapper: {
		flex: 1,
		alignItems: 'center',
	},
	button: {
		width: 56,
		height: 56,
		borderRadius: 28,
	},
	buttonLeft: {
		backgroundColor: 'black',
	},
	buttonRight: {
		backgroundColor: 'red',
	},
});
