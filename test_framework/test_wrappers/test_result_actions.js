
import {RoleType, TestType} from '../../imports/constants/constants.js'
import {DefaultItemNames, DefaultComponentNames} from '../../imports/constants/default_names.js';

class TestResultActions {

    // LOCATIONS -------------------------------------------------------------------------------------------------------

    // Add Location
    developerRefreshesTestResultsWithIntTestsVisible(expectation) {

        const viewOptions = {
            userId:                     'NONE',
            designDetailsVisible:       true,
            designTestSummaryVisible:   false,
            designDomainDictVisible:    false,
            updateDetailsVisible:       true,
            updateTestSummaryVisible:   false,
            updateDomainDictVisible:    false,
            wpDetailsVisible:           true,
            wpDomainDictVisible:        false,
            devDetailsVisible:          false,
            devAccTestsVisible:         false,
            devIntTestsVisible:         true,       // Set
            devUnitTestsVisible:        false,
            devTestSummaryVisible:      false,
            devFeatureFilesVisible:     false,
            devDomainDictVisible:       false
        };

        server.call('testResults.refreshTestResults', RoleType.DEVELOPER, 'hugh', viewOptions, expectation);
    }
}
 export default new TestResultActions();
