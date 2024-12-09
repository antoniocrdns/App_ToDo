import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Load from './Load';
import TodoApp from './TodoApp'; // Renombra tu componente principal a TodoApp

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Load">
        <Stack.Screen 
          name="Load" 
          component={Load} 
          options={{ headerShown: false }}
        />
        <Stack.Screen 
          name="App" 
          component={TodoApp}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}