import React, { useEffect, useState, useCallback } from 'react';
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
import NotificationIcon from '../components/NotificationIcon.tsx';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import axiosInstance from '../utils/axiosInstance.js';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Home() {
  const navigation = useNavigation();
  const [topPicks, setTopPicks] = useState([]);
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  const fetchTopPicks = async () => {
    try {
      const response = await axiosInstance.get('/books/get-trending-books'); // Adjust endpoint as per your backend route
      setTopPicks(response.data.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching top picks:', error);
      setLoading(false);
    }
  };

  const fetchPreviousBorrows = async () => {
    try {
      const response = await axiosInstance.get('/books/get-previous-borrows'); // Adjust endpoint as per your backend route
      setBooks(response.data.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching previous borrows:', error);
      setLoading(false);
    }
  };

  const loadUserData = async () => {
    try {
      const storedUser = await AsyncStorage.getItem('user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error('Error loading user data from AsyncStorage:', error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchTopPicks();
      fetchPreviousBorrows();
      loadUserData(); // Load user data when the screen is focused
    }, [])
  );

  const coverImages = [
    'https://m.media-amazon.com/images/I/81YkqyaFVEL._AC_UF1000,1000_QL80_.jpg',
    'https://m.media-amazon.com/images/I/81YkqyaFVEL._AC_UF1000,1000_QL80_.jpg',
    'https://m.media-amazon.com/images/I/81YkqyaFVEL._AC_UF1000,1000_QL80_.jpg',
    'https://m.media-amazon.com/images/I/81YkqyaFVEL._AC_UF1000,1000_QL80_.jpg',
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <NotificationIcon />
        <TouchableOpacity onPress={() => navigation.openDrawer()}>
          <Image
            source={{
              uri: user?.avatar || 'https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcTP9hneBUzKcWY0lZAnnIP9-rPOWqP9lsVIO5iihMwrKsTcevg2OehToQ3wb-1z3FNIWJ4nWEqdd5AunJjSCdwTFbWgAW5mFSxlRp56Og',
            }}
            style={styles.avatar}
          />
        </TouchableOpacity>
        <Text style={styles.Hello}>
          Hello {user?.lastName || 'Ali'}!
        </Text>
        <TouchableOpacity
          style={styles.searchTouchable}
          onPress={() => navigation.navigate('Search')}>
          <View style={styles.searchFakeInput}>
            <Text style={styles.searchPlaceholder}>Search for Books</Text>
          </View>
        </TouchableOpacity>
        {/* Section 1: Top Picks for you */}
        <View style={styles.sectionContainer1}>
          <View style={styles.TrendingContainer}>
            <Text style={styles.Heading}>Top Picks for you</Text>
            <TouchableOpacity
              onPress={() =>
                navigation.push('Catagory', { category: 'Top picks' })
              }>
              <Text style={styles.all}>See all</Text>
            </TouchableOpacity>
          </View>
          <ScrollView horizontal={true} style={styles.horizontalScroll}>
            {loading ? (
              <ActivityIndicator size="large" color="#fff" />
            ) : (
              topPicks.length > 0 ? (
                topPicks.map((book, idx) => (
                  <TouchableOpacity
                    key={idx}
                    onPress={() => navigation.push('IndividualBook', { book })}>
                    <Image
                      source={{ uri: book.coverImage }}
                      style={styles.bookCoverTrending}
                    />
                  </TouchableOpacity>
                ))
              ) : (
                coverImages.map((image, idx) => (
                  <Image key={idx} source={{ uri: image }} style={styles.bookCoverTrending} />
                ))
              )
            )}
          </ScrollView>
        </View>

        {/* Section 2: Trending */}
        <View style={styles.sectionContainer2}>
          <View style={styles.TrendingContainer}>
            <Text style={styles.Heading}>Trending</Text>
            <TouchableOpacity
              onPress={() =>
                navigation.push('Catagory', { category: 'Top picks' })
              }>
              <Text style={styles.all}>See all</Text>
            </TouchableOpacity>
          </View>
          <ScrollView horizontal={true} style={styles.horizontalScroll}>
            {coverImages.map((image, idx) => (
              <Image key={idx} source={{ uri: image }} style={styles.bookCover} />
            ))}
          </ScrollView>
        </View>

        {/* Section 3: Pick from Popular Genre */}
        <View style={styles.sectionContainer3}>
          <View style={styles.TrendingContainer}>
            <Text style={styles.Heading}>Pick from Popular Genre</Text>
            <TouchableOpacity>
              <Text style={styles.all}>See all</Text>
            </TouchableOpacity>
          </View>
          <ScrollView horizontal={true} style={styles.horizontalScroll}>
            {coverImages.map((image, idx) => (
              <Image key={idx} source={{ uri: image }} style={styles.bookCover} />
            ))}
          </ScrollView>
        </View>

        {/* Section 4: Your recent Borrows */}
        <View style={styles.sectionContainer4}>
          <View style={styles.TrendingContainer}>
            <Text style={styles.Heading}>Your recent Borrows</Text>
            <TouchableOpacity
              onPress={() => navigation.push('BorrowedBooks')}>
              <Text style={styles.all}>See all</Text>
            </TouchableOpacity>
          </View>
          <ScrollView horizontal={true} style={styles.horizontalScroll}>
            {loading ? (
              <ActivityIndicator size="large" color="#fff" />
            ) : (
              books.length > 0 ? (
                books.map((book, idx) => (
                  <TouchableOpacity
                    key={idx}
                    onPress={() => navigation.push('IndividualBook', { book })}>
                    <Image
                      source={{ uri: book.coverImage }}
                      style={[
                        styles.bookCover,
                        book.toReturn === false && styles.dimmedBookCover,
                      ]}
                    />
                  </TouchableOpacity>
                ))
              ) : (
                coverImages.map((image, idx) => (
                  <Image key={idx} source={{ uri: image }} style={styles.bookCover} />
                ))
              )
            )}
          </ScrollView>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1b2b',
  },
  sectionContainer1: {
    marginBottom: 30,
    padding: 10,
    borderRadius: 10,
  },
  sectionContainer2: {
    marginBottom: 30,
    padding: 10,
    borderRadius: 10,
  },
  sectionContainer3: {
    marginBottom: 30,
    padding: 10,
    borderRadius: 10,
  },
  sectionContainer4: {
    marginBottom: 30,
    padding: 10,
    borderRadius: 10,
  },
  TrendingContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    margin: 15,
  },
  Hello: {
    color: 'white',
    fontSize: 24,
    marginLeft: 15,
    marginTop: 5,
  },
  Heading: {
    color: 'white',
    fontSize: 20,
    flex: 1,
  },
  all: {
    color: '#888',
    fontSize: 16,
    marginTop: 5,
  },
  notification: {
    position: 'absolute',
    top: 0,
    right: 0,
    margin: 12,
    zIndex: 1,
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
  searchTouchable: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 125,
    marginTop: 30,
    marginLeft: 15,
    marginRight: 15,
    justifyContent: 'center',
    backgroundColor: '#3a3c51',
  },
  searchFakeInput: {
    height: '100%',
    justifyContent: 'center',
    paddingLeft: 10,
  },
  searchPlaceholder: {
    color: '#888',
  },
  horizontalScroll: {
    paddingLeft: 15,
  },
  bookCover: {
    width: 100,
    height: 150,
    borderRadius: 10,
    marginRight: 20,
  },
  bookCoverTrending: {
    width: 125,
    height: 190,
    borderRadius: 10,
    marginRight: 20,
  },
  dimmedBookCover: {
    opacity: 0.5,
  },
});
