import React from 'react';
import { withRouter} from 'react-router-dom';

class Signup extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            userName: '',
            email: '',
            password: ''
        };

        this.createNewUser = this.createNewUser.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(e) {
        const target = e.target;
        const name = target.name;
        const value = target.value;

        this.setState({
            [name]: value
        });
    }

    createNewUser(e) {
        e.preventDefault();

        const { userName, email, password } = this.state;

        window.firebase.auth().createUserWithEmailAndPassword(email, password)
        .then((resp) => {

            resp.user.updateProfile({
                displayName: userName,
              }).then(function() {

                    window.db.collection("users").add({
                        id: resp.user.uid,
                        userName: userName,
                        email: email,
                        createdAt: new Date().getTime()
                    })
                    .then(function(docRef) {
                        console.log("Document written with ID: ", docRef.id);
                        
                    })
                    .catch(function(error) {
                        console.error("Error adding document: ", error);
                    });
              }).catch(function(error) {
                console.error("Error adding document: ", error);
            });

            //Redirect
            this.props.history.push('/home');
        })
        .catch(function(error) {
            console.log(error.code);
            console.log(error.message)
        });
    }

    render() {
        return ( 
            <form className="py-3" onSubmit={this.createNewUser}>
                <div className="form-group">
                    <input type="text" name="userName" onChange={this.handleChange} value={this.state.userName}  className="form-control" placeholder="Full name" />
                </div>
                <div className="form-group">
                <input type="email" name="email" onChange={this.handleChange} value={this.state.email}  className="form-control" placeholder="xyz@email.com" />
                </div>
                <div className="form-group">
                <input type="password" name ="password" onChange={this.handleChange} value={this.state.password}  className="form-control" placeholder="******" />
                </div>
                <button className="btn btn-primary">
                    Signup
                </button>
            </form>
        );
    }
}

export default withRouter(Signup);