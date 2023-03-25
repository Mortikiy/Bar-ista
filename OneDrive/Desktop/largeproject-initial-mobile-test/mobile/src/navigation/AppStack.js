import React from "react";
import { View, Text } from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LogInScreen from "../screens/LogInScreen";
import WelcomeScreen from "../screens/WelcomeScreen";
import HomeScreen from "../screens/HomeScreen";

const Stack = createNativeStackNavigator();

const AppStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen component={HomeScreen} name="Home" />
    </Stack.Navigator>
  );
};

export default AppStack;
