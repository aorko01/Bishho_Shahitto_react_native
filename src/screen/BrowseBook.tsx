import React, {useState, useEffect, useCallback} from 'react';
import {
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ActivityIndicator,
  TextInput,
  Modal,
  Switch,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {useNavigation, useFocusEffect} from '@react-navigation/native';
import Book from '../components/Book';
import NotificationIcon from '../components/NotificationIcon';
import axiosInstance from '../utils/axiosInstance';

export default function BrowseBook(props) {
  const navigation = useNavigation();
  const category = 'Browse Books';

  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [genre, setGenre] = useState('');
  const [author, setAuthor] = useState('');
  const [bookName, setBookName] = useState('');
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [sortDropdownVisible, setSortDropdownVisible] = useState(false);
  const [sortOption, setSortOption] = useState('Alphabetically');
  const [genres, setGenres] = useState([]);
  const [showAvailableOnly, setShowAvailableOnly] = useState(false);

  const sortOptions = ['Most Borrowed', 'Rating', 'Alphabetically'];

  const fetchBooks = async () => {
    setLoading(true);
    try {
      let endpoint;
      if (sortOption === 'Alphabetically') {
        endpoint = '/books/get-all-books-alphabetically';
      } else if (sortOption === 'Most Borrowed') {
        endpoint = '/books/get-books-sorted-by-borrows';
      } else if (sortOption === 'Rating') {
        endpoint = '/books/get-books-sorted-by-ratings';
      }

      const response = await axiosInstance.get(endpoint);
      setBooks(response.data);
    } catch (error) {
      console.error('Error fetching books:', error);
    }
    setLoading(false);
  };

  const getGenres = async () => {
    try {
      const response = await axiosInstance.get('/books/get-all-genres');
      setGenres(response.data.data);
    } catch (error) {
      console.error('Error fetching genres:', error);
    }
  };
  useEffect(() => {
   

    getGenres();
    fetchBooks();
  }, [sortOption]);

  const handleBookBorrowed = () => {
    // Re-fetch the books after a book is borrowed, without resetting the list
    fetchBooks(true);
  };

  useFocusEffect(
    useCallback(() => {
      return () => {
        setGenre('');
        setSortOption('Alphabetically');
      };
    }, []),
  );

  const filteredBooks = books.filter(
    book =>
      (!genre || book.genre === genre) &&
      (!author || book.author.toLowerCase().includes(author.toLowerCase())) &&
      (!bookName ||
        book.title.toLowerCase().includes(bookName.toLowerCase())) &&
      (!showAvailableOnly || book.canBeBorrowed), // Updated condition here
  );

  const handleSelectGenre = selectedGenre => {
    setGenre(selectedGenre);
    setDropdownVisible(false);
  };

  const handleSelectSortOption = selectedOption => {
    setSortOption(selectedOption);
    setSortDropdownVisible(false);
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
        <View style={styles.searchContainermain}>
          <View style={styles.searchContainer}>
            <TouchableOpacity
              style={styles.dropdown}
              onPress={() => setDropdownVisible(true)}>
              <Text style={styles.dropdownText}>{genre || 'Select Genre'}</Text>
              <Icon name="arrow-drop-down" size={20} color="white" />
            </TouchableOpacity>
            <TextInput
              style={styles.searchInput}
              placeholder="Search by book name"
              placeholderTextColor="#999"
              onChangeText={setBookName}
              value={bookName}
            />
          </View>

          <View style={styles.searchContainer}>
            <TextInput
              style={styles.searchInputAuthor}
              placeholder="Search by author"
              placeholderTextColor="#999"
              onChangeText={setAuthor}
              value={author}
            />
            <TouchableOpacity
              style={styles.dropdown}
              onPress={() => setSortDropdownVisible(true)}>
              <Text style={styles.dropdownText}>{sortOption || 'Sort By'}</Text>
              <Icon name="arrow-drop-down" size={20} color="white" />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.toggleContainer}>
          <Text style={styles.toggleLabel}>Show Available Books Only</Text>
          <Switch
            value={showAvailableOnly}
            onValueChange={setShowAvailableOnly}
            thumbColor={showAvailableOnly ? 'green' : 'grey'}
            trackColor={{false: 'grey', true: 'green'}}
          />
        </View>

        <Modal
          visible={dropdownVisible}
          transparent={true}
          animationType="fade">
          <TouchableOpacity
            style={styles.modalOverlay}
            onPress={() => setDropdownVisible(false)}>
            <View style={styles.dropdownMenu}>
              {genres.map((item, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.dropdownItem}
                  onPress={() => handleSelectGenre(item)}>
                  <Text style={styles.dropdownItemText}>{item}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </TouchableOpacity>
        </Modal>

        <Modal
          visible={sortDropdownVisible}
          transparent={true}
          animationType="fade">
          <TouchableOpacity
            style={styles.modalOverlay}
            onPress={() => setSortDropdownVisible(false)}>
            <View style={styles.dropdownMenu}>
              {sortOptions.map((item, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.dropdownItem}
                  onPress={() => handleSelectSortOption(item)}>
                  <Text style={styles.dropdownItemText}>{item}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </TouchableOpacity>
        </Modal>

        {filteredBooks.map((book, index) => (
          <View
            key={index}
            style={[
              styles.bookContainer,
              !book.canBeBorrowed && !showAvailableOnly && {opacity: 0.9}, // Apply dimming only when showAvailableOnly is false
            ]}>
            <Book key={index} book={book} onBookBorrowed={handleBookBorrowed} />
          </View>
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
    textAlign: 'center',
  },
  searchContainermain: {
    margin: 10,
    marginBottom: 20,
  },
  searchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
  },
  dropdown: {
    backgroundColor: '#1a1b2b',
    borderRadius: 5,
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  dropdownText: {
    color: 'white',
    fontSize: 16,
    marginRight: 5,
  },
  searchInput: {
    backgroundColor: '#3a3c51',
    borderRadius: 15,
    color: 'white',
    paddingHorizontal: 10,
    flex: 1,
  },
  searchInputAuthor: {
    backgroundColor: '#3a3c51',
    borderRadius: 15,
    color: 'white',
    paddingHorizontal: 10,
    flex: 1,
  },
  toggleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: 20,
    marginBottom: 10,
  },
  toggleLabel: {
    color: 'white',
    fontSize: 18,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  dropdownMenu: {
    backgroundColor: '#3a3c51',
    borderRadius: 10,
    padding: 20,
  },
  dropdownItem: {
    padding: 10,
  },
  dropdownItemText: {
    color: 'white',
    fontSize: 16,
  },
  bookContainer: {
    margin: 10,
    backgroundColor: '#2a2b3d',
    borderRadius: 10,
    padding: 10,
  },
});
