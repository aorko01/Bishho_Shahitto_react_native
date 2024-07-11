import React from 'react';
import Login from './src/screen/Login';
import Register from './src/screen/Register';
import BottomNavigation from './src/navigation/BottomNavigation';
import Catagory from './src/screen/Catagory';
import IndividualBook from './src/screen/IndividualBook';
import Search from './src/screen/Search';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Register" component={Register} />
        <Stack.Screen name="Main" component={BottomNavigation} />
        <Stack.Screen name="Catagory" component={Catagory} />
        <Stack.Screen name="IndividualBook" component={IndividualBook} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
