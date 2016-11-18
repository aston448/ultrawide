
import { ValidatedMethod } from 'meteor/mdg:validated-method';

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
    moveDesignComponent,
    reorderDesignComponent
} from '../apiValidatedMethods/design_component_methods.js'


class ServerDesignComponentApi {

    addApplicationToDesignVersion(view, mode, designVersionId, callback){

        addApplicationToDesignVersion.call(
            {
                view: view,
                mode: mode,
                designVersionId: designVersionId,
            },
            (err, result) => {
                callback(err, result);
            }
        );
    }

    addDesignSectionToApplication(view, mode, designVersionId, parentId, callback){

        addDesignSectionToApplication.call(
            {
                view: view,
                mode: mode,
                designVersionId: designVersionId,
                parentId: parentId
            },
            (err, result) => {
                callback(err, result);
            }
        );
    }

    addDesignSectionToDesignSection(view, mode, designVersionId, parentId, parentLevel, callback){

        addDesignSectionToDesignSection.call(
            {
                view: view,
                mode: mode,
                designVersionId: designVersionId,
                parentId: parentId,
                parentLevel: parentLevel
            },
            (err, result) => {
                callback(err, result);
            }
        );
    }

    addFeatureToDesignSection(view, mode, designVersionId, parentId, callback){

        addFeatureToDesignSection.call(
            {
                view: view,
                mode: mode,
                designVersionId: designVersionId,
                parentId: parentId
            },
            (err, result) => {
                callback(err, result);
            }
        );
    }

    addFeatureAspectToFeature(view, mode, designVersionId, parentId, callback){

        addFeatureAspectToFeature.call(
            {
                view: view,
                mode: mode,
                designVersionId: designVersionId,
                parentId: parentId
            },
            (err, result) => {
                callback(err, result);
            }
        );
    }

    addScenario(view, mode, designVersionId, parentId, callback){

        addScenario.call(
            {
                view: view,
                mode: mode,
                designVersionId: designVersionId,
                parentId: parentId
            },
            (err, result) => {
                callback(err, result);
            }
        );
    }

    updateComponentName(view, mode, designComponentId, newPlainText, newRawText, callback){

        updateComponentName.call(
            {
                view: view,
                mode: mode,
                designComponentId: designComponentId,
                newPlainText: newPlainText,
                newRawText: newRawText
            },
            (err, result) => {
                callback(err, result);
            }
        );
    };

    updateFeatureNarrative(view, mode, designComponentId, newPlainText, newRawText, callback){

        updateFeatureNarrative.call(
            {
                view: view,
                mode: mode,
                designComponentId: designComponentId,
                newPlainText: newPlainText,
                newRawText: newRawText
            },
            (err, result) => {
                callback(err, result);
            }
        );
    };

    removeDesignComponent(view, mode, designComponentId, parentId, callback){

        removeDesignComponent.call(
            {
                view: view,
                mode: mode,
                designComponentId: designComponentId,
                parentId: parentId,
            },
            (err, result) => {
                callback(err, result);
            }
        );

    };

    moveDesignComponent(view, mode, displayContext, designComponentId, newParentId, callback){

        moveDesignComponent.call(
            {
                view: view,
                mode: mode,
                displayContext: displayContext,
                movingComponentId: designComponentId,
                targetComponentId: newParentId,
            },
            (err, result) => {
                callback(err, result);
            }
        );
    };

    reorderDesignComponent(view, mode, displayContext, designComponentId, targetComponentId, callback){

        reorderDesignComponent.call(
            {
                view: view,
                mode: mode,
                displayContext: displayContext,
                movingComponentId: designComponentId,
                targetComponentId: targetComponentId,
            },
            (err, result) => {
                callback(err, result);
            }
        );
    }

}

export default new ServerDesignComponentApi();

