
import * as SecureStore from 'expo-secure-store';

export async function save(key, value) {
    await SecureStore.setItemAsync(key, value);
  }
  
export async function getValueFor(key) {
    let result = await SecureStore.getItemAsync(key);
    if (result) {
      // console.log('SecureStore result:', result);
      // alert("🔐 Here's your value 🔐 \n" + result);
    } else {
      alert('No values stored under that key.');
    }
    return result;
  }

export async function getData(url, setState, ...args) {
    try{
      const hasName = args && args[0];
      const authToken = await getValueFor('token');
      console.log("getData token: "+authToken);
      url = hasName ? url+`?token=${authToken.slice(1, -1)}&name=${args[0]}` : url+`?token=${authToken.slice(1, -1)}`;
      const response = await fetch(url, {
        method: 'GET',
      })
      const data = await response.json();
      // alert(JSON.stringify(data));
      setState(data);
    }catch(err){
      alert(err);
    }
  }