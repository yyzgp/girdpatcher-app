import React, { useRef, useEffect } from 'react';
import { StyleSheet, View, Dimensions, Image, Animated } from 'react-native';

const _WIDTH = Dimensions.get("screen").width;
const _HEIGHT = Dimensions.get("screen").height;

const FadeInView = (props) => {
    const fadeAnim = useRef(new Animated.Value(0)).current  // Initial value for opacity: 0

    React.useEffect(() => {
      setTimeout(() => {
        Animated.timing(
          fadeAnim,
          {
            toValue: -140.5,
            duration: 1000,
            useNativeDriver: true
          }
        ).start();
      }, 300);
    }, [fadeAnim])

    return (
      <Animated.View
        style={{
          ...props.style,
          transform: [{
            translateY: fadeAnim
          }]
        }}
      >
        {props.children}
      </Animated.View>
    );
}

export function Splash() {

  return (
    <View style={[styles.container, styles.horizontal]}>
        <FadeInView style={{overflow: "hidden", position: "absolute"}}>
            <Image source={require("../resource/images/logo_white.png")} style={{height: 100, width: 100}} />
        </FadeInView>
    </View>
  );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: "#fff",
        alignItems: "center",
        position: "absolute",
        zIndex: 9,
        width: _WIDTH,
        height: _HEIGHT,
        top: 0,
        left: 0,
        elevation: 2
    }
});