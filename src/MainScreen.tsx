import * as React from 'react';
import { Animated, View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Cards } from './Cards';

type LikedItem = {
	kind: 'Liked';
	index: number;
};

type TrashItem = {
	kind: 'Trashed';
	index: number;
};

type Items = LikedItem | TrashItem;

interface State {
	stack: Array<Items>;
}

export class MainScreen extends React.Component<null, State> {
	state: State = {
		stack: [],
	};
	data = Array(10)
		.fill(null)
		.map((_, index) => 'Image ' + index);

	cards = React.createRef<Cards>();

	undo = () => {
		const stack = this.state.stack.slice();
		const lastItem = stack.pop();
		switch (lastItem.kind) {
			case 'Liked':
				this.cards.current.goBackFromRight();
				break;
			case 'Trashed':
				this.cards.current.goBackFromLeft();
				break;
		}
		this.setState({ stack });
	};

	onLike = index => {
		this.setState({
			stack: this.state.stack.concat([{ kind: 'Liked', index }]),
		});
	};

	onTrash = index => {
		this.setState({
			stack: this.state.stack.concat([{ kind: 'Trashed', index }]),
		});
	};

	render() {
		return (
			<View style={styles.container}>
				<View style={styles.header}>
					<View style={{ flex: 1 }}>
						{this.state.stack.length > 0 && (
							<TouchableOpacity
								onPress={this.undo}
								hitSlop={{ left: 16, top: 16, right: 16, bottom: 16 }}>
								<Text style={styles.headerUndo}>Undo</Text>
							</TouchableOpacity>
						)}
					</View>
					<View style={{ flex: 1 }}>
						<Text style={styles.headerTitle}>My Mars</Text>
					</View>
					<View style={{ flex: 1 }}>
						<TouchableOpacity
							style={styles.headerFav}
							hitSlop={{ left: 16, top: 16, right: 16, bottom: 16 }}>
							<Image source={require('./icons/fav-icon.png')} style={{ width: 23, height: 20 }} />
						</TouchableOpacity>
					</View>
				</View>
				<Cards ref={this.cards} data={this.data} onLike={this.onLike} onTrash={this.onTrash}>
					{data => <Text>{data}</Text>}
				</Cards>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		marginVertical: 100,
		position: 'relative',
		//paddingTop: 32, // for Android
	},
	header: {
		flexDirection: 'row',
	},
	headerUndo: {
		fontWeight: '500',
		fontSize: 16,
		letterSpacing: 0.25,
		color: '#EB5757',
		marginLeft: 16,
	},
	headerTitle: {
		textAlign: 'center',
		fontWeight: '500',
		fontSize: 18,
		letterSpacing: 0.5,
	},
	headerFav: {
		alignSelf: 'flex-end',
		marginRight: 16,
	},
});
