import {RoleType, ViewMode, DesignVersionStatus, DesignUpdateStatus, ComponentType, DesignUpdateMergeAction, WorkPackageType} from '../../imports/constants/constants.js'
import {DefaultItemNames, DefaultComponentNames} from '../../imports/constants/default_names.js';


class WpComponentActions{

    managerAddComponentToScopeForCurrentBaseWp(type, parentName, name){
        server.call('testWorkPackageComponents.toggleInitialWpComponentInScope', type, parentName, name, 'miles');
    }

    managerAddComponentInScopeForCurrentUpdateWp(type, parentName, name){
        server.call('testWorkPackageComponents.toggleUpdateWpComponentInScope', type, parentName, name, 'miles');
    }

    managerRemoveComponentFromScopeForCurrentBaseWp(type, parentName, name){
        server.call('testWorkPackageComponents.toggleInitialWpComponentOutScope', type, parentName, name, 'miles');
    }

    managerRemoveComponentFromScopeForCurrentUpdateWp(type, parentName, name){
        server.call('testWorkPackageComponents.toggleUpdateWpComponentOutScope', type, parentName, name, 'miles');
    }



    managerAddsApplicationToScopeForCurrentBaseWp(appName){
        server.call('testWorkPackageComponents.toggleInitialWpComponentInScope', ComponentType.APPLICATION, 'NONE', appName, 'miles');
    }

    managerAddsDesignSectionToScopeForCurrentBaseWp(parentName, sectionName){
        server.call('testWorkPackageComponents.toggleInitialWpComponentInScope', ComponentType.DESIGN_SECTION, parentName, sectionName, 'miles');
    }

    managerAddsFeatureToScopeForCurrentBaseWp(parentName, featureName){
        server.call('testWorkPackageComponents.toggleInitialWpComponentInScope', ComponentType.FEATURE, parentName, featureName, 'miles');
    }

    managerAddsFeatureAspectToScopeForCurrentBaseWp(parentName, aspectName){
        server.call('testWorkPackageComponents.toggleInitialWpComponentInScope', ComponentType.FEATURE_ASPECT, parentName, aspectName, 'miles');
    }

    managerAddsScenarioToScopeForCurrentBaseWp(parentName, scenarioName){
        server.call('testWorkPackageComponents.toggleInitialWpComponentInScope', ComponentType.SCENARIO, parentName, scenarioName, 'miles');
    }

    managerRemovesApplicationFromScopeForCurrentBaseWp(appName){
        server.call('testWorkPackageComponents.toggleInitialWpComponentOutScope', ComponentType.APPLICATION, 'NONE', appName, 'miles');
    }

    managerRemovesDesignSectionFromScopeForCurrentBaseWp(parentName, sectionName){
        server.call('testWorkPackageComponents.toggleInitialWpComponentOutScope', ComponentType.DESIGN_SECTION, 'NONE', parentName, sectionName, 'miles');
    }

    managerRemovesFeatureFromScopeForCurrentBaseWp(parentName, featureName){
        server.call('testWorkPackageComponents.toggleInitialWpComponentOutScope', ComponentType.FEATURE, 'NONE', parentName, featureName, 'miles');
    }

    managerRemovesFeatureAspectFromScopeForCurrentBaseWp(parentName, aspectName){
        server.call('testWorkPackageComponents.toggleInitialWpComponentOutScope', ComponentType.FEATURE_ASPECT, 'NONE', parentName, aspectName, 'miles');
    }

    managerRemovesScenarioFromScopeForCurrentBaseWp(parentName, scenarioName){
        server.call('testWorkPackageComponents.toggleInitialWpComponentOutScope', ComponentType.SCENARIO, 'NONE', parentName, scenarioName, 'miles');
    }

}

export default new WpComponentActions();
