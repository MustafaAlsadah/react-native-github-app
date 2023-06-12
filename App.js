import * as React from 'react';
import * as WebBrowser from 'expo-web-browser';
import { makeRedirectUri, useAuthRequest } from 'expo-auth-session';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Image, Button, TouchableOpacity, ImageBackground } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as SecureStore from 'expo-secure-store';
import { get } from 'react-native/Libraries/TurboModule/TurboModuleRegistry';


async function save(key, value) {
  await SecureStore.setItemAsync(key, value);
}

async function getValueFor(key) {
  let result = await SecureStore.getItemAsync(key);
  if (result) {
    alert("🔐 Here's your value 🔐 \n" + result);
  } else {
    alert('No values stored under that key.');
  }
}
// WebBrowser.maybeCompleteAuthSession();

// Endpoint
const discovery = {
  authorizationEndpoint: 'https://github.com/login/oauth/authorize',
  tokenEndpoint: 'https://github.com/login/oauth/access_token',
  revocationEndpoint: 'https://github.com/settings/connections/applications/<CLIENT_ID>',
};

function HomeScreen() {

  const NAVIGATOR = useNavigation();

  
  
  const [request, response, promptAsync] = useAuthRequest(
    {
      clientId: '46cc4721f3403a1b9f8a',
      scopes: ['identity'],
      redirectUri: makeRedirectUri({
        scheme: 'your.app'
      }),
    },
    discovery
  );
  
  React.useEffect(()=>{
    if (response?.type === 'success') {
      const { code } = response.params;
      const getToken = async () => {
        try {
          const tokenResponse = await fetch('https://github.com/login/oauth/access_token', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Accept: 'application/json',
            },
            body: JSON.stringify({
              code: code,
              client_id: '46cc4721f3403a1b9f8a',
              client_secret: '7c27b59e0626694a743948ccff6862346f9c2faa',
            }),
          });

          const tokenData = await tokenResponse.json();
          const authToken = tokenData.access_token;

          await save("token", authToken);

          // Assuming you have the authentication token stored in a variable called 'authToken'



          alert(authToken);
        } catch (err) {
          alert(err);
        }
      NAVIGATOR.replace('Details');
    }
    getToken();
  }}, [response])

  const authUser = async () => {
      
      alert("login")
    } 


  return (
    <View style={styles.container}>
      <ImageBackground source={require("./assets/hallstat.jpg")} style={{
        flex: 1,
        resizeMode: 'cover',
        justifyContent: 'center',
        width: "100%",
        height: "100%",
      }}>

          <View style={{alignItems:'center'}}>
            <Image source={require('./assets/github-icon.png')}  style={{width: 200, height: 200}} />
            <TouchableOpacity onPress={ ()=>promptAsync() } style={styles.signInBtn}>
              <Text style={{color:"white", fontSize: 16 }}>Sign In</Text>
            </TouchableOpacity>
            <StatusBar style="auto" />
          </View>

      </ImageBackground>
    </View>
  );
}

function DetailsScreen() {

getValueFor('token').then((authToken) => {
  fetch('https://api.github.com/user/starred', {
  method: 'GET',
  headers: {
    Authorization: `Bearer ${authToken}`,
    Accept: 'application/vnd.github.v3+json',
  },
})
  .then(response => response.json())
  .then(data => {
    // Handle the response data
    console.log('Starred Repositories:', data);
  })
  .catch(error => {
    // Handle the error
    alert('Error fetching starred repositories:', error);
  });

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Details Screen</Text>
    </View>
  );
});
  

}

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Details" component={DetailsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
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
