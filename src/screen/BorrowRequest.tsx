import React, { useEffect, useState } from 'react';
import {
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import Book from '../components/Book';
import axiosInstance from '../utils/axiosInstance';

export default function Category() {
  const navigation = useNavigation();
  const category = 'Borrow History';

  const url = '/books/get-previous-borrows';

  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(url);
      if (response.data.success) {
        setBooks(response.data.data);
      } else {
        console.error('Failed to fetch books:', response.data.message);
      }
    } catch (error) {
      console.error('Error fetching books:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <View style={styles.back}>
            <Icon name="arrow-back" size={30} color="white" />
          </View>
        </TouchableOpacity>
        <View style={styles.notification}>
          <Icon name="notifications" size={30} color="white" />
        </View>
        <Text style={styles.HeadText}>{category}</Text>

        {books.map((book, index) => (
          <Book key={index} book={book} />
        ))}

        {loading && (
          <ActivityIndicator
            style={{ marginTop: 20 }}
            size="large"
            color="white"
          />
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1b2b',
  },
  notification: {
    position: 'absolute',
    top: 0,
    right: 0,
    margin: 15,
  },
  back: {
    position: 'absolute',
    top: 0,
    left: 0,
    margin: 15,
  },
  HeadText: {
    fontSize: 30,
    color: 'white',
    fontWeight: 'bold',
    marginTop: 60,
    paddingLeft: 20,
    marginBottom: 30,
    textAlign: 'center',
  },
});
