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
                        lastMessage: null,
                        previousLastMessage: null
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
            chats.forEach( chat => dispatch(newMessageNotification(chat)) );
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
        const oldMessages = getState().chats.getIn(['list', chatIndex, 'messages']);
        
        const unsubscribe = window.db.collection("chats").doc(currentChatId).collection("messages")
        .orderBy("createdAt", "desc").limit(8).onSnapshot(querySnapshot => {
            let messages = [];
            let message = null;
            
            if(!oldMessages.size){
                const lastMessage = querySnapshot.docs[querySnapshot.docs.length-1];
                dispatch({ type: 'SET_LAST_MESSAGE_BY_CHAT', chatIndex, lastMessage})
            }

            let changeType = "";      
            querySnapshot.docChanges().forEach(function(change) {
                
                if (change.type === "added" && !oldMessages.some(msg => msg.get("id") === change.doc.id)) {
                    changeType = "added";
                    
                    messages.push({id: change.doc.id, ...change.doc.data()}); 
                    console.log("Added:", change.doc.id,change.doc.data())
                }
                if (change.type === "modified") {
                    changeType = "modified";
                    message = {id: change.doc.id, ...change.doc.data()} 
                    console.log("modified Message", change.doc.data());
                }
                if (change.type === "removed") {
                    changeType = "removed"
                    console.log("removed Message", change.doc.data());
                }

                /* var source = querySnapshot.metadata.fromCache ? "local cache" : "server";
                console.log("Data came from " + source); */
            });
            
            if(changeType === "added") {
                dispatch({ type: 'UPDATE_MESSAGES_BY_CHAT', chatIndex: chatIndex, messages})
                //console.log('.....', getState().chats.getIn(['list', chatIndex, 'messages']).filter(e => e.get('status') === 1).toJS());
                getState().chats.getIn(['list', chatIndex, 'messages']).forEach(message => {                    
                    if(message.get('status') === 1 && getState().session.get('currentUser').id !== message.get('from')){
                        dispatch(updateStatusMessage(message));
                    }
                })
            }else if(changeType === "modified") {
                const messageIndex = getState().chats.getIn(['list', chatIndex, 'messages']).findIndex( msg => msg.get('id') === message.id );
                dispatch({ type: 'UPDATE_MESSAGE', chatIndex, messageIndex, message});
            }
        });

        return unsubscribe;
    }
}

export const getMessagesPaginateByChat = () => {
    return (dispatch, getState) => {
        const currentChatId = getState().chats.getIn(['currentChatId']);
        const chats = getState().chats.getIn(['list']);
        const chatIndex = chats.findIndex( chat => chat.get('id') === currentChatId );
        const chat = chats.find(chat => chat.get('id') === currentChatId );
        console.log('++++', currentChatId, chat);
        
        const lastMessage = chat.get('lastMessage');
        console.log(lastMessage);

        let nextQuery = true;
        let lastMSG = getState().chats.getIn(['list', chatIndex, 'lastMessage']);
        let previousMSG = getState().chats.getIn(['list', chatIndex, 'previousLastMessage']);

        
        // if(previousMSG !== null) {
        if(previousMSG) {
            if(previousMSG.id === lastMSG.id) {
                nextQuery = false;
            }
        }

        if(nextQuery) {
            dispatch(loadingMessages(true));
            
            window.db.collection("chats").doc(currentChatId).collection("messages")
            .orderBy("createdAt", "desc").limit(8).startAfter(lastMessage)
            .get().then(function(querySnapshot) {

                let previousLastMessage = getState().chats.getIn(['list', chatIndex, 'lastMessage'])
                
                dispatch({ type: 'SET_PREVIOUS_LAST_MESSAGE_BY_CHAT', chatIndex: chatIndex, previousLastMessage: previousLastMessage})

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
}

export const loadingMessages = (bool) => {
    return { type: 'LOADING_MESSAGES', loading: bool }
}

export const newMessageNotification = (chatParam) => {
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
                        console.log("added Notification ", change.doc.data());
                    }
                }
                if (change.type === "modified") {
                    console.log("Modified Notification ", change.doc.data());
                }
                if (change.type === "removed") {
                    console.log("removed Notification ", change.doc.data());
                }
            });
            
            dispatch({ type: 'UPDATE_PENDING_MESSAGES_BY_CHAT', chatIndex: chatIndex, pendingMessages: messages.length});
        });
    }
}

export const updateStatusMessage = (messageParam) => {
    return (dispatch, getState) => {
        const currentChatId = getState().chats.getIn(['currentChatId']);
        const chats = getState().chats.getIn(['list']);
        const chatIndex = chats.findIndex( chat => chat.get('id') === currentChatId );
        // const chat = chats.find(chat => chat.get('id') === currentChatId );
        // const messageIndex = chat.getIn(['messages']).findIndex( message => message.get('id') === messageParam.get('id') );
        
        if (messageParam.get('status') < 2) {
            window.db.collection("chats").doc(currentChatId).collection("messages").doc(messageParam.get('id'))
            .update({
                status: 2
            })
            .then(() => {
                console.log("status from message updated!", messageParam.get('id'));
                dispatch({ type: 'UPDATE_PENDING_MESSAGES_BY_CHAT', chatIndex, pendingMessages: -1});
            })
            .catch((error) => {
                console.error("Error updating message: ", error);
            });
        }
    }
}
