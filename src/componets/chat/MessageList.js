import React from 'react';
import Message from './Message';
import {isToday, isYesterday, getTimeFromTimestamp, getTimeAndDateFromTimestamp, getDateFromTimestamp, diffBetweenDates} from '../../helpers/Dates';

class MessageList extends React.Component {
    setDate(date) {
        if(isToday(date)) {
            return "Today";
        } else if(isYesterday(date)) {
            return "Yesterday";
        } else {
            return getDateFromTimestamp(date);
        }
    }

    render() {
        const {messages, currentUser} = this.props;

        let date = null;
        let newList = [];
        messages.forEach( message => {
            if(diffBetweenDates(date, message.get('createdAt')) !== 0){
                newList.push(<div key={message.get('createdAt')}  className="border-top pt-2 text-center"><span className="text-success">{this.setDate(message.get('createdAt'))}</span></div>);
                newList.push(<Message key={message.get('id')} currentUser={currentUser} message={message} date={getTimeAndDateFromTimestamp(message.get('createdAt'))} />);  
            } else {    
                newList.push(<Message key={message.get('id')} currentUser={currentUser} message={message} date={getTimeAndDateFromTimestamp(message.get('createdAt'))} />);
            }

            date = message.get('createdAt');
        })

        return newList;
    }
}

export default MessageList;