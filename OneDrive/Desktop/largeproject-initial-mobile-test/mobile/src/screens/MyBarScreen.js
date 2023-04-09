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
} from "react-native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import jwt_decode from "jwt-decode";

//commentt

const MyBarScreen = ({ navigation }) => {
  const [searchText, setSearchText] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showResults, setShowResults] = useState(false);

  const [userData, setUserData] = useState(null);
  const [decodedToken, setDecodedToken] = useState({});

  const [ingredients, setIngredients] = useState([]);

  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const userToken = await AsyncStorage.getItem("userToken");
      const decoded = jwt_decode(userToken);
      setUserData(decoded);
      setDecodedToken(decoded);
    };
    fetchData();
  }, []);

  const fetchData = async (userId) => {
    try {
      const response = await fetch(
        "https://obscure-springs-89188.herokuapp.com/api/getBar",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userId }),
        }
      );
      const data = await response.json();
      return data;
    } catch (error) {
      console.log("Error getBar");
      console.error(error);
    }
  };

  useEffect(() => {
    const userId = decodedToken._id; // replace with the actual user ID
    fetchData(userId)
      .then((data) => setData(data))
      .catch((error) => console.error(error));
  }, [decodedToken._id]);

  const handleSearch = async () => {
    try {
      const response = await fetch(
        "https://obscure-springs-89188.herokuapp.com/api/searchIngredient",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            search: searchText,
          }),
        }
      );

      const data = await response.json();
      setSearchResults(data.results);
      setShowResults(data.results.length > 0);
    } catch (error) {
      console.log("Error search!");
      console.error(error);
    }
  };

  async function addIngredientToBar(userId, ingName) {
    try {
      const response = await fetch(
        "https://obscure-springs-89188.herokuapp.com/api/addIngredientToBar",
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: userId,
            ingName: ingName,
          }),
        }
      );
      const data = await response.json();
      const newData = await fetchData(userId); //might need these 2 in delete
      setData(newData);
    } catch (error) {
      console.log("Error add!");
      console.error(error);
      // Handle the error here
    }
  }

  async function deleteIngredientFromBar(userId, ingName) {
    try {
      const response = await fetch(
        "https://obscure-springs-89188.herokuapp.com/api/deleteIngredientInBar",
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userId, ingName }),
        }
      );
      const data = await response.json();
      const newData = await fetchData(userId); //might need these 2 in delete
      setData(newData);
    } catch (error) {
      console.log("Error delete!");
      console.error(error);
      // Handle the error here
    }
  }

  return (
    <ImageBackground
      style={styles.background}
      source={require("../assets/gradient.png")}
    >
      <View
        style={{
          alignItems: "center",
        }}
      >
        <View style={styles.searchBarContainer}>
          <MaterialIcons name="search" size={24} color="#000000" />

          <TextInput
            style={styles.searchBarInput}
            placeholder="Search Ingredients"
            placeholderTextColor="#000000"
            value={searchText}
            onChangeText={(text) => {
              setSearchText(text);
              setShowResults(false);
            }}
            onSubmitEditing={handleSearch}
          />
          <MaterialIcons
            name="close"
            size={24}
            color="rgba(0,0,0,0.5)"
            onPress={() => {
              Keyboard.dismiss();
              setSearchText("");
              setSearchResults([]);
              setShowResults(false);
            }}
          />
        </View>

        {showResults && (
          <View style={styles.searchResultsContainer}>
            <ScrollView style={{ flex: 1 }}>
              {searchResults.map((result, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.searchResultItem}
                  onPress={() => {
                    setShowResults(false);
                    addIngredientToBar(userData._id, result.ingredient);
                    //handlePress();
                  }}
                >
                  <Text style={styles.searchResultText}>
                    {result.ingredient}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}
        <View style={styles.myIngredientsContainer}>
          <ScrollView style={{ flex: 1 }}>
            <Text
              style={{
                textAlign: "center",
                paddingTop: 10,
                fontSize: 16,
                fontWeight: "bold",
              }}
            >
              My Ingredients
            </Text>

            {Array.isArray(data) &&
              data.map((ingredientObj, index) => (
                <View key={index} style={styles.myIngredientItem}>
                  <Text style={styles.myIngredientText}>
                    {ingredientObj.ingredient}
                  </Text>
                  <MaterialIcons
                    name="highlight-off"
                    size={24}
                    color="#FF000088"
                    onPress={() => {
                      deleteIngredientFromBar(
                        decodedToken._id,
                        ingredientObj.ingredient
                      );
                    }}
                  />
                </View>
              ))}
          </ScrollView>
        </View>
        <TouchableOpacity onPress={() => {}}>
          <View style={styles.generateContainer}>
            <Text
              style={{
                textAlign: "center",
                paddingTop: 7,
                fontSize: 16,
                fontWeight: "bold",
              }}
            >
              Generate Drinks
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  searchBarContainer: {
    borderWidth: 2,
    marginTop: Platform.OS === "ios" ? 60 : 30,
    padding: 10,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    margin: 10,
    padding: 5,
  },
  searchBarInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
  },
  searchResultsContainer: {
    position: "absolute",
    marginTop: Platform.OS === "ios" ? 95 : 70,
    left: 0,
    right: 0,
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    margin: 10,
    padding: 5,
    zIndex: 1,
    maxHeight:
      Platform.OS === "ios"
        ? Dimensions.get("window").height - 190
        : Dimensions.get("window").height - 130,
  },
  searchResultItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#CCCCCC",
  },
  searchResultText: {
    fontSize: 16,
  },
  myIngredientsContainer: {
    borderWidth: 2,
    backgroundColor: "white",
    borderRadius: 20,
    width: Dimensions.get("window").width * 0.9,
    height: Dimensions.get("window").height * 0.4,
  },
  myIngredientItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#CCCCCC",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  myIngredientText: {
    fontSize: 16,
  },
  generateContainer: {
    borderWidth: 2,
    backgroundColor: "#4CC9F0",
    borderRadius: 20,
    width: Dimensions.get("window").width * 0.9,
    height: Dimensions.get("window").height * 0.05,
    marginTop: 10,
  },
});

export default MyBarScreen;
