import React, { Component } from 'react';
import { BrowserRouter as Router, Switch, Route} from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import LandingPage from './LandingPage';
import ChatRoom from './ChatRoom';
//import Test from './Test';
import Signup from './Signup';
import Login from './Login';
import { connect } from 'react-redux';
import { isAuthenticated} from '../redux/actions/session';

class Navigation extends Component {
    componentDidMount() {
        this.props.isAuth();
    }

    render() {
        return (
            <Router>
                <Switch>
                    <Route exact path="/" component={LandingPage} />
                    <ProtectedRoute exact path="/home" authenticated={this.props.authenticated} component={ChatRoom} />
                    <Route exact path="/signup" component={Signup} />
                    <Route exact path="/login" component={Login} />
                    <Route exact path="*" component={() => "404 NOT FOUND"} />
                </Switch>
            </Router>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        authenticated: state.session.get('authenticated')
    }
}

const mapDispatchToProps = dispatch => ({
    isAuth: () => dispatch(isAuthenticated())
})

export default connect(mapStateToProps, mapDispatchToProps )(Navigation)