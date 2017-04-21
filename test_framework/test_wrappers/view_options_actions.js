import {RoleType, ViewOptionType, ViewType} from '../../imports/constants/constants.js'

class ViewOptionsActions {

    // Turn all options off - use for initialisation only
    setAllViewOptionsHidden(userName){
        server.call('testViewOptions.setAllViewOptionsHidden', userName);
    }

    // INT TESTS -------------------------------------------------------------------------------------------------------

    // Switch on/off Int tests for Developer
    developerTogglesIntTestsPane(expectation) {
        server.call('testViewOptions.toggleViewOption', ViewOptionType.DEV_INT_TESTS, 'hugh', expectation);
    }

    // UNIT TESTS ------------------------------------------------------------------------------------------------------

    // Switch on/off Unit tests for Developer
    developerTogglesUnitTestsPane(expectation){
        server.call('testViewOptions.toggleViewOption', ViewOptionType.DEV_UNIT_TESTS, 'hugh', expectation)
    }

    // TEST SUMMARY
    developerTogglesDesignVersionTestSummary(expectation){
        server.call('testViewOptions.toggleViewOption', ViewOptionType.DESIGN_TEST_SUMMARY, 'hugh', expectation)
    }

}

export default new ViewOptionsActions();
