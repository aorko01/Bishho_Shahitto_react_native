import { StyleSheet, Text, View, TextInput, TouchableOpacity, ScrollView, SafeAreaView } from 'react-native';
import React, { useState } from 'react';
import { Formik } from 'formik';
import * as Yup from 'yup';

const userSchema = Yup.object().shape({
  firstName: Yup.string().required().label('First Name'),
  middleName: Yup.string().label('Middle Name'),
  lastName: Yup.string().required().label('Last Name'),
  username: Yup.string()
    .required()
    .label('Username')
    .min(5, 'Username must be at least 5 characters')
    .max(15, 'Username must be at most 15 characters'),
  email: Yup.string().required().email().label('Email'),
  password: Yup.string()
    .required()
    .min(8, 'Password must be at least 8 characters')
    .max(15, 'Password must be at most 15 characters'),
});

export default function Register() {
  const initialValues = {
    firstName: '',
    middleName: '',
    lastName: '',
    username: '',
    email: '',
    password: '',
  };

  const handleRegister = (values) => {
    console.log(values); // Handle form submission, e.g., send data to backend
  };

  return (
    <ScrollView
      contentContainerStyle={styles.scrollView}
      keyboardShouldPersistTaps="handled">
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          <Text style={styles.title}>Register</Text>
          <Formik
            initialValues={initialValues}
            validationSchema={userSchema}
            onSubmit={handleRegister}>
            {({
              values,
              errors,
              touched,
              isValid,
              handleChange,
              handleBlur,
              handleSubmit,
            }) => (
              <View>
                <TextInput
                  style={styles.input}
                  placeholder="First Name"
                  value={values.firstName}
                  onChangeText={handleChange('firstName')}
                  onBlur={handleBlur('firstName')}
                />
                {touched.firstName && errors.firstName &&
                  <Text style={styles.errorText}>{errors.firstName}</Text>
                }

                <TextInput
                  style={styles.input}
                  placeholder="Middle Name"
                  value={values.middleName}
                  onChangeText={handleChange('middleName')}
                  onBlur={handleBlur('middleName')}
                />

                <TextInput
                  style={styles.input}
                  placeholder="Last Name"
                  value={values.lastName}
                  onChangeText={handleChange('lastName')}
                  onBlur={handleBlur('lastName')}
                />
                {touched.lastName && errors.lastName &&
                  <Text style={styles.errorText}>{errors.lastName}</Text>
                }

                <TextInput
                  style={styles.input}
                  placeholder="Username"
                  value={values.username}
                  onChangeText={handleChange('username')}
                  onBlur={handleBlur('username')}
                />
                {touched.username && errors.username &&
                  <Text style={styles.errorText}>{errors.username}</Text>
                }

                <TextInput
                  style={styles.input}
                  placeholder="Email"
                  value={values.email}
                  onChangeText={handleChange('email')}
                  onBlur={handleBlur('email')}
                  keyboardType="email-address"
                />
                {touched.email && errors.email &&
                  <Text style={styles.errorText}>{errors.email}</Text>
                }

                <TextInput
                  style={styles.input}
                  placeholder="Password"
                  value={values.password}
                  onChangeText={handleChange('password')}
                  onBlur={handleBlur('password')}
                  secureTextEntry
                />
                {touched.password && errors.password &&
                  <Text style={styles.errorText}>{errors.password}</Text>
                }

                <TouchableOpacity
                  style={[styles.button, { backgroundColor: '#0f52ba', marginBottom: 16 }]}
                  onPress={handleSubmit}
                  disabled={!isValid}>
                  <Text style={styles.buttonText}>Register</Text>
                </TouchableOpacity>
              </View>
            )}
          </Formik>
        </View>
      </SafeAreaView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flexGrow: 1,
    backgroundColor: '#000000',
    height: '100%',
  },
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
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
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 20,
    paddingLeft: 8,
    marginBottom: 16,
    backgroundColor: '#fff',
  },
  button: {
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    backgroundColor: '#0f52ba',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  errorText: {
    fontSize: 12,
    color: 'red',
  },
});
