/**
 * Created by aston on 05/12/2016.
 */

import { Designs }                  from '../../imports/collections/design/designs.js';
import { DesignVersions }           from '../../imports/collections/design/design_versions.js';
import { DesignUpdates }            from '../../imports/collections/design_update/design_updates.js';
import { WorkPackages }             from '../../imports/collections/work/work_packages.js';
import { DesignComponents }         from '../../imports/collections/design/design_components.js';
import { DesignUpdateComponents }   from '../../imports/collections/design_update/design_update_components.js';
import { WorkPackageComponents }    from '../../imports/collections/work/work_package_components.js';
import { UserCurrentEditContext }   from '../../imports/collections/context/user_current_edit_context.js';
import { UserCurrentViewOptions }   from '../../imports/collections/context/user_current_view_options.js';
import { UserRoles }                from '../../imports/collections/users/user_roles.js';

import {RoleType, ViewType, ViewMode, DisplayContext, ComponentType} from '../../imports/constants/constants.js';

class TestDataHelpers {

    getUserContext(userName){

        const user = UserRoles.findOne({userName: userName});
        if(!user){
            throw new Meteor.Error("FAIL", "User " + userName + " not found.");
        }

        const userContext = UserCurrentEditContext.findOne({userId: user.userId});
        if(!userContext){
            throw new Meteor.Error("FAIL", "User Context not found for " + userName);
        }

        return userContext;

    };

    getViewOptions(userName){

        const user = UserRoles.findOne({userName: userName});
        if(!user){
            throw new Meteor.Error("FAIL", "User " + userName + " not found.");
        }

        const viewOptions = UserCurrentViewOptions.findOne({userId: user.userId});
        if(!viewOptions){
            throw new Meteor.Error("FAIL", "View Options not found for " + userName);
        }

        return viewOptions;
    }

    getDesign(designName){

        const design = Designs.findOne({designName: designName});
        if(!design){
            throw new Meteor.Error("FAIL", "Design " + designName + " not found.");
        }

        return design;
    };

    getDesignVersion(designId, designVersionName){

        const designVersion = DesignVersions.findOne({designId: designId, designVersionName: designVersionName});
        const design = Designs.findOne({_id: designId});

        if(!designVersion){
            throw new Meteor.Error("FAIL", "Design Version " + designVersionName + " not found for Design " + design.designName);
        }

        return designVersion;
    };

    getDesignUpdate(designVersionId, designUpdateName){

        const designVersion = DesignVersions.findOne({_id: designVersionId});
        const designUpdate = DesignUpdates.findOne({designVersionId: designVersionId, updateName: designUpdateName});

        if(!designUpdate){
            throw new Meteor.Error("FAIL", "Design Update " + designUpdateName + " not found for Design Version " + designVersion.designVersionName);
        }

        return designVersion;
    }

    getWorkPackage(designVersionId, designUpdateId, workPackageName){

        const designVersion = DesignVersions.findOne({_id: designVersionId});
        let designUpdateName = 'NONE';
        if(designUpdateId != 'NONE'){
            designUpdateName = DesignUpdates.findOne({_id: designUpdateId}).updateName;
        }

        const workPackage = WorkPackages.findOne({
            designVersionId: designVersionId,
            designUpdateId: designUpdateId,
            workPackageName: workPackageName});

        if(!workPackage){
            throw new Meteor.Error("FAIL", "Work Package " + workPackageName + " not found for Design Version " + designVersion.designVersionName + " and Design Update " + designUpdateName);
        }

        return workPackage;
    };

    getDesignComponent(designVersionId, designUpdateId, componentName){

        let designComponent = null;
        let designUpdateName = 'NONE';
        const designVersion = DesignVersions.findOne({_id: designVersionId});

        if(designUpdateId === 'NONE'){
            designComponent = DesignComponents.findOne({
                designVersionId: designVersionId,
                componentName:  componentName
            });

        } else {
            designComponent = DesignUpdateComponents.findOne({
                designVersionId: designVersionId,
                designUpdateId: designUpdateId,
                componentNameNew:  componentName
            });
            designUpdateName = DesignUpdates.findOne({_id: designUpdateId}).updateName;
        }

        if(!designComponent){
            throw new Meteor.Error("FAIL", "Design Component " + componentName + " not found for Design Version " + designVersion.designVersionName + " and Design Update " + designUpdateName);
        }

        return designComponent;

    };

