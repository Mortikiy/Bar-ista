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

import RegisterSVG from "../assets/register.svg";
import InputField from "../components/InputField";
import CustomButton from "../components/CustomButton";

const RegisterScreen = ({ navigation }) => {
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
            <RegisterSVG height={200} width={200} />
          </View>
          <Text
            style={{
              fontSize: 28,
              fontWeight: "500",
              color: "#fff",
            }}
          >
            Register
          </Text>

          <InputField
            label={"Username"}
            icon={
              <Ionicons
                name="person-outline"
                size={29}
                color="#666"
                style={{ marginRight: 5 }}
              />
            }
          />

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
          />
          <InputField
            label={"Confirm Password"}
            icon={
              <Ionicons
                name="ios-lock-closed-outline"
                size={29}
                color="#666"
                style={{ marginRight: 5 }}
              />
            }
            inputType="password"
          />

          <CustomButton label={"Register"} onPress={() => {}} />

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
              Register
            </Text>
          </TouchableOpacity> */}
          <View style={{ flexDirection: "row", justifyContent: "center" }}>
            <Text style={{ color: "#fff" }}>Already have an account? </Text>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Text
                style={{
                  color: "#fff",
                  fontWeight: "bold",
                  textDecorationLine: "underline",
                }}
              >
                Login here.
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

export default RegisterScreen;
