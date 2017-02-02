import {RoleType, ViewMode, DesignVersionStatus, DesignUpdateStatus, ComponentType, DesignUpdateMergeAction, WorkPackageType} from '../../imports/constants/constants.js'
import {DefaultItemNames, DefaultComponentNames} from '../../imports/constants/default_names.js';


class WpComponentActions{

    managerAddComponentToScopeForCurrentBaseWp(type, parentName, name, expectation){
        server.call('testWorkPackageComponents.toggleInitialWpComponentInScope', type, parentName, name, 'miles', expectation);
    }

    managerAddComponentInScopeForCurrentUpdateWp(type, parentName, name, expectation){
        server.call('testWorkPackageComponents.toggleUpdateWpComponentInScope', type, parentName, name, 'miles', expectation);
    }

    managerRemoveComponentFromScopeForCurrentBaseWp(type, parentName, name, expectation){
        server.call('testWorkPackageComponents.toggleInitialWpComponentOutScope', type, parentName, name, 'miles', expectation);
    }

    managerRemoveComponentFromScopeForCurrentUpdateWp(type, parentName, name, expectation){
        server.call('testWorkPackageComponents.toggleUpdateWpComponentOutScope', type, parentName, name, 'miles', expectation);
    }



    managerAddsApplicationToScopeForCurrentBaseWp(appName, expectation){
        server.call('testWorkPackageComponents.toggleInitialWpComponentInScope', ComponentType.APPLICATION, 'NONE', appName, 'miles', expectation);
    }

    managerAddsDesignSectionToScopeForCurrentBaseWp(parentName, sectionName, expectation){
        server.call('testWorkPackageComponents.toggleInitialWpComponentInScope', ComponentType.DESIGN_SECTION, parentName, sectionName, 'miles', expectation);
    }

    managerAddsFeatureToScopeForCurrentBaseWp(parentName, featureName, expectation){
        server.call('testWorkPackageComponents.toggleInitialWpComponentInScope', ComponentType.FEATURE, parentName, featureName, 'miles', expectation);
    }

    managerAddsFeatureAspectToScopeForCurrentBaseWp(parentName, aspectName, expectation){
        server.call('testWorkPackageComponents.toggleInitialWpComponentInScope', ComponentType.FEATURE_ASPECT, parentName, aspectName, 'miles', expectation);
    }

    managerAddsScenarioToScopeForCurrentBaseWp(parentName, scenarioName, expectation){
        server.call('testWorkPackageComponents.toggleInitialWpComponentInScope', ComponentType.SCENARIO, parentName, scenarioName, 'miles', expectation);
    }

    managerRemovesApplicationFromScopeForCurrentBaseWp(appName, expectation){
        server.call('testWorkPackageComponents.toggleInitialWpComponentOutScope', ComponentType.APPLICATION, 'NONE', appName, 'miles', expectation);
    }

    managerRemovesDesignSectionFromScopeForCurrentBaseWp(parentName, sectionName, expectation){
        server.call('testWorkPackageComponents.toggleInitialWpComponentOutScope', ComponentType.DESIGN_SECTION, parentName, sectionName, 'miles', expectation);
    }

    managerRemovesFeatureFromScopeForCurrentBaseWp(parentName, featureName, expectation){
        server.call('testWorkPackageComponents.toggleInitialWpComponentOutScope', ComponentType.FEATURE, parentName, featureName, 'miles', expectation);
    }

    managerRemovesFeatureAspectFromScopeForCurrentBaseWp(parentName, aspectName, expectation){
        server.call('testWorkPackageComponents.toggleInitialWpComponentOutScope', ComponentType.FEATURE_ASPECT, parentName, aspectName, 'miles', expectation);
    }

    managerRemovesScenarioFromScopeForCurrentBaseWp(parentName, scenarioName, expectation){
        server.call('testWorkPackageComponents.toggleInitialWpComponentOutScope', ComponentType.SCENARIO, parentName, scenarioName, 'miles', expectation);
    }

}

export default new WpComponentActions();
