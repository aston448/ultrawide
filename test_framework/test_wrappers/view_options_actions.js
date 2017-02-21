import {RoleType, ViewOptionType, ViewType} from '../../imports/constants/constants.js'

class ViewOptionsActions {

    // Turn all options off - use for initialisation only
    setAllViewOptionsHidden(userName){
        server.call('testViewOptions.setAllViewOptionsHidden', userName);
    }

    // Switch on/off Int tests for WP where mash data already loaded
    developerTogglesIntTestsInWorkPackageDevelopmentView(expectation){
        server.call('testViewOptions.toggleViewOption', ViewOptionType.DEV_INT_TESTS, 'hugh', RoleType.DEVELOPER, ViewType.DEVELOP_BASE_WP, false, expectation)
    }

    // Switch on/off Int tests for WP where mash data not yet loaded
    developerTogglesIntTestsInNewWorkPackageDevelopmentView(expectation){
        server.call('testViewOptions.toggleViewOption', ViewOptionType.DEV_INT_TESTS, 'hugh', RoleType.DEVELOPER, ViewType.DEVELOP_BASE_WP, true, expectation)
    }
}

export default new ViewOptionsActions();
