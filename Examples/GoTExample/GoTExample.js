/**
 * Sample app using animated scroll
 * https://github.com/usful/react-native-animated-scrollview
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

let {width, height} = Dimensions.get('window');

import AnimatedScrollView from 'react-native-animated-scrollview';


export default class GoTExample extends Component {
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
        <AnimatedScrollView delay={3700} parrallaxOutputMax={180} parrallaxOutputMin={20} footerImage={<Image source={require('./assets/img/wolf.jpg')} />}>
          <Image resizeMode="cover" style={{height: 400}} source={require('./assets/img/atsea.jpg')} />
          <Image resizeMode="cover" style={{height: 400}}source={require('./assets/img/icequeen.jpg')} />
          <Image resizeMode="cover" style={{height: 400}}source={require('./assets/img/icetree.jpg')} />
          <Image resizeMode="cover" style={{height: 400}}source={require('./assets/img/tree.jpg')} />
          <Image resizeMode="cover" style={{height: 400}}source={require('./assets/img/firecircle.jpg')} />
          <Image resizeMode="cover" style={{height: 400}}source={require('./assets/img/flayed.jpg')} />
          <Image resizeMode="cover" style={{height: 400}}source={require('./assets/img/one.jpg')} />
          <Image resizeMode="cover" style={{height: 400}}source={require('./assets/img/blackandwhite.jpg')} />
          <Image resizeMode="cover" style={{height: 400}} source={require('./assets/img/atsea.jpg')} />
          <Image resizeMode="cover" style={{height: 400}}source={require('./assets/img/icequeen.jpg')} />
          <Image resizeMode="cover" style={{height: 400}}source={require('./assets/img/icetree.jpg')} />
          <Image resizeMode="cover" style={{height: 400}}source={require('./assets/img/tree.jpg')} />
          <Image resizeMode="cover" style={{height: 400}}source={require('./assets/img/firecircle.jpg')} />
          <Image resizeMode="cover" style={{height: 400}}source={require('./assets/img/flayed.jpg')} />
          <Image resizeMode="cover" style={{height: 400}}source={require('./assets/img/one.jpg')} />
          <Image resizeMode="cover" style={{height: 400}}source={require('./assets/img/blackandwhite.jpg')} />
        </AnimatedScrollView>

      </View>
    );
  }
}