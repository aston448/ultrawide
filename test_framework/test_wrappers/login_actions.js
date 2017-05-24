import {RoleType, TestType} from '../../imports/constants/constants.js'
import {DefaultItemNames, DefaultComponentNames} from '../../imports/constants/default_names.js';

class LoginActions {

    userLogsInAs(userName, password, expectation) {
        server.call('testLogin.loginUser', userName, password, expectation);
    }

}

export default new LoginActions();

