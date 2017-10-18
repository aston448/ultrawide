
import {RoleType, ViewType, TestType} from '../../imports/constants/constants.js'
import {DefaultItemNames, DefaultComponentNames} from '../../imports/constants/default_names.js';

class TestIntegrationActions {

    // REFRESH ---------------------------------------------------------------------------------------------------------

    developerRefreshesTestResults(expectation){

        server.call('testIntegration.refreshTestResults', ViewType.DEVELOP_BASE_WP, RoleType.DEVELOPER, 'hugh', expectation);
    };

    designerRefreshesTestResultsForBaseDesignVersion(expectation){

        server.call('testIntegration.refreshTestResults', ViewType.DESIGN_PUBLISHED, RoleType.DESIGNER, 'gloria', expectation);
    };

    designerRefreshesTestResultsForDesignUpdateView(expectation){

        server.call('testIntegration.refreshTestResults', ViewType.DESIGN_UPDATE_VIEW, RoleType.DESIGNER, 'gloria', expectation);
    };

}
 export default new TestIntegrationActions();
