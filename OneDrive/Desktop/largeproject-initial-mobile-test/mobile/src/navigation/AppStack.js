import React from "react";
import { View, Text } from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LogInScreen from "../screens/LogInScreen";
import WelcomeScreen from "../screens/WelcomeScreen";
import HomeScreen from "../screens/HomeScreen";
import FavoriteDrinksScreen from "../screens/FavoriteDrinksScreen";
import TabNavigator from "./TabNavigator";
import MyBarScreen from "../screens/MyBarScreen";
import Profile from "../screens/Profile";

const Stack = createNativeStackNavigator();

const AppStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen component={TabNavigator} name="Home" />
      <Stack.Screen component={FavoriteDrinksScreen} name="FavoriteDrinks" />
      <Stack.Screen component={MyBarScreen} name="MyBar" />
      <Stack.Screen component={Profile} name="Profile" />
    </Stack.Navigator>
  );
};

export default AppStack;
