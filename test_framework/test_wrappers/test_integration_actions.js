
import {RoleType, TestType} from '../../imports/constants/constants.js'
import {DefaultItemNames, DefaultComponentNames} from '../../imports/constants/default_names.js';

class TestIntegrationActions {

    // REFRESH ---------------------------------------------------------------------------------------------------------


    developerRefreshesTestResults(expectation){

        server.call('testIntegration.refreshTestResults', RoleType.DEVELOPER, 'hugh', expectation);

    };


}
 export default new TestIntegrationActions();
