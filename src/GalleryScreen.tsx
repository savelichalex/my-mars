import * as React from 'react';
import { FlatList, View, Image, Text, StyleSheet } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { formatDate } from './helpers';

export const GalleryScreen = ({ photos }) =>
	photos.length === 0 ? (
		<View style={styles.emptyWrapper}>
			<Text style={styles.emptyWrapperText}>There are no any favorite photos of Mars yet :(</Text>
		</View>
	) : (
		<FlatList
			style={styles.list}
			contentInsetAdjustmentBehavior="automatic"
			data={photos.map((photo, index) => ({
				key: index,
				...photo,
			}))}
			renderItem={({ item }) => (
				<View style={styles.listItemWrapper}>
					<Image source={{ uri: item.imgSrc }} style={styles.listItemImage} />
					<LinearGradient
						style={styles.listItemInner}
						colors={['rgba(0,0,0,0.8)', 'rgba(235,87,87,0.1)']}>
						<Text style={styles.itemTitleText}>{item.roverName}</Text>
						<Text style={styles.itemSecondaryText}>{item.cameraName}</Text>
						<Text style={styles.itemSecondaryText}>{formatDate(new Date(item.date))}</Text>
					</LinearGradient>
				</View>
			)}
		/>
	);

const styles = StyleSheet.create({
	emptyWrapper: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		paddingHorizontal: '20%',
	},
	emptyWrapperText: {
		fontSize: 14,
		letterSpacing: 0.75,
		color: '#727C81',
		textAlign: 'center',
	},
	list: {
		flex: 1,
	},
	listItemWrapper: {
		height: 150,
	},
	listItemImage: {
		...StyleSheet.absoluteFillObject,
		aspectRatio: 1,
	},
	listItemInner: {
		...StyleSheet.absoluteFillObject,
		padding: 20,
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
});
