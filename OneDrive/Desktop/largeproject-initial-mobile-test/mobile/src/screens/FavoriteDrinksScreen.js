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

const FavoriteDrinksScreen = ({ navigation }) => {
  return (
    <ImageBackground
      style={styles.background}
      source={require("../assets/gradient.png")}
    >
      <SafeAreaView
        style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
      >
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
        <Text>Favorite Drinks Screen</Text>
      </SafeAreaView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: "center",
  },
});

export default FavoriteDrinksScreen;
