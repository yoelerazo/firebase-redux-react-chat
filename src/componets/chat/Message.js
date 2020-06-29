import React from 'react';
import  { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import './../../styles/components/message.scss';
import File from './File';

class Message extends React.Component {
    render() {
        const {message, date} = this.props;
        let userMatch = message.get('from').indexOf(this.props.currentUser.id) > -1;
        
        return (
            <div className={`my-3 d-flex ${userMatch ? "justify-content-end" : "justify-content-start"}`}>  
                <div className={`card border message ${userMatch ? "message--owner" : ""}`}>
                    <div className="card-body p-3">
                        {message.get('filesId') ? 
                        <div className="border rounded mb-2 p-2 bg-light">
                            {message.get('filesId').map( (fileId) => 
                                <File key={fileId} fileId={fileId} />
                            )}
                        </div> 
                        : ""}
                        <p className={`card-text mb-2 ${userMatch ? "text-right" : ""}`}>{message.get('content')}</p>
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