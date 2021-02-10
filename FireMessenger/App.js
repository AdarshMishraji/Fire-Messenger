import React from 'react';
import { Provider as AuthProvider } from './src/contexts/AuthContext';
import { Provider as ThemeProvider } from './src/contexts/ThemeContext';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import InitialScreen from './src/screens/InitialScreen';
import SignupScreen from './src/screens/SignupScreen';
import AuthProviderScreen from './src/screens/AuthProviderScreen';
import LoginScreen from './src/screens/LoginScreen';
import HomeScreen from './src/screens/HomeScreen';
import ChatsRoomScreen from './src/screens/ChatsRoomScreen';
import ChatsScreen from './src/screens/ChatsScreen';
import messaging from '@react-native-firebase/messaging';

const Stack = createStackNavigator();

messaging().setBackgroundMessageHandler(
  async (message) => {
    console.log('message', message);
  }
)

const App = () => {

  return <NavigationContainer theme={DarkTheme}>
    <Stack.Navigator initialRouteName='Initial'>
      <Stack.Screen name='Initial' component={InitialScreen} options={{ headerShown: false }} />
      <Stack.Screen
        name='Signup'
        component={SignupScreen}
        options={{
          headerTitle: 'Sign Up',
          headerTitleAlign: 'center',
          headerLeft: null,
          headerStyle: {
            backgroundColor: DarkTheme.dark ? 'black' : 'white',
          },
          headerTitleStyle: {
            fontSize: 30,
            fontWeight: 'bold',
            marginTop: 10
          }
        }}
      />
      <Stack.Screen name='Login'
        component={LoginScreen}
        options={{
          headerTitle: 'Login In',
          headerTitleAlign: 'center',
          headerLeft: null,
          headerStyle: {
            backgroundColor: DarkTheme.dark ? 'black' : 'white',
          },
          headerTitleStyle: {
            fontSize: 30,
            fontWeight: 'bold',
            marginTop: 10
          }

        }}
      />
      <Stack.Screen name='AuthProvider' component={AuthProviderScreen} options={{ headerShown: false }} />
      <Stack.Screen name='Home' component={HomeScreen} options={{ headerShown: false }} />
      <Stack.Screen name='ChatsRoom' component={ChatsRoomScreen} options={{ title: 'Select a User' }} />
      <Stack.Screen name='Chat' component={ChatsScreen} />
    </Stack.Navigator>
  </NavigationContainer>
}

export default () => {
  return <AuthProvider>
    <ThemeProvider>
        <App />
    </ThemeProvider>
  </AuthProvider>
}