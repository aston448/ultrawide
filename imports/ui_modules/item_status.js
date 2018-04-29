import {ItemType, LogLevel, WorkPackageStatus, WorkPackageTestStatus} from "../constants/constants";
import TextLookups from '../common/lookups.js';
import {log} from "../common/utils";

class ItemStatusUiModulesClass {

    getStatusString(currentItemType, currentItemStatus, wpTestStatus, adopterName){

        switch(currentItemType){

            case ItemType.DESIGN:

                return TextLookups.designStatus(currentItemStatus);

            case ItemType.DESIGN_VERSION:

                return TextLookups.designVersionStatus(currentItemStatus);

            case ItemType.DESIGN_UPDATE:

                return TextLookups.designUpdateStatus(currentItemStatus);

            case ItemType.WORK_PACKAGE:

                if(currentItemStatus === WorkPackageStatus.WP_ADOPTED) {

                    const adopter = ' by ' + adopterName;

                    if (wpTestStatus === WorkPackageTestStatus.WP_TESTS_COMPLETE) {

                        return TextLookups.workPackageStatus(currentItemStatus) + ' and COMPLETED' + adopter;

                    } else {

                        return TextLookups.workPackageStatus(currentItemStatus) + adopter;

                    }

                } else {

                    return TextLookups.workPackageStatus(currentItemStatus)
                }
        }
    }
    
    shouldItemWrapperUpdate(props, nextProps){
        
        let shouldUpdate = false;


        let itemStatusNew = '';
        let itemStatusOld = '';
        let itemNameNew = '';
        let itemNameOld = '';
        let itemRefNew = '';
        let itemRefOld = '';

        switch(props.itemType){
            case ItemType.DESIGN:
                itemStatusNew = nextProps.item.designStatus;
                itemStatusOld = props.item.designStatus;
                itemNameNew = nextProps.item.designName;
                itemNameOld = props.item.designName;
                break;
            case ItemType.DESIGN_VERSION:
                itemStatusNew = nextProps.item.designVersionStatus;
                itemStatusOld = props.item.designVersionStatus;
                itemNameNew = nextProps.item.designVersionName;
                itemNameOld = props.item.designVersionName;
                itemRefNew = nextProps.item.designVersionNumber;
                itemRefOld = props.item.designVersionNumber;
                break;
            case ItemType.DESIGN_UPDATE:
                itemStatusNew = nextProps.item.updateStatus;
                itemStatusOld = props.item.updateStatus;
                itemNameNew = nextProps.item.updateName;
                itemNameOld = props.item.updateName;
                itemRefNew = nextProps.item.updateReference;
                itemRefOld = props.item.updateReference;
                break;
            case ItemType.WORK_PACKAGE:
                itemStatusNew = nextProps.item.workPackageStatus;
                itemStatusOld = props.item.workPackageStatus;
                itemNameNew = nextProps.item.workPackageName;
                itemNameOld = props.item.workPackageName;
                itemRefNew = nextProps.item.workPackageLink;
                itemRefOld = props.item.workPackageLink;
                break;
        }

        if(
            itemStatusNew !== itemStatusOld ||
            itemNameNew !== itemNameOld ||
            itemRefNew !== itemRefOld ||
            nextProps.userContext.designId !== props.userContext.designId ||
            nextProps.userContext.designVersionId !== props.userContext.designVersionId ||
            nextProps.userContext.designUpdateId !== props.userContext.designUpdateId ||
            nextProps.userContext.workPackageId !== props.userContext.workPackageId
        ){

            shouldUpdate = true;
        }

        log((msg) => console.log(msg), LogLevel.PERF, 'Wrapper {} should update {}', props.itemType, shouldUpdate);

        return shouldUpdate;
    }
}

export const ItemStatusUiModules = new ItemStatusUiModulesClass();