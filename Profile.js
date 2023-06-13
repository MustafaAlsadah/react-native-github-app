import * as React from 'react';
import { StyleSheet, Text, View, Image, Button, TouchableOpacity, ImageBackground, ScrollView } from 'react-native';
import RepoCard from './RepoCard';
import { SvgUri } from 'react-native-svg';
import { getData } from './utils';
import { styles } from './App';
import { save } from './utils';

export default function Profile(){
    const [data, setData] = React.useState(null);
    const [repos , setRepos] = React.useState(null);
    React.useEffect(()=>{
      getData("https://user-nejxs2bk7a-uc.a.run.app", setData);
      getData(`https://repos-nejxs2bk7a-uc.a.run.app`, setRepos, data?.login);
      
      // console.log(data);
      // console.log(repos);
    }, [])
    return(
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

  