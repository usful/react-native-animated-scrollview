/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  Animated,
  AppRegistry,
  StyleSheet,
  Text,
  View,
Image,
Dimensions,
Easing
} from 'react-native';

import * as Animatable from 'react-native-animatable';
let {width, height} = Dimensions.get('window');

import ListImp from './components/ListImp';

import StaggeredScrollview from './components/StaggeredScrollview';
console.disableYellowBox = true;



class AnimatedPlay extends Component {
  constructor(props) {
    super(props);

    this.state = {
      fadeAnim: new Animated.Value(0)
    }
  }

  componentDidMount() {
    Animated.sequence([
      Animated.timing(
        this.state.fadeAnim,
        {
          fromValue: 0,
          toValue: 1,
          easing: Easing.easeIn,
          duration: 3000
        }
      ),
      Animated.timing(
        this.state.fadeAnim,
        {
          fromValue: 1,
          toValue: 0,
          easing: Easing.easeOut,
          duration: 1000
        }
      )
    ]).start();
  }

  render() {
    return (
      <View style={{ flex:1, backgroundColor: 'transparent' }}>
          <Animated.Image style={{opacity: this.state.fadeAnim, height: height, width: width, alignSelf: 'center', position: 'absolute'}} source={require('./assets/img/Game-of-Thrones-Wallpapers-Black-640x960-iphone-4-4s.jpg')} />
        <StaggeredScrollview style={styles.container}>
          <Image resizeMode="cover" style={{height: 400}} source={require('./assets/img/atsea.jpg')} />
          <Image resizeMode="cover" style={{height: 400}}source={require('./assets/img/icequeen.jpg')} />
          <Image resizeMode="cover" style={{height: 400}}source={require('./assets/img/icetree.jpg')} />
          <Image resizeMode="cover" style={{height: 400}}source={require('./assets/img/tree.jpg')} />
          <Image resizeMode="cover" style={{height: 400}}source={require('./assets/img/firecircle.jpg')} />
          <Image resizeMode="cover" style={{height: 400}}source={require('./assets/img/flayed.jpg')} />
          <Image resizeMode="cover" style={{height: 400}}source={require('./assets/img/one.jpg')} />
          <Image resizeMode="cover" style={{height: 400}}source={require('./assets/img/blackandwhite.jpg')} />
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