    getWorkPackageComponentWithParent(designVersionId, designUpdateId, workPackageId, componentType, componentParentName, componentName){
        // Allows us to get a component by combination of name and parent name - so we can get Feature Aspects successfully
        let designComponents = [];
        let designComponent = null;
        let parentComponent = null;
        let designComponentRef = '';
        let designUpdateName = 'NONE';
        const designVersion = DesignVersions.findOne({_id: designVersionId});
        const workPackage = WorkPackages.findOne({_id: workPackageId});

        if(designUpdateId === 'NONE'){
            designComponents = DesignComponents.find({
                designVersionId: designVersionId,
                componentType: componentType,
                componentName:  componentName
            }).fetch();

            // Get the component that has the expected parent for Feature Aspects or Design Sections
            if(componentType === ComponentType.DESIGN_SECTION || componentType === ComponentType.FEATURE_ASPECT) {
                designComponents.forEach((component) => {

                    let parentComponent = DesignComponents.findOne({
                        _id: component.componentParentId
                    });


                    if (parentComponent.componentName === componentParentName) {
                        designComponent = component;
                    }

                });
            } else {
                // Names are unique so assume only one
                designComponent = designComponents[0];
            }

        } else {
            designComponents = DesignUpdateComponents.find({
                designVersionId: designVersionId,
                designUpdateId: designUpdateId,
                componentType: componentType,
                componentNameNew:  componentName
            }).fetch();

            // Get the component that has the expected parent for Feature Aspects or Design Sections
            if(componentType === ComponentType.DESIGN_SECTION || componentType === ComponentType.FEATURE_ASPECT) {
                designComponents.forEach((component) => {

                    let parentComponent = DesignUpdateComponents.findOne({
                        _id: component.componentParentIdNew
                    });

                    if (parentComponent.componentNameNew === componentParentName) {
                        designComponent = component;
                    } else {
                        if(componentParentName === 'NONE'){
                            designComponent = component;
                        }
                    }

                });
            } else {
                // Names are unique so assume only one
                designComponent = designComponents[0];
            }

            designUpdateName = DesignUpdates.findOne({_id: designUpdateId}).updateName;
        }

        if(designComponent){
            designComponentRef = designComponent.componentReferenceId;
        } else {
            throw new Meteor.Error("FAIL", "Design Component " + componentName + " not found for Design Version " + designVersion.designVersionName + " and Design Update " + designUpdateName);
        }

        const workPackageComponent = WorkPackageComponents.findOne({
            designVersionId: designVersionId,
            workPackageId: workPackageId,
            componentReferenceId: designComponentRef
        });

        if(!workPackageComponent){
            throw new Meteor.Error("FAIL", "Work Package Component " + componentName + " not found for Design Version " + designVersion.designVersionName + " and Design Update " + designUpdateName + " and Work Package " + workPackage.workPackageName);
        }

        return workPackageComponent;

    };

    getWorkPackageComponentParentName(designVersionId, designUpdateId, workPackageId, componentType, componentName){

        let designComponent = null;
        let designComponentParentRef = '';
        let parentComponent = null;
        let designUpdateName = 'NONE';
        let parentComponentName = '';
        const designVersion = DesignVersions.findOne({_id: designVersionId});
        const workPackage = WorkPackages.findOne({_id: workPackageId});

        if(designUpdateId === 'NONE'){
            designComponent = DesignComponents.findOne({
                designVersionId: designVersionId,
                componentType: componentType,
                componentName:  componentName
            });

            if(designComponent){
                designComponentParentRef = designComponent.componentParentReferenceId;
            } else {
                throw new Meteor.Error("FAIL", "Design Component " + componentName + " not found for Design Version " + designVersion.designVersionName + " and Design Update " + designUpdateName);
            }

            if(designComponentParentRef === 'NONE'){
                return 'NONE';
            } else {
                parentComponent = DesignComponents.findOne({
                    designVersionId: designVersionId,
                    componentReferenceId: designComponentParentRef
                });

                if(parentComponent){
                    return parentComponent.componentName;
                } else {
                    return 'NONE';
                }
            }

        } else {
            designComponent = DesignUpdateComponents.findOne({
                designVersionId: designVersionId,
                designUpdateId: designUpdateId,
                componentType: componentType,
                componentNameNew:  componentName
            });
            designUpdateName = DesignUpdates.findOne({_id: designUpdateId}).updateName;
            if(designComponent){
                designComponentParentRef = designComponent.componentParentReferenceIdNew;
            } else {
                throw new Meteor.Error("FAIL", "Design Component " + componentName + " not found for Design Version " + designVersion.designVersionName + " and Design Update " + designUpdateName);
            }

            if(designComponentParentRef === 'NONE'){
                return 'NONE';
            } else {
                parentComponent = DesignUpdateComponents.findOne({
                    designVersionId: designVersionId,
                    designUpdateId: designUpdateId,
                    componentReferenceId: designComponentParentRef
                });

                if(parentComponent){
                    return parentComponent.componentNameNew;
                } else {
                    return 'NONE';
                }
            }
        }


    }

}

export default new TestDataHelpers();