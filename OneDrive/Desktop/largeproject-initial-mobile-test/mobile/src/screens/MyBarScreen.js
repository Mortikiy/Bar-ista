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

const MyBarScreen = ({ navigation }) => {
  const [searchText, setSearchText] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [myIngredients, setMyIngredients] = useState([]);

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
      console.error(error);
    }
  };

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
                    setMyIngredients([...myIngredients, result.ingredient]);
                    setShowResults(false);
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

            {myIngredients.map((ingredient, index) => (
              <View key={index} style={styles.myIngredientItem}>
                <Text style={styles.myIngredientText}>{ingredient}</Text>
              </View>
            ))}
          </ScrollView>
        </View>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  searchBarContainer: {
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
    backgroundColor: "white",
    borderRadius: 20,
    width: Dimensions.get("window").width * 0.9,
    height: Dimensions.get("window").height * 0.4,
  },
  myIngredientItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#CCCCCC",
  },
  myIngredientText: {
    fontSize: 16,
  },
});

export default MyBarScreen;
