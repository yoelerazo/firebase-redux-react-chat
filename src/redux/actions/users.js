export const getUsersByCurrentUser = () => {
    return (dispatch, getState) => {
        const currentUser = getState().session.get('currentUser');

        window.db.collection("users").get()
        .then((querySnapshot) => {
            var users = [];

            querySnapshot.forEach(function(doc) {
                users.push(doc.data());
            });

            users = users.filter((user) => {
                return user.id !== currentUser.id;
            });

            dispatch({ type: 'SET_USERS_BY_CURRENT_USER', users: users })
        })
        .catch(function(error) {
            console.log("Error getting documents: ", error);
        });
    }
}
