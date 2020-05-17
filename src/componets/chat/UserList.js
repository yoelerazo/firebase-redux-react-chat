import React from 'react';
import { connect } from 'react-redux';
import { getUsersByCurrentUser } from '../../redux/actions/users';
import userImage from "../../user_image.jpg";

class UserList extends React.Component {
    constructor(props) {
        super(props);

        this.handleClickUserItem = this.handleClickUserItem.bind(this);
    }

    async createChat(membersId, membersName) {

        await window.db.collection("chats").add({
            type: "partner",
            membersId: membersId,
            membersName: membersName,
            createdAt: new Date().getTime()
        })
        .then(function(docRef) {
            console.log("Document written with ID: ", docRef.id);
        })
        .catch(function(error) {
            console.error("Error adding document: ", error);
        });
    }

    handleClickUserItem(e) {
        let target = e.target;
        let user_partner = this.props.users.find(user => user.get('id') === target.id);
        let membersId = [this.props.currentUser.id, user_partner.get('id')]
        let membersName = [this.props.currentUser.userName, user_partner.get('userName')]
        
        this.createChat(membersId, membersName);
        this.props.handleClickOpenCloseButton();
    }

    componentDidMount() {
        this.props.getUsersByCurrentUser();
    }

    render() {
        const {users, isToggleOn, filterText} = this.props;
        const usersFiltered = users.filter( user => {
            return user.get('userName').toLowerCase().indexOf(filterText.toLowerCase()) !== -1;
        });

        return (
            <div className={isToggleOn ? '' : 'd-none'}>
                <ul className="list-group list-group-flush shadow-sm">
                    {usersFiltered.map( (user) => 
                        <li id={user.get('id')} onClick={this.handleClickUserItem} key={user.get('id')} className="list-group-item" >
                            <div className="avatar--48 overflow-hidden rounded-circle mr-2 d-inline-block align-middle">
                                <img src={userImage} className="responsive-img" />
                            </div>
                            {user.get('userName')}
                        </li>
                    )}   
                </ul>
            </div>
        )
    }
}

const preFilterUsers = (state) => {
    return state.users.getIn(['usersByCurrentUser']).filter(user => !state.chats.getIn(['list']).find(chat => chat.get('partnerId') === user.get('id') ))
}

const mapStateToProps = (state) => ({
    currentUser: state.session.get('currentUser'),
    users: preFilterUsers(state)
})

const mapDispatchToProps = dispatch => ({
    getUsersByCurrentUser: () => dispatch(getUsersByCurrentUser())
})
  
export default connect(mapStateToProps, mapDispatchToProps )(UserList)