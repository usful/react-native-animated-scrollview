/**
 * Created by zhirui on 8/3/16.
 */

import React, {Component} from 'react';
import {Animated, ScrollView, View, Text, StyleSheet, Dimensions, Easing, Image, TouchableWithoutFeedback, Modal} from 'react-native';

import AnimatedWrapper from './AnimatedWrapper';

let {width, height} = Dimensions.get('window');
export default class StaggeredScrollview extends Component {

  constructor(props) {
    super(props);

    this.state = {
      scrollOffset: 0,
      // index of expanded model, otherwise is false
      expandedModal: false,
      fadeAnim: new Animated.Value(0),
      time: 750,
      //temp value, usually replaced when component mounts, right now only works with uniform/mostly uniform rows
      rowHeight: 200,
      screenSpace: height,
      styleValues: [],
      visibleAnimations: [],
      interpolatedValues: [],
      scalingValues: [],
      alreadyAnimated: 0,
      endFade: new Animated.Value(0),
      interred: 0,
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

    while (((this.state.alreadyAnimated - 1) * this.state.rowHeight) <= (this.state.screenSpace + this.state.scrollOffset)) {
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


    if (this.state.scrollOffset > event.nativeEvent.contentSize.height - this.state.screenSpace) {
      console.log('ran this mate');
      this.state.endFade.setValue(this.state.scrollOffset);
    }
  }

  componentDidMount() {

    // doesn't really need to use map, could just do with a for loop
    // it just creates animations and maps them to the animated values array
    this.state.styleValues.map((value, key) => {
      if (((key + 1) * this.state.rowHeight) <= (this.state.screenSpace + this.state.scrollOffset)) {
        this.state.visibleAnimations.push(Animated.timing(
          this.state.styleValues[key].animated,
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

  renderModal(child, ref) {


    this.refs[ref].measure((x, y, width, height) =>{

      let modalOpacity = new Animated.Value(0);
      let transformDriver = new Animated.Value(0);

      let offset = y - ((this.state.screenSpace - height)/2 + this.state.scrollOffset);


      let modalTranslateY =
        transformDriver.interpolate({
          inputRange: [0, 1],
          outputRange: [offset, 0]
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
                          <Animated.View style={{transform: [{translateY: modalTranslateY}]}}>
                            <TouchableWithoutFeedback onPress={() => {
                              Animated.sequence([
                                Animated.timing(
                                  transformDriver,
                                  {
                                    toValue: 0,
                                    duration: 400,
                                    easing: Easing.easeOut
                                  }
                                ),
                                Animated.timing(
                                  modalOpacity,
                                  {
                                    toValue: 0,
                                    duration: 300,
                                    easing: Easing.easeOut
                                  }
                                ),
                              ]).start(status => status.finished ? this.setState({expandedModal: false}) : {});

                            }}>
                              {child}
                            </TouchableWithoutFeedback>
                          </Animated.View>
                        </Animated.View>
      });

      Animated.sequence([
        Animated.timing(
          modalOpacity,
          {
            toValue: 1,
            duration: 300,
            easing: Easing.easeIn
          }
        ),
        Animated.timing(
          transformDriver,
          {
            toValue: 1,
            duration: 400,
            easing: Easing.easeIn
          }
        )
      ]).start();
    });
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
              this.state.styleValues.push(
                {
                  ref: "view" + key,
                  animated: new Animated.Value(0),
                  scaling: new Animated.Value(1),
                }
              );
              this.state.styleValues[key].translateX = this.state.styleValues[key].animated.interpolate({
                inputRange: [0, 1],
                outputRange: [-50, 0]
              });

              return (
                <View ref={"view" + key}>
                <Animated.View
                  style={{
                  opacity: this.state.styleValues[key].animated,
                  position: this.state.styleValues[key].position,
                  alignSelf: 'center',
                  transform: [{translateY: this.state.styleValues[key].translateX}]
                }} >

                  <TouchableWithoutFeedback onPress={() => this.renderModal(child, this.state.styleValues[key].ref)}>
                  {child}
                    </TouchableWithoutFeedback>
                </Animated.View>
                  </View>
              );})
            }
          </ScrollView>
        {(this.state.expandedModal ) ? this.state.expandedModal : null}

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