import {DesignVersionStatus, ItemType, LogLevel, RoleType, WorkPackageType} from "../constants/constants";
import {AddActionIds} from "../constants/ui_context_ids";
import ClientWorkPackageServices from "../apiClient/apiClientWorkPackage";
import {log} from "../common/utils";
import React, { Component } from 'react';
import ItemWrapper                  from '../../imports/ui/components/select/ItemWrapper.jsx';

class WorkPackageContainerUiModules{

    onAddWorkPackage(userRole, userContext, wpType, openWpItems){

        ClientWorkPackageServices.addNewWorkPackage(userRole, userContext, wpType, openWpItems);

    }

    displayNote(noteText){
        return <div className="design-item-note">{noteText}</div>;
    }

    displayNothing(){
        return <div></div>;
    }

    renderWorkPackagesList(workPackages){
        if(workPackages.length > 0) {
            return workPackages.map((workPackage) => {
                return (
                    <ItemWrapper
                        key={workPackage._id}
                        itemType={ItemType.WORK_PACKAGE}
                        item={workPackage}
                    />
                );
            });
        }
    }

    renderNewWorkPackageLists(newWorkPackages, availableWorkPackages){

        return [
            this.renderWorkPackagesList(newWorkPackages),
            this.renderWorkPackagesList(availableWorkPackages)
        ]
    }


    getFooterDetails(designVersionName, designVersionStatus, userRole, userContext, wpType, openWpItems){


        let footerActionFunction = null;
        let hasFooterAction = false;
        const footerAction = 'Add Work Package to Design Version: ' + designVersionName;
        const footerActionUiContextId = AddActionIds.UI_CONTEXT_ADD_WORK_PACKAGE;
        const footerText = 'for Design Version: ' + designVersionName;

        // Add WP available to Managers for Base DVs
        if(userRole === RoleType.MANAGER  && wpType === WorkPackageType.WP_BASE) {

            // And for Design Versions only of they are Draft
            if(designVersionStatus === DesignVersionStatus.VERSION_DRAFT) {
                hasFooterAction = true;

                footerActionFunction = () => this.onAddWorkPackage(
                    userRole,
                    userContext,
                    wpType,
                    openWpItems
                );
            }
        }

        return{
            footerActionFunction: footerActionFunction,
            footerAction: footerAction,
            hasFooterAction: hasFooterAction,
            footerActionUiContextId: footerActionUiContextId,
            footerText: footerText
        }
    }

    getBodyDetails(userContext, userRole, designVersionStatus, newWorkPackages, availableWorkPackages, adoptedWorkPackages, completedWorkPackages){

        let bodyDataFunction1 = () => this.displayNothing();
        let bodyDataFunction2 = () => this.displayNothing();
        let bodyDataFunction3 = () => this.displayNothing();

        let headerText1 = '';
        let headerText2 = '';
        let headerText3 = '';

        let tabText1 = '';
        let tabText2 = '';
        let tabText3 = '';

        const wpsNotAppropriate = 'Work Packages may only be added to a Draft design version...';
        const NO_WORK_PACKAGES = 'No Work Packages';
        const selectDesignUpdate = 'Select a Design Update';

        // When a design version is selected...
        if(userContext.designVersionId){

            switch(designVersionStatus){

                case DesignVersionStatus.VERSION_NEW:

                    // No work packages available and none can be added...

                    tabText1 = 'AVAILABLE';
                    headerText1 = 'Available Work Packages';
                    if(userRole === RoleType.MANAGER){
                        bodyDataFunction1 = () => this.displayNote(wpsNotAppropriate);
                    } else {
                        bodyDataFunction1 = () => this.displayNote(NO_WORK_PACKAGES);
                    }

                    tabText2 = 'ADOPTED';
                    headerText2 = 'Adopted Work Packages';
                    bodyDataFunction2 = () => this.displayNote(NO_WORK_PACKAGES);

                    tabText3 = 'COMPLETED';
                    headerText3 = 'Completed Work Packages';
                    bodyDataFunction3 = () => this.displayNote(NO_WORK_PACKAGES);

                    break;

                case DesignVersionStatus.VERSION_DRAFT:
                case DesignVersionStatus.VERSION_DRAFT_COMPLETE:
                case DesignVersionStatus.VERSION_UPDATABLE:
                case DesignVersionStatus.VERSION_UPDATABLE_COMPLETE:

                    tabText1 = 'AVAILABLE';
                    headerText1 = 'Available Work Packages';
                    if(newWorkPackages.length === 0 && availableWorkPackages.length === 0){

                        bodyDataFunction1 = () => this.displayNote(NO_WORK_PACKAGES);

                    } else {

                        bodyDataFunction1 = () => this.renderNewWorkPackageLists(newWorkPackages, availableWorkPackages);

                    }

                    tabText2 = 'ADOPTED';
                    headerText2 = 'Adopted Work Packages';
                    if(userRole === RoleType.DEVELOPER){
                        headerText2 = 'My Adopted Work Packages';
                    }
                    if(adoptedWorkPackages.length === 0){

                        bodyDataFunction2 = () => this.displayNote(NO_WORK_PACKAGES);
                    } else {

                        bodyDataFunction2 = () => this.renderWorkPackagesList(adoptedWorkPackages);
                    }

                    tabText3 = 'COMPLETED';
                    headerText3 = 'Completed Work Packages';
                    if(userRole === RoleType.DEVELOPER){
                        headerText3 = 'My Completed Work Packages';
                    }
                    if(completedWorkPackages.length === 0){

                        bodyDataFunction3 = () => this.displayNote(NO_WORK_PACKAGES);
                    } else {

                        bodyDataFunction3 = () => this.renderWorkPackagesList(completedWorkPackages);
                    }

                    break;

                default:
                    log((msg) => console.log(msg), LogLevel.ERROR, "Unknown Design Version Status: {}", designVersionStatus);
            }
        } else {
            bodyDataFunction1 = () => this.displayNote(NO_WORK_PACKAGES);
        }

        return{
            bodyDataFunction1: bodyDataFunction1,
            bodyDataFunction2: bodyDataFunction2,
            bodyDataFunction3: bodyDataFunction3,
            headerText1: headerText1,
            headerText2: headerText2,
            headerText3: headerText3,
            tabText1: tabText1,
            tabText2: tabText2,
            tabText3: tabText3
        }

    }
}

export default new WorkPackageContainerUiModules();