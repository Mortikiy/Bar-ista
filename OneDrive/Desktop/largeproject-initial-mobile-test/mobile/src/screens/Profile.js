import React, { useEffect, useState, useContext } from 'react';
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
import AsyncStorage from '@react-native-async-storage/async-storage';
import jwt_decode from "jwt-decode";

export default function Profile() {
  const [userData, setUserData] = useState(null);
  const [decodedToken, setDecodedToken] = useState({});
  const {logout} = useContext(AuthContext);

  useEffect(() => {
    const fetchData = async () => {
      const userToken = await AsyncStorage.getItem('userToken');
      const decoded = jwt_decode(userToken);
      setUserData(decoded);
      setDecodedToken(decoded);
    }   
    fetchData();
  }, []);

  return (
    <ImageBackground style={styles.background} source={require("../assets/gradient.png")}>
    <View style= {styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>User Profile</Text>
        <TouchableOpacity style={styles.logoutButton} onPress={logout}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.content}> 
      <Text style = {styles.greeting}>Hello,</Text>
      <Text style= {styles.name}>{decodedToken.firstName} {decodedToken.lastName}!</Text>
      </View>
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
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 45,
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#FFF',
  },
  logoutButton: {
    padding: 10,
    backgroundColor: '#FFF',
    borderRadius: 5,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#AD40AF',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  name: {
    fontSize: 25,
    fontWeight: 'bold',
    marginBottom: 10,
    color: "#FFF",
  },
  greeting: {
    fontSize: 25,
    fontWeight: 'bold',
    marginBottom: 10,
    color: "#000",
  },
});
