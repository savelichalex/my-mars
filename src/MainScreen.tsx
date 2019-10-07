import * as React from 'react';
import {
	Animated,
	View,
	Text,
	StyleSheet,
	TouchableOpacity,
	Image,
	Alert,
	NativeModules,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { MaterialIndicator } from 'react-native-indicators';
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

type ImageItem = {
	img_src: string;
	roverName: string;
	date: Date;
	cameraName: string;
};
interface State {
	stack: Array<Items>;
	data: Array<ImageItem>;
}

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export class MainScreen extends React.Component<null, State> {
	constructor(props) {
		super(props);

		const API_KEY = 'houOH3QDrs78RuJ32ZOxoZEmHZ9d1YUpabVdmBEp';
		fetch(
			`https://api.nasa.gov/mars-photos/api/v1/rovers/curiosity/photos?sol=1000&api_key=${API_KEY}`
		)
			.then(res => res.json())
			.then(res => {
				if (res.error != null) throw res.error;
				this.setState({
					data: res.photos.map(({ camera, img_src, earth_date, rover }) => ({
						imgSrc: img_src,
						roverName: rover.name,
						date: new Date(earth_date),
						cameraName: camera.full_name,
					})),
				});
			})
			.catch(e => {
				Alert.alert(e.code.split('_').join(' '), e.message);
			});
	}

	state: State = {
		stack: [],
		data: null,
	};

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

	onGoToFavs = () => {
		NativeModules.NavigationManager.present('GalleryScreen', {
			photos: this.state.stack
				.filter(({ kind }) => kind === 'Liked')
				.map(({ index }) => this.state.data[index]),
		});
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
		const UndoText = (
			<Text
				style={[styles.headerUndo, { color: this.state.stack.length > 0 ? '#EB5757' : '#CFD8DC' }]}>
				Undo
			</Text>
		);
		return (
			<View style={styles.container}>
				<View style={styles.header}>
					<View style={styles.headerItem}>
						{this.state.stack.length > 0 ? (
							<TouchableOpacity
								onPress={this.undo}
								hitSlop={{ left: 16, top: 16, right: 16, bottom: 16 }}>
								{UndoText}
							</TouchableOpacity>
						) : (
							UndoText
						)}
					</View>
					<View style={styles.headerItem}>
						<Text style={styles.headerTitle}>My Mars</Text>
					</View>
					<View style={styles.headerItem}>
						<TouchableOpacity
							style={styles.headerFav}
							hitSlop={{ left: 16, top: 16, right: 16, bottom: 16 }}
							onPress={this.onGoToFavs}>
							<Image source={require('./icons/fav-icon.png')} style={styles.headerFavIcon} />
						</TouchableOpacity>
					</View>
				</View>
				{this.state.data == null ? (
					<View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
						<MaterialIndicator color="#EB5757" size={40} trackWidth={2} />
					</View>
				) : (
					<Cards
						ref={this.cards}
						data={this.state.data}
						onLike={this.onLike}
						onTrash={this.onTrash}>
						{(data: ImageItem) => (
							<>
								<Image source={{ uri: data.imgSrc }} style={styles.itemImage} />
								<LinearGradient
									colors={['rgba(0,0,0,0.8)', 'rgba(235,87,87,0)']}
									style={styles.itemInfo}>
									<Text style={styles.itemTitleText}>{data.roverName}</Text>
									<Text style={styles.itemSecondaryText}>{data.cameraName}</Text>
									<Text style={styles.itemSecondaryText}>
										{months[data.date.getMonth()]} {data.date.getDay()}, {data.date.getFullYear()}
									</Text>
								</LinearGradient>
							</>
						)}
					</Cards>
				)}
				<View style={styles.bottomDescriptionWrapper}>
					<Text style={styles.bottomDescription}>
						{this.state.data == null
							? 'Downloading'
							: `${this.state.data.length - this.state.stack.length} cards`}
					</Text>
				</View>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		position: 'relative',
	},
	header: {
		flexDirection: 'row',
		height: 56,
		marginBottom: 16,
	},
	headerItem: {
		flex: 1,
		justifyContent: 'center',
	},
	headerUndo: {
		fontWeight: '500',
		fontSize: 16,
		letterSpacing: 0.25,
		marginLeft: 16,
	},
	headerTitle: {
		textAlign: 'center',
		fontWeight: '500',
		fontSize: 18,
		letterSpacing: 0.5,
		color: '#102027',
	},
	headerFav: {
		alignSelf: 'flex-end',
		marginRight: 16,
	},
	headerFavIcon: {
		width: 23,
		height: 20,
	},
	itemImage: {
		...StyleSheet.absoluteFillObject,
		top: -5,
		bottom: -5,
		aspectRatio: 1,
	},
	itemInfo: {
		...StyleSheet.absoluteFillObject,
		padding: 24,
	},
	itemTitleText: {
		fontWeight: '500',
		fontSize: 20,
		letterSpacing: 0.15,
		color: 'white',
		marginBottom: 4,
	},
	itemSecondaryText: {
		fontSize: 14,
		letterSpacing: 0.75,
		color: 'white',
	},
	bottomDescriptionWrapper: {
		height: 20,
		marginTop: 16,
		alignItems: 'center',
		justifyContent: 'center',
	},
	bottomDescription: {
		fontSize: 14,
		letterSpacing: 0.75,
		color: '#727C81',
	},
});
