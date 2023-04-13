import React, { useState, useEffect } from "react";
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
import AsyncStorage from "@react-native-async-storage/async-storage";
import jwt_decode from "jwt-decode";
import RNRestart from "react-native-restart";
import FavoriteButton from "../components/FavoriteButton";

export default function HomeScreen() {
  const [userData, setUserData] = useState(null);
  const [decodedToken, setDecodedToken] = useState({});

  const [favorites, setFavorites] = useState([]);
  const [refresh, setRefresh] = useState(false);

  function refreshFavorites() {
    setRefresh(!refresh);
  }

  const [apiData, setApiData] = useState([]);

  useEffect(() => {
    fetch("https://obscure-springs-89188.herokuapp.com/api/getRandomDrink")
      .then((response) => response.json())
      // .then((data) =>
      //   data.map((drink) => ({
      //     ...drink,
      //     isHeartFilled: refresh.includes(drink.name),
      //   }))
      // )
      .then((data) => setApiData(data))
      .catch((error) => console.error(error));
  }, []);

  useEffect(() => {
    const startReload = () => RNRestart.Restart();
    const fetchData = async () => {
      const userToken = await AsyncStorage.getItem("userToken");
      const decodedToken = jwt_decode(userToken);
      setUserData(decodedToken);
      setDecodedToken(decodedToken);
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
      if (data.error == "no user found") {
        setFavorites();
      } else {
        setFavorites([...data.map((drink) => drink.name)]);
      }
    };
    fetchData();
  }, [favorites]);

  const screenWidth = Dimensions.get("window").width;

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
          paddingTop: Platform.OS === "android" ? 25 : 0,
        }}
      >
        <Text style={styles.header}>
          Hey {decodedToken.firstName}, try some of these favorites:
        </Text>
        <ScrollView contentContainerStyle={styles.scrollViewContent}>
          <View style={styles.drinksContainer}>
            {apiData.map((drink, index) => (
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
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                  }}
                >
                  <Text style={styles.drinkName}>{drink.name}</Text>
                  {/* <TouchableOpacity onPress={() => toggleHeart(index)}>
                    <MaterialIcons
                      name={
                        drink.isHeartFilled ? "favorite" : "favorite-outline"
                      }
                      size={24}
                      style={styles.heartIcon}
                      color="#FC46AA"
                    />
                  </TouchableOpacity> */}
                  <FavoriteButton
                    userId={decodedToken._id}
                    drinkName={drink.name}
                    isFavorite={favorites.includes(drink.name) ? true : false}
                  ></FavoriteButton>
                </View>
                <Text style={styles.ingredients}>
                  Ingredients: {drink.ingMeasurments.join(", ")}
                </Text>
                <Text></Text>
                <Text style={styles.ingredients}>
                  Instructions: {drink.instructions}
                </Text>
              </View>
            ))}
          </View>
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
    color: "white",
  },
  drinksContainer: {
    alignItems: "center",
  },
  drink: {
    borderWidth: 2,
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
    borderWidth: 2,
  },
  heartIcon: {
    width: 30,
    height: 30,
    alignSelf: "flex-end",
  },
});
