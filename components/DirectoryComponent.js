import React, { Component } from "react";
import { FlatList, View } from "react-native";
// import { ListItem } from "react-native-elements";
import { Tile } from "react-native-elements";
// import { HeaderTitle } from "react-navigation-stack";
// import { CAMPSITES } from "../shared/campsites";
import { connect } from "react-redux";
import { baseUrl } from "../shared/baseUrl";
import Loading from "./LoadingComponent";
import * as Animatable from "react-native-animatable";

const mapStateToProps = (state) => {
  return {
    campsites: state.campsites,
  };
};

class Directory extends Component {
  // constructor(props) {
  //   super(props);
  //   this.state = {
  //     campsites: CAMPSITES,
  //   };
  // }

  static navigationOptions = {
    title: "Directory",
  };

  render() {
    const { navigate } = this.props.navigation;

    const renderDirectoryItem = ({ item }) => {
      return (
        <Animatable.View animation="fadeInRightBig" duration={2000}>
          <Tile
            title={item.name}
            caption={item.description}
            featured
            // onPress={() => props.onPress(item.id)}
            onPress={() => navigate("CampsiteInfo", { campsiteId: item.id })}
            // leftAvatar={{ source: require("./images/react-lake.jpg") }}
            imageSrc={{ uri: baseUrl + item.image }}
          />
        </Animatable.View>
      );
    };

    if (this.props.campsites.isLoading) {
      return <Loading />;
    }

    if (this.props.campsites.errMess) {
      return (
        <View>
          <Text>{props.campsites.errMess}</Text>
        </View>
      );
    }

    return (
      <FlatList
        // data={props.campsites}
        // data={this.state.campsites}
        data={this.props.campsites.campsites}
        renderItem={renderDirectoryItem}
        keyExtractor={(item) => item.id.toString()}
      />
    );
  }
}

export default connect(mapStateToProps)(Directory);
