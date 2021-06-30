import React from 'react';
import {Card} from 'react-bootstrap';
import {Link} from 'react-router-dom';
import Grid from '@material-ui/core/Grid';
import '../Styles/Profile.css';
import LocalStorageStrings  from '../LoginStrings';
import TextField from '@material-ui/core/TextField';
import ReactLoading from 'react-loading';
import firebase from '../Firebase/firebase';
import 'react-toastify/dist/ReactToastify.css';


class Signin extends React.Component{
    constructor(props){
        super(props)
        this.state ={
        isLoading: false,
        documentKey: localStorage.getItem(LocalStorageStrings.FirebaseDocumentId),
        id: localStorage.getItem(LocalStorageStrings.ID),
        photoUrl:localStorage.getItem(LocalStorageStrings.PhotoURL),
        name: localStorage.getItem(LocalStorageStrings.Name),
        aboutMe: localStorage.getItem(LocalStorageStrings.Description)
        }    
        this.newPhoto = null;
        this.newPhotoUrl = ""   
        this.onChangeNickname = this.onChangeNickname.bind(this);
        this.onChangeAvatar = this.onChangeAvatar.bind(this);
        this.onChangeAboutMe = this.onChangeAboutMe.bind(this);
        this.updateInfo = this.updateInfo.bind(this);
    }
    onChangeNickname = (event) =>{
        this.setState({
            name: event.target.value
        })
    }
    onChangeAboutMe = (event) =>{
        this.setState({
            aboutMe: event.target.value
        })
    }
    onChangeAvatar = (event) => {
        if(event.target.files && event.target.files[0]){
            const prefixFiletype = event.target.files[0].type.toString()
            if(prefixFiletype.indexOf(LocalStorageStrings.PREFIX_IMAGE) !== 0){
                this.props.showToast(0, "This. file is not an image")
                return
            }
            this.newPhoto = event.target.files[0]
            this.setState({photoUrl: URL.createObjectURL(event.target.files[0])})

        }else{
            this.props.showToast(0, "Something wrong with input file")
        }
    }
    updateInfo = () => {
        this.setState({isLoading: true})
        if(this.newPhoto){
            const uploadTask = firebase.storage()
            .ref()
            .child(this.state.id)
            .put(this.newPhoto)
            uploadTask.on(
                LocalStorageStrings.UPLOAD_CHANGED,
                null,
                err =>{
                    this.props.showToast(0, err.message)
                },
                ()=>{
                    uploadTask.snapshot.ref.getDownloadURL().then(downloadURL => {
                        this.updateUserInfo(true, downloadURL)
                        this.setState({isLoading: true})

                    })
                }
            )
        }else{
            this.updateUserInfo(false,null)
        }

    }

    updateUserInfo = (isUpdatedPhotoURL, downloadURL)=>{
        let newInfo
        if(isUpdatedPhotoURL){
            newInfo = {
                name: this.state.name,
                description: this.state.aboutMe,
                URL: downloadURL
            }
        }else{
           newInfo ={
                name: this.state.name,
                description: this.state.aboutMe,
           }
        }
        firebase.firestore()
        .collection('users')
        .doc(this.state.documentKey)
        .update(newInfo)
        .then(data => {
            localStorage.setItem(LocalStorageStrings.Name, this.state.name)
            localStorage.setItem(LocalStorageStrings.Description, this.state.aboutMe)
            if(isUpdatedPhotoURL){
                localStorage.setItem(LocalStorageStrings.PhotoURL, downloadURL)
            }
            this.setState({isLoading: false})
            this.props.showToast(1, "Update Info Success")
        })

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
                           color={'pink'}
                           height={'10%'}
                           width={'10%'}
                           />
                       </div>
                   ): null}
                   </div>
                   
                   </Grid>
               <Grid item xs={12} sm={8} md={5} className="loginrightcomponent" elevation={6} square>
                 <Card style={{display:'flex',flexDirection:'column',alignItems:'center', width:'100%', boxShadow:"0 5px 5px #808888"}}>
                       <button class="btnhome">
                             Profile
                         </button>            
                 </Card>
                 <div style={paper}>

                        <img className="avatar" alt="" src={this.state.photoUrl ? this.state.photoUrl : "https://firebasestorage.googleapis.com/v0/b/realtime-web-chat-application.appspot.com/o/nopic.jpg?alt=media&token=ca9b2167-2092-4c9e-9ad2-409242ad6bd3" }/>
                        <div className="viewWrapInputFile">
                            <img
                            className="imgInputFile"
                            alt="icon gallery"
                            src="https://firebasestorage.googleapis.com/v0/b/realtime-web-chat-application.appspot.com/o/ic_input_file.png?alt=media&token=458fc33b-52bd-4818-82cd-d28f39c6d82b"
                            onClick={()=>{this.refInput.click()}}
                            
                            />
                            <input
                            ref = {el => {
                                this.refInput = el
                            }}
                            accept = "image/*"
                            className="viewInputFile"
                            type="file"
                            onChange={this.onChangeAvatar}
                            
                            />

                        </div>

                    
                         <TextField
                         variant="outlined"
                         margin="normal"
                         fullWidth
                         id="name"
                         label="Name"
                         name="name"
                         autoFocus
                         onChange={this.onChangeNickName}
                         value={this.state.name ? this.state.name : ""}
                         />
                        <TextField
                         variant="outlined"
                         margin="normal"
                         fullWidth
                         id="description"
                         label="Status"
                         name="description"
                         autoFocus
                         onChange={this.onChangeAboutMe}
                         value={this.state.aboutMe ? this.state.aboutMe : ""}
                         />
                         
                         <div>
                             <button className="button1" onClick={this.updateInfo}>
                                 <span>Update</span>
                             </button>
                        
                            <button className="button1" onClick={()=>{this.props.history.push('/chat')}}>
                                back
                            </button>
                       
                            </div>                                        
                 </div>
               </Grid>
           </Grid>

        );
    };
};
export default Signin;