// == IMPORTS ==========================================================================================================

// Meteor / React Services

// Ultrawide collections
import {DesignUpdateComponents} from '../collections/design_update/design_update_components.js';

// Ultrawide Services
import {ViewType, ViewMode, DisplayContext, ComponentType} from '../constants/constants.js';
import {validateDesignUpdateComponentName, locationMoveDropAllowed, reorderDropAllowed} from '../common/utils.js';

// REDUX services
import store from '../redux/store'
import {updateDesignComponentName, setCurrentUserOpenDesignUpdateItems} from '../redux/actions'

// =====================================================================================================================

// -- CLASS ------------------------------------------------------------------------------------------------------------
//
// Client Design Update Component Services - Supports client calls for actions relating to a Design Update Component
//
// This class is the test entry point when not testing through the GUI.
// Most functions validate and return true / false according to business rules even if there is implicit validation in the GUI
// (E.g. buttons not being visible if action invalid)
//
// ---------------------------------------------------------------------------------------------------------------------

class ClientDesignUpdateComponentServices{

    // User opened or closed a design component
    setOpenClosed(designComponent, currentList, newState){

        if(designComponent.componentType === ComponentType.FEATURE){
            // Open or close the whole feature
            const featureComponents = DesignUpdateComponents.find(
                {
                    designVersionId: designComponent.designVersionId,
                    designUpdateId: designComponent.designUpdateId,
                    componentFeatureReferenceIdNew: designComponent.componentFeatureReferenceIdNew
                }
            );

            featureComponents.forEach((component) => {
                store.dispatch(setCurrentUserOpenDesignUpdateItems(
                    Meteor.userId(),
                    currentList,
                    component._id,
                    newState
                ));
            });

        } else {
            if(newState){
                // Open - just open this item
                store.dispatch(setCurrentUserOpenDesignUpdateItems(
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

        let childComponents = DesignUpdateComponents.find(
            {
                designVersionId: designComponent.designVersionId,
                designUpdateId: designComponent.designUpdateId,
                componentParentReferenceIdNew: designComponent.componentReferenceId
            }
        );

        if(childComponents.count() > 0){
            childComponents.forEach((child) => {

                store.dispatch(setCurrentUserOpenDesignUpdateItems(
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

    // User saved a change to design compoennt name
    updateComponentName(designUpdateComponent, newPlainText, newRawText){

        // Make sure the name being saved is unique in this design version
        if(validateDesignUpdateComponentName(designUpdateComponent, newPlainText)) {
            Meteor.call('designUpdate.saveComponentName', designUpdateComponent._id, newPlainText, newRawText);

            // Temp update for the redux state to the local new value - otherwise does not get changed in time
            // This allows the text area to immediately display any updates to current component name
            store.dispatch(updateDesignComponentName(newPlainText));
            return true;
        } else {
            return false;
        }
    };

    // User saved changes to Narrative in a Feature
    updateFeatureNarrative(view, mode, designUpdateComponentId, newPlainText, newRawText){

        // Validate - can only do this if editing a design update and in edit mode
        if(view === ViewType.DESIGN_UPDATE_EDIT && mode === ViewMode.MODE_EDIT) {
            Meteor.call('designUpdate.saveFeatureNarrative', designUpdateComponentId, newRawText, newPlainText);
        } else {
            return false;
        }
    };

    // User clicked Add Application in the main Design Update Applications container
    addApplicationToDesignVersion(view, mode, designVersionId, designUpdateId) {

        // Validate - can only do this if editing a design update and in edit mode
        if (view === ViewType.DESIGN_UPDATE_EDIT && mode === ViewMode.MODE_EDIT) {
            Meteor.call('designUpdate.addNewApplication', designVersionId, designUpdateId);
            return true;
        } else {
            return false;
        }
    };

    // User clicked Add Design Section inside an Application component
    addDesignSectionToApplication(view, mode, parentComponent){

        // Validate - can only do this if editing a design update and in edit mode
        if(view === ViewType.DESIGN_UPDATE_EDIT && mode === ViewMode.MODE_EDIT) {
            Meteor.call('designUpdate.addNewSectionToApplication', parentComponent.designVersionId, parentComponent.designUpdateId, parentComponent._id);
            return true;
        } else {
            return false;
        }
    };

    // User clicked Add Sub Section inside a Design Section
    addSectionToDesignSection(view, mode, parentComponent){

        // Validate - can only do this if editing a design update and in edit mode
        if(view === ViewType.DESIGN_UPDATE_EDIT && mode === ViewMode.MODE_EDIT) {
            Meteor.call('designUpdate.addNewSectionToDesignSection', parentComponent.designVersionId, parentComponent.designUpdateId, parentComponent._id, parentComponent.componentLevel);
            return true;
        } else {
            return false;
        }
    };

    // User clicked Add Feature inside a Design Section
    addFeatureToDesignSection(view, mode, parentComponent){

        // Validate - can only do this if editing a design update and in edit mode
        if(view === ViewType.DESIGN_UPDATE_EDIT && mode === ViewMode.MODE_EDIT) {
            Meteor.call('designUpdate.addNewFeature', parentComponent.designVersionId, parentComponent.designUpdateId, parentComponent._id);
            return true;
        } else {
            return false;
        }
    };

    // User clicked Add Feature Aspect inside a Feature
    addFeatureAspectToFeature(view, mode, parentComponent){

        // Validate - can only do this if editing a design update and in edit mode
        if(view === ViewType.DESIGN_UPDATE_EDIT && mode === ViewMode.MODE_EDIT) {
            Meteor.call('designUpdate.addNewFeatureAspectToFeature', parentComponent.designVersionId, parentComponent.designUpdateId, parentComponent._id);
            return true;
        } else {
            return false;
        }
    };

    // User clicked Add Scenario in either a Feature or Feature Aspect
    addScenario(view, mode, parentComponent){

        // Validate - can only do this if editing a design update and in edit mode
        if(view === ViewType.DESIGN_UPDATE_EDIT && mode === ViewMode.MODE_EDIT) {
            Meteor.call('designUpdate.addNewScenario', parentComponent.designVersionId, parentComponent.designUpdateId, parentComponent._id);
        } else {
            return false;
        }
    };

    // User clicked Delete for a design component when editing a Design Update
    logicallyDeleteComponent(view, mode, component){

        // Validate - can only do this if editing a design update and in edit mode and item is removable
        if(view === ViewType.DESIGN_UPDATE_EDIT && mode === ViewMode.MODE_EDIT && component.isRemovable) {
            // This just marks the component as deleted...
            Meteor.call('designUpdate.deleteComponent', component._id, component.componentParentIdNew);

            // The current component remains this component until a nre component is chosen - so no update to REDUX as for actual delete.

            return true;
        } else {
            return false;
        }
    };

    // User clicked Restore for a logically deleted design component when editing a Design Update
    restoreComponent(view, mode, component){

        // Validate - can only do this if editing a design update and in edit mode and item is logicaly deleted
        if(view === ViewType.DESIGN_UPDATE_EDIT && mode === ViewMode.MODE_EDIT && component.isRemoved) {
            Meteor.call('designUpdate.restoreComponent', component._id, component.componentParentIdNew);
            return true;
        } else {
            return false;
        }
    };

    // User put a scopable item in the scope view in or out of scope for a Design Update
    toggleInScope(view, mode, context, component, newScope){

        // Validate - can only do this if editing an update in edit mode and for the scope context
        if(view === ViewType.DESIGN_UPDATE_EDIT && mode === ViewMode.MODE_EDIT && context === DisplayContext.UPDATE_SCOPE){
            Meteor.call('designUpdate.toggleScope', component._id, newScope);
            return true;
        } else {
            return false;
        }

    };

    // User dragged a component to a new location in the design update
    moveComponent(view, mode, context, movingComponent, newParentComponent){

        // Validation - must be editing design udate in edit mode and component must be allowed to drop...
        if(view === ViewType.DESIGN_UPDATE_EDIT && mode === ViewMode.MODE_EDIT && context === DisplayContext.UPDATE_EDIT &&
            locationMoveDropAllowed(
                movingComponent.componentType,
                newParentComponent.componentType,
                view, newParentComponent.isInScope)
        ){
            Meteor.call('designUpdate.moveComponent', movingComponent._id, newParentComponent._id);
            return true;
        } else {
            return false;
        }
    };

    // User dragged a component to a new position in its current list
    reorderComponent(view, mode, context, movingComponent, targetComponent){

        // Validation - must be editing new design in edit mode and component must be allowed to drop...
        if(view === ViewType.DESIGN_UPDATE_EDIT && mode === ViewMode.MODE_EDIT && context === DisplayContext.UPDATE_EDIT &&
            reorderDropAllowed(
                movingComponent,
                targetComponent)
        ){
            // The target component is the one in the list above which the drop will be made
            Meteor.call('designUpdate.reorderComponent', movingComponent._id, targetComponent._id);
            return true;
        } else {
            return false;
        }
    };

}

export default new ClientDesignUpdateComponentServices();