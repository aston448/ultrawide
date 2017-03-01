import {RoleType, ViewMode, DesignVersionStatus, DesignUpdateStatus, ComponentType, DesignUpdateMergeAction, WorkPackageType} from '../../imports/constants/constants.js'
import {DefaultItemNames, DefaultComponentNames} from '../../imports/constants/default_names.js';


class WpComponentActions{

    // Generic scoping
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

    // Select
    managerSelectsWorkPackageComponent(type, parentName, name){
        server.call('testWorkPackageComponents.selectWorkPackageComponent', type, parentName, name, 'miles');
    }

    developerSelectsWorkPackageComponent(type, parentName, name){
        server.call('testWorkPackageComponents.selectWorkPackageComponent', type, parentName, name, 'hugh');
    }

    // Specific Scoping - Add
    managerAddsApplicationToScopeForCurrentBaseWp(appName, expectation){
        server.call('testWorkPackageComponents.toggleInitialWpComponentInScope', ComponentType.APPLICATION, 'NONE', appName, 'miles', expectation);
    }

    managerAddsApplicationToScopeForCurrentUpdateWp(appName, expectation){
        server.call('testWorkPackageComponents.toggleUpdateWpComponentInScope', ComponentType.APPLICATION, 'NONE', appName, 'miles', expectation);
    }

    managerAddsDesignSectionToScopeForCurrentBaseWp(parentName, sectionName, expectation){
        server.call('testWorkPackageComponents.toggleInitialWpComponentInScope', ComponentType.DESIGN_SECTION, parentName, sectionName, 'miles', expectation);
    }

    managerAddsDesignSectionToScopeForCurrentUpdateWp(parentName, sectionName, expectation){
        server.call('testWorkPackageComponents.toggleUpdateWpComponentInScope', ComponentType.DESIGN_SECTION, parentName, sectionName, 'miles', expectation);
    }

    managerAddsFeatureToScopeForCurrentBaseWp(parentName, featureName, expectation){
        server.call('testWorkPackageComponents.toggleInitialWpComponentInScope', ComponentType.FEATURE, parentName, featureName, 'miles', expectation);
    }

    managerAddsFeatureToScopeForCurrentUpdateWp(parentName, featureName, expectation){
        server.call('testWorkPackageComponents.toggleUpdateWpComponentInScope', ComponentType.FEATURE, parentName, featureName, 'miles', expectation);
    }

    managerAddsFeatureAspectToScopeForCurrentBaseWp(parentName, aspectName, expectation){
        server.call('testWorkPackageComponents.toggleInitialWpComponentInScope', ComponentType.FEATURE_ASPECT, parentName, aspectName, 'miles', expectation);
    }

    managerAddsFeatureAspectToScopeForCurrentUpdateWp(parentName, aspectName, expectation){
        server.call('testWorkPackageComponents.toggleUpdateWpComponentInScope', ComponentType.FEATURE_ASPECT, parentName, aspectName, 'miles', expectation);
    }

    managerAddsScenarioToScopeForCurrentBaseWp(parentName, scenarioName, expectation){
        server.call('testWorkPackageComponents.toggleInitialWpComponentInScope', ComponentType.SCENARIO, parentName, scenarioName, 'miles', expectation);
    }

    managerAddsScenarioToScopeForCurrentUpdateWp(parentName, scenarioName, expectation){
        server.call('testWorkPackageComponents.toggleUpdateWpComponentInScope', ComponentType.SCENARIO, parentName, scenarioName, 'miles', expectation);
    }

    // Specific Scoping - Remove
    managerRemovesApplicationFromScopeForCurrentBaseWp(appName, expectation){
        server.call('testWorkPackageComponents.toggleInitialWpComponentOutScope', ComponentType.APPLICATION, 'NONE', appName, 'miles', expectation);
    }

    managerRemovesApplicationFromScopeForCurrentUpdateWp(appName, expectation){
        server.call('testWorkPackageComponents.toggleUpdateWpComponentOutScope', ComponentType.APPLICATION, 'NONE', appName, 'miles', expectation);
    }

    managerRemovesDesignSectionFromScopeForCurrentBaseWp(parentName, sectionName, expectation){
        server.call('testWorkPackageComponents.toggleInitialWpComponentOutScope', ComponentType.DESIGN_SECTION, parentName, sectionName, 'miles', expectation);
    }

    managerRemovesDesignSectionFromScopeForCurrentUpdateWp(parentName, sectionName, expectation){
        server.call('testWorkPackageComponents.toggleUpdateWpComponentOutScope', ComponentType.DESIGN_SECTION, parentName, sectionName, 'miles', expectation);
    }

    managerRemovesFeatureFromScopeForCurrentBaseWp(parentName, featureName, expectation){
        server.call('testWorkPackageComponents.toggleInitialWpComponentOutScope', ComponentType.FEATURE, parentName, featureName, 'miles', expectation);
    }

    managerRemovesFeatureFromScopeForCurrentUpdateWp(parentName, featureName, expectation){
        server.call('testWorkPackageComponents.toggleUpdateWpComponentOutScope', ComponentType.FEATURE, parentName, featureName, 'miles', expectation);
    }

    managerRemovesFeatureAspectFromScopeForCurrentBaseWp(parentName, aspectName, expectation){
        server.call('testWorkPackageComponents.toggleInitialWpComponentOutScope', ComponentType.FEATURE_ASPECT, parentName, aspectName, 'miles', expectation);
    }

    managerRemovesFeatureAspectFromScopeForCurrentUpdateWp(parentName, aspectName, expectation){
        server.call('testWorkPackageComponents.toggleUpdateWpComponentOutScope', ComponentType.FEATURE_ASPECT, parentName, aspectName, 'miles', expectation);
    }

    managerRemovesScenarioFromScopeForCurrentBaseWp(parentName, scenarioName, expectation){
        server.call('testWorkPackageComponents.toggleInitialWpComponentOutScope', ComponentType.SCENARIO, parentName, scenarioName, 'miles', expectation);
    }

    managerRemovesScenarioFromScopeForCurrentUpdateWp(parentName, scenarioName, expectation){
        server.call('testWorkPackageComponents.toggleUpdateWpComponentOutScope', ComponentType.SCENARIO, parentName, scenarioName, 'miles', expectation);
    }

    // WP Editing
    developerUpdatesSelectedComponentNameTo(newName, expectation){
        server.call('testWorkPackageComponents.updateSelectedComponentName', newName, 'hugh', expectation);
    }

    developerAddsScenarioToSelectedFeatureAspect(expectation){
        server.call('testWorkPackageComponents.addNewScenarioToSelectedComponent', 'hugh', expectation);
    }

    developerAddsFeatureAspectToSelectedFeature(expectation){
        server.call('testWorkPackageComponents.addNewFeatureAspectToSelectedComponent', 'hugh', expectation);
    }

    developerRemovesSelectedScenario(expectation){
        server.call('testWorkPackageComponents.removeSelectedComponent', ComponentType.SCENARIO, 'hugh', expectation);
    }

    developerRemovesSelectedFeatureAspect(expectation){
        server.call('testWorkPackageComponents.removeSelectedComponent', ComponentType.FEATURE_ASPECT, 'hugh', expectation);
    }

}

export default new WpComponentActions();
