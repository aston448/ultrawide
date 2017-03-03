
import {RoleType, ViewType, TestType} from '../../imports/constants/constants.js'
import {DefaultItemNames, DefaultComponentNames} from '../../imports/constants/default_names.js';

class TestIntegrationActions {

    // REFRESH ---------------------------------------------------------------------------------------------------------

    developerRefreshesTestResults(expectation){

        server.call('testIntegration.refreshTestResults', ViewType.DEVELOP_BASE_WP, RoleType.DEVELOPER, 'hugh', expectation);
    };

    developerRefreshesTestData(expectation){

        server.call('testIntegration.refreshTestData', ViewType.DEVELOP_BASE_WP, RoleType.DEVELOPER, 'hugh', expectation)
    }


}
 export default new TestIntegrationActions();
