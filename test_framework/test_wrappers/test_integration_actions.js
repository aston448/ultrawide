
import {RoleType, TestType} from '../../imports/constants/constants.js'
import {DefaultItemNames, DefaultComponentNames} from '../../imports/constants/default_names.js';

class TestIntegrationActions {

    // DISPLAY ---------------------------------------------------------------------------------------------------------

    developerShowsIntegrationTestPane(expectation){

    };

    developerHidesIntegrationTestPane(expectation){

    };

    developerShowsUnitTestPane(expectation){

    };

    developerHidesUnitTestPane(expectation){

    };

    developerShowsTestSummary(expectation){

    };

    developerHidesTestSummary(expectation){

    }

    // REFRESH ---------------------------------------------------------------------------------------------------------

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

        server.call('testIntegration.refreshTestResults', RoleType.DEVELOPER, 'hugh', viewOptions, expectation);
    }

    developerRefreshesTestResults(expectation){

    }
}
 export default new TestIntegrationActions();
