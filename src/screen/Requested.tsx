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
import NotificationIcon from '../components/NotificationIcon';
import axiosInstance from '../utils/axiosInstance';

export default function Requested() {
  const navigation = useNavigation();
  const category = 'Requested';

  const url = '/books/get-to-borrows';

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

  const handleBookReturned = () => {
    // Re-fetch the books after a book is returned, without resetting the list
    fetchBooks(true);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <View style={styles.back}>
            <Icon name="arrow-back" size={30} color="white" />
          </View>
        </TouchableOpacity>
        <NotificationIcon />
        <Text style={styles.HeadText}>{category}</Text>

        {books.map((book, index) => (
          <Book key={index} book={book} onBookBorrowed={handleBookReturned} />
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
