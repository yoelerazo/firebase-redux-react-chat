import React, { Component } from 'react';
import { BrowserRouter as Router, Switch, Route} from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import LandingPage from './LandingPage';
import ChatRoom from './ChatRoom';
import { connect } from 'react-redux';

class Navigation extends Component {
    render() {
        return (
            <Router>
                <Switch>
                    <Route exact path="/" component={LandingPage} />
                    <ProtectedRoute exact path="/home" authenticated={this.props.authenticated} component={ChatRoom} />
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

export default connect(mapStateToProps, {} )(Navigation)