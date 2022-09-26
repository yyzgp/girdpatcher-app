import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useState, useEffect } from 'react';


import { TouchableOpacity, View, Text } from 'react-native';

import { FontAwesome } from '@expo/vector-icons';

import TabOneScreen from '../screens/TabOneScreen';
import TabTwoScreen from '../screens/TabTwoScreen';
import TabThreeScreen from '../screens/TabThreeScreen';
import { BottomTabParamList, TabOneParamList, TabTwoParamList, TabThreeParamList } from '../types';

const BottomTab = createBottomTabNavigator<BottomTabParamList>();
function MyTabBar({ state, descriptors, navigation }) {
  const focusedOptions = descriptors[state.routes[state.index].key].options;
  if (focusedOptions.tabBarVisible === false) {
    return null;
  }

  return (
    <View style={{
      flexDirection: 'row',
      backgroundColor: "#007bff"}}>

      {state.routes.map((route:any, index:number) => {

        const { options } = descriptors[route.key];
        const label = options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
            ? options.title
            : route.name;

        if(label == "Videos")
          return null;

        const isFocused = state.index === index;

        const onPress = () => {
 
            const event = navigation.emit({
                type: 'tabPress',
                target: route.key,
                canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
                navigation.navigate(route.name);
            }
        };

        const onLongPress = () => {
            navigation.emit({
                type: 'tabLongPress',
                target: route.key,
            });
        };

        let icon = "pie-chart";

        if(label == "Jobs")
          icon = "list";
        else if(label == "Settings")
          icon = "cog"

        return (
            <TouchableOpacity
            key={label}
            accessibilityRole="button"
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            testID={options.tabBarTestID}
            onPressIn={onPress}
            onLongPress={onLongPress}
            style={{ 
              flex: 1,
              padding: 20}}>
                <Text style={{ 
                  color: !isFocused ? '#5aaaff' : '#FFF', 
                  textAlign: 'center'}}>
                    <FontAwesome style={{fontSize: 36}} name={icon} />
                </Text>
            </TouchableOpacity>
        );
      })}
    </View>
  );
}
export default function BottomTabNavigator() {

  const colorScheme = "light";//useColorScheme();
  const [isLoaded, setIsLoaded] = React.useState(false);
  const [user, setUser] = React.useState(Object);

  useEffect(() => {
      if(!isLoaded) {
          AsyncStorage.getItem('user_info').then((e:any) => {
              setUser(JSON.parse(e));
          });
          setIsLoaded(true);
      }
  }, []);
  return (
    <BottomTab.Navigator
      initialRouteName="TabThree"
      tabBar={props => <MyTabBar {...props} />}>
      <BottomTab.Screen
        name="TabThree"
        children={(props) => <TabThreeNavigator {...props} userinfo={user} />}
        options={{
            tabBarLabel: "Dashboard",
        }}
      />
      <BottomTab.Screen
        name="TabOne"
        children={(props) => <TabOneNavigator {...props} userinfo={user} />}
        options={{
            tabBarLabel: "Jobs",
            tabBarIcon: ({ color }) => <TabBarIcon name="briefcase" color={color} />
        }}
      />
      <BottomTab.Screen
        name="TabTwo"
        component={TabTwoNavigator}
        options={{
          tabBarLabel: "Settings",
          tabBarIcon: ({ color }) => <TabBarIcon name="settings" color={color} />,
        }}
      />
    </BottomTab.Navigator>
  );
}

// You can explore the built-in icon families and icons on the web at:
// https://icons.expo.fyi/
function TabBarIcon(props: { name: React.ComponentProps<typeof Ionicons>['name']; color: string }) {
  return <Ionicons size={30} style={{ marginBottom: -3 }} {...props} />;
}

// Each tab has its own navigation stack, you can read more about this pattern here:
// https://reactnavigation.org/docs/tab-based-navigation#a-stack-navigator-for-each-tab
const TabOneStack = createStackNavigator<TabOneParamList>();

function TabOneNavigator({navigation, userinfo, route}: any) {
  return (
    <TabOneStack.Navigator>
      <TabOneStack.Screen
        name="TabOneScreen"
        children={() => <TabOneScreen userinfo={userinfo} navigation={navigation} />}
        options={{ headerShown: false }}
      />
    </TabOneStack.Navigator>
  );
}

const TabTwoStack = createStackNavigator<TabTwoParamList>();

function TabTwoNavigator() {
  return (
    <TabTwoStack.Navigator>
      <TabTwoStack.Screen
        name="TabTwoScreen"
        component={TabTwoScreen}
        options={{ headerShown: false }}
      />
    </TabTwoStack.Navigator>
  );
}

const TabThreeStack = createStackNavigator<TabThreeParamList>();

function TabThreeNavigator({navigation, userinfo, route}: any) {
  return (
    <TabThreeStack.Navigator>
      <TabThreeStack.Screen
        name="TabThreeScreen"
        children={() => <TabThreeScreen userinfo={userinfo} navigation={navigation} />}
        options={{ headerShown: false }}
      />
    </TabThreeStack.Navigator>
  );
}
