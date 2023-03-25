import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AuthStack from "./src/navigation/AuthStack";
import AppStack from "./src/navigation/AppStack";

import HomeScreen from "./src/screens/HomeScreen";
import WelcomeScreen from "./src/screens/WelcomeScreen";

const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <AuthStack />
      {/* <AppStack /> */}
    </NavigationContainer>
  );
};

export default App;
