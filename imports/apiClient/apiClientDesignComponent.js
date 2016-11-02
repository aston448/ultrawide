// == IMPORTS ==========================================================================================================

// Meteor / React Services

// Ultrawide collections
import {DesignComponents} from '../collections/design/design_components.js';
import {DesignUpdateComponents} from '../collections/design_update/design_update_components.js';

// Ultrawide Services
import {ViewType, ViewMode, DisplayContext, ComponentType, LogLevel} from '../constants/constants.js';
import {validateDesignComponentName, locationMoveDropAllowed, reorderDropAllowed, log} from '../common/utils.js';

// REDUX services
import store from '../redux/store'
import {setCurrentUserItemContext, setCurrentUserOpenDesignItems, updateDesignComponentName} from '../redux/actions'

// =====================================================================================================================

// -- CLASS ------------------------------------------------------------------------------------------------------------
//
// Client Design Component Services - Supports client calls for actions relating to a Design Component
//
// This class is the test entry point when not testing through the GUI.
// Most functions validate and return true / false according to business rules even if there is implicit validation in the GUI
// (E.g. buttons not being visible if action invalid)
//
// ---------------------------------------------------------------------------------------------------------------------

class ClientDesignComponentServices{

    // User selected a design component
    setDesignComponent(newDesignComponentId, userContext){
        if(newDesignComponentId != userContext.designComponentId) {

            // See if any of the feature specific fields need setting
            let component = null;
            let componentFeatureRef = '';
            let componentParentRef = '';

            if(userContext.designUpdateId === 'NONE'){
                component = DesignComponents.findOne({_id: newDesignComponentId});
                componentFeatureRef = component.componentFeatureReferenceId;
                componentParentRef = component.componentParentReferenceId;
            } else {
                component = DesignUpdateComponents.findOne({_id: newDesignComponentId});
                componentFeatureRef = component.componentFeatureReferenceIdNew;
                componentParentRef = component.componentParentReferenceIdNew;
            }

            let featureReferenceId = 'NONE';
            let featureAspectReferenceId = 'NONE';
            let scenarioReferenceId = 'NONE';

            switch(component.componentType){
                case ComponentType.FEATURE:
                    featureReferenceId = component.componentReferenceId;
                    break;
                case ComponentType.FEATURE_ASPECT:
                    featureAspectReferenceId = component.componentReferenceId;
                    featureReferenceId = componentFeatureRef;
                    break;
                case ComponentType.SCENARIO:
                    featureReferenceId = componentFeatureRef;
                    // If this Scenario is not directly under its feature then the parent is the Feature Aspect
                    if(componentParentRef != componentFeatureRef){
                        featureAspectReferenceId = componentParentRef;
                    }
                    scenarioReferenceId = component.componentReferenceId;
                    break;
            }

            // Update context to new component
            const context = {
                userId:                     Meteor.userId(),
                designId:                   userContext.designId,
                designVersionId:            userContext.designVersionId,
                designUpdateId:             userContext.designUpdateId,
                workPackageId:              userContext.workPackageId,
                designComponentId:          newDesignComponentId,
                designComponentType:        component.componentType,
                featureReferenceId:         featureReferenceId,
                featureAspectReferenceId:   featureAspectReferenceId,
                scenarioReferenceId:        scenarioReferenceId,
                scenarioStepId:             'NONE'
            };

            store.dispatch(setCurrentUserItemContext(context, true));

            return true;
        }

        // Not an error - just indicates no change
        return false;
    };

    // User opened or closed a design component
    setOpenClosed(designComponent, currentList, newState){

        if(designComponent.componentType === ComponentType.FEATURE){
            // Open or close the whole feature

            const featureComponents = DesignComponents.find(
                {
                    designVersionId: designComponent.designVersionId,
                    componentFeatureReferenceId: designComponent.componentFeatureReferenceId
                }
            );

            featureComponents.forEach((component) => {
                store.dispatch(setCurrentUserOpenDesignItems(
                    Meteor.userId(),
                    currentList,
                    component._id,
                    newState
                ));
            });

        } else {

            if(newState){
                // Open - just open this item
                store.dispatch(setCurrentUserOpenDesignItems(
                    Meteor.userId(),
                    currentList,
                    designComponent._id,
                    newState
                ));
            } else {
                // Close - close all children
                this.closeChildren(designComponent, currentList)
            }

        }

        return true;
    };


    // Recursive function to close all children down to the bottom of the tree
    closeChildren(designComponent, currentList){

        let childComponents = DesignComponents.find(
            {
                designVersionId: designComponent.designVersionId,
                componentParentReferenceId: designComponent.componentReferenceId
            }
        );

        if(childComponents.count() > 0){
            childComponents.forEach((child) => {

                store.dispatch(setCurrentUserOpenDesignItems(
                    Meteor.userId(),
                    currentList,
                    designComponent._id,
                    false
                ));

                // Recursively call for these children
                this.closeChildren(child, currentList)


            });

            return true;

        } else {
            return false;
        }
    };

    // User saved a change to design component name
    updateComponentName(designComponent, newPlainText, newRawText){

        // Make sure the name being saved is unique in this design version
        if(validateDesignComponentName(designComponent, newPlainText)) {
            Meteor.call('design.saveComponentName', designComponent._id, newPlainText, newRawText);

            // Temp update for the redux state to the local new value - otherwise does not get changed in time
            // This allows the text area to immediately display any updates to current component name
            store.dispatch(updateDesignComponentName(newPlainText));

            return true;

        } else {
            return false;
        }
    };

