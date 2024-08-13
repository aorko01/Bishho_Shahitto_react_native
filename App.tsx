import React, { useEffect } from 'react';
import { Alert } from 'react-native';
import messaging from '@react-native-firebase/messaging';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axiosInstance from './src/utils/axiosInstance'; // Import the Axios instance
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
  useEffect(() => {
    const requestFCMPermission = async () => {
      const authStatus = await messaging().requestPermission();
      const enabled =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL;

      if (enabled) {
        console.log('FCM permission granted');
        getFCMToken();
      } else {
        console.log('FCM permission denied');
        Alert.alert('FCM Permission Denied', 'Please enable notifications.');
      }
    };

    const getFCMToken = async () => {
      try {
        const fcmToken = await messaging().getToken();
        console.log('FCM Token:', fcmToken);

        // Store FCM token in AsyncStorage if needed
        await AsyncStorage.setItem('fcmToken', fcmToken);

        // Send the token to the backend
        await axiosInstance.post('/users/update-fcm-token', { fcmToken });
      } catch (error) {
        console.error('Error fetching FCM token:', error);
      }
    };

    requestFCMPermission();

    // Listen to token refresh event
    const unsubscribe = messaging().onTokenRefresh(async (fcmToken) => {
      console.log('FCM Token Refreshed:', fcmToken);

      // Update the FCM token in AsyncStorage if needed
      await AsyncStorage.setItem('fcmToken', fcmToken);

      // Send the refreshed token to the backend
      await axiosInstance.post('/users/update-fcm-token', { fcmToken });
    });

    return unsubscribe; // Unsubscribe from the event on unmount
  }, []);

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
