
import {RoleType, ViewType, TestType} from '../../imports/constants/constants.js'
import {DefaultItemNames, DefaultComponentNames} from '../../imports/constants/default_names.js';

class TestIntegrationActionsClass {

    // REFRESH ---------------------------------------------------------------------------------------------------------

    // Base WP
    developerRefreshesTestResults(expectation){

        server.call('testIntegration.refreshTestResults', ViewType.DEVELOP_BASE_WP, RoleType.DEVELOPER, 'hugh', expectation);
    };

    // Base Design
    designerRefreshesTestResultsForBaseDesignVersion(expectation){

        server.call('testIntegration.refreshTestResults', ViewType.DESIGN_PUBLISHED, RoleType.DESIGNER, 'gloria', expectation);
    };

    developerRefreshesTestResultsForBaseDesignVersion(expectation){

        server.call('testIntegration.refreshTestResults', ViewType.DESIGN_PUBLISHED, RoleType.DESIGNER, 'hugh', expectation);
    };

    managerRefreshesTestResultsForBaseDesignVersion(expectation){

        server.call('testIntegration.refreshTestResults', ViewType.DESIGN_PUBLISHED, RoleType.DESIGNER, 'miles', expectation);
    };

    // Design Update
    designerRefreshesTestResultsForDesignUpdateView(expectation){

        server.call('testIntegration.refreshTestResults', ViewType.DESIGN_UPDATE_VIEW, RoleType.DESIGNER, 'gloria', expectation);
    };

}
 export const TestIntegrationActions = new TestIntegrationActionsClass();
