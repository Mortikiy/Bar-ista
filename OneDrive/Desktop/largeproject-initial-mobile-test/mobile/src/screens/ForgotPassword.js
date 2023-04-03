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
let bp = require('../components/Path.js');
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import Ionicons from "react-native-vector-icons/Ionicons";

import LogoImage from "../assets/logo.svg";

import RegisterSVG from "../assets/register.svg";
import InputField from "../components/InputField";
import CustomButton from "../components/CustomButton";

//attach sign up in the register
const RegisterScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
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
    let emailRestriction = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

    if(email === ""){
      str += "Email cannot be empty\n";
    } else if(emailRestriction.test(email) === false){
      str += "Please enter a valid email\n"
    }

    return str;
  }

  const handleSubmit = () => {
    if (InputValidation() != "") {
      alert(InputValidation());
    } else {
      fetch("https://obscure-springs-89188.herokuapp.com/api/sendPasswordLink",
      {
        method: 'POST',
        headers:
        {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({email: email}),
      })
      .then((response) =>
      {
        if (!response.ok)
        {
          throw new Error('Network error - response not OK');
        }
        return response.json();
      })
      .then((data) =>
      {
        if (data.error === ('user does not exist with that email'))
        {
            alert("No user found with this email.");
            setColor("#FFCCCC")
            return;
        }
        
        else
        {
          setEmail("");
          alert("Email with link to reset your password sent!");
          setColor("#b1deb5")
        }
      })
      .catch((error) => 
      {
        alert('Forgot Password Error:', error);
        setColor("#FFCCCC")
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
            Reset Password
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
              onChangeText={(text) => setEmail(text)}
              value={email}
            />
          </View>

          {/* register button */}
          <CustomButton
            label={"Reset Password"}
            onPress={() => {
              handleSubmit();
            }}
          />
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
