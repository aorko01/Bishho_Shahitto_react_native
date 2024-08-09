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
import Book from '../components/Book';
import axiosInstance from '../utils/axiosInstance';

export default function Category(props) {
  const navigation = useNavigation();
  const route = useRoute();

  const categoryFromRoute = route.params?.category;
  const category = props.category || categoryFromRoute || 'Top picks'; // default category if none is provided

  let url = '';
  if (category === 'Top picks') {
    url = '/books/get-trending-books';
  }

  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async (refresh = false) => {
    if (loading || refreshing) return;
    if (refresh) {
      setRefreshing(true);
      setPage(1);
    } else {
      setLoading(true);
    }

    try {
      const response = await axiosInstance.get(`${url}?page=${refresh ? 1 : page}`);
      if (response.data.success) {
        const newBooks = response.data.data;
        setBooks(refresh ? newBooks : [...books, ...newBooks]);
        setPage(refresh ? 2 : page + 1);
      } else {
        console.error('Failed to fetch books:', response.data.message);
      }
    } catch (error) {
      console.error('Error fetching books:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleEndReached = () => {
    fetchBooks();
  };

  const handleBookBorrowed = () => {
    // Re-fetch the books after a book is borrowed, without resetting the list
    fetchBooks(true);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        onScroll={({nativeEvent}) => {
          if (isCloseToBottom(nativeEvent)) {
            handleEndReached();
          }
        }}
        scrollEventThrottle={400}>
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
          <Book key={index} book={book} onBookBorrowed={handleBookBorrowed} /> 
        ))}

        {loading && !refreshing && (
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

const isCloseToBottom = ({layoutMeasurement, contentOffset, contentSize}) => {
  const paddingToBottom = 20;
  return (
    layoutMeasurement.height + contentOffset.y >=
    contentSize.height - paddingToBottom
  );
};

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
  bookContainer: {
    flexDirection: 'row',
    backgroundColor: '#3a3c51',
    justifyContent: 'space-between',
    alignContent: 'center',
    paddingHorizontal: 20,
    paddingVertical: 5,
    margin: 20,
    borderRadius: 20,
    marginBottom: 30,
  },
  bookCover: {
    width: 80,
    height: 120,
    borderRadius: 10,
    position: 'relative',
    top: -20,
    shadowColor: 'black',
    shadowOpacity: 1.5,
  },
  description: {
    flex: 1,
    marginLeft: 30,
  },
});
