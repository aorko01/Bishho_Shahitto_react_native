import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

export default function BorrowedBooks() {
  return (
    <View style={styles.container}>
      <Text>BorrowedBooks</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1b2b',
    justifyContent: 'center',
    alignItems: 'center',
  },
})