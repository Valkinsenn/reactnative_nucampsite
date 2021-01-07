import React, { Component } from "react";
import { FlatList, View } from "react-native";
// import { ListItem } from "react-native-elements";
import { Tile } from "react-native-elements";
// import { HeaderTitle } from "react-navigation-stack";
// import { CAMPSITES } from "../shared/campsites";
import { connect } from "react-redux";
import { baseUrl } from "../shared/baseUrl";
import Loading from "./LoadingComponent";

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
        <Tile
          title={item.name}
          caption={item.description}
          featured
          // onPress={() => props.onPress(item.id)}
          onPress={() => navigate("CampsiteInfo", { campsiteId: item.id })}
          // leftAvatar={{ source: require("./images/react-lake.jpg") }}
          imageSrc={{ uri: baseUrl + item.image }}
        />
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
