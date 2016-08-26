/**
 * Created by zhirui on 8/3/16.
 */

import React, {Component} from 'react';
import {Animated, ScrollView, View, Text, StyleSheet, Dimensions, Easing, Image, TouchableOpacity, Modal} from 'react-native';

let {width, height} = Dimensions.get('window');
export default class StaggeredScrollview extends Component {

  static defaultProps = {
    rowHeight: 200
  };
  
  constructor(props) {
    super(props);
    
    this.state = {
      scrollOffset: 0,
      // index of expanded child, otherwise it's false
      expandedModal: false,
      fadeAnim: new Animated.Value(0),
      rowHeight: 300,
      screenSpace: height,
      styleValues: [],
      visibleAnimations: [],
      alreadyAnimated: 0,
      footerAnim: new Animated.Value(0),
      isInterredCalculated: false,
      maxScrollOffset: 0,
      interred: 0,
    }

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

  // TODO: instead of manually setting the values, implement using animated events that directly hook into the onscroll event
  handleScroll(event) {
   this.setState({
      scrollOffset: event.nativeEvent.contentOffset.y,
    });

    if (!this.state.isInterredCalculated) {
      this.state.maxScrollOffset = event.nativeEvent.contentSize.height - this.state.screenSpace;
      this.state.interred = this.state.footerAnim.interpolate({
        inputRange: [this.state.maxScrollOffset + 20, event.nativeEvent.contentSize.height - this.state.screenSpace + 200],
        outputRange: [0, .5]
      });
      this.state.isInterredCalculated = true;
    }

    while (((this.state.alreadyAnimated - 1) * this.props.rowHeight) <= (this.state.screenSpace + this.state.scrollOffset)) {
      this.state.visibleAnimations.push(Animated.timing(
        this.state.styleValues[this.state.alreadyAnimated - 1].animated,
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

    this.state.styleValues.forEach((child) => {
      if ((child.y + this.props.rowHeight >= this.state.scrollOffset) && (child.y <= this.state.scrollOffset + this.state.screenSpace)) {
        child.parrallaxOffset.setValue(this.state.scrollOffset + (this.state.screenSpace - this.props.rowHeight) - child.y);
      }
    })


    // Only runs once you scroll past last item in the scrollview
    if (this.state.scrollOffset > event.nativeEvent.contentSize.height - this.state.screenSpace) {
      this.state.footerAnim.setValue(this.state.scrollOffset);
    }
  }

  componentDidMount() {

    let key = 0;

    // creates animations and maps them to the animated values array for the first visible elements
    while (((key) * this.props.rowHeight) <= (this.state.screenSpace)) {
      this.state.styleValues[key].parrallaxOffset.setValue(this.state.screenSpace - this.props.rowHeight - key * this.props.rowHeight);
      this.state.visibleAnimations.push(Animated.timing(
        this.state.styleValues[key].animated,
        {
          fromValue: 0,
          toValue: 1,
          duration: 500,
          easing: Easing.easeIn
        }
      ));
      ++key;
    }

    Animated.sequence(
      this.state.visibleAnimations
    ).start();
    this.state.alreadyAnimated = this.state.visibleAnimations.length;

    // reset the array so not all animations are run again onscroll
    this.state.visibleAnimations = [];
  }

  renderModal(child, style) {

    let modalOpacity = new Animated.Value(0);
    let transformDriver = new Animated.Value(0);

    let offset = style.y - ((this.state.screenSpace - style.height)/2 + this.state.scrollOffset);


    let modalTranslateY =
      transformDriver.interpolate({
        inputRange: [0, 1],
        outputRange: [offset, 0]
      });

    // this gets the interpolated value of the parrallax offset, is there a better way to do this?
    let parrallaxOffset = (this.state.scrollOffset + (this.state.screenSpace - this.props.rowHeight) - style.y)/(this.state.screenSpace-this.props.rowHeight)*(160) - 180;

    console.log(parrallaxOffset);

    let parrallaxTranslateY =
      transformDriver.interpolate({
        inputRange: [0, 1],
        outputRange: [parrallaxOffset, 0]
      });

    let expandView =
      transformDriver.interpolate({
        inputRange: [0, 1],
        outputRange: [this.props.rowHeight, style.actualHeight]
      });

    this.setState({
      expandedModal: <Animated.View style={{
                      opacity: modalOpacity,
                      position: 'absolute',
                      top: 0,
                      height: this.state.screenSpace,
                      width: width,
                      backgroundColor: 'black',
                      justifyContent: 'center'}}>
                        <Animated.View style={{overflow: "hidden", opacity: modalOpacity, height: expandView, transform: [{translateY: modalTranslateY}]}}>
                          <Animated.View style={{transform: [{translateY: parrallaxTranslateY}]}}>
                          <TouchableOpacity style={{alignItems: 'center'}} onPress={() => {
                            Animated.sequence([
                              Animated.timing(
                                transformDriver,
                                {
                                  fromValue: 1,
                                  toValue: 0,
                                  duration: 400,
                                  easing: Easing.easeOut
                                }
                              ),
                              Animated.timing(
                                modalOpacity,
                                {
                                  fromValue: 1,
                                  toValue: 0,
                                  duration: 300,
                                  easing: Easing.easeOut
                                }
                              ),
                            ]).start(status => status.finished ? this.setState({expandedModal: false}) : {});

                          }}>
                            {child}
                          </TouchableOpacity>
                            </Animated.View>
                        </Animated.View>
                      </Animated.View>
    });

    Animated.sequence([
      Animated.timing(
        modalOpacity,
        {
          fromValue: 0,
          toValue: 1,
          duration: 300,
          easing: Easing.easeIn
        }
      ),
      Animated.timing(
        transformDriver,
        {
          fromValue: 0,
          toValue: 1,
          duration: 400,
          easing: Easing.easeIn
        }
      )
    ]).start();
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
          scrollEventThrottle={16}
          showsVerticalScrollIndicator={false}>

          {this.props.children.map((child, key) => {

            // pushing animation setup object per child
            this.state.styleValues.push(
              {
                animated: new Animated.Value(0),
                scaling: new Animated.Value(1),
                parrallaxOffset: new Animated.Value(0),
              }
            );
            // TODO: Need to find a way to calculate the interpolation output range
            this.state.styleValues[key].translateY = this.state.styleValues[key].parrallaxOffset.interpolate({
              inputRange: [0, this.state.screenSpace - this.props.rowHeight],
              outputRange: [-180, -20],
            });

            return (
              <View style={{overflow: 'hidden', height: this.props.rowHeight}}
                onLayout={ ({nativeEvent: {layout : {x: x, y: y, width: width, height: height}}}) => {
                  this.state.styleValues[key].y = y;
                  this.state.styleValues[key].height = height;
              }}>
                <Animated.View
                  style={{
                  opacity: this.state.styleValues[key].animated,
                  alignItems: 'center',
                  justifyContent: 'center',
                  transform: [{translateY: this.state.styleValues[key].translateY}]
                }} onLayout={ ({nativeEvent: {layout : {height: height}}}) => {
                  this.state.styleValues[key].actualHeight = height;
              }}>

                  <TouchableOpacity style={{alignItems: 'center'}} onPress={() => this.renderModal(child, this.state.styleValues[key])}>
                    {child}
                  </TouchableOpacity>
                </Animated.View>
              </View>
            );})
          }
        </ScrollView>
        {(this.state.expandedModal ) ? this.state.expandedModal : null}

        {(this.state.scrollOffset > this.state.maxScrollOffset + 20) ? <Animated.Image style={{
          opacity: this.state.interred,
          top: 0,
          height: height,
          width: width,
          position: 'absolute'}} source={require('./img/wolf.jpg')} /> : null }
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