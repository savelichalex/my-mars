/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */

import { AppRegistry, YellowBox } from 'react-native';
YellowBox.ignoreWarnings(['`-[RCTRootView cancelTouches]']);

import { MainScreen } from './src/MainScreen';
import { GalleryScreen } from './src/GalleryScreen';

AppRegistry.registerComponent('MainScreen', () => MainScreen);
AppRegistry.registerComponent('GalleryScreen', () => GalleryScreen);
