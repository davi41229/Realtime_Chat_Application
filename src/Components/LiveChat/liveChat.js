import React from 'react';
import ReactLoading from 'react-loading';
import firebase from '../Firebase/firebase';
import 'react-toastify/dist/ReactToastify.css';
import '../Styles/liveChat.css';
import LocalStorageStrings from '../LoginStrings';
import 'bootstrap/dist/css/bootstrap.min.css';
import moment from 'moment';
import "../Styles/liveChat.css";

class LiveChat extends React.Component{
    constructor(props){
        super(props);
        this.state={
            isLoading: false,
            isShowSticker: false,
            inputValue:"",
            currentPeerUser:this.props.currentPeerUser
        }
        this.currentUserName = localStorage.getItem(LocalStorageStrings.Name);
        this.currentUserId = localStorage.getItem(LocalStorageStrings.ID);
        this.currentUserPhoto = localStorage.getItem(LocalStorageStrings.PhotoURL);
        this.currentUserDocumentId = localStorage.getItem(LocalStorageStrings.FirebaseDocumentId)
        this.stateChanged = LocalStorageStrings.UPLOAD_CHANGED;
        this.listMessage = [];
        this.removeListener = null
        this.groupChatId = null;
        this.currentPhotoFile = null;
    }
    componentDidUpdate(prevProps, preState){
        this.scrollToBottom()
        if(this.props.currentPeerUser !== prevProps.currentPeerUser){
            this.getListHistory();
        }

    }
    componentDidMount(){
        this.getListHistory()  
    }
    static getDerivedStateFromProps(props,state){
        if(props.currentPeerUser !== state.currentPeerUser){
            return {currentPeerUser : props.currentPeerUser}
        }
    }
    componentWillUnmount(){
        if(this.removeListener){
            this.removeListener()
        }
    }
    scrollToBottom = () => {
        if(this.messagesEnd){
            this.messagesEnd.scrollIntoView({})
        }
    }
    onKeyboardPress=(event)=>{
        if(event.key === 'Enter'){
            this.onSendMessage(this.state.inputValue, 0)
        }
    }
    openListSticker=()=>{
        this.setState({isShowSticker: !this.state.isShowSticker})
    }
    getListHistory=()=>{
        if(this.removeListener){
            this.removeListener()
        }
        this.listMessage.length = 0
        this.setState({isLoading : true})
        if(
            this.hashString(this.currentUserId)<=
            this.hashString(this.state.currentPeerUser.id)
        ){
            this.groupChatId = `${this.currentUserId}-${this.state.currentPeerUser.id}`
        }else{
            this.groupChatId = `${this.state.currentPeerUser.id}-${this.currentUserId}`
        }
        this.removeListener = firebase.firestore()
        .collection('Messages')
        .doc(this.groupChatId)
        .collection(this.groupChatId)
        .onSnapshot(
            onSnapshot => {
                onSnapshot.docChanges().forEach(change =>{
                    if(change.type === LocalStorageStrings.DOC){
                        this.listMessage.push(change.doc.data())
                    }
                })
                this.setState({isLoading: false})   
            },
            err =>{
                this.props.showToast(0, err.toString())
            }
        )
    }
    onSendMessage = (content, type)=>{
        if(this.state.isShowSticker && type === 2){
            this.setState({isShowSticker: false})
        }
        if(content.trim() === ''){
            return
        }
        const timestamp = moment()
        .valueOf()
        .toString()
        const itemMessage ={
            idFrom: this.currentUserId,
            idTo: this.state.currentPeerUser.id,
            timestamp: timestamp,
            content: content.trim(),
            type:type
        }
        firebase.firestore()
        .collection('Messages')
        .doc(this.groupChatId)
        .collection(this.groupChatId)
        .doc(timestamp)
        .set(itemMessage)
        .then(()=>{
            this.setState({inputValue:''})
        })
    }
    render(){
        return(
            <div className="content">
                 {this.state.isLoading ? (
                       <div className="viewLoading">
                           <ReactLoading
                           type={'spin'}
                           color={'black'}
                           height={'10%'}
                           width={'10%'}
                           />
                       </div>
                   ): null}
                   <div class="contact-profile">
                       <img alt ="" src={this.state.currentPeerUser.URL ? this.state.currentPeerUser.URL : "https://firebasestorage.googleapis.com/v0/b/realtime-web-chat-application.appspot.com/o/nopic.jpg?alt=media&token=ca9b2167-2092-4c9e-9ad2-409242ad6bd3" }/>
                        <p>{this.state.currentPeerUser.name}</p>
                        <div class="social-media">
                            <i class="fa fa-facebook" aria-hidden="true"></i>
                            <i class="fa fa-twitter" aria-hidden="true"></i>
                            <i class="fa fa-instagram" aria-hidden="true"></i>
                        </div>
                   </div>
                   <div className="viewListContentChat">
                       {this.renderListMessage()}
                       <div styles={{float:'left', clear:'both'}}
                        ref={el=>{
                            this.messagesEnd = el
                        }}
                       />                      
                   </div>
                   {this.state.isShowSticker ? this.renderStickers() : null}
                   <div className="message-input">
                       <div class="wrap">
                           <input
                            className="viewInput"
                            placeholder="Type a message"
                            value={this.state.inputValue}
                            onChange={event =>{
                                this.setState({inputValue: event.target.value})
                            }}
                            onKeyPress={this.onKeyboardPress}
                           
                           />
                           <img
                            className="icOpenGallery"
                            src="https://firebasestorage.googleapis.com/v0/b/realtime-web-chat-application.appspot.com/o/ic_photo.png?alt=media&token=cf2d98de-dc6d-4de1-a2f6-e347ffa62b6e"
                            alt="icon open gallery"
                            onClick={()=> this.refInput.click()}
                           />
                           <input
                                ref={el => {
                                    this.refInput = el
                                }}
                                accept="image/*"
                                className="viewInputGallery"
                                type="file"
                                onChange={this.onChoosePhoto}
                           />
                           <img
                                className="icOpenSticker"
                                src="https://firebasestorage.googleapis.com/v0/b/realtime-web-chat-application.appspot.com/o/ic_sticker.png?alt=media&token=ceb2aaf6-bed0-4711-9dcf-e13e4e64ac54"
                                alt="icon open sticker"
                                onClick={this.openListSticker}
                           />
                           <img
                                className="icSend"
                                src="https://firebasestorage.googleapis.com/v0/b/realtime-web-chat-application.appspot.com/o/ic_send.png?alt=media&token=2ba9c8fb-0f00-476e-9ee9-89a42b25c845"
                                alt="icon send"
                                onClick={() => this.onSendMessage(this.state.inputValue, 0)}
                           />
                       </div>
                   </div>             
            </div>
        );
    };
    onChoosePhoto = (event)=>{
        if(event.target.files && event.target.files[0]){
            this.setState({isLoading: true})
            this.currentPhotoFile = event.target.files[0]
            const prefixFiletype = event.target.files[0].type.toString()
            if(prefixFiletype.indexOf('image/') === 0){
                this.uploadPhoto()
            }else{
                this.setState({isLoading: false})
                this.props.showToast(0, 'This is not an image')
            }
        }else{
            this.setState({isLoading: false})
        }
    }
    uploadPhoto =()=>{
        if(this.currentPhotoFile){
            const timestamp = moment()
            .valueOf()
            .toString()
            const uploadTask = firebase.storage()
            .ref()
            .child(timestamp)
            .put(this.currentPhotoFile)
            uploadTask.on(
                LocalStorageStrings.UPLOAD_CHANGED,
                null,
                err =>{
                    this.setState({isLoading: false})
                    this.props.showToast(0, err.message)
                },
                ()=>{
                    uploadTask.snapshot.ref.getDownloadURL().then(downloadURL => {
                        this.onSendMessage(downloadURL, 1)
                        this.setState({isLoading: false})
                    })
                }
            )
        }else{
            this.setState({isLoading: false})
            this.props.showToast(0, 'File is null')
        }
    }
    renderListMessage = () => {
        if(this.listMessage.length > 0 ){
            let viewListMessage = []
            this.listMessage.forEach((item, index)=>{
                if(item.idFrom === this.currentUserId){
                    if(item.type === 0){
                        viewListMessage.push(
                            <div className="viewItemRight" key={item.timestamp}>
                                <span className="textContentItem">{item.content}</span>
                            </div>
                        )
                    }else if(item.type === 1){
                        viewListMessage.push(
                            <div className="viewItemRight2" key={item.timestamp}>
                                <img
                                className="imgItemRight"
                                src={item.content}
                                alt="content message"                          
                                />
                            </div>
                        )
                    }else{
                        viewListMessage.push(
                            <div className="viewItemRight3" key={item.timestamp}>
                                <img
                                className="imgItemRightSticker"
                                src={this.getGifImage(item.content)}
                                alt="content message"                             
                                />
                            </div>
                        )
                    }
                }else {
                    if(item.type === 0){
                        viewListMessage.push(
                            <div className="viewWrapItemLeft" key={item.timestamp}>
                                <div className="viewWrapItemLeft3">
                                    {this.isLastMessageLeft(index) ? (
                                        <img
                                            src={this.state.currentPeerUser.URL ? this.state.currentPeerUser.URL : "https://firebasestorage.googleapis.com/v0/b/realtime-web-chat-application.appspot.com/o/nopic.jpg?alt=media&token=ca9b2167-2092-4c9e-9ad2-409242ad6bd3"}
                                            alt="avatar"
                                            className="peerAvatarLeft"
                                        />
                                    ):(
                                        <div className="viewPaddingLeft"></div>
                                    )}
                                    <div className="viewItemLeft">
                                        <span className="textContentItem">{item.content}</span>
                                    </div>
                                </div>
                                {this.isLastMessageLeft(index)?(
                                    <span className="textTimeLeft">
                                        <div className="time">
                                            {moment(Number(item.timestamp)).format('11')}
                                        </div>
                                    </span>
                                ):null}
                            </div>
                        )
                    }else if (item.type === 1){
                        viewListMessage.push(
                            <div className="viewWrapItemLeft2" key={item.timestamp}>
                                <div className="viewWrapItemleft3">
                                    {this.isLastMessageLeft(index)?(
                                    <img
                                    src={this.state.currentPeerUser.URL ? this.state.currentPeerUser.URL : "https://firebasestorage.googleapis.com/v0/b/realtime-web-chat-application.appspot.com/o/nopic.jpg?alt=media&token=ca9b2167-2092-4c9e-9ad2-409242ad6bd3"}
                                    alt="avatar"
                                    className="peerAvatarLeft"
                                    />
                                    ):(
                                        <div className="viewPaddingLeft">
                                        </div>
                                    )}
                                    <div className="viewItemLeft2">
                                        <img
                                            className="imgItemLeft"
                                            src={item.content}
                                            alt="content message"
                                        />
                                    </div>
                                </div>
                                {this.isLastMessageLeft(index)?(
                                    <span className="textTimeLeft">
                                        <div className="time">
                                            {moment(Number(item.timestamp)).format('11')}
                                        </div>
                                    </span>
                                ):null}
                            </div>
                        )
                    }else{
                        viewListMessage.push(
                            <div className="viewWrapItemleft2" key={item.timestamp}>
                                <div className="viewWrapitemLeft3">
                                {this.isLastMessageLeft(index)?(
                                    <img
                                    src={this.state.currentPeerUser.URL ? this.state.currentPeerUser.URL : "https://firebasestorage.googleapis.com/v0/b/realtime-web-chat-application.appspot.com/o/nopic.jpg?alt=media&token=ca9b2167-2092-4c9e-9ad2-409242ad6bd3"}
                                    alt="avatar"
                                    className="peerAvatarLeft"
                                    />
                                    ):(
                                        <div className="veiwPaddingLeft"/>             
                                    )}
                                    <div className="viewItemLeft3" key={item.timestamp}>
                                        <img
                                        className="imgItemLeftSticker"
                                        src={this.getGifImage(item.content)}
                                        alt="content message"                                    
                                       />
                                    </div>
                                </div>
                                {this.isLastMessageLeft(index)?(
                                    <span className="textTimeLeft">
                                        <div className="time">
                                            <div className="timesetup">
                                                {moment(Number(item.timestamp)).format('ll')}
                                            </div>
                                        </div>
                                        
                                    </span>
                                ):null}
                            </div>
                        )
                    }
                }
            })
            return viewListMessage
        }else{
            return(
                <div className="viewWrapSayHi">
                    <span className="textSayHi"> No messages</span>
                    <img
                    className="imgWaveHand"
                    src="https://firebasestorage.googleapis.com/v0/b/realtime-web-chat-application.appspot.com/o/14-wave_hand.png?alt=media&token=b7c095f7-d91d-4aed-bfd2-1f18a7174d48"
                    alt="wave hand"        
                    />
                </div>
            )
        }
    }
    renderStickers =()=>{
        return(
            <div className="viewStickers">
                <img
                    className="imgSticker"
                    src="https://firebasestorage.googleapis.com/v0/b/realtime-web-chat-application.appspot.com/o/l1.png?alt=media&token=70257a77-d961-4003-a204-32ccb447974d"
                    alt="sticker"
                    onClick={()=>{this.onSendMessage('l1', 2)}}
                />
                
                 <img
                    className="imgSticker"
                    src="https://firebasestorage.googleapis.com/v0/b/realtime-web-chat-application.appspot.com/o/l2.png?alt=media&token=ec23f72d-7c4e-49b4-9f7a-f019dfac4e8e"
                    alt="sticker"
                    onClick={()=>{this.onSendMessage('l2', 2)}}
                />
                 <img
                    className="imgSticker"
                    src="https://firebasestorage.googleapis.com/v0/b/realtime-web-chat-application.appspot.com/o/l3.png?alt=media&token=d194dd19-2ad7-43fc-8029-0579d5e3e6ac"
                    alt="sticker"
                    onClick={()=>{this.onSendMessage('l3', 2)}}
                />
                 <img
                    className="imgSticker"
                    src="https://firebasestorage.googleapis.com/v0/b/realtime-web-chat-application.appspot.com/o/l4.png?alt=media&token=a8aadd1a-2e29-4739-bdb8-0dd7e29044f5"
                    alt="sticker"
                    onClick={()=>{this.onSendMessage('l4', 2)}}
                />
                 <img
                    className="imgSticker"
                    src="https://firebasestorage.googleapis.com/v0/b/realtime-web-chat-application.appspot.com/o/l5.png?alt=media&token=f97bda65-c039-4779-8f2e-a14f9beed6c0"
                    alt="sticker"
                    onClick={()=>{this.onSendMessage('l5', 2)}}
                />
                 <img
                    className="imgSticker"
                    src="https://firebasestorage.googleapis.com/v0/b/realtime-web-chat-application.appspot.com/o/l6.png?alt=media&token=d9e493a5-3b9b-4047-a70e-02089ffbda25"
                    alt="sticker"
                    onClick={()=>{this.onSendMessage('l6', 2)}}
                />
               
                <img
                    className="imgSticker"
                    src="https://firebasestorage.googleapis.com/v0/b/realtime-web-chat-application.appspot.com/o/m1.gif?alt=media&token=9fca63f7-aef9-42b6-a9d7-5aba99495f53"
                    alt="sticker"
                    onClick={()=>{this.onSendMessage('m1', 2)}}
                />
                <img
                    className="imgSticker"
                    src="https://firebasestorage.googleapis.com/v0/b/realtime-web-chat-application.appspot.com/o/m2.gif?alt=media&token=a4f98c20-f2ca-43b0-a00c-1fefddf2654c"
                    alt="sticker"
                    onClick={()=>{this.onSendMessage('m2', 2)}}
                />
                 <img
                    className="imgSticker"
                    src="https://firebasestorage.googleapis.com/v0/b/realtime-web-chat-application.appspot.com/o/m3.gif?alt=media&token=dc48b833-1859-4f73-990f-09130b559fd6"
                    alt="sticker"
                    onClick={()=>{this.onSendMessage('m3', 2)}}
                />
            </div>
        )
    }
    getGifImage = (value) =>{
        switch(value){
            case 'l1':
                return "https://firebasestorage.googleapis.com/v0/b/realtime-web-chat-application.appspot.com/o/l1.png?alt=media&token=70257a77-d961-4003-a204-32ccb447974d"
            case 'l2':
                return "https://firebasestorage.googleapis.com/v0/b/realtime-web-chat-application.appspot.com/o/l2.png?alt=media&token=ec23f72d-7c4e-49b4-9f7a-f019dfac4e8e"
            case 'l3':
                return "https://firebasestorage.googleapis.com/v0/b/realtime-web-chat-application.appspot.com/o/l3.png?alt=media&token=d194dd19-2ad7-43fc-8029-0579d5e3e6ac"
            case 'l4':
                return "https://firebasestorage.googleapis.com/v0/b/realtime-web-chat-application.appspot.com/o/l4.png?alt=media&token=a8aadd1a-2e29-4739-bdb8-0dd7e29044f5"
            case 'l5':
                return "https://firebasestorage.googleapis.com/v0/b/realtime-web-chat-application.appspot.com/o/l5.png?alt=media&token=f97bda65-c039-4779-8f2e-a14f9beed6c0"
            case 'l6':
                return "https://firebasestorage.googleapis.com/v0/b/realtime-web-chat-application.appspot.com/o/l6.png?alt=media&token=d9e493a5-3b9b-4047-a70e-02089ffbda25"
            case 'l7':
                return "https://firebasestorage.googleapis.com/v0/b/realtime-web-chat-application.appspot.com/o/l7.png?alt=media&token=0c04fe37-e810-44f1-b7ae-988a9dd00b9d"
            case 'l8': 
                return "https://firebasestorage.googleapis.com/v0/b/realtime-web-chat-application.appspot.com/o/l8.png?alt=media&token=ea375719-a845-405f-be19-b161a5606c47"
            case 'm1':
                return "https://firebasestorage.googleapis.com/v0/b/realtime-web-chat-application.appspot.com/o/m1.gif?alt=media&token=9fca63f7-aef9-42b6-a9d7-5aba99495f53"
            case 'm2':
                return "https://firebasestorage.googleapis.com/v0/b/realtime-web-chat-application.appspot.com/o/m2.gif?alt=media&token=a4f98c20-f2ca-43b0-a00c-1fefddf2654c"
            case 'm3':
                return "https://firebasestorage.googleapis.com/v0/b/realtime-web-chat-application.appspot.com/o/m3.gif?alt=media&token=dc48b833-1859-4f73-990f-09130b559fd6"
            case 'm4':
                return "https://firebasestorage.googleapis.com/v0/b/realtime-web-chat-application.appspot.com/o/m4.gif?alt=media&token=e6910a5f-622f-4850-8e75-100e18c7330a"
            case 'm5':
                return "https://firebasestorage.googleapis.com/v0/b/realtime-web-chat-application.appspot.com/o/m5.gif?alt=media&token=dcbd1b7d-3197-46f1-a2d3-77592b82f6fb"
            default:
                return "https://firebasestorage.googleapis.com/v0/b/realtime-web-chat-application.appspot.com/o/nopic.jpg?alt=media&token=ca9b2167-2092-4c9e-9ad2-409242ad6bd3"
            }
    }
    hashString = str =>{
        let hash = 0
        for(let i = 0; i < str.length; i++){
            hash += Math.pow(str.charCodeAt(i) * 31, str.length - i)
            hash = hash & hash
        }
        return hash
    }
    isLastMessageLeft = (index) =>{
        if(
            (index + 1 < this.listMessage.length &&
                this.listMessage[index + 1].idFrom === this.currentUserId) ||
                index === this.listMessage.length - 1
        ){
            return true
        }else{
            return false
        }   
    }
};
export default LiveChat;