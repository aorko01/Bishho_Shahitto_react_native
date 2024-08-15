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
import EditProfile from './src/screen/EditProfile';
import Notifications from './src/screen/Notifications';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { CommonActions } from '@react-navigation/native';

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

    const checkAccessToken = async () => {
      try {
        const accessToken = await AsyncStorage.getItem('accessToken');
        const refreshToken = await AsyncStorage.getItem('refreshToken');

        if (accessToken) {
          // Verify accessToken with the backend
          console.log('Checking access token:', accessToken);
          const response = await axiosInstance.get('/users/is-user-verified');

          if (response.status === 200) {
            console.log('Access token is valid');
            navigateToMainScreen();
          } else {
            throw new Error('Access token invalid');
          }
        } else if (refreshToken) {
          // Refresh the accessToken using refreshToken
          const refreshResponse = await axiosInstance.post('/users/refresh-accesstoken', { refreshToken: refreshToken });

          if (refreshResponse.status === 200) {
            const { newAccessToken } = refreshResponse.data;
            await AsyncStorage.setItem('accessToken', newAccessToken);
            console.log('Access token refreshed successfully');
            navigateToMainScreen();
          } else {
            throw new Error('Unable to refresh access token');
          }
        } else {
          navigateToLoginScreen();
        }
      } catch (error) {
        console.error('Error checking tokens:', error);
        navigateToLoginScreen();
      }
    };

    const navigateToMainScreen = () => {
      // Use navigationRef to navigate
      navigationRef.current?.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: 'Main' }],
        })
      );
    };

    const navigateToLoginScreen = () => {
      // Use navigationRef to navigate
      navigationRef.current?.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: 'Login' }],
        })
      );
    };

    requestFCMPermission();
    checkAccessToken();

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
    <NavigationContainer ref={navigationRef}>
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

// Create a navigation ref to be used in App component
const navigationRef = React.createRef();

export default App;
