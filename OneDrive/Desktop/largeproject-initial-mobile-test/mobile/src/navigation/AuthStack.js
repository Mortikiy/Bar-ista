import React from "react";
import { View, Text } from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LogInScreen from "../screens/LogInScreen";
import WelcomeScreen from "../screens/WelcomeScreen";
import RegisterScreen from "../screens/RegisterScreen";

const Stack = createNativeStackNavigator();

const AuthStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen component={WelcomeScreen} name="WelcomeScreen" />
      <Stack.Screen component={LogInScreen} name="Login" />
      <Stack.Screen component={RegisterScreen} name="Register" />
    </Stack.Navigator>
  );
};

export default AuthStack;
