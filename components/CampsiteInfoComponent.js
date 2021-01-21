import React, { Component } from "react";
import {
  Alert,
  Button,
  FlatList,
  Modal,
  PanResponder,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Card, Icon, Input, Rating } from "react-native-elements";
import { connect } from "react-redux";
import { baseUrl } from "../shared/baseUrl";
import { postComment, postFavorite } from "../redux/ActionCreators";
import * as Animatable from "react-native-animatable";

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

  const view = React.createRef();

  const recognizeDrag = ({ dx }) => (dx < -200 ? true : false);

  const recognizeComment = ({ dx }) => (dx > 200 ? true : false);

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderGrant: () => {
      view.current
        .rubberBand(1000)
        .then((endState) =>
          console.log(endState.finished ? "finished" : "canceled")
        );
    },
    onPanResponderEnd: (e, gestureState) => {
      console.log("pan responder end", gestureState);
      if (recognizeDrag(gestureState)) {
        Alert.alert(
          "Add Favorite",
          `Are you sure you want to add ${campsite.name} to your favorites?`,
          [
            {
              text: "Cancel",
              style: "cancel",
              onPress: () => console.log("Cancel Pressed"),
            },
            {
              text: "OK",
              onPress: () =>
                props.favorite
                  ? console.log("Already set as a favorite")
                  : props.markFavorite(),
            },
          ],
          { cancelable: false }
        );
      } else if (recognizeComment(gestureState)) {
        props.onShowModal();
      }
      return true;
    },
  });

  const shareCampsite = (title, message, url) => {
    Share.share(
      {
        title,
        message: `${title}: ${message} ${url}`,
        url,
      },
      {
        dialogTitle: `Share ${title}`,
      }
    );
  };

  if (campsite) {
    return (
      <Animatable.View
        animation="fadeInDown"
        duration={2000}
        delay={1000}
        ref={view}
        {...panResponder.panHandlers}
      >
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
            <Icon
              color="#5637DD"
              name={"share"}
              onPress={() =>
                shareCampsite(
                  campsite.name,
                  campsite.description,
                  baseUrl + campsite.image
                )
              }
              raised
              reverse
              type="font-awesome"
            />
          </View>
        </Card>
      </Animatable.View>
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
    <Animatable.View animation="fadeInUp" duration={2000} delay={1000}>
      <Card title="Comments">
        <FlatList
          data={comments}
          renderItem={renderCommentItem}
          keyExtractor={(item) => item.id.toString()}
        />
      </Card>
    </Animatable.View>
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
