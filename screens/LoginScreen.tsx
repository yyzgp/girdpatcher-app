import { StackScreenProps } from "@react-navigation/stack";
import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  TextInput,
  Alert,
  Image,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { RootStackParamList } from "../types";
import { LoginApi } from "../helpers/Api";
import { Loader } from "../components/Loader";
import { Splash } from "../components/Splash";
var timeout: any;
var dd: any;
export default function LoginScreen({
  navigation,
}: StackScreenProps<RootStackParamList, "Login">) {
  var today = new Date();
  const [email, setEmail] = useState(String);
  const [password, setPassword] = useState(String);
  const [showLoader, setShowLoader] = useState(Boolean);
  useEffect(() => {
    //setShowLoader(true);
    AsyncStorage.getItem("user_info").then((e) => {
      setTimeout(() => {
        setShowLoader(false);
        if (e != null || e != undefined) {
          navigation.navigate("Root");
        }
      }, 1400);
    });
  }, []);

  function login() {
    if (email == "" || password == "") displayIncorrectError();
    else
      LoginApi({ _data: { email, password } })
        .then((logRes) => {
          if (logRes.status) {
            AsyncStorage.setItem("user_info", JSON.stringify(logRes.data)).then(
              (e) => {
                navigation.navigate("Root");
              }
            );
          } else {
            displayIncorrectError();
          }
        })
        .catch((error) => {
          console.log(error);
          displayIncorrectError();
        });
  }

  function displayIncorrectError() {
    Alert.alert("", "Incorrect Username or Password.", [
      { text: "OK", onPress: () => {} },
    ]);
  }

  return (
    <View style={styles.container}>
      <View style={{ alignItems: "center" }}>
        <Image
          source={require("../resource/images/logo_white.png")}
          style={{ height: 100, width: 100 }}
        />
      </View>
      <View>
        <Text style={styles.title}>Email</Text>
        <TextInput
          style={styles.input}
          onChangeText={(e) => {
            setEmail(e);
          }}
          placeholder="Email"
        />
      </View>
      <View style={styles.input_group}>
        <Text style={styles.title}>Password</Text>
        <TextInput
          secureTextEntry
          style={styles.input}
          onChangeText={(e) => {
            setPassword(e);
          }}
          placeholder="********"
        />
      </View>
      <TouchableOpacity onPress={login} style={styles.button}>
        <Text style={styles.button_text}>Login</Text>
      </TouchableOpacity>

      {showLoader ? <Splash /> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  input_group: {
    marginTop: 15,
  },
  input: {
    borderWidth: 1,
    borderColor: "#888",
    borderRadius: 5,
    width: "100%",
    marginTop: 10,
    padding: 5,
    paddingHorizontal: 10,
    color: "#555",
  },
  button: {
    backgroundColor: "#2980b9",
    marginTop: 20,
    paddingHorizontal: 10,
    paddingVertical: 15,
    borderRadius: 5,
  },
  button_text: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
  },
  container: {
    backgroundColor: "#fff",
    flex: 1,
    padding: 40,
    justifyContent: "center",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000000",
  },
});
