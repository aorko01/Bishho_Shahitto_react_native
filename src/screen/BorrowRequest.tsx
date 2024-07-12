import React, {useEffect, useState} from 'react';
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
import {useNavigation, useRoute} from '@react-navigation/native';
import axiosInstance from '../utils/axiosInstance';

export default function Category(props) {
  const navigation = useNavigation();
  const route = useRoute();

  const categoryFromRoute = route.params?.category;
  const category = props.category || categoryFromRoute || 'Top picks'; // default category if none is provided

  const url = '/books/get-previous-borrows';

  const [books, setBooks] = useState([]);
  const [currentBorrowIds, setCurrentBorrowIds] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(url);
      if (response.data.success) {
        const { previousBorrows, currentBorrows } = response.data.data;
        setBooks(previousBorrows);
        setCurrentBorrowIds(currentBorrows.map(borrow => borrow.book._id));
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
          <TouchableOpacity
            key={index}
            onPress={() => navigation.push('IndividualBook', {book})}>
            <View key={index} style={styles.bookContainer}>
              <View>
                <Image
                  source={{
                    uri: book.coverImage,
                  }}
                  style={styles.bookCover}
                />
              </View>
              <View style={styles.description}>
                <Text style={{color: 'white', fontSize: 20}}>{book.title}</Text>
                <Text style={{fontSize: 15}}>{book.author}</Text>
                <Text style={{fontSize: 15, marginTop: 30}}>
                  Rating: {book.totalRating}
                </Text>
              </View>
              <View style={styles.buttonContainer}>
                {currentBorrowIds.includes(book._id) ? (
                  <TouchableOpacity style={styles.returnButton}>
                    <Text style={styles.buttonText}>Return</Text>
                  </TouchableOpacity>
                ) : (
                  <View style={styles.returnedLabel}>
                    <Text style={styles.labelText}>Returned</Text>
                  </View>
                )}
              </View>
            </View>
          </TouchableOpacity>
        ))}

        {loading && (
          <ActivityIndicator
            style={{marginTop: 20}}
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
  },
  bookContainer: {
    flexDirection: 'row',
    backgroundColor: '#3a3c51',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
    margin: 20,
    borderRadius: 20,
    marginBottom: 30,
  },
  bookCover: {
    width: 80,
    height: 120,
    borderRadius: 10,
  },
  description: {
    flex: 1,
    marginLeft: 30,
  },
  buttonContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  returnButton: {
    backgroundColor: 'red',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  returnedLabel: {
    backgroundColor: 'gray',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  labelText: {
    color: 'white',
    fontWeight: 'bold',
  },
});
