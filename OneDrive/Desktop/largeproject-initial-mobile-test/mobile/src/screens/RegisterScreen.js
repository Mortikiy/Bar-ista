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
  Alert,
} from "react-native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import Ionicons from "react-native-vector-icons/Ionicons";

import LogoImage from "../assets/logo.svg";

import RegisterSVG from "../assets/register.svg";
import InputField from "../components/InputField";
import CustomButton from "../components/CustomButton";

//attach sign up in the register
const RegisterScreen = ({ navigation }) => {
  const [firstName, setfirstName] = useState("");
  const [lastName, setlastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [color, setColor] = useState("#fff");

    // grabbed style info so textbox changes color when confirm password and password is not the same
  const mystyle = {
    flexDirection: "row",
    backgroundColor: color,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 5,
    padding: 10,
  }

  function InputValidation(){
    let str = "";
    // Regex
    let passRestriction = /(?=.*\d)(?=.*[A-Za-z])(?=.*[?!@#$%^&*]).{8,32}$/;
    let nameRestriction = /(?=.*[a-zA-Z])./;
    let emailRestriction = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

    if(firstName === ""){
      str += "First Name cannot be empty\n";
    } else if (nameRestriction.test(firstName) === false){
      str += "Please enter a valid first name\n";
    }

    if(lastName === ""){
      str += "Last Name cannot be empty\n";
    } else if (nameRestriction.test(lastName) === false){
      str += "Please enter a valid first name\n";
    }

    if(email === ""){
      str += "Email cannot be empty\n";
    } else if(emailRestriction.test(email) === false){
      str += "Please enter a valid email\n"
    }

    if(password === ""){
      str += "Password cannot be empty\n";
    }

    if (confirmPassword ===""){
      str += "Please confirm your password\n"
    } 

    if(passRestriction.test(password) === false){
      str += "Your password must contain at least: \n 1 Uppercase and 1 lowercase letter\ 1 Symbol & 1 Digit\n";
    }

    if(password.localeCompare(confirmPassword) != 0){
      str += "Password does not match\n";
      setColor("#FFCCCC")
    } else {
      setColor("#b1deb5")
    }

    return str;
  }

  const handleSubmit = () => {
    if (InputValidation() != "") {
      alert(InputValidation());
    } else {
      fetch("https://obscure-springs-89188.herokuapp.com/api/createUser", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstName: firstName,
          lastName: lastName,
          email: email,
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
          if (data.error === "user already exists")
            alert("Error: User already exists!");
          else
            console.log(
              "New account made! Hello, " +
                data.firstName +
                " " +
                data.lastName +
                "!"
            );
        })
        .catch((error) => {
          console.error("Signup request error:", error);
        });
    }
  };

  return (
    <ImageBackground
      style={styles.background}
      source={require("../assets/gradient.png")}
    >
      <SafeAreaView style={{ flex: 1, justifyContent: "center" }}>
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

          {/* <InputField
            label={"First Name"}
            icon={
              <Ionicons
                name="person-outline"
                size={29}
                color="#666"
                style={{ marginRight: 5 }}
              />
            }
            onChangeText={value => setfirstName(value)}
            value={email}
          /> */}

          {/* Changed material to Ionicon */}
          <View style={styles.container}>
            <Ionicons
              name="person-outline"
              size={29}
              color="#666"
              style={{ marginRight: 5 }}
            />
            <TextInput
              placeholder="First Name"
              style={styles.input}
              onChangeText={(text) => setfirstName(text)}
              value={firstName}
            />
          </View>

          <View style={styles.container}>
            <Ionicons
              name="person-outline"
              size={29}
              color="#666"
              style={{ marginRight: 5 }}
            />
            <TextInput
              placeholder="Last Name"
              style={styles.input}
              onChangeText={(text) => setlastName(text)}
              value={lastName}
            />
          </View>

          {/* <InputField
            label={"Last Name"}
            icon={
              <Ionicons
                name="person-outline"
                size={29}
                color="#666"
                style={{ marginRight: 5 }}
              />
            }
            onChangeText={value => setlastName(value)}
            value={lastName}
          /> */}

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
              onChangeText={(text) => setEmail(text.toLowerCase())}
              value={email}
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
            onChangeText={value => setEmail(value)}
            value={email}
            keyboardType="email-address"
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
            onChangeText={value => setPassword(value)}
            value={password}
            inputType="password"
          /> */}
          <View style={mystyle}>
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
            {/* <TouchableOpacity onPress={() => {}}>
              <Text style={{ color: "#AD40AF", fontWeight: "700" }}>
                Forgot?
              </Text>
            </TouchableOpacity> */}
          </View>
          {/* <InputField
            label={"Confirm Password"}
            icon={
              <Ionicons
                name="ios-lock-closed-outline"
                size={29}
                color="#666"
                style={{ marginRight: 5 }}
              />
            }
            onChangeText={value => setConfirmPassword(value)}
            value={confirmPassword}
            inputType="password"
          /> */}
          <View style={mystyle}>
            <Ionicons
              name="ios-lock-closed-outline"
              size={29}
              color="#666"
              style={{ marginRight: 5 }}
            />
            <TextInput
              placeholder="Confirm Password"
              style={styles.input}
              secureTextEntry={true}
              onChangeText={(text) => setConfirmPassword(text)}
              value={confirmPassword}
            />
            {/* <TouchableOpacity onPress={() => {}}>
              <Text style={{ color: "#AD40AF", fontWeight: "700" }}>
                Forgot?
              </Text>
            </TouchableOpacity> */}
          </View>

          {/* register button */}
          <CustomButton
            label={"Register"}
            onPress={() => {
              handleSubmit();
            }}
          />

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
