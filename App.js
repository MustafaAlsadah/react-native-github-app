import * as React from 'react';
import { StyleSheet, Text, View, Image, Button, TouchableOpacity, ImageBackground, ScrollView } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './HomeScreen';
import StarredRepos from './StarredRepos';
import Profile from './Profile';


const Tab = createMaterialTopTabNavigator();


function MyTabs() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Profile" component={Profile} />
      <Tab.Screen name="Starred Repos" component={StarredRepos} />
    </Tab.Navigator>
  );
}


const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="StarredRepos" component={StarredRepos} />
        {/* <Stack.Screen name="StarredRepos" component={StarredRepos} /> */}

        <Stack.Screen name="Navigator" component={MyTabs} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    width: "100%"
  },
  signInBtn: {
    alignItems: 'center',
    padding: 16,
    marginTop: 26,
    borderRadius: 7,
    backgroundColor: 'black',
    color: 'white',
    width: 200,
  } 
});


