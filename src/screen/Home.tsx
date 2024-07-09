import React from 'react';
import { Image, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

export default function Home() {
  return (
    <SafeAreaView style={styles.container}>
    <ScrollView>
      <View style={styles.notification}>
        <Icon name="notifications" size={30} color="white" />
      </View>
      <Image
        source={{
          uri: 'https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcTP9hneBUzKcWY0lZAnnIP9-rPOWqP9lsVIO5iihMwrKsTcevg2OehToQ3wb-1z3FNIWJ4nWEqdd5AunJjSCdwTFbWgAW5mFSxlRp56Og',
        }}
        style={styles.avatar}
      />
      <Text style={styles.Hello}>Hello Ali!</Text>
      <TextInput
        style={styles.searchInput}
        placeholder="Search for Books"
        placeholderTextColor="#888"
      />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1b2b',
  },
  Hello: {
    color: 'white',
    fontSize: 24,
    marginLeft: 15,
    marginTop: 5,
  },
  notification: {
    position: 'absolute',
    top: 0,
    right: 0,
    margin: 12,
  },
  avatar: {
    width: 65,
    height: 65,
    borderWidth: 2,
    borderColor: 'white',
    borderRadius: 50,
    marginTop: 25,
    marginLeft: 15,
  },
  searchInput: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 125,
    marginTop: 30,
    marginLeft: 15,
    marginRight: 15,
    paddingLeft: 10,
    backgroundColor: '#3a3c51',
  },
});
