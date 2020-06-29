import React from 'react';
import Header from '../componets/shared/Header';
import Main from '../componets/shared/Main';
import Window from '../componets/chat/Window';
import ChatNavbar from '../componets/chat/ChatNavbar';
import { connect } from 'react-redux';

class ChatRoom extends React.Component {

    render() {
        const {currentUser, currentChatId} = this.props;

        if(currentUser) {
            return (
                <>
                   <Header />
                   <Main>
                        <ChatNavbar />
                        {currentChatId 
                        ? <Window /> 
                        : <div className="p-3 bg-white d-none d-lg-flex flex-lg-grow-1"> Select a chat </div>
                        }
                   </Main>
                </>
            );
        }else {
            return <h5>Loading...</h5>
        }  
    }
}

const mapStateToProps = (state) => ({
    currentUser: state.session.get('currentUser'),
    currentChatId: state.chats.getIn(['currentChatId'])
})
  
export default connect(mapStateToProps, {} )(ChatRoom)
