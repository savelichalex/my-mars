import * as React from 'react';
import {
	Animated,
	View,
	Text,
	Dimensions,
	StyleSheet,
	LayoutChangeEvent,
	Image,
} from 'react-native';
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

interface Props {
	data: Array<any>;
	children(data: any): React.ReactNode;
	onLike(index: number): void;
	onTrash(index: number): void;
}

interface State {
	cardHeight: number;
	cardIndexInCenter: number;
	currentIndex: number;
}

export class Cards extends React.Component<Props, State> {
	state = {
		cardHeight: null,
		cardIndexInCenter: 3,
		currentIndex: 0,
	};

	// Buttons animations
	private cardStatus = new Animated.Value(0);
	private leftButtonScale = this.cardStatus.interpolate({
		inputRange: [-0.5, 0],
		outputRange: [1.3, 1],
		extrapolate: 'clamp',
	});
	private leftButtonOpacity = this.cardStatus.interpolate({
		inputRange: [0, 0.5],
		outputRange: [1, 0.5],
		extrapolate: 'clamp',
	});
	private rightButtonScale = this.cardStatus.interpolate({
		inputRange: [0, 0.5],
		outputRange: [1, 1.3],
		extrapolate: 'clamp',
	});
	private rightButtonOpacity = this.cardStatus.interpolate({
		inputRange: [-0.5, 0],
		outputRange: [0.5, 1],
		extrapolate: 'clamp',
	});

	// Pan gesture handling
	private onPan = ({ nativeEvent: { translationX, state } }: PanGestureHandlerGestureEvent) => {
		const factor = translationX / width;
		const index = this.state.cardIndexInCenter;
		this.cards[index].cardHorizontalStatus.setValue(factor);
		this.cardStatus.setValue(factor);
	};

	private onPanStateChange = ({
		nativeEvent: { translationX, state, velocityX },
	}: PanGestureHandlerStateChangeEvent) => {
		const factor = translationX / width;
		if (state === State.CANCELLED || state === State.END) {
			const { centerIndex, secondIndex, thirdIndex, fourthIndex, hiddenIndex } = this.getIndexes();
			Animated.spring(this.cardStatus, {
				delay: 200,
				toValue: 0,
				useNativeDriver: true,
			}).start();
			if (Math.abs(factor) > 0.5 || Math.abs(velocityX) > 1000) {
				Animated.parallel([
					velocityX > 0
						? Animated.spring(this.cards[centerIndex].cardHorizontalStatus, {
								toValue: HorizontalStatus.Right,
								useNativeDriver: true,
						  })
						: Animated.spring(this.cards[centerIndex].cardHorizontalStatus, {
								toValue: HorizontalStatus.Left,
								useNativeDriver: true,
						  }),
					Animated.spring(this.cards[secondIndex].positionInStack, {
						toValue: PositionInStack.Front,
						useNativeDriver: true,
					}),
					Animated.spring(this.cards[thirdIndex].positionInStack, {
						toValue: PositionInStack.Second,
						useNativeDriver: true,
					}),
					Animated.spring(this.cards[fourthIndex].positionInStack, {
						toValue: PositionInStack.Third,
						useNativeDriver: true,
					}),
				]).start();
				this.cards[hiddenIndex].indexForData = this.state.currentIndex + 4;
				this.setState(
					{ cardIndexInCenter: secondIndex, currentIndex: this.state.currentIndex + 1 },
					() => {
						this.cards[hiddenIndex].positionInStack.setValue(PositionInStack.Fourth);
						this.cards[hiddenIndex].cardHorizontalStatus.setValue(HorizontalStatus.Center);
					}
				);
				if (factor > 0.5) {
					this.props.onLike(this.cards[centerIndex].indexForData);
				} else {
					this.props.onTrash(this.cards[centerIndex].indexForData);
				}
				return;
			} else {
				Animated.spring(this.cards[centerIndex].cardHorizontalStatus, {
					toValue: 0,
					useNativeDriver: true,
				}).start();
				return;
			}
		}
	};

	private getIndexes() {
		const centerIndex = this.state.cardIndexInCenter;
		let secondIndex = centerIndex - 1;
		if (secondIndex < 0) {
			secondIndex = this.cards.length + secondIndex;
		}
		let thirdIndex = centerIndex - 2;
		if (thirdIndex < 0) {
			thirdIndex = this.cards.length + thirdIndex;
		}
		let fourthIndex = centerIndex - 3;
		if (fourthIndex < 0) {
			fourthIndex = this.cards.length + fourthIndex;
		}
		let hiddenIndex = centerIndex + 1;
		if (hiddenIndex === this.cards.length) {
			hiddenIndex = 0;
		}
		return {
			centerIndex,
			secondIndex,
			thirdIndex,
			fourthIndex,
			hiddenIndex,
		};
	}

	// For undo
	goBackFromLeft() {
		const { hiddenIndex } = this.getIndexes();
		this.cards[hiddenIndex].cardHorizontalStatus.setValue(HorizontalStatus.Left);
		this.goBack();
	}

	goBackFromRight() {
		const { hiddenIndex } = this.getIndexes();
		this.cards[hiddenIndex].cardHorizontalStatus.setValue(HorizontalStatus.Right);
		this.goBack();
	}

