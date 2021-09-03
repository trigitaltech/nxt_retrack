import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Image,
  ImageBackground,
  KeyboardAvoidingView,
  ScrollView,
  Dimensions,
} from "react-native";
import SplashScreen from "react-native-splash-screen";
import AsyncStorage from "@react-native-community/async-storage";
import { icons } from "../../assets/icons";
//import { NavigationEvents } from 'react-navigation';

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userId: __DEV__ ? "trigital" : "",
      passWord: __DEV__ ? "Imcl!@2019$" : "",
      isLoading: false,
      passWordToggle: true,
      buttonDisable: false,
    };
  }

  componentDidMount() {
    SplashScreen.hide();
  }

  onLogin = async () => {
    this.setState({ isLoading: true, buttonDisable: true });
    setInterval(() => {
      this.setState({ buttonDisable: false });
    }, 30000);

    var apiUrl = "http://65.0.51.207:9000/api/v1/imcl/signin";

    var userId = this.state.userId;
    userId = userId.replace("\\\\", "\\");

    if (userId == "") {
      alert("Userid is required");
      this.setState({ isLoading: false, buttonDisable: false });
      return false;
    } else if (this.state.passWord == "") {
      alert("Password is required");
      this.setState({ isLoading: false, buttonDisable: false });
      return false;
    }

    // let body = {
    //   userName: 'grant-hits\\trigital',
    //   passWord:'Imcl!@2019$'
    // };
    let body = {
      userName: userId,
      passWord: this.state.passWord,
    };
    console.log(body);
    await AsyncStorage.setItem("userId", userId);
    await AsyncStorage.setItem("password", this.state.passWord);
    global.userId = userId;
    fetch(apiUrl, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    })
      .then((response) => {
        return response.json().then((responseJson) => {
          console.log(responseJson);
          if (responseJson.status == 200) {
            this.userTextInput.clear();
            this.passTextInput.clear();
            this.setState({ isLoading: false, buttonDisable: false });
            this.props.navigation.navigate("Welcome", {
              userName: userId,
            });
          } else if (responseJson.status == 400) {
            if (responseJson.response == null) {
              Alert.alert(responseJson.error);
              this.setState({ isLoading: false, buttonDisable: false });
            } else {
              Alert.alert(responseJson.response.result);
              this.setState({ isLoading: false, buttonDisable: false });
            }
          } else {
            Alert.alert(responseJson.error);
            this.setState({ isLoading: false, buttonDisable: false });
          }
        });
      })
      .catch((error) => {
        Alert.alert("Exception Error", error.message);
      });
  };

  render() {
    const { isLoading, passWordToggle, buttonDisable, userId, passWord } =
      this.state;
    return (
      <View style={{ flex: 1 }}>
        <ImageBackground
          source={icons.background}
          style={styles.backgroundImage}
          resizeMode="cover"
        ></ImageBackground>
        <View
          style={{
            height: 180,
          }}
        ></View>
        <View
          style={{
            height: 400,
          }}
        >
          <View
            style={{
              alignItems: "center",
              justifyContent: "center",
              marginTop: 30,
            }}
          >
            <Text style={[styles.welcomeText, { bottom: 24 }]}>
              Hello Again! Welcome back
            </Text>
            <View style={styles.inputView}>
              <Image style={{ marginTop: 24 }} source={icons.userid} />
              <Text style={styles.star}> *</Text>
              <TextInput
                style={{
                  width: "85%",
                  color: "black",
                  paddingLeft: 8,
                  marginTop: 8,
                }}
                value={userId}
                placeholder="Userid"
                placeholderTextColor="#818285"
                autoCapitalize="none"
                clearButtonMode="always"
                onChangeText={(text) => this.setState({ userId: text })}
                ref={(input) => {
                  this.userTextInput = input;
                }}
              />
            </View>
            <View style={styles.inputView}>
              <Image style={{ marginTop: 24 }} source={icons.passwordldpi} />
              <Text style={styles.star}> *</Text>
              <TextInput
                style={{
                  width: "77%",
                  color: "black",
                  paddingLeft: 8,
                  marginTop: 8,
                }}
                value={passWord}
                placeholder="Password"
                placeholderTextColor="#818285"
                secureTextEntry={passWordToggle}
                onChangeText={(text) => this.setState({ passWord: text })}
                ref={(input) => {
                  this.passTextInput = input;
                }}
              />
              {passWordToggle ? (
                <TouchableOpacity
                  onPress={() => {
                    this.setState({ passWordToggle: false });
                  }}
                >
                  <Image
                    style={{ marginTop: 18 }}
                    tintColor="#818285"
                    source={icons.visibility}
                  />
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  onPress={() => {
                    this.setState({ passWordToggle: true });
                  }}
                >
                  <Image
                    style={{ marginTop: 18 }}
                    tintColor="#818285"
                    source={icons.visibility_off}
                  />
                </TouchableOpacity>
              )}
            </View>
            <TouchableOpacity
              style={{ paddingTop: 24 }}
              onPress={() => this.onLogin()}
              disabled={buttonDisable}
            >
              <ImageBackground
                source={icons.button_blue}
                style={styles.button}
                imageStyle={{ borderRadius: 10 }}
              >
                {!isLoading ? (
                  <Text style={styles.buttonText}>sign in</Text>
                ) : (
                  <ActivityIndicator
                    size="small"
                    color={"#fff"}
                    style={{ marginLeft: 18 }}
                  />
                )}
              </ImageBackground>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    marginTop: 100,
    alignItems: "center",
  },
  backgroundImage: {
    justifyContent: "center",
    position: "absolute",
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
  welcomeText: {
    color: "#266CB5",
    fontWeight: "bold",
    fontSize: 20,
  },
  star: {
    color: "#266CB5",
    fontWeight: "bold",
    paddingTop: 12,
  },
  iconText: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f7f7f7",
    width: "90%",
    borderRadius: 7,
    marginTop: 10,
  },
  input: {
    flex: 1,
    padding: 12,
    fontSize: 18,
    color: "#666666",
    borderColor: "#f7f7f7",
    borderWidth: 2,
    backgroundColor: "#f7f7f7",
    borderRadius: 5,
    paddingLeft: 5,
  },
  inputView: {
    flexDirection: "row",
    width: "80%",
    borderRadius: 5,
    height: 60,
    marginTop: 20,
    justifyContent: "center",
    borderRadius: 10,
    backgroundColor: "white",
    shadowColor: "#888888",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.9,
    shadowRadius: 3,
    elevation: 8,
  },
  button: {
    height: 50,
    width: 250,
    top: 10,
    marginBottom: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    fontWeight: "bold",
    color: "white",
    textTransform: "uppercase",
  },
});

export default Login;
