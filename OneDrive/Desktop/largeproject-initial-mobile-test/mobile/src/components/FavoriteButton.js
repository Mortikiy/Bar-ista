import React, { useState, useEffect } from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

import MaterialIcons from "react-native-vector-icons/MaterialIcons";

export default function FavoriteButton({ userId, drinkName, isFavorite }) {
  //const [isFavorite, setIsFavorite] = useState();

  const handlePress = async () => {
    if (isFavorite) {
      // Remove from favorites
      await fetch(
        "https://obscure-springs-89188.herokuapp.com/api/deleteFavorite",
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userId, name: drinkName }),
        }
      );
    } else {
      // Add to favorites
      await fetch(
        "https://obscure-springs-89188.herokuapp.com/api/addFavorite",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userId, name: drinkName }),
        }
      );
    }
    isFavorite = !isFavorite;
  };

  return (
    <TouchableOpacity>
      <View>
        <MaterialIcons
          name={isFavorite ? "favorite" : "favorite-outline"}
          size={24}
          style={styles.heartIcon}
          color="#FC46AA"
          onPress={() => {
            handlePress();
          }}
        />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  heartIcon: {
    width: 30,
    height: 30,
    alignSelf: "flex-end",
  },
});
