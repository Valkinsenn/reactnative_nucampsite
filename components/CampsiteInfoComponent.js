import React, { Component } from "react";
import {
  Button,
  FlatList,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Card, Icon, Input, Rating } from "react-native-elements";
import { connect } from "react-redux";
import { baseUrl } from "../shared/baseUrl";
import { postComment, postFavorite } from "../redux/ActionCreators";

const mapStateToProps = (state) => {
  return {
    campsites: state.campsites,
    comments: state.comments,
    favorites: state.favorites,
  };
};

const mapDispatchToProps = {
  postComment: (campsiteId, author, rating, text) =>
    postComment(campsiteId, author, rating, text),
  postFavorite: (campsiteId) => postFavorite(campsiteId),
};

function RenderCampsite(props) {
  const { campsite } = props;

  if (campsite) {
    return (
      <Card
        featuredTitle={campsite.name}
        image={{ uri: baseUrl + campsite.image }}
      >
        <Text style={{ margin: 10 }}>{campsite.description}</Text>
        <View style={styles.cardRow}>
          <Icon
            name={props.favorite ? "heart" : "heart-o"}
            type="font-awesome"
            color="#f50"
            raised
            reverse
            onPress={() =>
              props.favorite
                ? console.log("Already set as a favorite")
                : props.markFavorite()
            }
          />
          <Icon
            color="#5637DD"
            name="pencil"
            onPress={() => props.onShowModal()}
            raised
            reverse
            type="font-awesome"
          />
        </View>
      </Card>
    );
  }
  return <View />;
}

function RenderComments({ comments }) {
  const renderCommentItem = ({ item }) => {
    return (
      <View style={{ margin: 10 }}>
        <Text style={{ fontSize: 14 }}>{item.text}</Text>
        {/* <Text style={{ fontSize: 12 }}>{item.rating} Stars</Text> */}
        <Rating
          imageSize={10}
          readonly
          startingValue={item.rating}
          style={{ alignItems: "flex-start", paddingVertical: "5%" }}
        />
        <Text
          style={{ fontSize: 12 }}
        >{`-- ${item.author}, ${item.date}`}</Text>
      </View>
    );
  };

  return (
    <Card title="Comments">
      <FlatList
        data={comments}
        renderItem={renderCommentItem}
        keyExtractor={(item) => item.id.toString()}
      />
    </Card>
  );
}

class CampsiteInfo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      author: "",
      rating: 5,
      showModal: false,
      text: "",
    };
  }

  toggleModal() {
    this.setState({ showModal: !this.state.showModal });
  }

  handleComment(campsiteId) {
    // console.log(JSON.stringify(this.state));
    this.props.postComment(
      campsiteId,
      this.state.author,
      this.state.rating,
      this.state.text
    );
    this.toggleModal();
    // this.resetForm();
  }

  resetForm() {
    this.setState({
      author: "",
      rating: 5,
      text: "",
    });
  }

  markFavorite(campsiteId) {
    // this.setState({ favorite: true });
    this.props.postFavorite(campsiteId);
  }

  static navigationOptions = {
    title: "Campsite Information",
  };

  render() {
    const campsiteId = this.props.navigation.getParam("campsiteId");
    // const campsite = this.state.campsites.filter(
    const campsite = this.props.campsites.campsites.filter(
      (campsite) => campsite.id === campsiteId
    )[0];
    // const comments = this.state.comments.filter(
    const comments = this.props.comments.comments.filter(
      (comment) => comment.campsiteId === campsiteId
    );
    return (
      <ScrollView>
        <RenderCampsite
          campsite={campsite}
          favorite={this.props.favorites.includes(campsiteId)}
          markFavorite={() => this.markFavorite(campsiteId)}
          onShowModal={() => this.toggleModal()}
        />
        <RenderComments comments={comments} />
        <Modal
          animationType={"slide"}
          onRequestClose={() => this.toggleModal()}
          transparent={false}
          visible={this.state.showModal}
        >
          <View style={styles.modal}>
            <View style={{ margin: 10 }}>
              <Rating
                imageSize={40}
                onFinishRating={(rating) => this.setState({ rating: rating })}
                showRating={true}
                startingValue={this.state.rating}
                style={{ paddingVertical: 10 }}
              />
              <Input
                leftIcon={<Icon name="user-o" type="font-awesome" />}
                leftIconContainerStyle={{ paddingRight: 10 }}
                onChangeText={(author) => this.setState({ author: author })}
                placeholder="Author"
                value={this.state.author}
              />
              <Input
                leftIcon={<Icon name="comment-o" type="font-awesome" />}
                leftIconContainerStyle={{ paddingRight: 10 }}
                onChangeText={(text) => this.setState({ text: text })}
                placeholder="Comment"
                value={this.state.text}
              />
              <Button
                color="#5637DD"
                onPress={() => {
                  this.handleComment(campsiteId);
                  this.resetForm();
                }}
                title="Submit"
              />
              <View style={{ marginTop: 20 }}>
                <Button
                  color="#808080"
                  onPress={() => {
                    this.resetForm();
                    this.toggleModal();
                  }}
                  title="Cancel"
                />
              </View>
            </View>
          </View>
        </Modal>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  cardRow: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    flexDirection: "row",
    margin: 20,
  },
  modal: {
    flex: 1,
    alignContent: "center",
    justifyContent: "center",
    margin: 20,
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(CampsiteInfo);
