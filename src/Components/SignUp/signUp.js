import React from 'react';
import {Card} from 'react-bootstrap';
import {Link} from 'react-router-dom';
import Grid from '@material-ui/core/Grid';
import '../Styles/Signup.css';
import LocalStorageStrings  from '../LoginStrings';
import TextField from '@material-ui/core/TextField';
import ReactLoading from 'react-loading';
import firebase from '../Firebase/firebase';

class Signin extends React.Component{
    constructor(props){
        super(props)
        this.state ={
            isLoading: false,
            email: "",
            password: "",
            name:""
        }
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }
   
    handleChange(event){
        this.setState({
            [event.target.name]: event.target.value
        });
    }
    async handleSubmit(event){
        const {name,password,email} = this.state;
        event.preventDefault();
        this.setState({isLoading: true})
        try{
        await firebase.auth().createUserWithEmailAndPassword(email, password)
        .then(async result => {
                await firebase.firestore().collection('users')
                .add({
                    name,
                    id:result.user.uid,
                    email,
                    password,
                    URL:'',
                    description:'',
                })
                .then((docRef)=>{
                        localStorage.setItem(LocalStorageStrings.FirebaseDocumentId, docRef.id);
                        localStorage.setItem(LocalStorageStrings.ID, result.user.uid);
                        localStorage.setItem(LocalStorageStrings.Name, name);
                        localStorage.setItem(LocalStorageStrings.Email, email);
                        localStorage.setItem(LocalStorageStrings.PhotoURL, "");
                        localStorage.setItem(LocalStorageStrings.Description, "");
                        this.setState({isLoading: false});
                        this.props.history.push('/chat');
                }).catch(function(error){
                    document.getElementById('1').innerHTML="User Already exit or poor internet";
                })
        })
        }catch{
            console.log("Failed To Authenticate")
        }   
    }
    render(){
        const paper={
            display:'flex',
            flexDirection:'column',
            alignItems:'center',
            paddingLeft:'10px',
            paddingRight:'10px',
            marginTop:'10px'
        }
        return(
           <Grid  container component="main" className="root">
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
                   ): null}
                   </div>
                   
                   </Grid>
               <Grid item xs={12} sm={8} md={5} className="loginrightcomponent" elevation={6} square>
                 <Card style={{display:'flex',backgroundColor:'#0e1111',flexDirection:'column',alignItems:'center', width:'100%', boxShadow:"0 5px 5px #808888"}}>
                     <Link to="/">
                         <button class="btnhome">
                             <i class="fa fa-home">Go to Home</i>
                         </button>
                     </Link>
                 </Card>
                 <div style={paper}>
                     <form style={{marginTop:'50px',width:'100%'}} noValidate onSubmit={this.handleSubmit}>
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
                         label="Password :length Greater than 6"
                         name="password"
                         type="password"
                         autoComplete="current-password"
                         autoFocus
                         onChange={this.handleChange}
                         value={this.state.password}
                         /> 
                           <TextField
                         variant="outlined"
                         margin="normal"
                         required
                         fullWidth
                         id="name"
                         label="Your Name"
                         name="name"
                         autoComplete="name"
                         autoFocus
                         onChange={this.handleChange}
                         value={this.state.name}
                         />
                         <div>
                             <p style={{color:'grey', fontSize:'15px'}}>Please fill all fields and password should be greater than 6</p>
                         </div>
                         <div className="CenterAliningItems">           
                                 <button className="button1" type="submit" >
                                     Signup
                                 </button>     
                            </div>   
                            <div>
                                <p id='1' style={{color:'red'}}></p>
                            </div>     

                     </form>

                 </div>
               </Grid>
           </Grid>

        );
    };
};
export default Signin;