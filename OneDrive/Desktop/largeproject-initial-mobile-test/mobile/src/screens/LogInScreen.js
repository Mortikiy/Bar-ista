import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TouchableOpacity,
  ImageBackground,
  Dimensions,
  Platform,
  TextInput,
  KeyboardAvoidingView,
} from "react-native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import Ionicons from "react-native-vector-icons/Ionicons";

import LogoImage from "../assets/logo.svg";

import LoginSVG from "../assets/login.svg";
import CustomButton from "../components/CustomButton";
import InputField from "../components/InputField";

const LogInScreen = ({ navigation }) => {
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = () => {
    fetch("https://obscure-springs-89188.herokuapp.com/api/login", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        login: login,
        password: password,
      }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network error - response not OK");
        }
        return response.json();
      })
      .then((data) => {
        if (data.error === "no user found") {
          alert("No user found");
        } else {
          console.log(data);
          alert("Hello, " + data.firstName + " " + data.lastName + "!");
        }
        // Here is where we do something with the response data our call gives us (nothing for login besides a cookie maybe)
      })
      .catch((error) => {
        console.error("Login request error:", error);
      });
  };

  return (
    <ImageBackground
      style={styles.background}
      source={require("../assets/gradient.png")}
    >
      <SafeAreaView style={{ flex: 1, justifyContent: "center" }}>
        {/* Added a back button */}
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={{
            position: "absolute",
            top: Platform.OS === "ios" ? 40 : 20,
            left: 0,
            padding: 10,
            zIndex: 1,
          }}
        >
          <MaterialIcons
            name="arrow-back"
            size={29}
            color="white"
            style={{ marginRight: 5 }}
          />
        </TouchableOpacity>
        <KeyboardAvoidingView
          style={{ paddingHorizontal: 25 }}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          <View style={{ alignItems: "center" }}>
            <LoginSVG height={200} width={200} />
          </View>
          <Text
            style={{
              fontSize: 28,
              fontWeight: "500",
              color: "#fff",
            }}
          >
            Login
          </Text>
          <View style={styles.container}>
            <MaterialIcons
              name="alternate-email"
              size={29}
              color="#666"
              style={{ marginRight: 5 }}
            />
            <TextInput
              placeholder="Email"
              style={styles.input}
              keyboardType="email-address"
              onChangeText={(text) => setLogin(text)}
              value={login}
            />
          </View>

          {/* <InputField
            label={"Email"}
            icon={
              <MaterialIcons
                name="alternate-email"
                size={29}
                color="#666"
                style={{ marginRight: 5 }}
              />
            }
            keyboardType="email-address"
            onChange={(event) => setLogin(event.target.value)}
            value={login}
          /> */}
          {/* <View>
            <TextInput
              placeholder="emailId"
              style= {{flex: 1, paddingVertical: 0}}
              keyboardType = "email-address"
            /> */}

          {/* <InputField
              label={"Password"}
              icon={
                <Ionicons
                  name="ios-lock-closed-outline"
                  size={29}
                  color="#666"
                  style={{ marginRight: 5 }}
                />
              }
              inputType="password"
              onChangeText={(text) => setPassword(text)}
              value={password}
              fieldButtonLabel={"Forgot?"} 
              fieldButtonFunction={() => {}} //forget password function
            /> */}
          {/* <TextInput
              placeholder = "password"
              style = {{flex: 1, paddingVertical: 0}}
              secureTextEntry = {true}
            />
          </View> */}

          <View style={styles.container}>
            <Ionicons
              name="ios-lock-closed-outline"
              size={29}
              color="#666"
              style={{ marginRight: 5 }}
            />
            <TextInput
              placeholder="Password"
              style={styles.input}
              secureTextEntry={true}
              onChangeText={(text) => setPassword(text)}
              value={password}
            />
            <TouchableOpacity onPress={() => {}}>
              <Text style={{ color: "#AD40AF", fontWeight: "700" }}>
                Forgot?
              </Text>
            </TouchableOpacity>
          </View>
          {/* <TouchableOpacity
            onPress={() => {}}
            style={{
              backgroundColor: "#4361EE",
              padding: 20,
              borderRadius: 10,
              marginBottom: 30,
            }}
          >
            <Text
              style={{
                textAlign: "center",
                fontWeight: "700",
                fontSize: 16,
                color: "#fff",
              }}
            >
              Login
            </Text>
          </TouchableOpacity>

          {/* where the functionality should go */}
          <CustomButton label={"Login"} onPress={() => handleSubmit()} />

          <View style={{ flexDirection: "row", justifyContent: "center" }}>
            <Text style={{ color: "#fff" }}>Don't have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate("Register")}>
              <Text
                style={{
                  color: "#fff",
                  fontWeight: "bold",
                  textDecorationLine: "underline",
                }}
              >
                Register here.
              </Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: "center",
  },
  container: {
    flexDirection: "row",
    backgroundColor: "#fff",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 5,
    padding: 10,
  },
  input: {
    flex: 1,
    marginLeft: 10,
  },
});

export default LogInScreen;
