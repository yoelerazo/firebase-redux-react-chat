import React from 'react';
//import { Link } from 'react-router-dom';
import  { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import { connect } from 'react-redux';

class Header extends React.Component {
    constructor(props) {
        super(props);
        this.logOutUser = this.logOutUser.bind(this);
    }

    logOutUser() {
        window.firebase.auth().signOut().then(() => {
            console.log("User logout!");
            this.props.history.push('/');
        });
    }
    render() {
        const {currentUser} = this.props;

        return (
            <header>
                <nav className="navbar navbar-light bg-white fixed-top">
                    <a className="navbar-brand" href="#">
                        <FontAwesomeIcon icon={faBars} color="white" /> 
                    </a>
                    <h5 className="text-secondary">{currentUser ? currentUser.userName : ""}</h5>
                    <button className="btn btn-outline-primary" onClick={this.logOutUser}>Logout</button>
                </nav>
            </header>
        );
    }
}

const mapStateToProps = (state) => ({
    currentUser: state.session.get('currentUser')
})
  
export default connect(mapStateToProps, {} )(Header)