    // User saved changes to Narrative in a Feature
    updateFeatureNarrative(view, mode, designComponentId, newPlainText, newRawText){

        // Validate - can only do this if editing a new design and in edit mode
        if(view === ViewType.DESIGN_NEW_EDIT && mode === ViewMode.MODE_EDIT) {
            Meteor.call('design.saveFeatureNarrative', designComponentId, newRawText, newPlainText);
        } else {
            return false;
        }
    };

    // User clicked Add Application in the main Design Applications container
    addApplicationToDesignVersion(view, mode, designVersionId) {

        // Validate - can only do this if editing a new design and in edit mode
        if (view === ViewType.DESIGN_NEW_EDIT && mode === ViewMode.MODE_EDIT) {
            Meteor.call('design.addNewApplication', designVersionId);
            return true;
        } else {
            return false;
        }
    };

    // User clicked Add Design Section inside an Application component
    addDesignSectionToApplication(view, mode, parentComponent){

        // Validate - can only do this if editing a new design and in edit mode
        if(view === ViewType.DESIGN_NEW_EDIT && mode === ViewMode.MODE_EDIT) {
            Meteor.call('design.addNewSectionToApplication', parentComponent.designVersionId, parentComponent._id);
            return true;
        } else {
            return false;
        }
    };

    // User clicked Add Sub Section inside a Design Section
    addSectionToDesignSection(view, mode, parentComponent){

        // Validate - can only do this if editing a new design and in edit mode
        if(view === ViewType.DESIGN_NEW_EDIT && mode === ViewMode.MODE_EDIT) {
            Meteor.call('design.addNewSectionToDesignSection', parentComponent.designVersionId, parentComponent._id, parentComponent.componentLevel);
            return true;
        } else {
            return false;
        }
    };

    // User clicked Add Feature inside a Design Section
    addFeatureToDesignSection(view, mode, parentComponent){

        // Validate - can only do this if editing a new design and in edit mode
        if(view === ViewType.DESIGN_NEW_EDIT && mode === ViewMode.MODE_EDIT) {
            Meteor.call('design.addNewFeature', parentComponent.designVersionId, parentComponent._id);
        } else {
            return false;
        }
    };

    // User clicked Add Feature Aspect inside a Feature
    addFeatureAspectToFeature(view, mode, parentComponent){

        // Validate - can only do this if editing a new design and in edit mode
        if(view === ViewType.DESIGN_NEW_EDIT && mode === ViewMode.MODE_EDIT) {
            Meteor.call('design.addNewFeatureAspectToFeature', parentComponent.designVersionId, parentComponent._id);
        } else {
            return false;
        }
    };

    // User clicked Add Scenario in either a Feature or Feature Aspect
    addScenario(view, mode, parentComponent){

        // Validate - can only do this if editing a new design and in edit mode
        if(view === ViewType.DESIGN_NEW_EDIT && mode === ViewMode.MODE_EDIT) {
            Meteor.call('design.addNewScenario', parentComponent.designVersionId, parentComponent._id);
        } else {
            return false;
        }
    };

    // User clicked Delete for a design component
    deleteComponent(view, mode, component, userContext){

        // Validation - must be editing new design in edit mode and item must be removable
        if(view === ViewType.DESIGN_NEW_EDIT && mode === ViewMode.MODE_EDIT && component.isRemovable) {
            Meteor.call('design.deleteComponent', component._id, component.componentParentId);

            // There can now be no component selected...
            const context = {
                userId:                     Meteor.userId(),
                designId:                   userContext.designId,
                designVersionId:            userContext.designVersionId,
                designUpdateId:             userContext.designUpdateId,
                workPackageId:              userContext.workPackageId,
                designComponentId:          'NONE',
                designComponentType:        'NONE',
                featureReferenceId:         'NONE',
                featureAspectReferenceId:   'NONE',
                scenarioReferenceId:        'NONE',
                scenarioStepId:             'NONE'
            };

            store.dispatch(setCurrentUserItemContext(context, true));
            return true;

        } else {
            return false;
        }
    };

    // User dragged a component to a new location in the design
    moveComponent(view, mode, context, movingComponent, newParentComponent){

        // Validation - must be editing new design in edit mode and component must be allowed to drop...
        if(view === ViewType.DESIGN_NEW_EDIT && mode === ViewMode.MODE_EDIT && context === DisplayContext.BASE_EDIT &&
            locationMoveDropAllowed(
                movingComponent.componentType,
                newParentComponent.componentType,
                view, newParentComponent.isInScope)
        ){
            Meteor.call('design.moveComponent', movingComponent._id, newParentComponent._id);
            return true;
        } else {
            return false;
        }
    };

    // User dragged a component to a new position in its current list
    reorderComponent(view, mode, context, movingComponent, targetComponent){

        log((msg) => console.log(msg), LogLevel.TRACE, "Moving design component.  View: {} Mode: {} Context: {}", view, mode, context);

        // Validation - must be editing new design in edit mode and component must be allowed to drop...
        if(view === ViewType.DESIGN_NEW_EDIT && mode === ViewMode.MODE_EDIT && context === DisplayContext.BASE_EDIT &&
            reorderDropAllowed(
                movingComponent,
                targetComponent)
        ){
            // The target component is the one in the list above which the drop will be made
            log((msg) => console.log(msg), LogLevel.TRACE, "OK to reorder...");
            Meteor.call('design.reorderComponent', movingComponent._id, targetComponent._id);
            return true;
        } else {
            return false;
        }
    };


}

export default new ClientDesignComponentServices();