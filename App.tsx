import React, { useEffect, useState, useRef } from 'react';
import { Alert } from 'react-native';
import messaging from '@react-native-firebase/messaging';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axiosInstance from './src/utils/axiosInstance';
import Login from './src/screen/Login';
import Register from './src/screen/Register';
import DrawerNavigator from './src/navigation/DrawerNavigator';
import IndividualBook from './src/screen/IndividualBook';
import Catagory from './src/screen/Catagory';
import BorrowedBooks from './src/screen/BorrowedBooks';
import EditProfile from './src/screen/EditProfile';
import Notifications from './src/screen/Notifications';
import LoadingScreen from './src/screen/LoadingScreen';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { CommonActions } from '@react-navigation/native';

const Stack = createNativeStackNavigator();

function App() {
  const [isUserVerified, setIsUserVerified] = useState(false);
  const navigationRef = useRef(null);

  useEffect(() => {
    const requestFCMPermission = async () => {
      const authStatus = await messaging().requestPermission();
      const enabled =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL;

      if (enabled) {
        console.log('FCM permission granted');
        if (isUserVerified) {
          await getFCMToken();
        }
      } else {
        console.log('FCM permission denied');
        Alert.alert('FCM Permission Denied', 'Please enable notifications.');
      }
    };

    const getFCMToken = async () => {
      try {
        const fcmToken = await messaging().getToken();
        console.log('FCM Token:', fcmToken);

        if (isUserVerified) {
          await axiosInstance.post('/users/update-fcm-token', { fcmToken });
        }
      } catch (error) {
        console.error('Error fetching FCM token:', error);
      }
    };

    const checkAccessToken = async () => {
      try {
        const accessToken = await AsyncStorage.getItem('accessToken');
        const refreshToken = await AsyncStorage.getItem('refreshToken');

        if (accessToken) {
          const response = await axiosInstance.get('/users/is-user-verified');

          if (response.status === 200) {
            console.log('Access token is valid');
            setIsUserVerified(true);
            navigateToHomeScreen();
          } else {
            throw new Error('Access token invalid');
          }
        } else if (refreshToken) {
          const refreshResponse = await axiosInstance.post('/users/refresh-accesstoken', { refreshToken });

          if (refreshResponse.status === 200) {
            const { newAccessToken } = refreshResponse.data;
            await AsyncStorage.setItem('accessToken', newAccessToken);
            console.log('Access token refreshed successfully');
            setIsUserVerified(true);
            navigateToHomeScreen();
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

    const navigateToHomeScreen = () => {
      navigationRef.current?.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: 'Main' }],
        })
      );
    };

    const navigateToLoginScreen = () => {
      navigationRef.current?.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: 'Login' }],
        })
      );
    };

    requestFCMPermission();
    checkAccessToken();

    const unsubscribe = messaging().onTokenRefresh(async (fcmToken) => {
      console.log('FCM Token Refreshed:', fcmToken);
      if (isUserVerified) {
        await axiosInstance.post('/users/update-fcm-token', { fcmToken });
      }
    });

    return unsubscribe;
  }, [isUserVerified]);

  return (
    <NavigationContainer ref={navigationRef}>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Loading" component={LoadingScreen} />
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
