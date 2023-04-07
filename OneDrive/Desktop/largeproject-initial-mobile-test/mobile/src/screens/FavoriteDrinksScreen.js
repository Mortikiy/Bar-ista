import React, { useState, useEffect, useContext } from "react";
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
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import LogoImage from "../assets/logo.svg";
import TabNavigator from "../navigation/TabNavigator";
import LogInScreen from "./LogInScreen";
import { AuthContext } from "../context/AuthContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import jwt_decode from "jwt-decode";
import { useNavigation } from '@react-navigation/native';


export default function HomeScreen() {
  const [favorites, setFavorites] = useState([]);
  const { logout } = useContext(AuthContext);
  const [userData, setUserData] = useState(null);

  const navigation = useNavigation();

  useEffect(() => {
    const fetchData = async () => {
      const userToken = await AsyncStorage.getItem("userToken");
      const decodedToken = jwt_decode(userToken);
      setUserData(decodedToken);

      const response = await fetch(
        "https://obscure-springs-89188.herokuapp.com/api/getFavorites",
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: decodedToken._id,
          }),
        }
      );
      
      const data = await response.json();
      
      if (data && data.length === 0) {
        console.log("no favorites");
      } else {
        setFavorites(data);
      }
    };

    fetchData();
  }, []);


  const handleButtonPress = () => {
    navigation.navigate("Home");
  };


  const screenWidth = Dimensions.get("window").width;

  return (
    <ImageBackground
      style={styles.background}
      source={require("../assets/gradient.png")}
    >
      <SafeAreaView
        style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
      >
  
        <ScrollView contentContainerStyle={styles.scrollViewContent}>
          {favorites.length === 0 ? (
          <View style={styles.container}>
            <Text style={{color: "#fff", fontSize: 15, fontWeight: "bold", padding: 10}}>You don't have any favorites</Text>
            <TouchableOpacity onPress={handleButtonPress} style={styles.button}>
              <Text style={styles.text}>Add Favorites?</Text>
            </TouchableOpacity>
          </View>
                      
          ) : (
            <View style={styles.drinksContainer}>
              <Text style={styles.header}>
                Your favorite drinks:
              </Text>
              {favorites.map((drink, index) => (
                <View
                  key={index}
                  style={[styles.drink, { width: screenWidth - 20 }]}
                >
                  {drink.img ? (
                    <Image
                      source={{ uri: drink.img }}
                      style={styles.drinkImage}
                    />
                  ) : null}
                  <Text style={styles.drinkName}>{drink.name}</Text>
                  <Text style={styles.ingredients}>
                    Ingredients: {drink.ingNeeded.join(", ")}
                  </Text>
                </View>
              ))}
            </View>
          )}
        </ScrollView>


      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: "center",
  },
  header: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  drinksContainer: {
    alignItems: "center",
  },
  drink: {
    marginVertical: 5,
    padding: 10,
    backgroundColor: "#fff",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
  },
  drinkName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  ingredients: {
    fontSize: 12,
  },
  drinkImage: {
    width: "100%",
    height: 150,
    marginBottom: 10,
    borderRadius: 10,
  },
  button: {
    backgroundColor: "#FFF",
    padding: 10,
    borderRadius: 5,
  },
  text: {
    color: "#AD40AF",
    fontWeight: "bold",
    fontSize: 18,
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: "70%"
  },
});