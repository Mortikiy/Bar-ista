import React, { useEffect, useState, useContext } from "react";
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TouchableOpacity,
  ImageBackground,
  Dimensions,
  Platform,
  Image,
  ScrollView,
} from "react-native";
import { AuthContext } from "../context/AuthContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import jwt_decode from "jwt-decode";
import Logout from "../assets/logout.svg";

export default function Profile() {
  const [userData, setUserData] = useState(null);
  const [decodedToken, setDecodedToken] = useState({});
  const { logout } = useContext(AuthContext);

  useEffect(() => {
    const fetchData = async () => {
      const userToken = await AsyncStorage.getItem("userToken");
      const decoded = jwt_decode(userToken);
      setUserData(decoded);
      setDecodedToken(decoded);
    };
    fetchData();
  }, []);

  return (
    <ImageBackground
      style={styles.background}
      source={require("../assets/gradient.png")}
    >
      <View style={styles.container}>
        <TouchableOpacity style={styles.logoutButton} onPress={logout}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
        <Logout width={250} height={250} />
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: "center",
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  logoutButton: {
    padding: 10,
    backgroundColor: "#FFF",
    borderRadius: 5,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#AD40AF",
  },
});
