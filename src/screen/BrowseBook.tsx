import React, { useState } from 'react';
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
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';

export default function Category(props) {
  const navigation = useNavigation();
  const category = 'Browse Books'; // default category if none is provided

  const dummyData = [
    {
      _id: '1',
      coverImage: 'https://via.placeholder.com/80x120',
      title: 'Book One',
      author: 'Author One',
      totalRating: 4.5,
      pageCount: 300,
      borrowCount: 10,
      genre: 'Genre One',
    },
    {
      _id: '2',
      coverImage: 'https://via.placeholder.com/80x120',
      title: 'Book Two',
      author: 'Author Two',
      totalRating: 4.0,
      pageCount: 250,
      borrowCount: 8,
      genre: 'Genre Two',
    },
    // Add more dummy books as needed
  ];

  const genres = ['Genre One', 'Genre Two', 'Genre Three']; // Add more genres as needed
  const sortOptions = ['Most Borrowed', 'Rating', 'Page Count']; // Sorting options

  const [books, setBooks] = useState(dummyData);
  const [currentBorrowIds, setCurrentBorrowIds] = useState(['1']); // Dummy current borrows
  const [loading, setLoading] = useState(false);
  const [genre, setGenre] = useState('');
  const [author, setAuthor] = useState('');
  const [bookName, setBookName] = useState('');
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [sortDropdownVisible, setSortDropdownVisible] = useState(false);
  const [sortOption, setSortOption] = useState('');

  const filteredBooks = books.filter(
    (book) =>
      (!genre || book.genre === genre) &&
      (!author || book.author.toLowerCase().includes(author.toLowerCase())) &&
      (!bookName || book.title.toLowerCase().includes(bookName.toLowerCase()))
  ).sort((a, b) => {
    if (sortOption === 'Most Borrowed') {
      return b.borrowCount - a.borrowCount;
    } else if (sortOption === 'Rating') {
      return b.totalRating - a.totalRating;
    } else if (sortOption === 'Page Count') {
      return b.pageCount - a.pageCount;
    }
    return 0;
  });

  const handleSelectGenre = (selectedGenre) => {
    setGenre(selectedGenre);
    setDropdownVisible(false);
  };

  const handleSelectSortOption = (selectedOption) => {
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
        <View style={styles.notification}>
          <Icon name="notifications" size={30} color="white" />
        </View>
        <Text style={styles.HeadText}>{category}</Text>

        <View style={styles.searchContainer}>
          <TouchableOpacity
            style={styles.dropdown}
            onPress={() => setDropdownVisible(true)}
          >
            <Text style={styles.dropdownText}>
              {genre || 'Select Genre'}
            </Text>
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
            onPress={() => setSortDropdownVisible(true)}
          >
            <Text style={styles.dropdownText}>
              {sortOption || 'Sort By'}
            </Text>
            <Icon name="arrow-drop-down" size={20} color="white" />
          </TouchableOpacity>
        </View>

        <Modal
          visible={dropdownVisible}
          transparent={true}
          animationType="fade"
        >
          <TouchableOpacity
            style={styles.modalOverlay}
            onPress={() => setDropdownVisible(false)}
          >
            <View style={styles.dropdownMenu}>
              {genres.map((item, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.dropdownItem}
                  onPress={() => handleSelectGenre(item)}
                >
                  <Text style={styles.dropdownItemText}>{item}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </TouchableOpacity>
        </Modal>

        <Modal
          visible={sortDropdownVisible}
          transparent={true}
          animationType="fade"
        >
          <TouchableOpacity
            style={styles.modalOverlay}
            onPress={() => setSortDropdownVisible(false)}
          >
            <View style={styles.dropdownMenu}>
              {sortOptions.map((item, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.dropdownItem}
                  onPress={() => handleSelectSortOption(item)}
                >
                  <Text style={styles.dropdownItemText}>{item}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </TouchableOpacity>
        </Modal>

        {filteredBooks.map((book, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => navigation.push('IndividualBook', { book })}
          >
            <View key={index} style={styles.bookContainer}>
              <View>
                <Image
                  source={{ uri: book.coverImage }}
                  style={styles.bookCover}
                />
              </View>
              <View style={styles.description}>
                <Text style={{ color: 'white', fontSize: 20 }}>{book.title}</Text>
                <Text style={{ fontSize: 15 }}>{book.author}</Text>
                <Text style={{ fontSize: 15, marginTop: 30 }}>
                  Rating: {book.totalRating}
                </Text>
                <Text style={{ fontSize: 15, marginTop: 10 }}>
                  Page Count: {book.pageCount}
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
  },
  searchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  dropdown: {
    flex: 1,
    backgroundColor: '#3a3c51',
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
  },
  dropdownText: {
    color: 'white',
    fontSize: 16,
  },
  searchInput: {
    flex: 1,
    backgroundColor: '#3a3c51',
    borderRadius: 10,
    color: 'white',
    paddingHorizontal: 10,
    marginLeft: 10,
  },
  searchInputAuthor: {
    flex: 1,
    backgroundColor: '#3a3c51',
    borderRadius: 10,
    color: 'white',
    paddingHorizontal: 10,
    marginRight: 10,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  dropdownMenu: {
    backgroundColor: '#3a3c51',
    borderRadius: 10,
    width: '80%',
    padding: 10,
  },
  dropdownItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#555',
  },
  dropdownItemText: {
    color: 'white',
    fontSize: 16,
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
