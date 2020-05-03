import React from 'react';
import { connect } from 'react-redux';
import { getChatsByCurrentUser, setCurrentChat, getMessagesByChat } from '../../redux/actions/chats';
import userImage from "../../user_image.jpg";

class ChatList extends React.Component {
    constructor(props) {
        super(props);
    }

    selectChat = (e) => {
        let id_target = e.target.id
        this.props.setCurrentChat(id_target);
        this.props.getMessagesByChat();
    }

    componentDidMount() {
        this.props.getChatsByCurrentUser();
    }

    render() {
        const {chats, isToggleOn, filterText, currentChatId} = this.props;
        const chatsFiltered = chats.filter( chat => {
            return chat.get('partner').toLowerCase().indexOf(filterText.toLowerCase()) !== -1;
        });

        return (
            <div className={!isToggleOn ? '' : 'd-none'} >
                <ul className="list-group list-group-flush shadow-sm">
                    {chatsFiltered.map( (chat) => 
                        <li id={chat.get('id')} onClick={this.selectChat} key={chat.get('id')} className="list-group-item" >
                            <div className="avatar--48 overflow-hidden rounded-circle mr-2 d-inline-block align-middle">
                                <img src={userImage} className="responsive-img" />
                            </div>
                            {chat.get('partner')}
                            {currentChatId !== chat.get('id') && chat.get('pending') !== 0 
                            ? <span className="badge badge-primary badge-pill">{chat.get('pending')}</span> : ""}
                        </li>
                    )}   
                </ul>
            </div>
        )
    }
}

const mapStateToProps = (state) => ({
    chats: state.chats.getIn(['list']),
    currentChatId: state.chats.getIn(['currentChatId'])
})

const mapDispatchToProps = dispatch => ({
    getChatsByCurrentUser: () => dispatch(getChatsByCurrentUser()),
    setCurrentChat: (id) => dispatch(setCurrentChat(id)),
    getMessagesByChat: () => dispatch(getMessagesByChat())
})
  
export default connect(mapStateToProps, mapDispatchToProps )(ChatList)