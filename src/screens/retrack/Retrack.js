import React, { Component } from "react";
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
  Alert,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { icons } from "../../assets/icons";
import AsyncStorage from "@react-native-community/async-storage";

class Retrack extends Component {
  constructor(props) {
    super(props);
    this.state = {
      customerId: __DEV__ ? "1000272503" : "",
      error: "1",
      isLoading: false,
      isEnabled: false,
      buttonDisable: false,
      type: "indigital",
      customerName: "",
      customerCity: "",
      disabledCustomerId: "",
      hasBlurred: false,
    };
  }
  componentDidMount() {
    this.blur_unsub = this.props.navigation.addListener("blur", () => {
      this.setState({
        hasBlurred: true,
      });
    });
    this.focus_unsub = this.props.navigation.addListener("focus", () => {
      if (this.state.hasBlurred) {
        this.setState({
          customerId: __DEV__ ? "1000272503" : "",
          error: "1",
          isLoading: false,
          isEnabled: false,
          buttonDisable: false,
          type: "indigital",
          customerName: "",
          customerCity: "",
          hasBlurred: false,
        });
      }

      // do something
    });
  }
  componentWillUnmount() {
    this.focus_unsub();
  }
  onRetrack = async () => {
    let { type, customerName, customerId, error, disabledCustomerId } =
      this.state;
    if (customerId != disabledCustomerId) {
      this.setState({
        isLoading: true,
        buttonDisable: true,
      });

      var apiUrl = `http://65.0.51.207:9000/api/v1/imcl/${type}/retrack`;

      if (customerId == "") {
        alert("Customer id is required");
        this.setState({ isLoading: false, buttonDisable: false });
        return false;
      }
      let userId = await AsyncStorage.getItem("userId");

      let body = {
        customerId: customerId,
        error: error,
        retrack: customerName == "" ? false : true,
        user: userId,
      };
      console.log(body);
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
            console.log(responseJson.status);
            if (response.status == 200) {
              if (body.retrack) {
                this.setState({
                  isLoading: false,
                  buttonDisable: false,
                });
                if (customerId != "") {
                  this.setState({
                    disabledCustomerId: customerId,
                  });
                  setTimeout(
                    () =>
                      this.setState({
                        disabledCustomerId: "",
                      }),
                    20000
                  );
                }
                this.props.navigation.navigate("SuccessRetrack", {
                  error: false,
                });
              } else {
                this.setState(
                  {
                    customerName:
                      responseJson.response.retrackResult.customerName,
                    customerCity: responseJson.response.retrackResult.city,
                    isLoading: false,
                    buttonDisable: false,
                  },
                  () => console.log(this.state)
                );
              }
              console.log(responseJson.response);

              //this.setState({ isLoading: false, buttonDisable: false });
            } else {
              this.props.navigation.navigate("SuccessRetrack", {
                error: true,
              });
              this.setState({
                isLoading: false,
                buttonDisable: false,
              });
            }
          });
        })
        .catch((error) => {
          //Alert.alert("Exception Error", error.message);
          this.props.navigation.navigate("SuccessRetrack", {
            error: true,
          });
          this.setState({
            isLoading: false,
            buttonDisable: false,
          });
        });
    } else {
      if (customerId == "") {
      } else {
        alert("Please wait before retracking for this customer.");
      }
    }
  };

  onButtonPress = () => {
    this.props.navigation.navigate("SuccessRetrack");
    this.setState({ customerId: "", isEnabled: false, error: "1" });
  };
  onLogout = async () => {
    this.setState({ isLoading: true });
    await AsyncStorage.removeItem("userId");
    await AsyncStorage.removeItem("password");
    global.userId = "";
    this.setState({ isLoading: false });
    this.props.navigation.popToTop();
  };
  render() {
    let { customerCity, customerName, customerId, type } = this.state;
    return (
      <View style={{ flex: 1, backgroundColor: "white" }}>
        <ImageBackground
          source={icons.background}
          style={styles.backgroundImage}
          resizeMode="cover"
        ></ImageBackground>
        <View
          style={{
            flexDirection: "row",
            marginVertical: 16,
            alignItems: "center",
          }}
        >
          <Image style={{ resizeMode: "contain" }} source={icons.half_oval} />
          <Image
            style={{ marginLeft: 32, resizeMode: "contain" }}
            source={icons.nxt_retrack}
            imageStyle={{ marginTop: 50 }}
          />
        </View>
        <View
          style={{
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <View style={{ flexDirection: "row" }}>
            <Text
              style={[
                styles.retrackTypeText,
                {
                  color: type == "indigital" ? "#266CB5" : "#58595B",
                },
              ]}
            >
              INDigital
            </Text>
            <Text style={{ fontWeight: "bold", fontSize: 18, color: "#ccc" }}>
              {" "}
              |{" "}
            </Text>
            <Text
              style={[
                styles.retrackTypeText,
                {
                  color: (type == "nxtdigital") == true ? "purple" : "#58595B",
                },
              ]}
            >
              NXTDIGITAL
            </Text>
          </View>
          <View style={{ top: 12 }}>
            <Switch
              trackColor={{ true: "#b3b3b3", false: "#b3b3b3" }}
              thumbColor={type == "indigital" ? "#266CB5" : "purple"}
              onValueChange={(data) =>
                this.setState(
                  {
                    type: !data ? "indigital" : "nxtdigital",
                  },
                  () => console.log("Current type", this.state.type)
                )
              }
              value={type == "indigital" ? false : true}
            />
          </View>
          <View style={{ margin: 16, width: "100%" }}>
            <View style={styles.inputView}>
              <TextInput
                style={styles.inputText}
                placeholder="Customer/STB Number"
                placeholderTextColor="#003f5c"
                value={customerId}
                onChangeText={(text) => {
                  this.setState({ customerId: text });
                }}
                value={this.state.customerId}
              />
            </View>
            <View style={styles.inputView}>
              <Picker
                style={styles.pickerStyle}
                placeholder={"Select Type Of Error"}
                dropdownIconColor={"#000"}
                selectedValue={this.state.error}
                onValueChange={(itemValue, itemIndex) =>
                  this.setState({ error: itemValue })
                }
              >
                <Picker.Item label="Error 1" value="1" />
                <Picker.Item label="Error 3" value="3" />
                <Picker.Item label="Error 5" value="5" />
                <Picker.Item label="Error 6" value="6" />
              </Picker>
            </View>
            {customerName != "" ? (
              <View
                style={[
                  styles.customerCard,
                  {
                    backgroundColor: "#c5d7db",
                    borderRadius: 10,
                    margin: 16,
                    padding: 16,
                    justifyContent: "center",
                  },
                ]}
              >
                <View
                  style={{
                    backgroundColor: "white",
                    height: 26,
                    width: 26,
                    justifyContent: "center",
                    alignItems: "center",
                    borderRadius: 10,
                    marginBottom: 8,
                  }}
                >
                  <Image
                    source={icons.person}
                    style={{
                      height: 24,
                      width: 24,
                      resizeMode: "contain",
                      tintColor: "grey",
                    }}
                  />
                </View>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <View style={{ marginRight: 24 }}>
                    <Text style={{ color: "#266CB5", fontSize: 16 }}>Name</Text>
                    <Text style={{ color: "#266CB5", fontSize: 16 }}>City</Text>
                  </View>
                  <View>
                    <Text style={{ fontSize: 16 }}>{customerName}</Text>
                    <Text style={{ fontSize: 16 }}>{customerCity}</Text>
                  </View>
                </View>
              </View>
            ) : null}
          </View>

          <TouchableOpacity
            style={{ paddingTop: 24 }}
            onPress={() => this.onRetrack()}
            disabled={this.state.buttonDisable}
          >
            <ImageBackground
              source={icons.button_blue}
              style={styles.button}
              imageStyle={{ borderRadius: 10 }}
            >
              {!this.state.isLoading ? (
                <Text style={styles.buttonText}>Process</Text>
              ) : (
                <ActivityIndicator
                  size="small"
                  color={"#fff"}
                  style={{ marginLeft: 18 }}
                />
              )}
            </ImageBackground>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={this.onLogout}
            style={{ alignSelf: "center", marginTop: 32 }}
          >
            <Text style={{ color: "#003f5c" }}>Logout</Text>
          </TouchableOpacity>
        </View>

        <View style={{ flex: 2 }} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  backgroundImage: {
    justifyContent: "center",
    position: "absolute",
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
  retrackTypeText: {
    fontWeight: "bold",
    fontSize: 18,
  },
  customerCard: {
    backgroundColor: "white",
    shadowColor: "#888888",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.9,
    shadowRadius: 3,
    elevation: 8,
  },
  inputView: {
    margin: 16,
    borderRadius: 5,
    height: 60,
    marginTop: 8,
    justifyContent: "center",
    padding: 20,
    borderRadius: 8,
    backgroundColor: "white",
    shadowColor: "#888888",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.9,
    shadowRadius: 3,
    elevation: 8,
  },
  inputText: {
    height: 60,
    color: "black",
  },
  pickerStyle: {
    color: "#344953",
    justifyContent: "center",
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

export default Retrack;
