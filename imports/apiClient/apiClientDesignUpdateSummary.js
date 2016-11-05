// == IMPORTS ==========================================================================================================

// Meteor / React Services
import { Meteor } from 'meteor/meteor';

// Ultrawide Collections
import { UserRoles }                from '../collections/users/user_roles.js';
import { UserCurrentEditContext }   from '../collections/context/user_current_edit_context.js';
import { Designs }                  from '../collections/design/designs.js';
import { DesignVersions }           from '../collections/design/design_versions.js';
import { DesignUpdates }            from '../collections/design_update/design_updates.js';
import { DesignComponents }         from '../collections/design/design_components.js';
import { DesignUpdateComponents }   from '../collections/design_update/design_update_components.js';

// Ultrawide GUI Components


// Ultrawide Services
import { ComponentType, DesignUpdateSummaryItem, DesignUpdateSummaryType} from '../constants/constants.js';
import ClientDesignServices from './apiClientDesign.js';


// =====================================================================================================================

// -- CLASS ------------------------------------------------------------------------------------------------------------
//
// Client Design Update Summary - Gets the data required to summarise a Design Update
//
// ---------------------------------------------------------------------------------------------------------------------

class ClientDesignUpdateSummary{

    getDesignUpdateSummary(designUpdateId){

        // Nothing is no Design Update is set
        if(!designUpdateId){
            return {
                functionalAdditions: [],
                functionalRemovals: [],
                functionalChanges: []
            };
        }

        // A summary consists of 3 things:
        // 1. Stuff Added
        // 2. Stuff Removed
        // 3. Stuff Modified

        // However these can be also divided into Functional and Structural changes.  Functional are changes to
        // Features and Scenarios.  Structural are all other changes

        // Get Stuff Added or Removed----------------------------------------------------------------------------------

        const newRemovedDesignComponents = DesignUpdateComponents.find({designUpdateId: designUpdateId, $or:[{isNew: true}, {isRemoved: true}]});

        let updateFunctionalAdditions = new Mongo.Collection(null);
        let updateFunctionalRemovals = new Mongo.Collection(null);

        let parentComponent = null;
        let realParentComponent = null;

        newRemovedDesignComponents.forEach((component) => {

            switch (component.componentType){
                case ComponentType.FEATURE:
                    // For a new Feature it is always related to its Parent Section
                    parentComponent = DesignUpdateComponents.findOne({_id: component.componentParentIdNew});

                    let parentName = 'NONE';

                    if(parentComponent){
                        parentName = parentComponent.componentNameNew;
                    }

                    if(component.isNew) {
                        updateFunctionalAdditions.insert({
                            summaryType:            DesignUpdateSummaryType.SUMMARY_ADD,
                            summaryComponentType:   DesignUpdateSummaryItem.SUMMARY_FEATURE,
                            itemName:               component.componentNameNew,
                            itemType:               component.componentType,
                            itemParentName:         parentName,
                            itemSectionName:        ''
                        });
                    } else {
                        updateFunctionalRemovals.insert({
                            summaryType:            DesignUpdateSummaryType.SUMMARY_REMOVE,
                            summaryComponentType:   DesignUpdateSummaryItem.SUMMARY_FEATURE,
                            itemName:               component.componentNameNew,
                            itemType:               component.componentType,
                            itemParentName:         parentName,
                            itemSectionName:        ''
                        });
                    }
                    break;
                case ComponentType.SCENARIO:
                    // A scenario may be related to a Feature or to a Feature Aspect.  If the latter, the Feature is still
                    // the parent and the Aspect is the Section

                    parentComponent = DesignUpdateComponents.findOne({_id: component.componentParentIdNew});

                    if(parentComponent.componentType === ComponentType.FEATURE){
                        if(component.isNew) {
                            updateFunctionalAdditions.insert({
                                summaryType:            DesignUpdateSummaryType.SUMMARY_ADD,
                                summaryComponentType:   DesignUpdateSummaryItem.SUMMARY_SCENARIO_IN_FEATURE,
                                itemName:               component.componentNameNew,
                                itemType:               component.componentType,
                                itemParentName:         parentComponent.componentNameNew,
                                itemSectionName:        ''
                            });
                        } else {
                            updateFunctionalRemovals.insert({
                                summaryType:            DesignUpdateSummaryType.SUMMARY_REMOVE,
                                summaryComponentType:   DesignUpdateSummaryItem.SUMMARY_SCENARIO_IN_FEATURE,
                                itemName:               component.componentNameNew,
                                itemType:               component.componentType,
                                itemParentName:         parentComponent.componentNameNew,
                                itemSectionName:        ''
                            });
                        }
                    } else {
                        // This scenario is in a Feature aspect.  Get the Feature as the real parent
                        realParentComponent = DesignUpdateComponents.findOne({_id: parentComponent.componentParentIdNew});
                        if(component.isNew) {
                            updateFunctionalAdditions.insert({
                                summaryType:            DesignUpdateSummaryType.SUMMARY_ADD_TO,
                                summaryComponentType:   DesignUpdateSummaryItem.SUMMARY_SCENARIO_IN_ASPECT,
                                itemName:               component.componentNameNew,
                                itemType:               component.componentType,
                                itemParentName:         realParentComponent.componentNameNew,
                                itemSectionName:        parentComponent.componentNameNew
                            });
                        } else {
                            updateFunctionalRemovals.insert({
                                summaryType:            DesignUpdateSummaryType.SUMMARY_REMOVE_FROM,
                                summaryComponentType:   DesignUpdateSummaryItem.SUMMARY_SCENARIO_IN_ASPECT,
                                itemName:               component.componentNameNew,
                                itemType:               component.componentType,
                                itemParentName:         realParentComponent.componentNameNew,
                                itemSectionName:        parentComponent.componentNameNew
                            });
                        }
                    }


            }
        });

        // Get changed stuff -------------------------------------------------------------------------------------------

        const changedDesignComponents = DesignUpdateComponents.find({designUpdateId: designUpdateId, isNew: false, isRemoved: false, $or:[{isChanged: true}, {isTextChanged: true}]});

        console.log("Found " + changedDesignComponents.count() + " changed design components for design update " + designUpdateId);

        let updateFunctionalChanges = new Mongo.Collection(null);

        changedDesignComponents.forEach((component) => {
            switch (component.componentType) {
                case ComponentType.FEATURE:

                    parentComponent = DesignUpdateComponents.findOne({_id: component.componentParentIdNew});

                    updateFunctionalChanges.insert({
                        summaryType: DesignUpdateSummaryType.SUMMARY_CHANGE,
                        summaryComponentType: DesignUpdateSummaryItem.SUMMARY_FEATURE,
                        itemName: component.componentNameNew,
                        itemOldName: component.componentNameOld,
                        itemNewNarrative: component.componentNarrativeNew,
                        itemOldNarrative: component.componentNarrativeOld,
                        itemType: component.componentType,
                        itemParentName: parentComponent.componentNameNew,
                        itemSectionName: '',
                        hasTextChange: component.isTextChanged
                    });
                    break;
                case ComponentType.SCENARIO:
                    // A scenario may be related to a Feature or to a Feature Aspect.  If the latter, the Feature is still
                    // the parent and the Aspect is the Section

                    parentComponent = DesignUpdateComponents.findOne({_id: component.componentParentIdNew});

                    if (parentComponent.componentType === ComponentType.FEATURE) {

                        updateFunctionalChanges.insert({
                            summaryType: DesignUpdateSummaryType.SUMMARY_CHANGE,
                            summaryComponentType: DesignUpdateSummaryItem.SUMMARY_SCENARIO_IN_FEATURE,
                            itemName: component.componentNameNew,
                            itemOldName: component.componentNameOld,
                            itemType: component.componentType,
                            itemParentName: parentComponent.componentNameNew,
                            itemSectionName: '',
                            hasTextChange: component.isTextChanged
                        });

                    } else {
                        // This scenario is in a Feature aspect.  Get the Feature as the real parent
                        realParentComponent = DesignUpdateComponents.findOne({_id: parentComponent.componentParentIdNew});

                        updateFunctionalChanges.insert({
                            summaryType: DesignUpdateSummaryType.SUMMARY_CHANGE_IN,
                            summaryComponentType: DesignUpdateSummaryItem.SUMMARY_SCENARIO_IN_ASPECT,
                            itemName: component.componentNameNew,
                            itemOldName: component.componentNameOld,
                            itemType: component.componentType,
                            itemParentName: realParentComponent.componentNameNew,
                            itemSectionName: parentComponent.componentNameNew,
                            hasTextChange: component.isTextChanged
                        });

                    }
                    break;
            }
        });

        return {
            functionalAdditions: updateFunctionalAdditions.find({}).fetch(),
            functionalRemovals: updateFunctionalRemovals.find({}).fetch(),
            functionalChanges: updateFunctionalChanges.find({}).fetch()
        }

    }

}

export default new ClientDesignUpdateSummary();