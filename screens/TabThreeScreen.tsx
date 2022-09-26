import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Dimensions, Text, Animated } from 'react-native';
import { View } from '../components/Themed';
import { LinearGradient } from 'expo-linear-gradient';

import { GetComms } from '../helpers/Api'

export default function TabThreeScreen({navigation, userinfo} : any) {
    const [tCount, settCount] = useState(0);
    const [wCount, setwCount] = useState(0);
    const [mCount, setmCount] = useState(0);


    useEffect(() => {
        if(userinfo.id != undefined) {
            GetComms({_data : {
                "user_id": userinfo.id,
            }})
            .then(c => {
                settCount(c.total);
                setmCount(c.monthly);
                setwCount(c.weekly);
            });
        }
    },[userinfo]);

    return (
        <View style={styles.container}>
            <View>
                <LinearGradient
                    colors={['#00bbff', '#007bff']}
                    start={[1.0, 1.0]}
                    end={[0.0, 1.0]}
                    style={{display: "flex", position: "absolute", height: "100%", width: "100%", borderBottomLeftRadius: 10, borderBottomRightRadius: 10}} />

                <View style={{flexDirection: "row", backgroundColor: "transparent", alignItems: "center", width: "100%", padding: 20}}>
                    <Text style={{fontSize: 24, color: "#fff"}}>welcome</Text>
                    <Text style={{fontSize: 32, color: "#ffc107", fontWeight: "600", marginLeft: 5}}>{userinfo.fullname}</Text>
                </View>
                <Text style={{color: "#fff", fontSize: 16, marginTop: 20, textAlign: "center"}}>Current Commission Earnings</Text>
                <View style={{flexDirection: "row", backgroundColor: "transparent", justifyContent: "center", alignItems: "center", marginBottom: 120}}>
                    <Text style={{fontSize: 42, color: "#fff"}}>$</Text>
                    <Text style={{fontSize: 72, color: "#fff", fontWeight: "bold"}}>{tCount.toFixed(2)}</Text>
                </View>

            </View>
            <View style={{padding: 20, marginTop: -60, width: "90%", alignSelf: "center", flexDirection: "row", borderWidth: 1, borderColor: "#d2d2d2", borderRadius: 10}}>
                <View style={{justifyContent: "center", alignItems: "center" , flex: 1, borderRightWidth: 1, borderRightColor: "#d2d2d2"}}>
                    <Text style={{color: "#888", fontSize: 16}}>Week's Earnings</Text>
                    <View style={{flexDirection: "row", alignItems: "center"}}>
                        <Text style={{fontSize: 24, color: "#888"}}>$</Text>
                        <Text style={{fontSize: 36, color: "#28a745", fontWeight: "bold"}}>{wCount.toFixed(2)}</Text>
                    </View>
                </View>
                <View style={{justifyContent: "center", alignItems: "center", flex: 1}}>
                    <Text style={{color: "#888", fontSize: 16}}>Month's Earnings</Text>
                    <View style={{flexDirection: "row", alignItems: "center"}}>
                        <Text style={{fontSize: 24, color: "#888"}}>$</Text>
                        <Text style={{fontSize: 36, color: "#28a745", fontWeight: "bold"}}>{mCount.toFixed(2)}</Text>
                    </View>
                </View>
            </View>
        </View>
    );
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 0,
    }
});

