import React from 'react';
import moment from 'moment';
import Message from './Message';

class MessageList extends React.Component {
    getDateFormat(targetdate) {
        let now = moment(moment().format('MM.DD.YY'));
        let date = moment(moment(targetdate).format('MM.DD.YY'));
        let diffDays = now.diff(date, 'days');
        
        if(diffDays === 0) {
            return "Today";
        } else if(diffDays === 1) {
            return "Yesterday";
        } else {
            return moment(date).format('MM.DD.YY');
        }
    }

    render() {
        const {messages, currentUser} = this.props;

        const newList = {}

        messages.forEach( message => {
            let dateTimestamp = moment(moment(message.get('createdAt').seconds).format('MM.DD.YY')).valueOf();

            if(!newList[dateTimestamp]) {
                newList[dateTimestamp] = {label: this.getDateFormat(dateTimestamp), messages: [message]};  
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
                            date={(this.getDateFormat(message.get('createdAt')) === "Today" || this.getDateFormat(message.get('createdAt')) === "Yesterday") ? 
                                moment(message.get('createdAt')).format("HH:mm") : 
                                moment(message.get('createdAt')).format('MM.DD.YY, HH:mm')} 
                        />
                    )}       
                </div>    
            )
        );  
    }
}

export default MessageList;