import React from 'react';
import 'expo-dev-client';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from './screens/LoginScreen';
import SignUpScreen from './screens/SignUpScreen';
import FirstScreen from './screens/FirstScreen';
import HomeScreen from './screens/HomeScreen';
import MapScreen from './screens/MapScreen';
import CameraScreen from './screens/CameraScreen';
import ProfileScreen from './screens/ProfileScreen';
import ProfileEditScreen from './screens/ProfileEditScreen';
import ForgetPassword from './screens/ForgetPassword';
import MemoryScreen from './screens/MemoryScreen';
import EditScreen from './screens/EditScreen';
import { UserProvider } from './context/UserContext';

export default function App() {
  const Stack = createNativeStackNavigator();
  return (
    <UserProvider>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen options={{headerShown: false}} name="First" component={FirstScreen} />
          <Stack.Screen options={{headerShown: false}} name="Login" component={LoginScreen} />
          <Stack.Screen options={{headerShown: false}} name="SignUp" component={SignUpScreen} />
          <Stack.Screen options={{headerShown: false}} name="Home" component={HomeScreen} />
          <Stack.Screen options={{headerShown: false}} name="Map" component={MapScreen} />
          <Stack.Screen options={{headerShown: false}} name="Camera" component={CameraScreen} />
          <Stack.Screen options={{headerShown: false}} name="Profile" component={ProfileScreen} />
          <Stack.Screen options={{headerShown: false}} name="ProfileEdit" component={ProfileEditScreen} />
          <Stack.Screen options={{headerShown: false}} name="ForgetPassword" component={ForgetPassword} />
          <Stack.Screen options={{headerShown: false}} name="Memory" component={MemoryScreen} />
          <Stack.Screen options={{headerShown: false}} name="Edit" component={EditScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </UserProvider>
  );
}
