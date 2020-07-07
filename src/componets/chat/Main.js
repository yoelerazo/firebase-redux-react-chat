import React from 'react';
import { connect } from 'react-redux';
import MessageList from './MessageList';
import { getMessagesPaginateByChat } from '../../redux/actions/chats';

class Main extends React.Component {
    constructor(props) {
        super(props)

        this.scrollElement = React.createRef()
    }

    scrollTo(position) {
        const ele = this.scrollElement.current;
        ele.scrollTop = position;
    }

    addEventScroll() {
        const ele = this.scrollElement.current;
        ele.addEventListener("scroll", () => {
            const hasScroll = ele.scrollHeight > ele.clientHeight;
            if (hasScroll && ele.scrollTop < 1 && this.props.loadingMessages === false){
                ele.scrollTop = 1;
                this.props.getMessagesPaginateByChat();
            }
        });
    }

    getSnapshotBeforeUpdate(prevProps, prevState) {
        const ele = this.scrollElement.current;
        
        return {
            shouldScrollToBottom: ele.scrollTop + ele.clientHeight >= ele.scrollHeight,
            onTop: ele.scrollTop <= 100 ? true : false,
            oldScrollPosition: ele.scrollHeight - ele.scrollTop
        };
        
    }

    componentDidUpdate(prevProps, prevState, snapshot) { 
        const ele = this.scrollElement.current;
        
        if(snapshot.shouldScrollToBottom || (prevProps.currentChatId !== this.props.currentChatId)) {
            this.scrollTo(ele.scrollHeight);
        } else if(snapshot.onTop){
            this.scrollTo(ele.scrollHeight - snapshot.oldScrollPosition);
        }
    }

    componentDidMount() {
        this.addEventScroll();
    }

    render() {
        const {messages, currentUser, loadingMessages} = this.props;

        return (
            <>
                {loadingMessages
                ? <div className="d-flex justify-content-center align-items-center position-absolute w-100 h-100" style={{zIndex: "999"}}>
                    <div className="spinner-border text-info" role="status">
                        <span className="sr-only">Loading...</span>
                    </div>
                </div> 
                : ""}
                <div ref={this.scrollElement} className="card-body overflow-auto scroll" style={{backgroundColor: "#f5f5f5", marginBottom: "95px"}}>
                    <MessageList currentUser={currentUser} messages={messages} />
                </div>
            </>
        );
        
    }
}

const getMessagesCurrentChat = (state) => {
    let messages = [];
    if(state.chats.getIn(['currentChatId'])) {
        const index = state.chats.getIn(['list']).findIndex( chat => chat.get('id') === state.chats.getIn(['currentChatId']));
        messages = state.chats.getIn(['list', index, 'messages']);
    }
    return messages;
}


const mapStateToProps = (state) => ({
    currentUser: state.session.get('currentUser'),
    currentChatId: state.chats.getIn(['currentChatId']),
    messages: getMessagesCurrentChat(state),
    loadingMessages: state.chats.getIn(['loadingMessages'])
})

const mapDispatchToProps = dispatch => ({
    getMessagesPaginateByChat: () => dispatch(getMessagesPaginateByChat())
})

export default connect(mapStateToProps, mapDispatchToProps )(Main)