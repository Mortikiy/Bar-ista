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
} from "react-native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import LogoImage from "../assets/logo.svg";

const WelcomeScreen = ({ navigation }) => {
  return (
    <ImageBackground
      style={styles.background}
      source={require("../assets/gradient.png")}
    >
      <SafeAreaView
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <View
          style={{
            alignItems: "center",
            marginTop: Platform.OS === "android" ? 30 : 0,
          }}
        >
          <Text style={{ fontSize: 30, fontWeight: "bold", color: "#fff" }}>
            Bar-ista
          </Text>
          <View
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
          >
            <LogoImage width={300} height={300} />
          </View>
          <View
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
          >
            <Text style={{ color: "#fff", fontSize: 20, textAlign: "center" }}>
              Get drink recipes from the ingredients in your pantry!
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => navigation.navigate("Login")}
            style={{
              backgroundColor: "#4361EE",
              padding: 20,
              width: screen_width,
              borderRadius: 10,
              flexDirection: "row",
              justifyContent: "space-between",
              marginBottom: Platform.OS === "android" ? 20 : 0,
            }}
          >
            <Text style={{ fontWeight: "bold", fontSize: 18, color: "#fff" }}>
              Get Started
            </Text>
            <MaterialIcons name="arrow-forward-ios" size={22} color="#fff" />
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
};

const screen_width = Dimensions.get("screen").width * 0.9;

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: "center",
  },
});

export default WelcomeScreen;
