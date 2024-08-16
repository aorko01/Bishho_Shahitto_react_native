import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Alert,
  Modal,
  TouchableWithoutFeedback,
} from 'react-native';
import { CommonActions, useNavigation } from '@react-navigation/native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import axiosInstance from '../utils/axiosInstance';
import AsyncStorage from '@react-native-async-storage/async-storage';
import messaging from '@react-native-firebase/messaging'; // Import Firebase Messaging

const API_URI = 'http://10.0.2.2:8000/api/v1';

const userSchema = Yup.object().shape({
  username: Yup.string().required().label('Username'),
  password: Yup.string().required().label('Password'),
});

const Login = () => {
  const navigation = useNavigation();
  const [usernameFocused, setUsernameFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [rememberMeVisible, setRememberMeVisible] = useState(false);
  const [rememberMeToken, setRememberMeToken] = useState(null);

  useEffect(() => {
    // Request permission to receive notifications
    messaging().requestPermission();
    
    // Get FCM token
    const fetchFcmToken = async () => {
      const token = await messaging().getToken();
      await AsyncStorage.setItem('fcmToken', token);
    };
    
    fetchFcmToken();
  }, []);

  const handleLogin = async values => {
    try {
      const response = await axiosInstance.post(`${API_URI}/users/login`, {
        username: values.username,
        password: values.password,
      });
  
      const { accessToken, refreshToken, user } = response.data.data;
  
      await AsyncStorage.setItem('accessToken', accessToken);
      await AsyncStorage.setItem('user', JSON.stringify(user));
  
      console.log('Login successful');
      console.log('User:', user);
  
      // Show Remember Me modal and pass the refreshToken
      setRememberMeVisible(true);
      setRememberMeToken(refreshToken);

      
      
      // Fetch the FCM token from AsyncStorage
      const fcmToken = await AsyncStorage.getItem('fcmToken');
      console.log('FCM Token:', fcmToken);
      if (fcmToken) {
        await axiosInstance.post('users/update-fcm-token', {
          fcmToken,
        });
      }
    } catch (error) {
      console.error('Error logging in:', error);
      Alert.alert('Error', 'Failed to log in. Please try again.');
    }
  };

  const handleRememberMe = async (remember) => {
    if (remember && rememberMeToken) {
      await AsyncStorage.setItem('refreshToken', rememberMeToken);
    }

    setRememberMeVisible(false);
    // Reset the navigation stack and navigate to 'Main'
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: 'Main' }],
      })
    );
  };

  return (
    <ScrollView
      contentContainerStyle={styles.scrollView}
      keyboardShouldPersistTaps="handled">
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          <Formik
            initialValues={{ username: '', password: '' }}
            validationSchema={userSchema}
            onSubmit={handleLogin}>
            {({
              values,
              errors,
              touched,
              isValid,
              handleChange,
              handleBlur,
              handleSubmit,
              handleReset,
            }) => (
              <View>
                <Text style={styles.title}>Login</Text>
                <TextInput
                  style={[
                    styles.input,
                    usernameFocused && styles.focusedInput,
                  ]}
                  placeholder="Username"
                  placeholderTextColor={usernameFocused ? '#fff' : '#999'}
                  value={values.username}
                  onChangeText={handleChange('username')}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  onFocus={() => setUsernameFocused(true)}
                  onBlur={() => {
                    setUsernameFocused(false);
                    handleBlur('username');
                  }}
                />
                {errors.username && touched.username && (
                  <Text style={styles.errorText}>{errors.username}</Text>
                )}
                <TextInput
                  style={[
                    styles.input,
                    passwordFocused && styles.focusedInput,
                  ]}
                  placeholder="Password"
                  placeholderTextColor={passwordFocused ? '#fff' : '#999'}
                  value={values.password}
                  onChangeText={handleChange('password')}
                  secureTextEntry
                  onFocus={() => setPasswordFocused(true)}
                  onBlur={() => {
                    setPasswordFocused(false);
                    handleBlur('password');
                  }}
                />
                {errors.password && touched.password && (
                  <Text style={styles.errorText}>{errors.password}</Text>
                )}
                <TouchableOpacity
                  style={[
                    styles.button,
                    { backgroundColor: '#0f52ba', marginBottom: 16 },
                  ]}
                  onPress={handleSubmit}>
                  <Text style={styles.buttonText}>Login</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.button, { backgroundColor: '#6c757d' }]}
                  onPress={() => navigation.navigate('Register')}>
                  <Text style={styles.buttonText}>Register</Text>
                </TouchableOpacity>
              </View>
            )}
          </Formik>
        </View>
      </SafeAreaView>

      {/* Remember Me Modal */}
      <Modal
        transparent={true}
        visible={rememberMeVisible}
        animationType="slide"
        onRequestClose={() => setRememberMeVisible(false)}>
        <TouchableWithoutFeedback onPress={() => setRememberMeVisible(false)}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback onPress={() => {}}>
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>Remember Me</Text>
                <Text style={styles.modalText}>Remember me on this device?</Text>
                <View style={styles.modalButtonContainer}>
                  <TouchableOpacity
                    style={[styles.modalButton, { backgroundColor: '#4e4890' }]}
                    onPress={() => handleRememberMe(true)}>
                    <Text style={styles.buttonText}>Yes</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.modalButton, { backgroundColor: '#6c757d' }]}
                    onPress={() => handleRememberMe(false)}>
                    <Text style={styles.buttonText}>No</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    flexGrow: 1,
    height: '100%',
    backgroundColor: '#1a1b2b',
  },
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
    flexDirection: 'column',
    alignContent: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 32,
    textAlign: 'center',
    color: '#fff',
  },
  input: {
    height: 40,
    borderWidth: 1,
    borderRadius: 20,
    paddingLeft: 8,
    marginBottom: 16,
    backgroundColor: '#3a3c51',
    borderColor: '#3a3c51',
  },
  focusedInput: {
    borderColor: '#0f52ba',
    height: 50,
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginBottom: 16,
    marginLeft: 8,
  },
  button: {
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)',
  },
  modalContent: {
    width: 300,
    backgroundColor: '#1a1b2b',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    color: 'white',
    marginBottom: 20,
  },
  modalText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
    marginVertical: 10,
  },
  modalButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  modalButton: {
    flex: 1,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    marginHorizontal: 5,
  },
});

export default Login;
