import React, { Component } from 'react';
import {
  Route,
  BrowserRouter as Router,
  Switch
} from 'react-router-dom';
import Home from './Components/Home/home';
import Login from './Components/Login/login';
import SidePanel from './Components/SidePanel/sidePanel';
import SignUp from './Components/SignUp/signUp';
import Profile from './Components/Profile/profile';
//import Welcome from './Components/Welcome/Welcome';
import { toast, ToastContainer } from 'react-toastify';
//import { Toast } from 'react-toastify/dist/components';

class App extends Component {
  showToast = (type, message) => {
    switch (type) {
      case 0:
        toast.warning(message)
        break;
      case 1:
        toast.success(message)
        break;
      default:
        break;
    }
  }
  render() {
    return (<Router>
      <ToastContainer
        autoClose={2000}
        hideProgressBar={true}
        position={toast.POSITION.TOP_CENTER}
      />
      <Switch>
        <Route
          exact
          path="/"
          render={props => <Home {...props} />}
        />
        <Route
          path="/signUp"
          render={props => <SignUp showToast={this.showToast}{...props} />}
        />
        <Route
          path="/login"
          render={props => <Login showToast={this.showToast}{...props} />}
        />
        <Route
          path="/chat"
          render={props => <SidePanel showToast={this.showToast}{...props} />}
        />
        <Route
          path="/profile"
          render={props => <Profile showToast={this.showToast}{...props} />}
        />
        {/* <Route
          path="/welcome"
          render={props => <Welcome showToast={this.showToast}{...props} />}
        /> */}

      </Switch>

    </Router>

    );
  };
};
export default App;
