import * as React from 'react';
import { StyleSheet, Text, View, Image, Button, TouchableOpacity, ImageBackground } from 'react-native';
import JavaScriptImg from './assets/JavaScript.png';
import PythonImg from './assets/Python.png';
import CPlsPlsImg from './assets/C++.png';
import JavaImg from './assets/Java.png';
import HTMLImg from './assets/HTML.png';

export default function RepoCard(props) {
    const {name, language} = props;
    let langImg;
    switch (language) {
        case 'JavaScript':
            langImg = JavaScriptImg;
            break;
        case 'Python':
            langImg = PythonImg;
            break;
        case 'C++':
            langImg = CPlsPlsImg;
            break;
        case 'Java':
            langImg = JavaImg;
            break;
        case 'HTML':
            langImg = HTMLImg;
            break;
        default:
            langImg = null;
                    
    }
    return (
        <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems:'center', margin: 10, backgroundColor: "#e7e7e7", padding: 20, borderRadius: 10, flexWrap: 'wrap'}}>
            <Text style={{fontSize: 15, fontWeight: 350}}>{name}</Text>
            {/* <View style={{ marginLeft: 5, marginRight: 5 }}/> */}
            {"\n"}
            <Text style={{fontSize: 15, fontWeight: 350}}>{language}</Text>
            <Image source={langImg}  style={{width: 40, height: 40, marginLeft: 4}} />


        </View>);
}