import React, {Component} from 'react';
import {
    View, 
    Text, 
    StyleSheet, 
    Image, 
    TouchableOpacity, 
    ImageBackground,
    ActivityIndicator
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';

class SuccessRetrack extends React.Component{
 constructor(props)
 {
     super(props);
     this.state={
        isLoading:false,
     }
 }

 async onLogout(){
    this.setState({isLoading:true});
    await AsyncStorage.removeItem('userId');
    await AsyncStorage.removeItem('password');
    global.userId='';
    setInterval(() => {
        this.setState({isLoading:false}); 
        this.props.navigation.navigate('Login');
    }, 10000);
 }

 render()  
 {
    const { isLoading} = this.state;
   return (
    <View style={{flex: 1,}}>
        <ImageBackground
            source={require('./assets/background.png')}
            style={styles.backgroundImage}
            resizeMode='cover'>
        </ImageBackground>
        <View style={{ flex: 1, flexDirection:'row',marginTop:18, }}>
            <Image
                style={{marginTop:8}}
                source={require('./assets/half_oval.png')}
            /> 
            <Image
                style={{marginLeft:32, marginTop:18}}
                source={require('./assets/nxt_retrack.png')}
                imageStyle={{marginTop:50}}
            />  
        </View>
        <View style={{ flex: 3, alignItems: 'center', justifyContent: 'center'}}>
            <Image
                style={{marginTop:18, height:100, width:100}}
                source={require('./assets/retrack-blue.png')}
            />
            <Image
                style={{marginTop:32, height:5, width:70, borderRadius:10}}
                source={require('./assets/line-blue.png')}
            />
            <View style={{marginTop:12, alignItems:'center'}}>
            <Text style={{fontWeight:'bold', fontSize:16}}>Hurray</Text>
            <Text style={{fontSize:16}}>You did it!</Text>
            <Text style={{fontSize:16}}>Retrack is successful.</Text>
            </View>
            <TouchableOpacity style={{paddingTop:24, }}
             onPress={() => {this.props.navigation.navigate('Retrack')}}>
                <ImageBackground
                    source={require('./assets/button-blue.png')}
                    style={styles.button}
                    imageStyle={{ borderRadius: 10}}
                    >
                    <Text
                        style={styles.buttonText}
                    >
                    Continue
                    </Text>
                </ImageBackground>
            </TouchableOpacity>
            <TouchableOpacity style={{}}
             onPress={() => {this.onLogout()}}>
                <ImageBackground
                    source={require('./assets/button-blue.png')}
                    style={styles.button}
                    imageStyle={{ borderRadius: 10}}
                    >
                    {!isLoading?(<Text
                  style={styles.buttonText}>log out</Text>):(<ActivityIndicator 
                size="small"
                color={'#fff'}
                style={{marginLeft:18}}
              />)}
                </ImageBackground>
            </TouchableOpacity>
        </View>
        <View style={{ flex: 2}} />
      </View>
   )
 }
}

const styles = StyleSheet.create({
    backgroundImage:{
        justifyContent: 'center',
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        right: 0
      },
      button:{
        height: 50,
        width: 250,
        top: 10,
        marginBottom:24,
        alignItems:'center',
        justifyContent:'center'
      },
      buttonText:{
        fontWeight: 'bold',
        color: 'white',
        textTransform:'uppercase'
      }
});

export default SuccessRetrack;
