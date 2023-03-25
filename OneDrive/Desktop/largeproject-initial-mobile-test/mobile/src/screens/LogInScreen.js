import React from "react";
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
  return (
    <ImageBackground
      style={styles.background}
      source={require("../assets/gradient.png")}
    >
      <SafeAreaView style={{ flex: 1, justifyContent: "center" }}>
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
          {/* <View style={styles.container}>
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
            />
          </View> */}

          <InputField
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
          />

          <InputField
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
            fieldButtonLabel={"Forgot?"}
            fieldButtonFunction={() => {}}
          />

          {/* <View style={styles.container}>
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
            />
            <TouchableOpacity onPress={() => {}}>
              <Text style={{ color: "#AD40AF", fontWeight: "700" }}>
                Forgot?
              </Text>
            </TouchableOpacity>
          </View> */}
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
          </TouchableOpacity> */}

          <CustomButton label={"Login"} onPress={() => {}} />

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
