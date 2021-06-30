import React from 'react';
import { Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Grid from '@material-ui/core/Grid';
import '../Styles/Login.css';
import LocalStorageStrings from '../LoginStrings';
import TextField from '@material-ui/core/TextField';
import ReactLoading from 'react-loading';
import firebase from '../Firebase/firebase';

class Login extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            isLoading: false,
            email: "",
            password: ""
        }
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    componentDidMount() {
        if (localStorage.getItem(LocalStorageStrings.ID)) {
            this.setState({ isLoading: true })
            this.props.showToast(1, 'Login Success')
            this.props.history.push('./chat')
        } else {
            this.setState({ isLoading: false })
        }
    }
    handleChange(event) {
        this.setState({
            [event.target.name]: event.target.value
        });
    }
    async handleSubmit(event) {
        event.preventDefault();
        this.setState({ isLoading: true })
        try {
            await firebase.auth().signInWithEmailAndPassword(this.state.email, this.state.password)
                .then(async result => {
                    let user = result.user;
                    if (user) {
                        await firebase.firestore().collection('users')
                            .where('id', "==", user.uid)
                            .get()
                            .then(function (querySnapshot) {
                                querySnapshot.forEach(function (doc) {
                                    localStorage.setItem(LocalStorageStrings.FirebaseDocumentId, doc.id);
                                    localStorage.setItem(LocalStorageStrings.ID, doc.data().id);
                                    localStorage.setItem(LocalStorageStrings.Name, doc.data().name);
                                    localStorage.setItem(LocalStorageStrings.Email, doc.data().email);
                                    localStorage.setItem(LocalStorageStrings.PhotoURL, doc.data().URL);
                                    localStorage.setItem(LocalStorageStrings.Description, doc.data().description);
                                })
                            })
                    }
                    this.props.history.push('/chat');
                    this.setState({ isLoading: false });
                }).catch(function (error) {
                    document.getElementById('1').innerHTML = "incorrect email/password or poor internet";
                })
        } catch {
            console.log("Failed To Authenticate")
        }
    }
    render() {
        const paper = {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            paddingLeft: '10px',
            paddingRight: '10px',
            marginTop: '10px'
        }
        return (
            <Grid container component="main" className="root">
                <Grid item xs={1} sm={4} md={7} className="image">
                    <div className="leftimage">
                        {this.state.isLoading ? (
                            <div className="viewLoadingProfile">
                                <ReactLoading
                                    type={'spin'}
                                    color={'#203152'}
                                    height={'10%'}
                                    width={'10%'}
                                />
                            </div>
                        ) : null}
                    </div>

                </Grid>
                <Grid item xs={12} sm={8} md={5} className="loginrightcomponent" elevation={6} square>
                    <Card style={{ display: 'flex', flexDirection: 'column', alignItems: 'center',backgroundColor:'	#0e1111', width: '100%', boxShadow: "0 5px 5px #808888",elevation:'{7} square' }}>
                        <Link to="/">
                            <button class="btnhome">
                                <i class="fa fa-home">Go to Home</i>
                            </button>
                        </Link>
                    </Card>
                    <div style={paper}>
                        <form style={{ marginTop: '50px', width: '100%' }} noValidate onSubmit={this.handleSubmit}>
                            <TextField
                                variant="outlined"
                                margin="normal"
                                required
                                fullWidth
                                id="email"
                                label="Email Address"
                                name="email"
                                autoComplete="email"
                                autoFocus
                                onChange={this.handleChange}
                                value={this.state.email}
                            />
                            <TextField
                                variant="outlined"
                                margin="normal"
                                required
                                fullWidth
                                id="password"
                                label="Password"
                                type="password"
                                name="password"
                                autoComplete="current-password"
                                autoFocus
                                onChange={this.handleChange}
                                value={this.state.password}
                            />
                            <div className="CenterAliningItems">
                                <button className="button1" type="submit">
                                    <span>Login</span>
                                </button>
                                <Link to="/signup" variant="body2">
                                    <button className="button1">
                                        Signup
                                    </button>
                                </Link>
                            </div>
                            <div>
                                <p id='1' style={{ color: 'red' }}></p>
                            </div>

                        </form>

                    </div>
                </Grid>
            </Grid>

        );
    };
};
export default Login;