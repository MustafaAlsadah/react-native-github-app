import * as React from 'react';
import { StyleSheet, Text, View, Image, Button, TouchableOpacity, ImageBackground, Linking } from 'react-native';
import JavaScriptImg from './assets/JavaScript.png';
import PythonImg from './assets/Python.png';
import CPlsPlsImg from './assets/C++.png';
import JavaImg from './assets/Java.png';
import HTMLImg from './assets/HTML.png';


export default function RepoCard(props) {
    const {name, language, link} = props;
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
        <TouchableOpacity onPress={()=>{
            Linking.openURL(`${link}`);
        }} style={{flexDirection: 'row', justifyContent: 'space-between', alignItems:'center', margin: 10, backgroundColor: "#C2DEDC",
                   padding: 20, borderRadius: 10, flexWrap: 'wrap', width: 350}}>
            
            <View style={{flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
                <Text style={{fontSize: 19, fontWeight: 400, marginBottom:10}}>{name}</Text>
                {props.avatar && <Image source={{uri: props.avatar}}  style={{width: 50, height: 50, borderRadius: 100} } />}
                <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
                    <Text style={{fontSize: 16, fontWeight: 350}}>{language}</Text>
                    <Image source={langImg}  style={{width: 35, height: 35, marginLeft: 4}} />
                </View>
            </View>


        </TouchableOpacity>);
}