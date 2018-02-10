import {
    ItemType, ComponentType, DesignStatus, DisplayContext, RoleType, ViewMode, ViewType,
    DesignUpdateStatus, DesignVersionStatus, WorkPackageStatus, WorkPackageTestStatus
} from "../constants/constants";

import ItemStatusUiModules from '../ui_modules/item_status.js';


import { chai } from 'meteor/practicalmeteor:chai';
import {shallow} from "enzyme/build/index";
import TextLookups from "../common/lookups";

describe('UI: Item Status', () => {

    // Design Status

    describe('Each Design in the list has its current status visible', () => {

        it('has status LIVE if live', () => {

            const currentItemType = ItemType.DESIGN;
            const currentItemStatus = DesignStatus.DESIGN_LIVE;
            const wpTestStatus = null;
            const adopterName = null;

            const expectation = 'ACTIVE DESIGN';

            const result = ItemStatusUiModules.getStatusString(currentItemType, currentItemStatus, wpTestStatus, adopterName);

            chai.assert.equal(result, expectation);
        });

        it('has status ARCHIVED if archived', () => {

            const currentItemType = ItemType.DESIGN;
            const currentItemStatus = DesignStatus.DESIGN_ARCHIVED;
            const wpTestStatus = null;
            const adopterName = null;

            const expectation = 'ARCHIVED DESIGN';

            const result = ItemStatusUiModules.getStatusString(currentItemType, currentItemStatus, wpTestStatus, adopterName);

            chai.assert.equal(result, expectation);
        });
    });

    // Design Version Status -------------------------------------------------------------------------------------------

    describe('The state of each Design Version is shown', () => {

        it('status visible for New', () => {

            const currentItemType = ItemType.DESIGN_VERSION;
            const currentItemStatus = DesignVersionStatus.VERSION_NEW;
            const wpTestStatus = null;
            const adopterName = null;

            const expectation = 'NEW';

            const result = ItemStatusUiModules.getStatusString(currentItemType, currentItemStatus, wpTestStatus, adopterName);

            chai.assert.equal(result, expectation);
        });

        it('status visible for Published', () => {

            const currentItemType = ItemType.DESIGN_VERSION;
            const currentItemStatus = DesignVersionStatus.VERSION_DRAFT;
            const wpTestStatus = null;
            const adopterName = null;

            const expectation = 'DRAFT';

            const result = ItemStatusUiModules.getStatusString(currentItemType, currentItemStatus, wpTestStatus, adopterName);

            chai.assert.equal(result, expectation);
        });

        it('status visible for Initial Complete', () => {

            const currentItemType = ItemType.DESIGN_VERSION;
            const currentItemStatus = DesignVersionStatus.VERSION_DRAFT_COMPLETE;
            const wpTestStatus = null;
            const adopterName = null;

            const expectation = 'INITIAL VERSION COMPLETED';

            const result = ItemStatusUiModules.getStatusString(currentItemType, currentItemStatus, wpTestStatus, adopterName);

            chai.assert.equal(result, expectation);
        });

        it('status visible for Updatable', () => {

            const currentItemType = ItemType.DESIGN_VERSION;
            const currentItemStatus = DesignVersionStatus.VERSION_UPDATABLE;
            const wpTestStatus = null;
            const adopterName = null;

            const expectation = 'UPDATABLE';

            const result = ItemStatusUiModules.getStatusString(currentItemType, currentItemStatus, wpTestStatus, adopterName);

            chai.assert.equal(result, expectation);
        });

        it('status visible for Updatable Complete', () => {

            const currentItemType = ItemType.DESIGN_VERSION;
            const currentItemStatus = DesignVersionStatus.VERSION_UPDATABLE_COMPLETE;
            const wpTestStatus = null;
            const adopterName = null;

            const expectation = 'UPDATABLE VERSION COMPLETED';

            const result = ItemStatusUiModules.getStatusString(currentItemType, currentItemStatus, wpTestStatus, adopterName);

            chai.assert.equal(result, expectation);
        });
    });


    // Update Status ---------------------------------------------------------------------------------------------------

    describe('The state of each Design Update is shown', () => {

        it('state shown for new update', () => {

            const currentItemType = ItemType.DESIGN_UPDATE;
            const currentItemStatus = DesignUpdateStatus.UPDATE_NEW;
            const wpTestStatus = null;
            const adopterName = null;

            const expectation = 'NEW';

            const result = ItemStatusUiModules.getStatusString(currentItemType, currentItemStatus, wpTestStatus, adopterName);

            chai.assert.equal(result, expectation);
        });

        it('state shown for published update', () => {

            const currentItemType = ItemType.DESIGN_UPDATE;
            const currentItemStatus = DesignUpdateStatus.UPDATE_PUBLISHED_DRAFT;
            const wpTestStatus = null;
            const adopterName = null;

            const expectation = 'DRAFT';

            const result = ItemStatusUiModules.getStatusString(currentItemType, currentItemStatus, wpTestStatus, adopterName);

            chai.assert.equal(result, expectation);
        });

        it('state shown for merged update', () => {

            const currentItemType = ItemType.DESIGN_UPDATE;
            const currentItemStatus = DesignUpdateStatus.UPDATE_MERGED;
            const wpTestStatus = null;
            const adopterName = null;

            const expectation = 'MERGED';

            const result = ItemStatusUiModules.getStatusString(currentItemType, currentItemStatus, wpTestStatus, adopterName);

            chai.assert.equal(result, expectation);
        });

        it('state shown for ignored update', () => {

            const currentItemType = ItemType.DESIGN_UPDATE;
            const currentItemStatus = DesignUpdateStatus.UPDATE_IGNORED;
            const wpTestStatus = null;
            const adopterName = null;

            const expectation = 'IGNORED';

            const result = ItemStatusUiModules.getStatusString(currentItemType, currentItemStatus, wpTestStatus, adopterName);

            chai.assert.equal(result, expectation);
        });
    });

    describe('The currently selected Work Package shows full details and options', () => {

        it('state shown for a new work package', () => {

            const currentItemType = ItemType.WORK_PACKAGE;
            const currentItemStatus = WorkPackageStatus.WP_NEW;
            const wpTestStatus = WorkPackageTestStatus.WP_TESTS_NOT_COMPLETE;
            const adopterName = 'NONE';

            const expectation = 'NEW';

            const result = ItemStatusUiModules.getStatusString(currentItemType, currentItemStatus, wpTestStatus, adopterName);

            chai.assert.equal(result, expectation);
        });

        it('state shown for an available work package', () => {

            const currentItemType = ItemType.WORK_PACKAGE;
            const currentItemStatus = WorkPackageStatus.WP_AVAILABLE;
            const wpTestStatus = WorkPackageTestStatus.WP_TESTS_NOT_COMPLETE;
            const adopterName = 'NONE';

            const expectation = 'AVAILABLE';

            const result = ItemStatusUiModules.getStatusString(currentItemType, currentItemStatus, wpTestStatus, adopterName);

            chai.assert.equal(result, expectation);
        });

        it('state shown for an adopted work package', () => {

            const currentItemType = ItemType.WORK_PACKAGE;
            const currentItemStatus = WorkPackageStatus.WP_ADOPTED;
            const wpTestStatus = WorkPackageTestStatus.WP_TESTS_NOT_COMPLETE;
            const adopterName = 'Hugh Genjin';

            const expectation = 'ADOPTED by Hugh Genjin';

            const result = ItemStatusUiModules.getStatusString(currentItemType, currentItemStatus, wpTestStatus, adopterName);

            chai.assert.equal(result, expectation);
        });

        it('state shown for a completed work package', () => {

            const currentItemType = ItemType.WORK_PACKAGE;
            const currentItemStatus = WorkPackageStatus.WP_ADOPTED;
            const wpTestStatus = WorkPackageTestStatus.WP_TESTS_COMPLETE;
            const adopterName = 'Hugh Genjin';

            const expectation = 'ADOPTED and COMPLETED by Hugh Genjin';

            const result = ItemStatusUiModules.getStatusString(currentItemType, currentItemStatus, wpTestStatus, adopterName);

            chai.assert.equal(result, expectation);
        });
    });

});