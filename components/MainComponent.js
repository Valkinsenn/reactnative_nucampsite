// SUGGESTION 1, PART 1: You can import "Component" from the react library
// No points off, but I noticed when defining your Main component as a class, you referred to React.Component.
// That is absolutely fine, but I wanted to make sure you were also aware that you could import
// Component in the line below like this...
// OLD CODE: import React from "react";
import React, { Component } from "react";
// END SUGGESTION 1, PART 1
import Home from "./HomeComponent";
import Directory from "./DirectoryComponent";
import About from "./AboutComponent";
import Contact from "./ContactComponent";
import CampsiteInfo from "./CampsiteInfoComponent";
import { View, Platform } from "react-native";
// import { CAMPSITES } from "../shared/campsites";
import { createStackNavigator } from "react-navigation-stack";
import { createDrawerNavigator } from "react-navigation-drawer";
import { createAppContainer } from "react-navigation";
// import ExpoStatusBar from "expo-status-bar/build/ExpoStatusBar";

const ContactNavigator = createStackNavigator(
  {
    // FIX 1, PART 1: Incorrect screen assignment
    // Your contact navigator only needs to serve up the contact component
    // You can delete the rest of the component pointers...
    /*
    Directory: { screen: Directory },
    CampsiteInfo: { screen: CampsiteInfo },
    About: { screen: About },
    */
    // END FIX 1, PART 1
    Contact: { screen: Contact },
  },
  {
    // FIX 1, PART 2: Unnecessary initial route
    // Since we now have corrected this navigator to point to one component,
    // you do not need the "initialRoute" parameter.
    /* initialRouteName: "Contact",*/
    // END FIX 1, PART 2
    defaultNavigationOptions: {
      headerStyle: {
        backgroundColor: "#5637DD",
      },
      headerTintColor: "#fff",
      headerTitleStyle: {
        color: "#fff",
      },
    },
  }
);

const AboutNavigator = createStackNavigator(
  {
    // FIX 2, PART 1: Incorrect screen assignment
    // As above, your about navigator only needs to serve up the contact component
    // You can delete the rest of the component pointers...
    /*
    Directory: { screen: Directory },
    CampsiteInfo: { screen: CampsiteInfo },
    Contact: { screen: Contact },
    */
    // END FIX 2, PART 1
    About: { screen: About },
  },
  {
    // FIX 2, PART 2: Unnecessary initial route
    // Again, if you have only one screen, there is no need to specify an initial route
    /* initialRouteName: "About", */
    // END FIX 2, PART 2
    defaultNavigationOptions: {
      headerStyle: {
        backgroundColor: "#5637DD",
      },
      headerTintColor: "#fff",
      headerTitleStyle: {
        color: "#fff",
      },
    },
  }
);

const DirectoryNavigator = createStackNavigator(
  {
    Directory: { screen: Directory },
    CampsiteInfo: { screen: CampsiteInfo },
    // FIX 3, PART 1: Incorrect screen assignment
    // Your directory navigator still only needs to serve up the
    // directory and campsite info components. Because we have more
    // than one screen, we DO have to have the initial route paramter
    // specified as you have it on line 98.
    // You can delete the rest of the component pointers...
    /*
    About: { screen: About },
    Contact: { screen: Contact },
    */
    // END FIX 3, PART 1
  },
  {
    initialRouteName: "Directory",
    defaultNavigationOptions: {
      headerStyle: {
        backgroundColor: "#5637DD",
      },
      headerTintColor: "#fff",
      headerTitleStyle: {
        color: "#fff",
      },
    },
  }
);

const HomeNavigator = createStackNavigator(
  {
    Home: { screen: Home },
  },
  {
    defaultNavigationOptions: {
      headerStyle: {
        backgroundColor: "#5637DD",
      },
      headerTintColor: "#fff",
      headerTitleStyle: {
        color: "#fff",
      },
    },
  }
);

const MainNavigator = createDrawerNavigator(
  {
    Home: { screen: HomeNavigator },
    Directory: { screen: DirectoryNavigator },
    About: { screen: AboutNavigator },
    Contact: { screen: ContactNavigator },
  },
  {
    drawerBackgroundColor: "#CEC8FF",
  }
);

const AppNavigator = createAppContainer(MainNavigator);

// SUGGESTION 1, PART 2: Using Component when imported from react library
// As per the suggestion above, if you import Component from the react library
// you would change your class definition statement just slightly...
// OLD CODE: class Main extends React.Component {
class Main extends Component {
  // END SUGGESTION 1, PART 2
  // constructor(props) {
  //   super(props);
  //   this.state = {
  //     campsites: CAMPSITES,
  //     selectedCampsite: null,
  //   };
  // }

  // onCampsiteSelect(campsiteId) {
  //   this.setState({ selectedCampsite: campsiteId });
  // }

  render() {
    return (
      <View
        style={{
          flex: 1,
          paddingTop:
            Platform.OS === "ios" ? 0 : Expo.Constants.statusBarHeight,
        }}
      >
        <AppNavigator />
        {/* <Directory
          campsites={this.state.campsites}
          onPress={(campsiteId) => this.onCampsiteSelect(campsiteId)}
        />
        <CampsiteInfo
          campsite={
            this.state.campsites.filter(
              (campsite) => campsite.id === this.state.selectedCampsite
            )[0]
          }
        /> */}
      </View>
    );
  }
}

export default Main;
