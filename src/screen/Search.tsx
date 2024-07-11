import React, { useRef, useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, Keyboard, FlatList, Touchable, TouchableOpacity } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import axiosInstance from '../utils/axiosInstance';  // Adjust the import path as necessary
import { useNavigation } from '@react-navigation/native';

export default function Search() {
  const navigation = useNavigation();
  const [query, setQuery] = useState('');
  const [result, setResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const searchInputRef = useRef(null);

  useFocusEffect(
    React.useCallback(() => {
      if (searchInputRef.current) {
        searchInputRef.current.focus();
      }
    }, [])
  );

  useEffect(() => {
    if (query) {
      handleSearch();
    } else {
      setResult([]);
    }
  }, [query]);

  const handleSearch = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.post('/books/get-searched-books', { search: query });
      setResult(response.data.data); // Assuming the data structure is { data: books }
    } catch (error) {
      console.error(error);
      setResult([]);
    } finally {
      setLoading(false);
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.resultItem}>
      <TouchableOpacity onPress={() => navigation.navigate('IndividualBook', { book: item })}>
      <Text style={styles.resultText}>{item.title}</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <TextInput
        ref={searchInputRef}
        style={styles.input}
        placeholder="Search for Books"
        placeholderTextColor="#888"
        value={query}
        onChangeText={setQuery}
        onSubmitEditing={handleSearch}
      />
      {loading && <Text style={styles.loading}>Loading...</Text>}
      <FlatList
        data={result}
        keyExtractor={(item) => item._id.toString()}
        renderItem={renderItem}
        ListEmptyComponent={<Text style={styles.noResults}>No results found</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1b2b',
    padding: 20,
  },
  input: {
    height: 40,
    backgroundColor: '#3a3c51',
    color: '#fff',
    paddingHorizontal: 10,
    marginBottom: 20,
    borderRadius: 20,
    borderColor: 'gray',
    borderWidth: 1,
  },
  loading: {
    color: '#fff',
    textAlign: 'center',
  },
  noResults: {
    color: '#fff',
    textAlign: 'center',
  },
  resultItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#3a3c51',
  },
  resultText: {
    color: '#fff',
  },
});
