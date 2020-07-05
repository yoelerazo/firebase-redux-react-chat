import React from 'react';

class Main extends React.Component {
    render() {
        return (
            <main className="container h-100 d-flex" style={{paddingTop: "4rem"}}>
                {this.props.children}
            </main>
        );
    }
}

export default Main;