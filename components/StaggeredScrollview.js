/**
 * Created by zhirui on 8/3/16.
 */

import React, {Component} from 'react';
import {Animated, ScrollView, View, Text, StyleSheet, Dimensions} from 'react-native';

import AnimatedWrapper from './AnimatedWrapper';

let {width, height} = Dimensions.get('window');
export default class StaggeredScrollview extends Component {

  constructor(props) {
    super(props);

    this.state = {
      scrollOffset: 0,
      delay: 0,
      rowHeight: 0,
    }

    this.handleScroll = this.handleScroll.bind(this);
  }

  handleScroll(event) {
    this.setState({
      scrollOffset: event.nativeEvent.contentOffset.y
    });
  }

  render() {
    let delay = 0;
    let time = 750;

    return (
      <View style={this.props.style}>
    <ScrollView
      pagingEnabled={true}
      onScroll={this.handleScroll}
      showsVerticalScrollIndicator={false}>
      {this.props.children.map((child, key) => {
        this.state.delay+= time;
        return (
        <AnimatedWrapper delay={this.state.delay}>
            {child}
        </AnimatedWrapper>
        );})
      }
    </ScrollView>
        </View>
    );
  }
}

const styles = StyleSheet.create({
  view: {
    width: width,
    backgroundColor: 'black'
  }
})