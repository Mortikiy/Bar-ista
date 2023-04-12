import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ImageBackground,
  Dimensions,
  Platform,
  TextInput,
  Keyboard,
  TouchableWithoutFeedback,
  ScrollView,
  SafeAreaView,
  Image,
} from "react-native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import jwt_decode from "jwt-decode";
import FavoriteButton from "../components/FavoriteButton";
import NoDrinks from "../assets/nodrinks.svg";

const GeneratedDrinksScreen = ({ navigation }) => {
  const [userData, setUserData] = useState(null);
  const [decodedToken, setDecodedToken] = useState({});

  const [favorites, setFavorites] = useState([]);
  const [refresh, setRefresh] = useState(false);

  function refreshFavorites() {
    setRefresh(!refresh);
  }

  useEffect(() => {
    const fetchData = async () => {
      const userToken = await AsyncStorage.getItem("userToken");
      const decoded = jwt_decode(userToken);
      setUserData(decoded);
      setDecodedToken(decoded);
    };
    fetchData();
  }, []);

  const [apiData, setApiData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const userToken = await AsyncStorage.getItem("userToken");
      const decoded = jwt_decode(userToken);
      setUserData(decoded);
      setDecodedToken(decoded);
      const response = await fetch(
        "https://obscure-springs-89188.herokuapp.com/api/getDrinks",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userId: decoded._id }),
        }
      );
      const drinksData = await response.json();
      setApiData(drinksData);
    };
    fetchData();
  }, []);

  // //need to fix this
  // const toggleHeart = (index) => {
  //   setDrinks((prevDrinks) => {
  //     const newDrinks = [...prevDrinks];
  //     newDrinks[index].isHeartFilled = !newDrinks[index].isHeartFilled;
  //     return newDrinks;
  //   });
  // };

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

  if (apiData.length === 0) {
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
          <View style={styles.headerConatainer}>
            <Text style={styles.header}>
              Looks like you can't make any drinks. Go back and add more
              ingredients.
            </Text>
            <NoDrinks width={150} height={150} />
          </View>
        </SafeAreaView>
      </ImageBackground>
    );
  } else {
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
          <View style={styles.headerConatainer}>
            <Text style={styles.header}>Here are the drinks you can make:</Text>
          </View>
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
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: "center",
  },
  drinksContainer: {
    alignItems: "center",
    marginTop: 10,
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
  header: {
    fontSize: Platform.OS === "ios" ? 18 : 20,
    fontWeight: "bold",
    marginBottom: 10,
    color: "white",
    textAlign: "center",
  },
  headerConatainer: {
    marginTop: Platform.OS === "ios" ? 3 : 6,
    alignItems: "center",
  },
});

export default GeneratedDrinksScreen;
