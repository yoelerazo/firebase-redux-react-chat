import React from 'react';
import { connect } from 'react-redux';

class File extends React.Component {

    componentDidMount() {
        // Query File
    }
    
    render() {
        <div></div>
    }
}

const mapStateToProps = (state) => ({
    currentUser: state.session.get('currentUser'),
    currentChatId: state.chats.getIn(['currentChatId'])
})
  
export default connect(mapStateToProps, {} )(File)
