import React, {Component, Easing} from 'react';
import {Animated, View} from 'react-native';

export default class AnimatedWrapper extends Component {

  constructor(props) {
    super(props);

    this.state = {
      fadeAnim: new Animated.Value(0),
    }
  }

  static defaultProps = {
    delay: 0,
    duration: 1000,
    fromValue: 0,
    toValue: 1,
    visible: false
  }

  shouldComponentUpdate(nextProps) {
    let bool = ((this.props.visible === false) && (nextProps.visible === true));
    return bool;
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.visible === true) {
      this.props.animate.start();
      console.log('i rant');
    }
  }
  componentDidMount() {
    console.log('ran');
    if (this.props.visible) {
      this.props.animate.start();
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