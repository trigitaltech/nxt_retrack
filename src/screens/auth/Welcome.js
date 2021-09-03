import React, { Component } from "react";
import { View, Text } from "react-native";

export default class Welcome extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userName: this.props.route.params.userName,
    };
  }
  componentDidMount() {
    setTimeout(() => {
      this.props.navigation.pop();
      this.props.navigation.navigate("Retrack");
    }, 1000);
  }
  render() {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: "#266CB5",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Text style={{ color: "white", fontSize: 40 }}>Welcome</Text>
        <Text style={{ color: "white", fontSize: 20 }}>
          {this.state.userName}
        </Text>
      </View>
    );
  }
}
