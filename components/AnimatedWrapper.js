import React, {Component, Easing} from 'react';
import {Animated, View} from 'react-native';

export default class AnimatedWrapper extends Component {

  constructor(props) {
    super(props);

    this.state = {
      fadeAnim: new Animated.Value(0),
      delay: 500,
    }
  }

  static defaultProps = {
    delay: 0,
    duration: 1000,
    fromValue: 0,
    toValue: 1,
    visible: true
  }

  componentDidMount() {
    if (this.props.visible) {
      Animated.timing(
        this.state.fadeAnim,
        {
          fromValue: 0,
          toValue: 1,
          duration: 1000,
          delay: this.props.delay,
        }
      ).start();
    }
  }

  render() {
    return(
      <Animated.View style={{opacity: this.state.fadeAnim}}>
        {this.props.children}
      </Animated.View>
    );
  }

}