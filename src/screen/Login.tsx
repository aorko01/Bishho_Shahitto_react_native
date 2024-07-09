import React, { useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URI = 'http://10.0.2.2:8000/api/v1';

const userSchema = Yup.object().shape({
  username: Yup.string().required().label('Username'),
  password: Yup.string().required().label('Password'),
});

const Login = () => {
  const navigation = useNavigation();
  const [usernameFocused, setUsernameFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);

  const handleLogin = async values => {
    try {
      const response = await axios.post(`${API_URI}/users/login`, {
        username: values.username,
        password: values.password,
      });

      const { accessToken, refreshToken, user } = response.data.data;

      await AsyncStorage.setItem('accessToken', accessToken);
      await AsyncStorage.setItem('refreshToken', refreshToken);
      await AsyncStorage.setItem('user', JSON.stringify(user));

      console.log('Login successful');
      navigation.navigate('Main'); // Navigate to the Home screen
    } catch (error) {
      console.error('Error logging in:', error);
      Alert.alert('Error', 'Failed to log in. Please try again.');
    }
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
                  onPress={() => console.log('Navigate to register screen')}>
                  <Text style={styles.buttonText}>Register</Text>
                </TouchableOpacity>
              </View>
            )}
          </Formik>
        </View>
      </SafeAreaView>
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
});

export default Login;
