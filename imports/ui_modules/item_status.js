import {ItemType, WorkPackageStatus, WorkPackageTestStatus} from "../constants/constants";
import TextLookups from '../common/lookups.js';

class ItemStatusUiModules{

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
}

export default new ItemStatusUiModules();