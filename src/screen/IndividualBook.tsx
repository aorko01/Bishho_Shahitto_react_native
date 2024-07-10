import {
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React from 'react';
import {useRoute} from '@react-navigation/native';

export default function IndividualBook() {
  const route = useRoute();
  const {bookId} = route.params;
  console.log(bookId);
  const coverImages = [
    'https://m.media-amazon.com/images/I/81YkqyaFVEL._AC_UF1000,1000_QL80_.jpg',
    'https://m.media-amazon.com/images/I/81YkqyaFVEL._AC_UF1000,1000_QL80_.jpg',
    'https://m.media-amazon.com/images/I/81YkqyaFVEL._AC_UF1000,1000_QL80_.jpg',
    'https://m.media-amazon.com/images/I/81YkqyaFVEL._AC_UF1000,1000_QL80_.jpg',
  ];
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.bookHead}>
          <View>
            <Image
              source={{uri: coverImages[0]}}
              style={styles.bookCover}
            />
          </View>
          <View>
          <Text>Book Title</Text>

          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#C3C0CE',
  },
  bookHead: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#1a1b2b',
    paddingTop: 70,
    paddingHorizontal: 20,
    width: '100%',
  },
    bookCover: {
        width: 120,
        height: 180,
        borderRadius: 10,
    },
});
