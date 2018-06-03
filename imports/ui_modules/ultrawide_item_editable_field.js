import {
    ItemType,
    FieldType,
    DesignVersionStatus,
    RoleType,
    DesignUpdateStatus,
    WorkPackageStatus
} from "../constants/constants";


import {ClientDesignServices}           from "../apiClient/apiClientDesign";
import {ClientWorkPackageServices}      from "../apiClient/apiClientWorkPackage";
import {ClientDesignUpdateServices}     from "../apiClient/apiClientDesignUpdate";
import {ClientDesignVersionServices}    from "../apiClient/apiClientDesignVersion";

import React from 'react';

class UltrawideItemEditableFieldUiModulesClass {

    // MAIN API --------------------------------------------------------------------------------------------------------

    getComponentLayout(userRole, fieldType, itemType, statusClass, currentItemStatus, fieldEditing, fieldNotEditing, fieldReadOnly, editing){

        let titleClass = 'design-item-attribute ' + statusClass;

        switch(userRole){

            case RoleType.GUEST_VIEWER:

                // No editing allowed
                if(fieldType === FieldType.LINK){

                    // links not visible to Guest
                    return <div></div>;

                } else {

                    return (<div className={titleClass}>{fieldReadOnly}</div>);
                }


            case RoleType.DEVELOPER:

                // Developers are aware of new stuff but can't access it yet.  They cannot edit names or versions of things.
                if(currentItemStatus === DesignVersionStatus.VERSION_NEW || currentItemStatus === DesignUpdateStatus.UPDATE_NEW || currentItemStatus === WorkPackageStatus.WP_NEW){

                    titleClass = 'design-item-header greyed-out';
                    return (<div className={titleClass + ' ' + statusClass}>{fieldReadOnly}</div>);

                } else {

                    if(fieldType === FieldType.LINK){

                        // Developers can edit links
                        if(editing){
                            return (<div className={titleClass + ' ' + statusClass}>{fieldEditing}</div>);
                        } else {
                            return (<div className={titleClass + ' ' + statusClass}>{fieldNotEditing}</div>);
                        }

                    } else {

                        return (<div className={titleClass + ' ' + statusClass}>{fieldReadOnly}</div>);
                    }
                }




            case RoleType.MANAGER:

                // Managers can edit Work Packages
                if(itemType === ItemType.WORK_PACKAGE){
                    if (editing) {
                        return (<div className={titleClass + ' ' + statusClass}>{fieldEditing}</div>);
                    } else {
                        return (<div className={titleClass + ' ' + statusClass}>{fieldNotEditing}</div>);
                    }

                } else {

                    // Rest is same as for Developers
                    if(currentItemStatus === DesignVersionStatus.VERSION_NEW || currentItemStatus === DesignUpdateStatus.UPDATE_NEW || currentItemStatus === WorkPackageStatus.WP_NEW){

                        titleClass = 'design-item-header greyed-out';
                        return (<div className={titleClass + ' ' + statusClass}>{fieldReadOnly}</div>);

                    }else {

                        if(fieldType === FieldType.LINK){

                            // Managers can edit links
                            if(editing){
                                return (<div className={titleClass + ' ' + statusClass}>{fieldEditing}</div>);
                            } else {
                                return (<div className={titleClass + ' ' + statusClass}>{fieldNotEditing}</div>);
                            }

                        } else {

                            return (<div className={titleClass + ' ' + statusClass}>{fieldReadOnly}</div>);
                        }
                    }

                }

            case RoleType.DESIGNER:

                if(itemType === ItemType.WORK_PACKAGE){

                    // Designers can see WPs read only and new stuff is greyed out
                    if(currentItemStatus === DesignVersionStatus.VERSION_NEW || currentItemStatus === DesignUpdateStatus.UPDATE_NEW || currentItemStatus === WorkPackageStatus.WP_NEW){

                        titleClass = 'design-item-header greyed-out'
                    }

                    return (<div className={titleClass + ' ' + statusClass}>{fieldReadOnly}</div>);

                } else {

                    // Designers can edit anything else
                    if (editing) {
                        return (<div className={titleClass + ' ' + statusClass}>{fieldEditing}</div>);
                    } else {
                        return (<div className={titleClass + ' ' + statusClass}>{fieldNotEditing}</div>);
                    }

                }

            case RoleType.ADMIN:

                // Must be in the Designs List as those are the only items Admin can see
                return (<div className={titleClass + ' ' + statusClass}>{fieldReadOnly}</div>);

        }




    }


    // ACTION FUNCTIONS ------------------------------------------------------------------------------------------------

    saveFieldValue(userRole, currentItemType, fieldType, currentItemId, newValue){

        switch(currentItemType){
            case ItemType.DESIGN:

                switch(fieldType){
                    case FieldType.NAME:
                        ClientDesignServices.updateDesignName(userRole, currentItemId, newValue);
                        break;
                    default:
                        console.log('Invalid field type for Design: %s', fieldType);
                }
                break;

            case ItemType.DESIGN_VERSION:

                switch(fieldType){
                    case FieldType.NAME:
                        ClientDesignVersionServices.updateDesignVersionName(userRole, currentItemId, newValue);
                        break;
                    case FieldType.VERSION:
                        ClientDesignVersionServices.updateDesignVersionNumber(userRole, currentItemId, newValue);
                        break;
                    default:
                        console.log('Invalid field type for Design Version: %s', fieldType);
                }
                break;

            case ItemType.DESIGN_UPDATE:

                switch(fieldType){
                    case FieldType.NAME:
                        ClientDesignUpdateServices.updateDesignUpdateName(userRole, currentItemId, newValue);
                        break;
                    case FieldType.REFERENCE:
                        ClientDesignUpdateServices.updateDesignUpdateReference(userRole, currentItemId, newValue);
                        break;
                    default:
                        console.log('Invalid field type for Design Update: %s', fieldType);
                }
                break;

            case ItemType.WORK_PACKAGE:

                switch(fieldType){
                    case FieldType.NAME:
                        ClientWorkPackageServices.updateWorkPackageName(userRole, currentItemId, newValue);
                        break;
                    case FieldType.LINK:
                        ClientWorkPackageServices.updateWorkPackageLink(currentItemId, newValue);
                        break;
                    default:
                        console.log('Invalid field type for Work Package: %s', fieldType);
                }
                break;
        }
    }

}

export const UltrawideItemEditableFieldUiModules = new UltrawideItemEditableFieldUiModulesClass();