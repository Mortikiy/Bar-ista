import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import HomeScreen from "../screens/HomeScreen";
import FavoriteDrinksScreen from "../screens/FavoriteDrinksScreen";

import Ionicons from "react-native-vector-icons/Ionicons";
import Feather from "react-native-vector-icons/Feather";
import MyBarScreen from "../screens/MyBarScreen";

const Tab = createBottomTabNavigator();

const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: { backgroundColor: "#7209B7" },
        tabBarInactiveTintColor: "#fff",
        tabBarActiveTintColor: "#4CC9F0",
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home-outline" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Favorite Drinks"
        component={FavoriteDrinksScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="heart-outline" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="My Bar"
        component={MyBarScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="wine-outline" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Logout"
        component={MyBarScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="log-out-outline" color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default TabNavigator;
