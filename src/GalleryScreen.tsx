import * as React from 'react';
import { Text } from 'react-native';

export const GalleryScreen = ({ photos }) => (
	<Text>Hi there! {JSON.stringify(photos, null, '  ')}</Text>
);
