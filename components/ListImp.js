/**
 * Created by zhirui on 8/4/16.
 */
/**
 * Created by zhirui on 8/3/16.
 */

import React, {Component} from 'react';
import {ListView, View, Text, StyleSheet, Dimensions, Image} from 'react-native';

import * as Animatable from 'react-native-animatable';
let {width, height} = Dimensions.get('window');
export default class ListImp extends Component {

  constructor(props) {
    super(props);
    var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.state = {
      dataSource: ds.cloneWithRows([
        {source: '/../assets/img/ddragon.gif'},
        {source: '/../assets/img/siblings.gif'},
        {source: '/../assets/img/Jon.gif'},
        {source: '/../assets/img/giphy.gif'},
        {source: '/../assets/img/drogo.gif'},
      ])
    };
  }
  render() {
    return (
      <ListView
        dataSource={this.state.dataSource}
        renderRow={(data) => <Image source={{ uri: data.source}} />}
      />
    );
  }
}


const styles = StyleSheet.create({
  view: {
    width: width,
    backgroundColor: 'black'
  },
  container: {
    height: height,
    width: width
  }
})