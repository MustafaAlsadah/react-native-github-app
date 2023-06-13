import * as React from 'react';
import { Text, View, StyleSheet, Image, TouchableOpacity, ImageBackground } from 'react-native';
import { makeRedirectUri, useAuthRequest } from 'expo-auth-session';
import { StatusBar } from 'expo-status-bar';

import { useNavigation } from '@react-navigation/native';
import { save, getValueFor } from './utils';
import { styles } from './App';



// Endpoint
const discovery = {
    authorizationEndpoint: 'https://github.com/login/oauth/authorize',
    tokenEndpoint: 'https://github.com/login/oauth/access_token',
    revocationEndpoint: 'https://github.com/settings/connections/applications/<CLIENT_ID>',
  };


export default function HomeScreen() {

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
            // alert("homescreen token: "+authToken);
  
             save("token", JSON.stringify(authToken)).then(()=>{
                NAVIGATOR.replace('Navigator');
             })
  
            // Assuming you have the authentication token stored in a variable called 'authToken'
          } catch (err) {
            alert(err);
          }
      }
      getToken();
    }}, [response])
  
  
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