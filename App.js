import React, { Component } from "react";
import { View, Text, StyleSheet } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { Login } from "./src/screens/auth";
import { Retrack, SuccessRetrack } from "./src/screens/retrack";

const Stack = createNativeStackNavigator();
class App extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Login"
          screenOptions={{
            headerShown: false,
          }}
        >
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="Retrack" component={Retrack} />
          <Stack.Screen name="SuccessRetrack" component={SuccessRetrack} />
        </Stack.Navigator>
      </NavigationContainer>
    );
  }
}

export default App;
