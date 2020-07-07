import React from 'react';
import moment from 'moment';
import {formatByDay} from '../../helpers/date_helper';
import Message from './Message';

class MessageList extends React.Component {
    render() {
        const {messages, currentUser} = this.props;

        const newList = {}
        
        messages.forEach( message => {
            let dateTimestamp = moment(moment(message.get('createdAt'),"x").format('MM.DD.YYYY'),'MM.DD.YYYY').valueOf();
            
            if(!newList[dateTimestamp]) {
                newList[dateTimestamp] = {label: formatByDay(dateTimestamp), messages: [message]};  
            }else {
                newList[dateTimestamp].messages.push(message);
            }
        });

        return (
            Object.entries(newList).map( ([key, value]) => 
                <div key={key}>
                    <div className="border-top pt-2 text-center"><span className="text-success">{value.label}</span></div>
                    {value.messages.map( (message) => 
                       <Message key={message.get('id')}
                            currentUser={currentUser} message={message} 
                            date={ (formatByDay(message.get('createdAt')) === "Today" || formatByDay(message.get('createdAt')) === "Yesterday") ? 
                                moment(message.get('createdAt')).format("HH:mm") : 
                                moment(message.get('createdAt')).format('DD.MM.YYYY, HH:mm')} 
                        />
                    )}       
                </div>    
            )
        );  
    }
}

export default MessageList;