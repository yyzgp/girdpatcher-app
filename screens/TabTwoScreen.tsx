import * as React from 'react';
import { StyleSheet } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Text, View } from '../components/Themed';
import { AntDesign } from '@expo/vector-icons';
export default function TabTwoScreen(navigation : any) {
    return (
        <View style={styles.container}>
            <TouchableOpacity 
            onPress={() => {
                AsyncStorage.removeItem("user_info");
                navigation.navigation.navigate("Login");
            }}
            style={{
              width: "100%",
              padding: 20,
              backgroundColor: "#efefef",
              flexDirection: "row", 
              justifyContent: "flex-start", 
              alignItems: "center"}}>
                <AntDesign name="logout" style={{fontSize: 18}} />
                <Text style={{fontSize: 18, marginLeft: 10}}>Logout</Text>
            </TouchableOpacity>
        </View>
    );
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 20
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
    }
});

