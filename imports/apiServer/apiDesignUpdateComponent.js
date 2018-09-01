
import {
    addApplicationToDesignVersion,
    addDesignSectionToApplication,
    addDesignSectionToDesignSection,
    addFeatureToDesignSection,
    addFeatureAspectToFeature,
    addScenario,
    updateComponentName,
    updateFeatureNarrative,
    removeDesignComponent,
    restoreDesignComponent,
    moveDesignComponent,
    reorderDesignComponent,
    toggleScope
} from '../apiValidatedMethods/design_update_component_methods.js'
import {setScenarioTestExpectations} from "../apiValidatedMethods/design_component_methods";


// =====================================================================================================================
// Server API for Design Update Components
//
// Calls Meteor Validated Methods and returns asynchronous results to callback
// =====================================================================================================================
class ServerDesignUpdateComponentApiClass {

    addApplicationToDesignVersion(view, mode, designVersionId, designUpdateId, callback){

        addApplicationToDesignVersion.call(
            {
                view: view,
                mode: mode,
                designVersionId: designVersionId,
                designUpdateId: designUpdateId
            },
            (err, result) => {
                callback(err, result);
            }
        );
    }

    addDesignSectionToApplication(view, mode, parentComponent, callback){

        addDesignSectionToApplication.call(
            {
                view: view,
                mode: mode,
                parentComponent: parentComponent
            },
            (err, result) => {
                callback(err, result);
            }
        );
    }

    addDesignSectionToDesignSection(view, mode, parentComponent, callback){

        addDesignSectionToDesignSection.call(
            {
                view: view,
                mode: mode,
                parentComponent: parentComponent
            },
            (err, result) => {
                callback(err, result);
            }
        );
    }

    addFeatureToDesignSection(view, mode, parentComponent, callback){

        addFeatureToDesignSection.call(
            {
                view: view,
                mode: mode,
                parentComponent: parentComponent
            },
            (err, result) => {
                callback(err, result);
            }
        );
    }

    addFeatureAspectToFeature(view, mode, parentComponent, workPackageId, callback){

        addFeatureAspectToFeature.call(
            {
                view: view,
                mode: mode,
                parentComponent: parentComponent,
                workPackageId:  workPackageId
            },
            (err, result) => {
                callback(err, result);
            }
        );
    }

    addScenario(view, mode, parentComponent, workPackageId, callback){

        addScenario.call(
            {
                view: view,
                mode: mode,
                parentComponent: parentComponent,
                workPackageId
            },
            (err, result) => {
                callback(err, result);
            }
        );
    }

    updateComponentName(view, mode, designUpdateComponentId, newPlainText, newRawText, callback){

        updateComponentName.call(
            {
                view: view,
                mode: mode,
                designUpdateComponentId: designUpdateComponentId,
                newPlainText: newPlainText,
                newRawText: newRawText
            },
            (err, result) => {
                callback(err, result);
            }
        );
    };

    updateFeatureNarrative(view, mode, designUpdateComponentId, newPlainText, newRawText, callback){

        updateFeatureNarrative.call(
            {
                view: view,
                mode: mode,
                designUpdateComponentId: designUpdateComponentId,
                newPlainText: newPlainText,
                newRawText: newRawText
            },
            (err, result) => {
                callback(err, result);
            }
        );
    };

    removeDesignComponent(view, mode, designUpdateComponentId, parentId, callback){

        removeDesignComponent.call(
            {
                view: view,
                mode: mode,
                designUpdateComponentId: designUpdateComponentId,
                parentId: parentId,
            },
            (err, result) => {
                callback(err, result);
            }
        );

    };

    restoreDesignComponent(view, mode, designUpdateComponentId, callback){

        restoreDesignComponent.call(
            {
                view: view,
                mode: mode,
                designUpdateComponentId: designUpdateComponentId
            },
            (err, result) => {
                callback(err, result);
            }
        );

    };

    moveDesignComponent(view, mode, displayContext, designUpdateComponentId, newParentId, callback){

        moveDesignComponent.call(
            {
                view: view,
                mode: mode,
                displayContext: displayContext,
                movingComponentId: designUpdateComponentId,
                targetComponentId: newParentId,
            },
            (err, result) => {
                callback(err, result);
            }
        );
    };

    reorderDesignComponent(view, mode, displayContext, designUpdateComponentId, targetComponentId, callback){

        reorderDesignComponent.call(
            {
                view: view,
                mode: mode,
                displayContext: displayContext,
                movingComponentId: designUpdateComponentId,
                targetComponentId: targetComponentId,
            },
            (err, result) => {
                callback(err, result);
            }
        );
    };

    toggleScope(view, mode, displayContext, baseComponentId, designUpdateId, updateComponent, newScope, callback){

        toggleScope.call(
            {
                view: view,
                mode: mode,
                displayContext: displayContext,
                baseComponentId: baseComponentId,
                designUpdateId: designUpdateId,
                updateComponent: updateComponent,
                newScope: newScope,
            },
            (err, result) => {
                callback(err, result);
            }
        );
    };
}

export const ServerDesignUpdateComponentApi = new ServerDesignUpdateComponentApiClass();


