import React from "react";
import {
  Button,
  Box,
  TextField,
  Alert,
  Typography,
  Tabs,
  Tab,
} from "@mui/material";
import axios from "axios";

/**
 * Define TopBar, a React component of project #5
 */
class LoginRegister extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: {
        first_name: undefined,
        last_name: undefined,
        location: undefined,
        description: undefined,
        occupation: undefined,
        login_name: undefined,
        password: undefined,
        password_repeat: undefined,
      },
      showLoginError: false,
      showRegistrationError: false,
      showRegistrationSuccess: false,
      showRegistration: false,
      tab: 1,
    };
    this.handleLogin = this.handleLogin.bind(this);
    this.handleRegister = this.handleRegister.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleShowRegistration = this.handleShowRegistration.bind(this);
  }

  handleShowRegistration = () => {
    const showRegistration = this.state.showRegistration;
    this.setState({
      showRegistration: !showRegistration,
    });
  };
  handleLogin = () => {
    const currentState = JSON.stringify(this.state.user);
    axios
      .post("/admin/login", currentState, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        const user = response.data;
        this.setState({
          showLoginError: false,
          showRegistrationSuccess: false,
          showRegistrationError: false,
        });
        this.props.changeUser(user);
      })
      .catch((error) => {
        this.setState({
          showLoginError: true,
          showRegistrationSuccess: false,
          showRegistrationError: false,
        });
        console.log(error);
      });
  };

  handleRegister = () => {
    if (this.state.password !== this.state.password_repeat) {
      // eslint-disable-next-line no-alert
      alert("Passwords don't match");
      return;
    }
    const currentState = JSON.stringify(this.state.user);
    axios
      .post("/user/", currentState, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        const user = response.data;
        this.setState({
          showRegistrationSuccess: true,
          showRegistrationError: false,
          showLoginError: false,
          showRegistration: false,
        });
        this.props.changeUser(user);
      })
      .catch((error) => {
        this.setState({
          showRegistrationError: true,
          showLoginError: false,
          showRegistrationSuccess: false,
        });
        console.log(error);
      });
  };

  handleChange(event) {
    this.setState((state) => {
      state.user[event.target.id] = event.target.value;
      return { user: state.user }; // Return the updated state
    });
  }
  componentDidMount() {
    //this.handleAppInfoChange();
  }
  render() {
    return this.state.user ? (
      <div>
        <Box component="form" autoComplete="off">
          {this.state.showLoginError && (
            <Alert severity="error">Login Failed</Alert>
          )}
          {this.state.showRegistrationError && (
            <Alert severity="error">Registration Failed</Alert>
          )}
          {this.state.showRegistrationSuccess && (
            <Alert severity="success">Registration Succeeded</Alert>
          )}
          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <Tabs
              value={this.state.tab}
              onChange={(e, newValue) => {
                this.setState((prevState) => ({
                  ...prevState,
                  tab: newValue,
                }));
              }}
              aria-label="basic tabs example"
            >
              <Tab label="Login" value={1} />
              <Tab label="Sign up" value={2} />
            </Tabs>
          </Box>
          {this.state.tab === 1 ? (
            <>
              <div>
                <TextField
                  id="login_name"
                  label="Login Name"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  required={true}
                  onChange={this.handleChange}
                />
              </div>
              <div>
                <TextField
                  id="password"
                  label="Password"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  type="password"
                  required={true}
                  onChange={this.handleChange}
                />
              </div>
              <Box mb={2}>
                <Button
                  type="submit"
                  variant="contained"
                  onClick={this.handleLogin}
                >
                  Login
                </Button>
              </Box>
            </>
          ) : (
            <Box>
              <div>
                <TextField
                  id="login_name"
                  label="Login Name"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  required={true}
                  onChange={this.handleChange}
                />
              </div>
              <div>
                <TextField
                  id="password"
                  label="Password"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  type="password"
                  required={true}
                  onChange={this.handleChange}
                />
              </div>
              <div>
                <TextField
                  id="password_repeat"
                  label="Repeat Password"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  type="password"
                  required={this.state.showRegistration}
                  onChange={this.handleChange}
                />
              </div>
              <div>
                <TextField
                  id="first_name"
                  label="First Name"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  autoComplete="off"
                  required={this.state.showRegistration}
                  onChange={this.handleChange}
                />
              </div>
              <div>
                <TextField
                  id="last_name"
                  label="Last Name"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  required={this.state.showRegistration}
                  onChange={this.handleChange}
                />
              </div>
              <div>
                <TextField
                  id="location"
                  label="Location"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  onChange={this.handleChange}
                />
              </div>
              <div>
                <TextField
                  id="description"
                  label="Description"
                  variant="outlined"
                  multiline
                  rows={4}
                  fullWidth
                  margin="normal"
                  onChange={this.handleChange}
                />
              </div>
              <div>
                <TextField
                  id="occupation"
                  label="Occupation"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  onChange={this.handleChange}
                />
              </div>
              <div>
                <Button variant="contained" onClick={this.handleRegister}>
                  Register
                </Button>
              </div>
            </Box>
          )}
        </Box>
      </div>
    ) : (
      <div />
    );
  }
}

export default LoginRegister;
