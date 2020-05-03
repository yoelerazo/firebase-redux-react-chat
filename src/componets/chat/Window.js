import React from 'react';
import Header from './Header';
import Main from './Main';
import Footer from './Footer';

class Window extends React.Component {
    render() {
        return (
            <div className="card position-relative rounded-0 border-0" style={{flexGrow:"1"}}>
                <Header />
                <Main />
                <Footer />
            </div>
        );
    }
}

export default Window;