	private goBack() {
		const { centerIndex, secondIndex, thirdIndex, fourthIndex, hiddenIndex } = this.getIndexes();
		Animated.parallel([
			Animated.spring(this.cards[hiddenIndex].cardHorizontalStatus, {
				toValue: HorizontalStatus.Center,
				useNativeDriver: true,
			}),
			Animated.spring(this.cards[centerIndex].positionInStack, {
				toValue: PositionInStack.Second,
				useNativeDriver: true,
			}),
			Animated.spring(this.cards[centerIndex].cardHorizontalStatus, {
				toValue: HorizontalStatus.Center,
				useNativeDriver: true,
			}),
			Animated.spring(this.cards[secondIndex].positionInStack, {
				toValue: PositionInStack.Third,
				useNativeDriver: true,
			}),
			Animated.spring(this.cards[secondIndex].cardHorizontalStatus, {
				toValue: HorizontalStatus.Center,
				useNativeDriver: true,
			}),
			Animated.spring(this.cards[thirdIndex].positionInStack, {
				toValue: PositionInStack.Fourth,
				useNativeDriver: true,
			}),
			Animated.spring(this.cards[thirdIndex].cardHorizontalStatus, {
				toValue: HorizontalStatus.Center,
				useNativeDriver: true,
			}),
		]).start();
		this.cards[fourthIndex].positionInStack.setValue(PositionInStack.Hidden);
		this.cards[fourthIndex].cardHorizontalStatus.setValue(HorizontalStatus.Left);
		this.cards[fourthIndex].indexForData = this.state.currentIndex - 2;
		this.setState({ cardIndexInCenter: hiddenIndex, currentIndex: this.state.currentIndex - 1 });
	}

	// Cards animations
	private createCardAnimations(
		height: number,
		index: number,
		position: PositionInStack,
		horizontal: HorizontalStatus = HorizontalStatus.Center
	) {
		const positionInStack = new Animated.Value(position);
		const cardHorizontalStatus = new Animated.Value(horizontal);
		return {
			indexForData: index,
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

	// We use the same 5 views for cards,
	// just to reduce re-rendering here
	// it should operate like a virtualization
	// in FlatList or similar things
	private createCards = height => [
		this.createCardAnimations(height, 3, PositionInStack.Fourth),
		this.createCardAnimations(height, 2, PositionInStack.Third),
		this.createCardAnimations(height, 1, PositionInStack.Second),
		this.createCardAnimations(height, 0, PositionInStack.Front),
		this.createCardAnimations(height, null, PositionInStack.Hidden, HorizontalStatus.Left),
	];
	// We need to render smth, just to get proper height then
	private cards = this.createCards(0);

	private renderCardChildren(index) {
		const data = this.props.data[index];
		return data != null ? this.props.children(data) : null;
	}

	private getZIndex = (index: number) => {
		const step = PositionInStack.Hidden - this.state.cardIndexInCenter - 1;
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
					this.cards = this.createCards(height);
				}}>
				<PanGestureHandler onGestureEvent={this.onPan} onHandlerStateChange={this.onPanStateChange}>
					<View style={{ flex: 1 }}>
						{this.cards.map((i, index) => {
							if (i.indexForData < 0 || i.indexForData >= this.props.data.length) {
								return null;
							}
							return (
								<Animated.View
									key={index}
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
									<View style={styles.cardInner}>{this.renderCardChildren(i.indexForData)}</View>
								</Animated.View>
							);
						})}
					</View>
				</PanGestureHandler>
				<View style={styles.buttonsWrapper}>
					<View style={styles.buttonWrapper}>
						<View style={styles.button}>
							<Animated.View
								style={[
									styles.buttonBack,
									styles.buttonLeft,
									{
										opacity: this.leftButtonOpacity,
										transform: [{ scale: this.leftButtonScale }],
									},
								]}
							/>
							<Image
								source={require('./icons/trash-icon.png')}
								style={{ width: 24, height: 22, marginTop: 2 }}
							/>
						</View>
					</View>
					<View style={styles.buttonWrapper}>
						<View style={styles.button}>
							<Animated.View
								style={[
									styles.buttonBack,
									styles.buttonRight,
									{
										opacity: this.rightButtonOpacity,
										transform: [{ scale: this.rightButtonScale }],
									},
								]}
							/>
							<Image
								source={require('./icons/like-icon.png')}
								style={{ width: 24, height: 22, marginBottom: 2 }}
							/>
						</View>
					</View>
				</View>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		position: 'relative',
		paddingTop: 32, // space for two visible cards top's
		marginLeft: '5%',
		marginRight: '5%',
	},
	card: {
		flex: 1,
		position: 'absolute',
		top: 0,
		bottom: 0,
		left: 0,
		right: 0,
		backgroundColor: 'white',
		borderRadius: 8,
		shadowColor: 'rgb(16, 32, 39)',
		shadowOpacity: 0.16,
		shadowRadius: 24,
		shadowOffset: {
			width: 0,
			height: 16,
		},
		elevation: 10,
	},
	cardInner: {
		flex: 1,
		overflow: 'hidden',
		borderRadius: 8,
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
		alignItems: 'center',
		justifyContent: 'center',
		position: 'relative',
		shadowColor: 'rgb(16, 32, 39)',
		shadowOpacity: 0.16,
		shadowRadius: 24,
		shadowOffset: {
			width: 0,
			height: 16,
		},
		elevation: 10,
	},
	buttonBack: {
		borderRadius: 28,
		...StyleSheet.absoluteFillObject,
	},
	buttonLeft: {
		backgroundColor: 'black',
	},
	buttonRight: {
		backgroundColor: '#EB5757',
	},
});
