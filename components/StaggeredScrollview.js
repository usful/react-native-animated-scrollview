/**
 * Created by zhirui on 8/3/16.
 */

import React, {Component} from 'react';
import {Animated, ScrollView, View, Text, StyleSheet, Dimensions, Easing, Image} from 'react-native';

import AnimatedWrapper from './AnimatedWrapper';

let {width, height} = Dimensions.get('window');
export default class StaggeredScrollview extends Component {

  constructor(props) {
    super(props);

    this.state = {
      scrollOffset: 0,
      fadeAnim: new Animated.Value(0),
      time: 750,
      //temp value, ususally, replaced when component mounts, right now only works with uniform/mostly uniform rows
      rowHeight: 200,
      screenSpace: height,
      animatedValues: [],
      visibleAnimations: [],
      interpolatedValues: [],
      scalingValues: [],
      rotateValues: [],
      alreadyAnimated: 0,
      endFade: new Animated.Value(0),
      interred: 0
    }

    this.state.interred = this.state.endFade.interpolate({
      inputRange: [1763, 1900],
      outputRange: [0, .5]
    });

    this.state.visibleAnimations.push(
      Animated.timing(
      this.state.fadeAnim,
      {
        fromValue: 0,
        toValue: 1,
        duration: 1000,
        easing: Easing.easeIn,
        delay: 2800
      })
    );

    this.handleScroll = this.handleScroll.bind(this);
  }

  handleScroll(event) {
  this.setState({
      scrollOffset: event.nativeEvent.contentOffset.y,
      rowHeight: event.nativeEvent.contentSize.height/this.props.children.length
    });

    console.log(this.state.scrollOffset);
    while (((this.state.alreadyAnimated - 1) * this.state.rowHeight) <= (this.state.screenSpace + this.state.scrollOffset)) {
      this.state.visibleAnimations.push(Animated.timing(
        this.state.animatedValues[this.state.alreadyAnimated - 1],
        {
          fromValue: 0,
          toValue: 1,
          duration: 500,
          easing: Easing.easeIn
        }
      ));

      ++this.state.alreadyAnimated;
    }

    Animated.sequence(
      this.state.visibleAnimations
    ).start();
    this.state.visibleAnimations = [];


    if (this.state.scrollOffset > event.nativeEvent.contentSize.height - this.state.screenSpace) {
      console.log('ran this mate');
      this.state.endFade.setValue(this.state.scrollOffset);
    }
  }

  componentDidMount() {

    // doesn't really need to use map, could just do with a for loop
    // it just creates animations and maps them to the animated values array
    this.state.animatedValues.map((value, key) => {
      if (((key + 1) * this.state.rowHeight) <= (this.state.screenSpace + this.state.scrollOffset)) {
        this.state.visibleAnimations.push(Animated.timing(
          this.state.animatedValues[key],
          {
            fromValue: 0,
            toValue: 1,
            duration: 500,
            easing: Easing.easeIn
          }
        ));
      }
    });

    Animated.sequence(
      this.state.visibleAnimations
    ).start();
    this.state.alreadyAnimated = this.state.visibleAnimations.length;

    // reset the array so not all animations are run again onscroll
    this.state.visibleAnimations = [];
  }
  render() {

    return (
      <Animated.View style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'transparent',
        opacity: this.state.fadeAnim
      }}>
        <ScrollView
            onScroll={this.handleScroll}
            scrollEventThrottle={100}
            showsVerticalScrollIndicator={false}>
            {this.props.children.map((child, key) => {
              this.state.animatedValues.push(new Animated.Value(0));
              this.state.interpolatedValues.push(this.state.animatedValues[key].interpolate({
                inputRange: [0, 1],
                outputRange: [-50, 0]
              }));
              return (
                <Animated.View style={{opacity: this.state.animatedValues[key], transform: [{translateX: this.state.interpolatedValues[key]}]}}>

                  {child}
                </Animated.View>
              );})
            }
          </ScrollView>

        <Animated.Image style={{opacity: this.state.interred, top: 0, height: height, width: width, alignSelf: 'center', position: 'absolute'}} source={require('../assets/img/wolf.jpg')} />

      </Animated.View>
    );
  }
}

const styles = StyleSheet.create({
  view: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  }
})