import React, {Component} from 'react';
import {
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  TouchableOpacity, 
  ActivityIndicator, 
  ImageBackground, 
  Image, 
  Switch, 
  Alert
} from 'react-native';
import {Picker} from '@react-native-picker/picker';

class Retrack extends React.Component{
 constructor(props)
 {
     super(props);
     this.state={
        customerId:'',
        error:"1",
        isLoading:false,
        isEnabled:false,
        buttonDisable:false,
     }
 }
 
 Retrack=()=>{
  this.setState({isLoading:true, buttonDisable:true});

  setInterval(() => {
    this.setState({buttonDisable:false}); 
  }, 30000);

  if(this.state.isEnabled==false){
    var type='cable';
  }
  else{
    var type='hits';
  }
  
  var apiUrl = 'http://65.0.51.207:9000/api/v1/imcl/retrack'; 

  if(this.state.customerId==''){
    alert('Customer id is required');
    this.setState({isLoading:false,buttonDisable:false}); 
    return false;
  }
  
  let body = {
    customerId: this.state.customerId,
    type:type,
    error:this.state.error
  };
  console.log(body);
  fetch(apiUrl,
    {
      method:'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body)
    }
    ).then((response)=>{
      return response.json().then(responseJson=>
      {
        console.log(responseJson.status);
        if(responseJson.status==200)
        {
          this.setState({isLoading:false,buttonDisable:false});
          if(responseJson.response.message=='Success'){
            Alert.alert(
              responseJson.response.message,
              '',
              [
                {text: 'ok', onPress: () => this.onButtonPress()}
              ],
            )
          }
          else{
            Alert.alert(responseJson.response.message);
            this.setState({isLoading:false,buttonDisable:false});
          }
        }
        else if(responseJson.status==400){
          Alert.alert(responseJson.response.message);
          this.setState({isLoading:false,buttonDisable:false});
        }
        else{
          Alert.alert(responseJson.error);
          this.setState({isLoading:false,buttonDisable:false});
        }
      })
    }).catch((error)=>{Alert.alert('Exception Error', error.message)})  
 }

 onButtonPress() {
  this.props.navigation.navigate('SuccessRetrack');
  this.setState({customerId:'', isEnabled:false, error:"1",});
}

 render()  
 {
   return (
    <View style={{flex:1}}>
      <ImageBackground
        source={require('./assets/background.png')}
        style={styles.backgroundImage}
        resizeMode='cover'>
      </ImageBackground>
      <View 
       style={{ flex: 2, flexDirection:'row',marginTop:24 }}>
        <Image
          style={{marginTop:16}}
          source={require('./assets/half_oval.png')}
        /> 
        <Image
            style={{marginLeft:32, marginTop:24}}
            source={require('./assets/nxt_retrack.png')}
            imageStyle={{marginTop:50}}
        />  
        </View>
        <View 
          style={{
            flex: 3, 
            alignItems: 'center',
            justifyContent: 'center'
          }}>
          <View style={{flexDirection:'row'}}>
            <Text style={[styles.retrackTypeText,{color:this.state.isEnabled==false?'#266CB5':'#58595B'}]}>INDigital</Text>
            <Text style={{fontWeight:'bold', fontSize:18, color:'#ccc'}}>  |  </Text>
            <Text style={[styles.retrackTypeText,{color:this.state.isEnabled==true?'purple':'#58595B'}]}>NXTDIGITAL</Text>
        </View>
        <View style={{top:12}}>
          <Switch
            trackColor={{ true: "#b3b3b3", false: "#b3b3b3" }}
            thumbColor={this.state.isEnabled ? "purple" : "#266CB5"}
            onValueChange ={(isEnabled)=>this.setState({isEnabled, customerId:''})}
            value={this.state.isEnabled}
          />
        </View>
      <View style={styles.inputView} >
          <TextInput  
            style={styles.inputText}
            placeholder="Customer/STB Number" 
            placeholderTextColor="#003f5c"
            onChangeText={text => {this.setState({customerId:text})}}
            //value={this.state.customerId}
          />
        </View>
        <View style={styles.inputView} >
          <Picker
            style={styles.pickerStyle}  
            placeholder={'Select Type Of Error'}
            dropdownIconColor={'#000'}
            selectedValue={this.state.error} 
            onValueChange={(itemValue, itemIndex) =>
              this.setState({error: itemValue})
            }
          >
          <Picker.Item label="Error1" value="1" />
          <Picker.Item label="Error2" value="2" />
          </Picker>
        </View>
        <TouchableOpacity 
          style={{paddingTop:24}}
          onPress={() => this.Retrack()}
          disabled={this.state.buttonDisable}
          >
          <ImageBackground
            source={require('./assets/button-blue.png')}
            style={styles.button}
            imageStyle={{ borderRadius: 10}}
            >
            {!this.state.isLoading?(<Text
              style={styles.buttonText}>Process</Text>):(<ActivityIndicator 
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
  retrackTypeText:{
    fontWeight:'bold', 
    fontSize:18
  },
  inputView:{
    width:"80%",
    borderRadius:5,
    height:60,
    marginTop:20,
    justifyContent:"center",
    padding:20,
    borderRadius: 5,
    shadowColor: '#888888',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.9,
    shadowRadius: 3,
    elevation: 3,
  },
  inputText:{
    height:60,
    color:"black",
  },
  pickerStyle:{  
    color: '#344953',  
    justifyContent: 'center',  
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

export default Retrack;
