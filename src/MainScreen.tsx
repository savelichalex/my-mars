import * as React from 'react';
import { Animated, View, Text, Dimensions, StyleSheet, LayoutChangeEvent } from 'react-native';
import {
	PanGestureHandler,
	PanGestureHandlerGestureEvent,
	PanGestureHandlerStateChangeEvent,
	State,
} from 'react-native-gesture-handler';

enum PositionInStack {
	Fourth = 0,
	Third = 1,
	Second = 2,
	Front = 3,
	Hidden = 4,
}

enum HorizontalStatus {
	Left = -1,
	Center = 0,
	Right = 1,
}

const { width } = Dimensions.get('window');

export class MainScreen extends React.Component {
	data = Array(10)
		.fill(null)
		.map((_, index) => 'Image ' + index);
	state = {
		cardHeight: null,
		cardIndexInCenter: 3,
		currentIndex: 0,
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

	onPan = ({ nativeEvent: { translationX, state } }: PanGestureHandlerGestureEvent) => {
		const factor = translationX / width;
		const index = this.state.cardIndexInCenter;
		this.cards[index].cardHorizontalStatus.setValue(factor);
	};

	onPanStateChange = ({
		nativeEvent: { translationX, state },
	}: PanGestureHandlerStateChangeEvent) => {
		const factor = translationX / width;
		if (state === State.CANCELLED || state === State.END) {
			const index = this.state.cardIndexInCenter;
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
				let secondIndex = index - 1;
				if (secondIndex < 0) {
					secondIndex = this.cards.length + secondIndex;
				}
				Animated.spring(this.cards[secondIndex].positionInStack, {
					toValue: PositionInStack.Front,
					useNativeDriver: true,
				}).start();
				let thirdIndex = index - 2;
				if (thirdIndex < 0) {
					thirdIndex = this.cards.length + thirdIndex;
				}
				Animated.spring(this.cards[thirdIndex].positionInStack, {
					toValue: PositionInStack.Second,
					useNativeDriver: true,
				}).start();
				let fourthIndex = index - 3;
				if (fourthIndex < 0) {
					fourthIndex = this.cards.length + fourthIndex;
				}
				Animated.spring(this.cards[fourthIndex].positionInStack, {
					toValue: PositionInStack.Third,
					useNativeDriver: true,
				}).start();
				let hiddenIndex = index + 1;
				if (hiddenIndex === this.cards.length) {
					hiddenIndex = 0;
				}
				this.setState({ cardIndexInCenter: secondIndex }, () => {
					this.cards[hiddenIndex].positionInStack.setValue(PositionInStack.Fourth);
					this.cards[hiddenIndex].cardHorizontalStatus.setValue(HorizontalStatus.Center);
				});
				return;
			}
			if (factor < -0.5) {
				Animated.spring(this.cards[index].cardHorizontalStatus, {
					toValue: -1,
					useNativeDriver: true,
				}).start();
				let secondIndex = index - 1;
				if (secondIndex < 0) {
					secondIndex = this.cards.length + secondIndex;
				}
				Animated.spring(this.cards[secondIndex].positionInStack, {
					toValue: PositionInStack.Front,
					useNativeDriver: true,
				}).start();
				let thirdIndex = index - 2;
				if (thirdIndex < 0) {
					thirdIndex = this.cards.length + thirdIndex;
				}
				Animated.spring(this.cards[thirdIndex].positionInStack, {
					toValue: PositionInStack.Second,
					useNativeDriver: true,
				}).start();
				let fourthIndex = index - 3;
				if (fourthIndex < 0) {
					fourthIndex = this.cards.length + fourthIndex;
				}
				Animated.spring(this.cards[fourthIndex].positionInStack, {
					toValue: PositionInStack.Third,
					useNativeDriver: true,
				}).start();
				let hiddenIndex = index + 1;
				if (hiddenIndex === this.cards.length) {
					hiddenIndex = 0;
				}
				this.setState({ cardIndexInCenter: secondIndex }, () => {
					this.cards[hiddenIndex].positionInStack.setValue(PositionInStack.Fourth);
					this.cards[hiddenIndex].cardHorizontalStatus.setValue(HorizontalStatus.Center);
				});
				return;
			}
		}
	};

	getCardAnimations(
		height: number,
		position: PositionInStack,
		horizontal: HorizontalStatus = HorizontalStatus.Center
	) {
		const positionInStack = new Animated.Value(position);
		const cardHorizontalStatus = new Animated.Value(horizontal);
		return {
			positionInStack,
			scaleX: positionInStack.interpolate({
				inputRange: [PositionInStack.Third, PositionInStack.Second, PositionInStack.Front],
				outputRange: [0.8, 0.9, 1],
				extrapolate: 'clamp',
			}),
			scaleY: positionInStack.interpolate({
				inputRange: [PositionInStack.Third, PositionInStack.Second, PositionInStack.Front],
				outputRange: [0.92, 0.96, 1],
				extrapolate: 'clamp',
			}),
			translateY: positionInStack.interpolate({
				inputRange: [PositionInStack.Third, PositionInStack.Second, PositionInStack.Front],
				outputRange: [-1 * (height * 0.04) - 32, -1 * (height * 0.02) - 16, 0],
				extrapolate: 'clamp',
			}),
			cardHorizontalStatus,
			translateX: cardHorizontalStatus.interpolate({
				inputRange: [-1, 0, 1],
				outputRange: [-width, 0, width],
			}),
		};
	}
	getCards = height => [
		this.getCardAnimations(height, PositionInStack.Fourth),
		this.getCardAnimations(height, PositionInStack.Third),
		this.getCardAnimations(height, PositionInStack.Second),
		this.getCardAnimations(height, PositionInStack.Front),
		this.getCardAnimations(height, PositionInStack.Hidden, HorizontalStatus.Left),
	];
	cards = this.getCards(0);

	renderCardChildren(data) {
		return <Text>{data}</Text>;
	}

	getZIndex = (index: number) => {
		const step = PositionInStack.Hidden - this.state.cardIndexInCenter;
		const zIndex = index + step;
		if (zIndex > PositionInStack.Hidden) {
			return zIndex - PositionInStack.Hidden - 1;
		}
		return zIndex;
	};

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
				<PanGestureHandler onGestureEvent={this.onPan} onHandlerStateChange={this.onPanStateChange}>
					<View style={{ flex: 1 }}>
						{this.cards.map((i, index) => (
							<Animated.View
								style={[
									styles.card,
									{
										zIndex: this.getZIndex(index),
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
						))}
					</View>
				</PanGestureHandler>
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
		zIndex: PositionInStack.Hidden + 1,
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
