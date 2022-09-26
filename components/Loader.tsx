import React from 'react';
import { ActivityIndicator, StyleSheet, Text, View, Dimensions } from 'react-native';

const _WIDTH = Dimensions.get("screen").width;
const _HEIGHT = Dimensions.get("screen").height;

export function Loader() {
  return (
    <View style={[styles.container]}>
        <ActivityIndicator size="large" color="#000000" />
    </View>
  );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        position: "absolute",
        zIndex: 9,
        width: _WIDTH,
        height: _HEIGHT,
        top: 0,
        left: 0,
    }
});