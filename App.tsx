import React from 'react';
import Login from './src/screen/Login';
import Register from './src/screen/Register';
import DrawerNavigator from './src/navigation/DrawerNavigator';
import IndividualBook from './src/screen/IndividualBook';
import Catagory from './src/screen/Catagory';
import BorrowedBooks from './src/screen/BorrowedBooks';
import EditProfile from './src/screen/EditProffile';
import Notifications from './src/screen/Notifications';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Register" component={Register} />
        <Stack.Screen name="Main" component={DrawerNavigator} />
        <Stack.Screen name="IndividualBook" component={IndividualBook} />
        <Stack.Screen name="Catagory" component={Catagory} />
        <Stack.Screen name="BorrowedBooks" component={BorrowedBooks} />
        <Stack.Screen name="EditProfile" component={EditProfile} />
        <Stack.Screen name="Notifications" component={Notifications} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
