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
    managerAddsApplicationToScopeForCurrentWp(appName, expectation){
        server.call('testWorkPackageComponents.toggleWpComponentInScope', ComponentType.APPLICATION, 'NONE', appName, 'miles', expectation);
    }

    managerAddsDesignSectionToScopeForCurrentWp(parentName, sectionName, expectation){
        server.call('testWorkPackageComponents.toggleWpComponentInScope', ComponentType.DESIGN_SECTION, parentName, sectionName, 'miles', expectation);
    }

    managerAddsFeatureToScopeForCurrentWp(parentName, featureName, expectation){
        server.call('testWorkPackageComponents.toggleWpComponentInScope', ComponentType.FEATURE, parentName, featureName, 'miles', expectation);
    }

    managerAddsFeatureAspectToScopeForCurrentWp(parentName, aspectName, expectation){
        server.call('testWorkPackageComponents.toggleWpComponentInScope', ComponentType.FEATURE_ASPECT, parentName, aspectName, 'miles', expectation);
    }

    managerAddsScenarioToScopeForCurrentWp(parentName, scenarioName, expectation){
        server.call('testWorkPackageComponents.toggleWpComponentInScope', ComponentType.SCENARIO, parentName, scenarioName, 'miles', expectation);
    }

    // Specific Scoping - Remove
    managerRemovesApplicationFromScopeForCurrentWp(appName, expectation){
        server.call('testWorkPackageComponents.toggleWpComponentOutScope', ComponentType.APPLICATION, 'NONE', appName, 'miles', expectation);
    }

    managerRemovesDesignSectionFromScopeForCurrentWp(parentName, sectionName, expectation){
        server.call('testWorkPackageComponents.toggleWpComponentOutScope', ComponentType.DESIGN_SECTION, parentName, sectionName, 'miles', expectation);
    }

    managerRemovesFeatureFromScopeForCurrentWp(parentName, featureName, expectation){
        server.call('testWorkPackageComponents.toggleWpComponentOutScope', ComponentType.FEATURE, parentName, featureName, 'miles', expectation);
    }

    managerRemovesFeatureAspectFromScopeForCurrentWp(parentName, aspectName, expectation){
        server.call('testWorkPackageComponents.toggleWpComponentOutScope', ComponentType.FEATURE_ASPECT, parentName, aspectName, 'miles', expectation);
    }

    managerRemovesScenarioFromScopeForCurrentWp(parentName, scenarioName, expectation){
        server.call('testWorkPackageComponents.toggleWpComponentOutScope', ComponentType.SCENARIO, parentName, scenarioName, 'miles', expectation);
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

    developerRemovesSelectedFeature(expectation){
        server.call('testWorkPackageComponents.removeSelectedComponent', ComponentType.FEATURE, 'hugh', expectation);
    }

    developerRemovesSelectedDesignSection(expectation){
        server.call('testWorkPackageComponents.removeSelectedComponent', ComponentType.DESIGN_SECTION, 'hugh', expectation);
    }

    developerRemovesSelectedApplication(expectation){
        server.call('testWorkPackageComponents.removeSelectedComponent', ComponentType.APPLICATION, 'hugh', expectation);
    }

    developerAddsApplicationToWorkPackage(expectation){
        server.call('testWorkPackageComponents.addNewComponentToSelectedComponent', ComponentType.APPLICATION, 'hugh', expectation);
    }

    developerAddsDesignSectionToSelectedComponent(expectation){
        server.call('testWorkPackageComponents.addNewComponentToSelectedComponent', ComponentType.DESIGN_SECTION, 'hugh', expectation);
    }

    developerAddsFeatureToSelectedDesignSection(expectation){
        server.call('testWorkPackageComponents.addNewComponentToSelectedComponent', ComponentType.FEATURE, 'hugh', expectation);
    }

}

export default new WpComponentActions();
