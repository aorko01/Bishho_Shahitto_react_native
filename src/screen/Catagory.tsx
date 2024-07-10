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
import { useNavigation, useRoute } from '@react-navigation/native';
import axiosInstance from '../utils/axiosInstance';

export default function Category() {
  const navigation = useNavigation();
  const route = useRoute();
  const { category } = route.params;
  let url = "";
  if (category === "Top picks") {
    url = '/books/get-trending-books';
  }

  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    if (loading) return;
    setLoading(true);
    try {
      const response = await axiosInstance.get(`${url}?page=${page}`);
      if (response.data.success) {
        setBooks(prevBooks => [...prevBooks, ...response.data.data]);
        setPage(page + 1); // Increment page for the next fetch
      } else {
        console.error('Failed to fetch books:', response.data.message);
      }
    } catch (error) {
      console.error('Error fetching books:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEndReached = () => {
    fetchBooks();
  };

  const coverImages = books.map((book) => book.coverImage);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView onScroll={({ nativeEvent }) => {
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
          <TouchableOpacity key={index} onPress={() => navigation.push('IndividualBook', { book })}>
          <View key={index} style={styles.bookContainer}>
            <View>
              <Image
                source={{
                  uri: coverImages[index],
                }}
                style={styles.bookCover}
              />
            </View>
            <View style={styles.description}>
              <Text style={{ color: 'white', fontSize: 20 }}>
                {book.title}
              </Text>
              <Text style={{fontSize: 15 }}>
                {book.author}
              </Text>
              <Text style={{fontSize: 15, marginTop: 30 }}>
                Rating: {book.totalRating}
              </Text>
            </View>
            <View style={{ paddingVertical: 50, paddingRight: 5 }}>
              <TouchableOpacity>
                <Text style={{ color: 'red' }}>Borrow</Text>
              </TouchableOpacity>
            </View>
          </View>
          </TouchableOpacity>
        ))}

        {loading && <ActivityIndicator style={{ marginTop: 20 }} size="large" color="white" />}
      </ScrollView>
    </SafeAreaView>
  );
}

const isCloseToBottom = ({ layoutMeasurement, contentOffset, contentSize }) => {
  const paddingToBottom = 20;
  return layoutMeasurement.height + contentOffset.y >=
    contentSize.height - paddingToBottom;
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
