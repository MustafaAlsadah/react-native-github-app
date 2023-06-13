import * as React from 'react';
import { StyleSheet, Text, View, Image, Button, TouchableOpacity, ImageBackground, ScrollView } from 'react-native';
import { getData } from './utils';
import RepoCard from './RepoCard';

export default function StarredRepos() {
    const [data, setData] = React.useState(null);

    React.useEffect(()=>{
      
      getData("https://starred-nejxs2bk7a-uc.a.run.app", setData);
      
    }, []);

    // console.log(data);
        
    
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        
        {data &&
          data.map((repo, index) => (
            <RepoCard key={index} name={repo.name} language={repo.language} link={repo.svn_url} avatar={repo.avatar_url}/>
          ))}
      </View>
    );

}