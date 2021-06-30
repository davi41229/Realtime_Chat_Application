import React from 'react';
import '../Styles/Welcome.css'
class Welcome extends React.Component {
    constructor(props) {
        super(props)
    }
    render() {
        return (
            <div className="viewWelcomeBoard">
                <img
                    className="avatarWelcome"
                    src={this.props.currentUserPhoto ? this.props.currentUserPhoto : "https://firebasestorage.googleapis.com/v0/b/realtime-web-chat-application.appspot.com/o/nopic.jpg?alt=media&token=ca9b2167-2092-4c9e-9ad2-409242ad6bd3"}
                    alt ="" />
                    <span className = "textTitleWelcome">{`Welcome, ${this.props.currentUserName}`}</span>
                    <span className="textDescriptionWelcome">Start Chatting</span>
            </div>
                )
    }
}
export default Welcome;