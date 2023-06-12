import * as React from 'react';
import * as WebBrowser from 'expo-web-browser';
import { makeRedirectUri, useAuthRequest } from 'expo-auth-session';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Image, Button, TouchableOpacity, ImageBackground, ScrollView } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

import { NavigationContainer } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as SecureStore from 'expo-secure-store';
import RepoCard from './RepoCard';
import { SvgUri } from 'react-native-svg';

const Tab = createMaterialTopTabNavigator();


function MyTabs() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Profile" component={Profile} />
      <Tab.Screen name="Starred Repos" component={StarredRepos} />
    </Tab.Navigator>
  );
}

async function save(key, value) {
  await SecureStore.setItemAsync(key, value);
}

async function getValueFor(key) {
  let result = await SecureStore.getItemAsync(key);
  if (result) {
    console.log('SecureStore result:', result);
    // alert("🔐 Here's your value 🔐 \n" + result);
  } else {
    alert('No values stored under that key.');
  }
  return result;
}

async function getData(url, setState) {
  try{
    const authToken = await getValueFor('token');

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${authToken.slice(1, -1)}`,
        Accept: 'application/vnd.github.v3+json',
      },
    })
    const data = await response.json();
    // alert(JSON.stringify(data));
    setState(data);
  }catch(err){
    alert(err);
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
          // alert("homescreen token: "+authToken);

           save("token", JSON.stringify(authToken)).then(()=>{
              NAVIGATOR.replace('Profile');
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

function StarredRepos() {
    const [data, setData] = React.useState(null);

    React.useEffect(()=>{
      
      getData("https://api.github.com/user/starred", setData);
      
    }, []);

    console.log(data);
        
    
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        
        {data &&
          data.map((repo, index) => (
            <RepoCard key={index} name={repo.name} language={repo.language} link={repo.svn_url} avatar={repo.avatar_url}/>
          ))}
      </View>
    );

}

function Profile(){
  const [data, setData] = React.useState(null);
  const [repos , setRepos] = React.useState(null);
  React.useEffect(()=>{
    getData("https://api.github.com/user", setData);
    getData("https://api.github.com/users/MustafaAlsadah/repos", setRepos);
    console.log(data);
    console.log(repos);
  }, [])
  return(
    // <View style={styles.container}>

    //   <Image source={{uri: data && data.avatar_url}}  style={{width: 160, height: 160, borderRadius: 100} } />
    //   <Text style={{fontSize: 27, fontWeight:350, marginBottom:15}}>{data && data.login}</Text>
    //   {repos && repos.map((repo, index)=><RepoCard key={index} name={repo.name}  language={repo.language} />)}
    // </View>
    <ScrollView>
      <View style={styles.container}>
        <Image
          source={{ uri: data && data.avatar_url }}
          style={{ width: 160, height: 160, borderRadius: 100 }}
        />
        <Text style={{ fontSize: 27, fontWeight: '350', marginBottom: 15 }}>
          {data && data.login}
        </Text>
        <SvgUri uri={`https://ghchart.rshah.org/${data?.login}`} width="350" style={{margin:30}}/>

        {repos &&
          repos.map((repo, index) => (
            <RepoCard key={index} name={repo.name} language={repo.language} link={repo.svn_url} />
          ))}
      </View>
    </ScrollView>
  )
}





const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="StarredRepos" component={StarredRepos} />
        <Stack.Screen name="Profile" component={MyTabs} />
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
