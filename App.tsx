import React from 'react';
import Login from './src/screen/Login';
import Register from './src/screen/Register';

import {View, Text, SafeAreaView} from 'react-native';

function App() {
  return (
    <SafeAreaView>
      <View>
      <Login/>
      </View>
    </SafeAreaView>
  );
}

export default App;
