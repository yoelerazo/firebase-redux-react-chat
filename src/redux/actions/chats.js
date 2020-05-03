export const getChatsByCurrentUser = () => {
    
    return (dispatch, getState) => {
        const currentUser = getState().session.get('currentUser');

        window.db.collection("chats").where("membersId", "array-contains", currentUser.id).onSnapshot(querySnapshot => {
            let chats = [];

            querySnapshot.docChanges().forEach(function(change) {
                if (change.type === "added") {
                    const partnerIndex = change.doc.data().membersId.findIndex(user => user !== currentUser.id);
                    const partnerId = change.doc.data().membersId[partnerIndex];
                    const partnerName = change.doc.data().membersName[partnerIndex];
                    
                    chats.push({
                        id: change.doc.id,
                        partner: partnerName,
                        partnerId: partnerId,
                        messages: [],
                        pending: 0,
                        lastMessage: null
                    });
                }
                if (change.type === "modified") {
                    console.log("Modified chat: ", change.doc.data());
                }
                if (change.type === "removed") {
                    console.log("Removed chat: ", change.doc.data());
                }
            });
            
            dispatch({ type: 'SET_CHATS', chats: chats });
            /* chats.forEach( chat => dispatch(newMessageNotification(chat)) ); */
        });
    }
}

export const setCurrentChat = (id) => {
    return { type: 'SET_CURRENT_CHAT', currentChatId: id }
}

export const getMessagesByChat = () => {

    return (dispatch, getState) => {
        const currentChatId = getState().chats.getIn(['currentChatId']);
        const chats = getState().chats.getIn(['list']);
        const chatIndex = chats.findIndex( chat => chat.get('id') === currentChatId );
        const chat = chats.find(chat => chat.get('id') === currentChatId );

        if(chat.get('messages').size){
            chat.get('messages').forEach( message => {
                console.log("preUpdate"+message.get('status') === 1 && getState().session.get('currentUser').id !== message.get('from'))
                if(message.get('status') === 1 && getState().session.get('currentUser').id !== message.get('from')){
                    dispatch(updateStatusMessage(message));
                }
            })
        }

        if(!chat.get('messages').size){
            
            window.db.collection("chats").doc(currentChatId).collection("messages")
            .orderBy("createdAt", "desc").limit(8).onSnapshot(querySnapshot => {
                let messages = [];
                let message = null;
               
                if(!getState().chats.getIn(['list', chatIndex, 'messages']).size){
                    let lastMessage = querySnapshot.docs[querySnapshot.docs.length-1];
                    dispatch({ type: 'SET_LAST_MESSAGE_BY_CHAT', chatIndex: chatIndex, lastMessage: lastMessage})
                }
                let changeType = "";
                querySnapshot.docChanges().forEach(function(change) {
                   
                    if (change.type === "added") {
                        changeType = "added";
                        messages.push({id: change.doc.id, ...change.doc.data()}); 
                    }
                    if (change.type === "modified") {
                        changeType = "modified";
                        message = {id: change.doc.id, ...change.doc.data()}  
                    }
                    if (change.type === "removed") {
                        changeType = "removed"
                    }

                    /* var source = querySnapshot.metadata.fromCache ? "local cache" : "server";
                    console.log("Data came from " + source); */
                });
                
                if(changeType === "added") {
                    dispatch({ type: 'UPDATE_MESSAGES_BY_CHAT', chatIndex: chatIndex, messages: messages.reverse()})

                    if(getState().chats.getIn(['currentChatId']) === currentChatId ){
                        getState().chats.getIn(['list', chatIndex, 'messages']).forEach( message => {
                            if(message.get('status') === 1 && getState().session.get('currentUser').id !== message.get('from')){
                                dispatch(updateStatusMessage(message));
                            }
                        })
                    }
                }else if(changeType === "modified") {
                    let messageIndex = getState().chats.getIn(['list', chatIndex, 'messages']).findIndex( msg => msg.get('id') === message.id );
                    dispatch({ type: 'UPDATE_MESSAGE', chatIndex: chatIndex, messageIndex: messageIndex, message: message});
                }
            });
        }
    }
}

export const getMessagesPaginateByChat = () => {
    return (dispatch, getState) => {
        const currentChatId = getState().chats.getIn(['currentChatId']);
        const chats = getState().chats.getIn(['list']);
        const chatIndex = chats.findIndex( chat => chat.get('id') === currentChatId );
        const chat = chats.find(chat => chat.get('id') === currentChatId );
        const lastMessage = chat.get('lastMessage');

        dispatch(loadingMessages(true));

        window.db.collection("chats").doc(currentChatId).collection("messages")
        .orderBy("createdAt", "desc").limit(8).startAfter(lastMessage)
        .get().then(function(querySnapshot) {
            
            if(!querySnapshot.empty){
                let messages = [];
                let lastMessage = querySnapshot.docs[querySnapshot.docs.length-1];

                dispatch({ type: 'SET_LAST_MESSAGE_BY_CHAT', chatIndex: chatIndex, lastMessage: lastMessage})

                querySnapshot.forEach(function(doc) {
                    messages.push( {id: doc.id, ...doc.data()});
                });
                
                dispatch({ type: 'UPDATE_MESSAGES_PAGINATE_BY_CHAT', chatIndex: chatIndex, messages: messages.reverse()})
            }
        }).catch(function(error) {
            console.log("Error getting document:", error);
        }).then(() => dispatch(loadingMessages(false)));
    }
}

export const loadingMessages = (bool) => {
    return { type: 'LOADING_MESSAGES', loading: bool }
}

/* export const newMessageNotification = (chatParam) => {
    return (dispatch, getState) => {
        const chats = getState().chats.getIn(['list']);
        const chatIndex = chats.findIndex( chat => chat.get('id') === chatParam.id );

        window.db.collection("chats").doc(chatParam.id).collection("messages")
        .where("status","==", 1).onSnapshot(querySnapshot => {
            let messages = [];
            querySnapshot.docChanges().forEach(function(change) {
                
                if (change.type === "added") {
                    if(getState().session.get('currentUser').id !== change.doc.data().from) {
                        messages.push({id: change.doc.id, ...change.doc.data()});
                    }
                }
                if (change.type === "modified") {
                    console.log("Modified Notificationmessage: ", change.doc.data());
                }
                if (change.type === "removed") {
                    console.log("Removed Notificationmessage: ", change.doc.data());
                }
            });
            
            dispatch({ type: 'PENDING_MESSAGES_BY_CHAT', chatIndex: chatIndex, pendingMessages: messages.length});
        });
    }
} */

export const updateStatusMessage = (messageParam) => {
    return (dispatch, getState) => {
        const currentChatId = getState().chats.getIn(['currentChatId']);
        const chats = getState().chats.getIn(['list']);
        const chatIndex = chats.findIndex( chat => chat.get('id') === currentChatId );
        const chat = chats.find(chat => chat.get('id') === currentChatId );
        const messageIndex = chat.getIn(['messages']).findIndex( message => message.get('id') === messageParam.get('id') );
        
        window.db.collection("chats").doc(currentChatId).collection("messages").doc(messageParam.get('id'))
        .update({
            status: 2
        })
        .then(function() {
            console.log("Document successfully updated!"); 
            /* dispatch({ type: 'PENDING_MESSAGES_BY_CHAT', chatIndex: chatIndex, pendingMessages: -1}); */
        })
        .catch(function(error) {
            console.error("Error updating document: ", error);
        });
        
    }
}


