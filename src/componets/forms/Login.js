import React from 'react';
import { withRouter} from 'react-router-dom';
import { isAuthenticated } from './../../redux/actions/session';
import { connect } from 'react-redux';

class Loging extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            userList: [],
            email: '',
            password: '',
            selectValue: 'defaultValue'
        };

        this.loginUser = this.loginUser.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleChangeSelect = this.handleChangeSelect.bind(this);
    }

    handleChange(e) {
        const target = e.target;
        const name = target.name;
        const value = target.value;

        this.setState({
            [name]: value
        });
    }

    handleChangeSelect(e) {
        this.setState({
            selectValue: e.target.value,
            email: e.target.value,
            password: '123456'
        }, () => {
            this.firebaseLogin();
        });
    }

    async firebaseLogin() {
        const { email, password } = this.state;
        
        await window.firebase.auth().signInWithEmailAndPassword(email, password)
        .then((resp) => {
            console.log("Login successful!", resp);
        })
        .catch(function(error) {
            console.log(error.code);
            console.log(error.message)
        });

        await this.props.isAuth();
        this.props.history.push('/home');
    }

    loginUser(e) {
        e.preventDefault();
        
        this.firebaseLogin();
    }

    getUsers() {
        return window.db.collection("users").get()
        .then((querySnapshot) => {
            var users = [];

            querySnapshot.forEach(function(doc) {
                users.push(doc.data());
            });

            this.setState({
                userList: users
            });
        })
        .catch(function(error) {
            console.log("Error getting documents: ", error);
        });
    }

    async componentDidMount() {
        await this.getUsers();
    }

    render() {
        const {userList} = this.state;

        return (  
            <form className="py-3" onSubmit={this.loginUser}>
                <div className="form-group">
                    <input type="email" name="email" onChange={this.handleChange} value={this.state.email}  className="form-control" placeholder="xyz@email.com" />
                </div>
                <div className="form-group">
                    <input type="password" name ="password" onChange={this.handleChange} value={this.state.password}  className="form-control" placeholder="******" />
                </div>
                <button className="btn btn-primary">
                    Login
                </button>

                <div className="form-group">
                    <label>
                        Login like:
                        <select value={this.state.selectValue} onChange={this.handleChangeSelect}>
                            <option value="defaultValue" disabled>Choose user</option>
                            {userList.map( user => 
                                <option key={user.id} value={user.email}>{user.userName}</option>
                            )}
                        </select>
                    </label>
                </div>
            </form>
        );
    }
}

const mapDispatchToProps = dispatch => ({
    isAuth: () => dispatch(isAuthenticated())
})

export default connect(null, mapDispatchToProps )(withRouter(Loging))