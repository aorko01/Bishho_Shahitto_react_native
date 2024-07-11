import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Catagory from './src/screen/Catagory';
import IndividualBook from './src/screen/IndividualBook';

const Stack = createNativeStackNavigator();

function MainStackNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Catagory" component={Catagory} />
      <Stack.Screen name="IndividualBook" component={IndividualBook} />
    </Stack.Navigator>
  );
}

export default MainStackNavigator;
