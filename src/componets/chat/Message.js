import React from 'react';
import  { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck } from '@fortawesome/free-solid-svg-icons';

class Message extends React.Component {
    render() {
        const {message, date} = this.props;

        let userMatch = message.get('from').indexOf(this.props.currentUser.id) > -1;
        let styles = {
            borderTopLeftRadius: "50rem",
            borderTopRightRadius: "50rem",
            borderBottomRightRadius:"50rem",
            borderBottomLeftRadius:"0"
        };

        if (userMatch) {
            styles = {
                borderTopLeftRadius: "50rem",
                borderTopRightRadius: "50rem",
                borderBottomRighttRadius:"0",
                borderBottomLeftRadius:"50rem",
                backgroundColor: "#99bdff"
            };
        }
        return (
            <div className={`my-3 d-flex ${userMatch ? "justify-content-end" : "justify-content-start"}`}>
                <div style={styles} className="card w-75 border">
                    <div className="card-body">
                        <p className="card-text">{message.get('content')}</p>
                        <p className={`card-text ${userMatch ? "text-right" : "text-left"}`}>
                            <small className="text-muted">{date}</small>
                            {userMatch && message.get('status') === 2 
                            ? <small className="text-muted"><FontAwesomeIcon icon={faCheck} className="text-success ml-2" /></small> 
                            : ""
                            }
                        </p>
                    </div>
                </div>
            </div>
        );
    }
}

export default Message;