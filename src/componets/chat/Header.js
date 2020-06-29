import React from 'react';
import { connect } from 'react-redux';
import  { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsisV } from '@fortawesome/free-solid-svg-icons';
import userImage from "../../user_image.jpg";

class Header extends React.Component {
    render() {
        const {userPartner} = this.props;
        
        return (
            <div className="card-header rounded-0 bg-transparent d-flex justify-content-between align-items-center">
                <div className="d-flex align-items-center">
                    <div className="square-6 overflow-hidden rounded-circle mr-2">
                        <img src={userImage} className="responsive-img"></img>
                    </div>
                    <span className="text-secondary">{userPartner}</span>
                </div>
                <a className="" href="#">
                    <FontAwesomeIcon icon={faEllipsisV} />
                </a>
            </div>
        );
    }
}

const getUserPartner = (state) => {
    return state.chats.getIn(['list']).find(chat => chat.get('id') === state.chats.getIn(['currentChatId'])).get('partner');
}

const mapStateToProps = (state) => ({
    userPartner: getUserPartner(state)
})

export default connect(mapStateToProps, {} )(Header)