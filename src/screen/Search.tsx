import React, { useRef, useState } from 'react';
import { StyleSheet, Text, View, TextInput, Keyboard } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';

export default function Search() {
  const [query, setQuery] = useState('');
  const [result, setResult] = useState(null);
  const searchInputRef = useRef(null);

  useFocusEffect(
    React.useCallback(() => {
      if (searchInputRef.current) {
        searchInputRef.current.focus();
      }
    }, [])
  );

  const handleSearch = () => {
    setResult(`Results for "${query}"`);
    Keyboard.dismiss();
  };

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
      {result && <Text style={styles.result}>{result}</Text>}
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
  result: {
    marginTop: 20,
    fontSize: 18,
    color: '#fff',
  },
});
