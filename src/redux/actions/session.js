export const isAuthenticated = () => {
    return (dispatch, getState) => {
        return window.firebase.auth().onAuthStateChanged((user) => {
            if(user) {
                console.log("Logged-in!");
                const currentUser = {
                    id: user.uid,
                    userName: user.displayName,
                    email: user.email
                }
                dispatch({ type: 'IS_AUTH', authenticated: true })
                dispatch({  type: 'SET_CURRENT_USER', currentUser: currentUser })
                
            }else {
              console.log("Not logged-in!")
              dispatch({ type: 'IS_AUTH', authenticated: false })
            }
        });
    }
}

export const logoutUser = () =>{
    return { type: 'RESET_APP' }
}