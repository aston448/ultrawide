class LoginVerifications{

    user_IsLoggedIn(userName){
        server.call('verifyLogin.loggedInUserIs', userName,
            (function(error, result){
                return(error === null);
            })
        );
    }

    noUserIsLoggedIn(){
        server.call('verifyLogin.noUserLoggedIn',
            (function(error, result){
                return(error === null);
            })
        );
    }

}

export default new LoginVerifications();
