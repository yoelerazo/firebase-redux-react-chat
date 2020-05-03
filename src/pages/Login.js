import React from 'react';
//import { Link } from 'react-router-dom';
//import  { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
//import { faArrowCircleLeft } from '@fortawesome/free-solid-svg-icons';

class Loging extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: ''
        };

        this.loginUser = this.loginUser.bind(this);
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

    loginUser(e) {
        e.preventDefault();
        
        const { email, password } = this.state;
        
        window.firebase.auth().signInWithEmailAndPassword(email, password)
        .then((resp) => {
            console.log("Login successful!");
            this.props.history.push('/home');
        })
        .catch(function(error) {
            console.log(error.code);
            console.log(error.message)
        });    
    }

    render() {
        return (  
            <div className="container h-100 d-flex flex-column justify-content-center">
                <div className="row justify-content-center">
                    <div className="col-6">
                        <div className="card">
                            <div className="card-header">
                                Login
                            </div>
                            <div className="card-body p-2">
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
                                </form>
                            </div>
                        </div>
                    </div>   
                </div>            
            </div>
        );
    }
}

export default Loging;