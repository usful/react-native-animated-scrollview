/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
Image,
Dimensions
} from 'react-native';

import * as Animatable from 'react-native-animatable';
let {width, height} = Dimensions.get('window');
import VideoCard from './components/VideoCard';

import ListImp from './components/ListImp';

import StaggeredScrollview from './components/StaggeredScrollview';
console.disableYellowBox = true;

let videos = [
  {
    video: "assets/vids/empty-lake",
    text: 'Introduction'
  },
  {
    video: "assets/vids/clip3",
    text: 'The Human Signature'
  },
  {
    video: "assets/vids/clip7",
    text: 'The Human Signature Continued'
  },
  {
    video: "assets/vids/clip13",
    text: 'This Project'
  },
  {
    video: "assets/vids/water",
    text: 'The Anthropocene'
  },
  {
    video: "assets/vids/clip5",
    text: 'Test Video Text'
  }
];

class AnimatedPlay extends Component {
  render() {
    return (
      <View style={{ flex:1, backgroundColor: 'transparent' }}>
        <Animatable.View animation="fadeIn" duration={300} easing="ease-in">
          <Image style={{ height: width, width: width, alignSelf: 'center', position: 'absolute'}} source={require('./assets/img/Game-of-Thrones-Wallpapers-Black-640x960-iphone-4-4s.jpg')} />
        </Animatable.View>

        <StaggeredScrollview style={styles.container}>
          <Image source={require('./assets/img/ddragon.gif')} />
          <Image source={require('./assets/img/siblings.gif')} />
          <Image source={require('./assets/img/drogo.gif')} />
          <Image source={require('./assets/img/Jon.gif')} />
          <Image source={require('./assets/img/giphy.gif')} />
          </StaggeredScrollview>

        </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});

AppRegistry.registerComponent('AnimatedPlay', () => AnimatedPlay);
