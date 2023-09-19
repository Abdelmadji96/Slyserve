import React from 'react';
import {Text, View, StatusBar} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import 'react-native-gesture-handler';
import {Provider} from 'react-redux';
import {PersistGate} from 'redux-persist/integration/react';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {ThemeProvider} from './src/context/theme';
import {store, persistor} from './src/redux/store';
import ApplicationNavigator from './src/navigation/ApplicationNavigator';

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar hidden />
      <Provider store={store}>
        <PersistGate persistor={persistor}>
          <SafeAreaProvider>
            <ThemeProvider>
              <ApplicationNavigator />
            </ThemeProvider>
          </SafeAreaProvider>
        </PersistGate>
      </Provider>
    </NavigationContainer>
  );
}
