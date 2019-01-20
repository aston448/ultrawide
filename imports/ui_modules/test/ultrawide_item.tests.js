import {
    ItemType,
    FieldType,
    DesignStatus,
    DesignVersionStatus,
    DesignUpdateStatus,
    RoleType,
    ViewMode,
    ViewType,
    WorkPackageType,
    DesignUpdateMergeAction,
    DesignUpdateWpStatus,
    DesignUpdateTestStatus,
    DuWorkPackageTestStatus,
    WorkPackageStatus, WorkPackageTestStatus
} from "../../constants/constants";

import { UI }           from "../../constants/ui_context_ids";
import { hashID }    from "../../common/utils";

import { UltrawideItemUiModules } from '../ultrawide_item.js';

import { shallow, render } from 'enzyme';
import { chai } from 'meteor/practicalmeteor:chai';

describe('UI Mods: UW Item', () => {

    function testLayout(itemType, itemData, userContext, userRole) {

        const layout = UltrawideItemUiModules.getComponentLayout(itemType, itemData, userContext, userRole);

        return render(layout);

    }

    function testUpdate(itemType, oldItem, newItem, oldContext, newContext){

        const oldProps = {
            itemType:       itemType,
            item:           oldItem,
            userContext:    oldContext
        };

        const newProps = {
            itemType:       itemType,
            item:           newItem,
            userContext:    newContext
        };

        return UltrawideItemUiModules.updateRequired(newProps, oldProps, null, null);
    }

    // Performance Tests (Component Update) ----------------------------------------------------------------------------

    describe('NFR', () => {

        // DESIGN

        describe('Component update is allowed for Design when details change', () => {

            it('update allowed on name change', () => {

                const itemType = ItemType.DESIGN;

                const oldItem = {
                    _id:            'DESIGN_01',
                    designStatus:   DesignStatus.DESIGN_LIVE,
                    designName:     'Design1'
                };

                const newItem = {
                    _id:            'DESIGN_01',
                    designStatus:   DesignStatus.DESIGN_LIVE,
                    designName:     'Design11'
                };

                const oldContext = {
                    designId:       'DESIGN_01'
                };

                const newContext = {
                    designId:       'DESIGN_01'
                };

                const shouldUpdate = testUpdate(itemType, oldItem, newItem, oldContext, newContext);

                chai.assert.isTrue(shouldUpdate, 'Update was expected');
            });

            it('update allowed on status change', () => {

                const itemType = ItemType.DESIGN;

                const oldItem = {
                    _id:            'DESIGN_01',
                    designStatus:   DesignStatus.DESIGN_LIVE,
                    designName:     'Design1'
                };

                const newItem = {
                    _id:            'DESIGN_01',
                    designStatus:   DesignStatus.DESIGN_ARCHIVED,
                    designName:     'Design1'
                };

                const oldContext = {
                    designId:       'DESIGN_01'
                };

                const newContext = {
                    designId:       'DESIGN_01'
                };

                const shouldUpdate = testUpdate(itemType, oldItem, newItem, oldContext, newContext);

                chai.assert.isTrue(shouldUpdate, 'Update was expected');
            });

        });

        describe('Component update is allowed for Design when it is selected or deselected', () => {

            it('update allowed on selection', () => {

                const itemType = ItemType.DESIGN;

                const oldItem = {
                    _id:            'DESIGN_01',
                    designStatus:   DesignStatus.DESIGN_LIVE,
                    designName:     'Design1'
                };

                const newItem = {
                    _id:            'DESIGN_01',
                    designStatus:   DesignStatus.DESIGN_LIVE,
                    designName:     'Design1'
                };

                const oldContext = {
                    designId:       'DESIGN_02'
                };

                const newContext = {
                    designId:       'DESIGN_01'
                };

                const shouldUpdate = testUpdate(itemType, oldItem, newItem, oldContext, newContext);

                chai.assert.isTrue(shouldUpdate, 'Update was expected');
            });

            it('update allowed on de-selection', () => {

                const itemType = ItemType.DESIGN;

                const oldItem = {
                    _id:            'DESIGN_01',
                    designStatus:   DesignStatus.DESIGN_LIVE,
                    designName:     'Design1'
                };

                const newItem = {
                    _id:            'DESIGN_01',
                    designStatus:   DesignStatus.DESIGN_LIVE,
                    designName:     'Design1'
                };

                const oldContext = {
                    designId:       'DESIGN_01'
                };

                const newContext = {
                    designId:       'DESIGN_02'
                };

                const shouldUpdate = testUpdate(itemType, oldItem, newItem, oldContext, newContext);

                chai.assert.isTrue(shouldUpdate, 'Update was expected');
            });
        });

        // DESIGN VERSION

        describe('Component update is allowed for Design Version when details change', () => {

            it('update allowed on name change', () => {

                const itemType = ItemType.DESIGN_VERSION;

                const oldItem = {
                    _id:                    'DESIGN_VERSION_01',
                    designId:               'DESIGN_01',
                    designVersionStatus:    DesignVersionStatus.VERSION_DRAFT,
                    designVersionName:      'DesignVersion1',
                    designVersionNumber:    '01'
                };

                const newItem = {
                    _id:                    'DESIGN_VERSION_01',
                    designId:               'DESIGN_01',
                    designVersionStatus:    DesignVersionStatus.VERSION_DRAFT,
                    designVersionName:      'DesignVersion11',
                    designVersionNumber:    '01'
                };

                const oldContext = {
                    designId:           'DESIGN_01',
                    designVersionId:    'DESIGN_VERSION_01'
                };

                const newContext = {
                    designId:           'DESIGN_01',
                    designVersionId:    'DESIGN_VERSION_01'
                };

                const shouldUpdate = testUpdate(itemType, oldItem, newItem, oldContext, newContext);

                chai.assert.isTrue(shouldUpdate, 'Update was expected');
            });

            it('update allowed on version change', () => {

                const itemType = ItemType.DESIGN_VERSION;

                const oldItem = {
                    _id:                    'DESIGN_VERSION_01',
                    designId:               'DESIGN_01',
                    designVersionStatus:    DesignVersionStatus.VERSION_DRAFT,
                    designVersionName:      'DesignVersion1',
                    designVersionNumber:    '01'
                };

                const newItem = {
                    _id:                    'DESIGN_VERSION_01',
                    designId:               'DESIGN_01',
                    designVersionStatus:    DesignVersionStatus.VERSION_DRAFT,
                    designVersionName:      'DesignVersion1',
                    designVersionNumber:    '011'
                };

                const oldContext = {
                    designId:           'DESIGN_01',
                    designVersionId:    'DESIGN_VERSION_01'
                };

                const newContext = {
                    designId:           'DESIGN_01',
                    designVersionId:    'DESIGN_VERSION_01'
                };

                const shouldUpdate = testUpdate(itemType, oldItem, newItem, oldContext, newContext);

                chai.assert.isTrue(shouldUpdate, 'Update was expected');
            });

            it('update allowed on status change', () => {

                const itemType = ItemType.DESIGN_VERSION;

                const oldItem = {
                    _id:                    'DESIGN_VERSION_01',
                    designId:               'DESIGN_01',
                    designVersionStatus:    DesignVersionStatus.VERSION_NEW,
                    designVersionName:      'DesignVersion1',
                    designVersionNumber:    '01'
                };

                const newItem = {
                    _id:                    'DESIGN_VERSION_01',
                    designId:               'DESIGN_01',
                    designVersionStatus:    DesignVersionStatus.VERSION_DRAFT,
                    designVersionName:      'DesignVersion1',
                    designVersionNumber:    '01'
                };

                const oldContext = {
                    designId:           'DESIGN_01',
                    designVersionId:    'DESIGN_VERSION_01'
                };

                const newContext = {
                    designId:           'DESIGN_01',
                    designVersionId:    'DESIGN_VERSION_01'
                };

                const shouldUpdate = testUpdate(itemType, oldItem, newItem, oldContext, newContext);

                chai.assert.isTrue(shouldUpdate, 'Update was expected');
            });

        });

        describe('Component update is allowed for Design Version when it is selected or deselected', () => {

            it('update allowed on selection', () => {

                const itemType = ItemType.DESIGN_VERSION;

                const oldItem = {
                    _id:                    'DESIGN_VERSION_01',
                    designId:               'DESIGN_01',
                    designVersionStatus:    DesignVersionStatus.VERSION_DRAFT,
                    designVersionName:      'DesignVersion1',
                    designVersionNumber:    '01'
                };

                const newItem = {
                    _id:                    'DESIGN_VERSION_01',
                    designId:               'DESIGN_01',
                    designVersionStatus:    DesignVersionStatus.VERSION_DRAFT,
                    designVersionName:      'DesignVersion1',
                    designVersionNumber:    '01'
                };

                const oldContext = {
                    designId:           'DESIGN_01',
                    designVersionId:    'DESIGN_VERSION_02'
                };

                const newContext = {
                    designId:           'DESIGN_01',
                    designVersionId:    'DESIGN_VERSION_01'
                };

                const shouldUpdate = testUpdate(itemType, oldItem, newItem, oldContext, newContext);

                chai.assert.isTrue(shouldUpdate, 'Update was expected');
            });

            it('update allowed on de-selection', () => {

                const itemType = ItemType.DESIGN_VERSION;

                const oldItem = {
                    _id:                    'DESIGN_VERSION_01',
                    designId:               'DESIGN_01',
                    designVersionStatus:    DesignVersionStatus.VERSION_DRAFT,
                    designVersionName:      'DesignVersion1',
                    designVersionNumber:    '01'
                };

                const newItem = {
                    _id:                    'DESIGN_VERSION_01',
                    designId:               'DESIGN_01',
                    designVersionStatus:    DesignVersionStatus.VERSION_DRAFT,
                    designVersionName:      'DesignVersion1',
                    designVersionNumber:    '01'
                };

                const oldContext = {
                    designId:           'DESIGN_01',
                    designVersionId:    'DESIGN_VERSION_01'
                };

                const newContext = {
                    designId:           'DESIGN_01',
                    designVersionId:    'DESIGN_VERSION_02'
                };

                const shouldUpdate = testUpdate(itemType, oldItem, newItem, oldContext, newContext);

                chai.assert.isTrue(shouldUpdate, 'Update was expected');
            });
        });

        // DESIGN UPDATE

        describe('Component update is allowed for Design Update when details change', () => {

            it('update allowed on name change', () => {

                const itemType = ItemType.DESIGN_UPDATE;

                const oldItem = {
                    _id:                    'DESIGN_UPDATE_01',
                    designVersionId:        'DESIGN_VERSION_01',
                    updateStatus:           DesignUpdateStatus.UPDATE_PUBLISHED_DRAFT,
                    updateName:             'DesignUpdate1',
                    updateReference:        'CR001'
                };

                const newItem = {
                    _id:                    'DESIGN_UPDATE_01',
                    designVersionId:        'DESIGN_VERSION_01',
                    updateStatus:           DesignUpdateStatus.UPDATE_PUBLISHED_DRAFT,
                    updateName:             'DesignUpdate11',
                    updateReference:        'CR001'
                };

                const oldContext = {
                    designId:           'DESIGN_01',
                    designVersionId:    'DESIGN_VERSION_01',
                    designUpdateId:     'DESIGN_UPDATE_01'
                };

                const newContext = {
                    designId:           'DESIGN_01',
                    designVersionId:    'DESIGN_VERSION_01',
                    designUpdateId:     'DESIGN_UPDATE_01'
                };

                const shouldUpdate = testUpdate(itemType, oldItem, newItem, oldContext, newContext);

                chai.assert.isTrue(shouldUpdate, 'Update was expected');
            });

            it('update allowed on reference change', () => {

                const itemType = ItemType.DESIGN_UPDATE;

                const oldItem = {
                    _id:                    'DESIGN_UPDATE_01',
                    designVersionId:        'DESIGN_VERSION_01',
                    updateStatus:           DesignUpdateStatus.UPDATE_PUBLISHED_DRAFT,
                    updateName:             'DesignUpdate1',
                    updateReference:        'CR001'
                };

                const newItem = {
                    _id:                    'DESIGN_UPDATE_01',
                    designVersionId:        'DESIGN_VERSION_01',
                    updateStatus:           DesignUpdateStatus.UPDATE_PUBLISHED_DRAFT,
                    updateName:             'DesignUpdate1',
                    updateReference:        'CR002'
                };

                const oldContext = {
                    designId:           'DESIGN_01',
                    designVersionId:    'DESIGN_VERSION_01',
                    designUpdateId:     'DESIGN_UPDATE_01'
                };

                const newContext = {
                    designId:           'DESIGN_01',
                    designVersionId:    'DESIGN_VERSION_01',
                    designUpdateId:     'DESIGN_UPDATE_01'
                };

                const shouldUpdate = testUpdate(itemType, oldItem, newItem, oldContext, newContext);

                chai.assert.isTrue(shouldUpdate, 'Update was expected');
            });

            it('update allowed on status change', () => {

                const itemType = ItemType.DESIGN_UPDATE;

                const oldItem = {
                    _id:                    'DESIGN_UPDATE_01',
                    designVersionId:        'DESIGN_VERSION_01',
                    updateStatus:           DesignUpdateStatus.UPDATE_NEW,
                    updateName:             'DesignUpdate1',
                    updateReference:        'CR001'
                };

                const newItem = {
                    _id:                    'DESIGN_UPDATE_01',
                    designVersionId:        'DESIGN_VERSION_01',
                    updateStatus:           DesignUpdateStatus.UPDATE_PUBLISHED_DRAFT,
                    updateName:             'DesignUpdate1',
                    updateReference:        'CR001'
                };

                const oldContext = {
                    designId:           'DESIGN_01',
                    designVersionId:    'DESIGN_VERSION_01',
                    designUpdateId:     'DESIGN_UPDATE_01'
                };

                const newContext = {
                    designId:           'DESIGN_01',
                    designVersionId:    'DESIGN_VERSION_01',
                    designUpdateId:     'DESIGN_UPDATE_01'
                };

                const shouldUpdate = testUpdate(itemType, oldItem, newItem, oldContext, newContext);

                chai.assert.isTrue(shouldUpdate, 'Update was expected');
            });

        });

        describe('Component update is allowed for Design Update when it is selected or deselected', () => {

            it('update allowed on selection', () => {

                const itemType = ItemType.DESIGN_UPDATE;

                const oldItem = {
                    _id:                    'DESIGN_UPDATE_01',
                    designVersionId:        'DESIGN_VERSION_01',
                    updateStatus:           DesignUpdateStatus.UPDATE_PUBLISHED_DRAFT,
                    updateName:             'DesignUpdate1',
                    updateReference:        'CR001'
                };

                const newItem = {
                    _id:                    'DESIGN_UPDATE_01',
                    designVersionId:        'DESIGN_VERSION_01',
                    updateStatus:           DesignUpdateStatus.UPDATE_PUBLISHED_DRAFT,
                    updateName:             'DesignUpdate1',
                    updateReference:        'CR001'
                };

                const oldContext = {
                    designId:           'DESIGN_01',
                    designVersionId:    'DESIGN_VERSION_01',
                    designUpdateId:     'DESIGN_UPDATE_02'
                };

                const newContext = {
                    designId:           'DESIGN_01',
                    designVersionId:    'DESIGN_VERSION_01',
                    designUpdateId:     'DESIGN_UPDATE_01'
                };

                const shouldUpdate = testUpdate(itemType, oldItem, newItem, oldContext, newContext);

                chai.assert.isTrue(shouldUpdate, 'Update was expected');
            });

            it('update allowed on de-selection', () => {

                const itemType = ItemType.DESIGN_UPDATE;

                const oldItem = {
                    _id:                    'DESIGN_UPDATE_01',
                    designVersionId:        'DESIGN_VERSION_01',
                    updateStatus:           DesignUpdateStatus.UPDATE_PUBLISHED_DRAFT,
                    updateName:             'DesignUpdate1',
                    updateReference:        'CR001'
                };

                const newItem = {
                    _id:                    'DESIGN_UPDATE_01',
                    designVersionId:        'DESIGN_VERSION_01',
                    updateStatus:           DesignUpdateStatus.UPDATE_PUBLISHED_DRAFT,
                    updateName:             'DesignUpdate1',
                    updateReference:        'CR001'
                };

                const oldContext = {
                    designId:           'DESIGN_01',
                    designVersionId:    'DESIGN_VERSION_01',
                    designUpdateId:     'DESIGN_UPDATE_01'
                };

                const newContext = {
                    designId:           'DESIGN_01',
                    designVersionId:    'DESIGN_VERSION_01',
                    designUpdateId:     'DESIGN_UPDATE_02'
                };

                const shouldUpdate = testUpdate(itemType, oldItem, newItem, oldContext, newContext);

                chai.assert.isTrue(shouldUpdate, 'Update was expected');
            });
        });

        // WORK PACKAGE

        describe('Component update is allowed for Work Package when details change', () => {

            it('update allowed on name change', () => {

                const itemType = ItemType.WORK_PACKAGE;

                const oldItem = {
                    _id:                    'WORK_PACKAGE_01',
                    designVersionId:        'DESIGN_VERSION_01',
                    designUpdateId:         'DESIGN_UPDATE_01',
                    workPackageStatus:      WorkPackageStatus.WP_AVAILABLE,
                    workPackageName:        'WorkPackage1',
                    workPackageLink:        'NONE'
                };

                const newItem = {
                    _id:                    'WORK_PACKAGE_01',
                    designVersionId:        'DESIGN_VERSION_01',
                    designUpdateId:         'DESIGN_UPDATE_01',
                    workPackageStatus:      WorkPackageStatus.WP_AVAILABLE,
                    workPackageName:        'WorkPackage11',
                    workPackageLink:        'NONE'
                };

                const oldContext = {
                    designId:           'DESIGN_01',
                    designVersionId:    'DESIGN_VERSION_01',
                    designUpdateId:     'DESIGN_UPDATE_01',
                    workPackageId:      'WORK_PACKAGE_01'
                };

                const newContext = {
                    designId:           'DESIGN_01',
                    designVersionId:    'DESIGN_VERSION_01',
                    designUpdateId:     'DESIGN_UPDATE_01',
                    workPackageId:      'WORK_PACKAGE_01'
                };

                const shouldUpdate = testUpdate(itemType, oldItem, newItem, oldContext, newContext);

                chai.assert.isTrue(shouldUpdate, 'Update was expected');
            });

            it('update allowed on link change', () => {

                const itemType = ItemType.WORK_PACKAGE;

                const oldItem = {
                    _id:                    'WORK_PACKAGE_01',
                    designVersionId:        'DESIGN_VERSION_01',
                    designUpdateId:         'DESIGN_UPDATE_01',
                    workPackageStatus:      WorkPackageStatus.WP_AVAILABLE,
                    workPackageName:        'WorkPackage1',
                    workPackageLink:        'NONE'
                };

                const newItem = {
                    _id:                    'WORK_PACKAGE_01',
                    designVersionId:        'DESIGN_VERSION_01',
                    designUpdateId:         'DESIGN_UPDATE_01',
                    workPackageStatus:      WorkPackageStatus.WP_AVAILABLE,
                    workPackageName:        'WorkPackage1',
                    workPackageLink:        'www.hen.com'
                };

                const oldContext = {
                    designId:           'DESIGN_01',
                    designVersionId:    'DESIGN_VERSION_01',
                    designUpdateId:     'DESIGN_UPDATE_01',
                    workPackageId:      'WORK_PACKAGE_01'
                };

                const newContext = {
                    designId:           'DESIGN_01',
                    designVersionId:    'DESIGN_VERSION_01',
                    designUpdateId:     'DESIGN_UPDATE_01',
                    workPackageId:      'WORK_PACKAGE_01'
                };

                const shouldUpdate = testUpdate(itemType, oldItem, newItem, oldContext, newContext);

                chai.assert.isTrue(shouldUpdate, 'Update was expected');
            });

            it('update allowed on status change', () => {

                const itemType = ItemType.WORK_PACKAGE;

                const oldItem = {
                    _id:                    'WORK_PACKAGE_01',
                    designVersionId:        'DESIGN_VERSION_01',
                    designUpdateId:         'DESIGN_UPDATE_01',
                    workPackageStatus:      WorkPackageStatus.WP_AVAILABLE,
                    workPackageName:        'WorkPackage1',
                    workPackageLink:        'NONE'
                };

                const newItem = {
                    _id:                    'WORK_PACKAGE_01',
                    designVersionId:        'DESIGN_VERSION_01',
                    designUpdateId:         'DESIGN_UPDATE_01',
                    workPackageStatus:      WorkPackageStatus.WP_ADOPTED,
                    workPackageName:        'WorkPackage1',
                    workPackageLink:        'NONE'
                };

                const oldContext = {
                    designId:           'DESIGN_01',
                    designVersionId:    'DESIGN_VERSION_01',
                    designUpdateId:     'DESIGN_UPDATE_01',
                    workPackageId:      'WORK_PACKAGE_01'
                };

                const newContext = {
                    designId:           'DESIGN_01',
                    designVersionId:    'DESIGN_VERSION_01',
                    designUpdateId:     'DESIGN_UPDATE_01',
                    workPackageId:      'WORK_PACKAGE_01'
                };

                const shouldUpdate = testUpdate(itemType, oldItem, newItem, oldContext, newContext);

                chai.assert.isTrue(shouldUpdate, 'Update was expected');
            });

        });

        describe('Component update is allowed for Work Package when it is selected or deselected', () => {

            it('update allowed on selection', () => {

                const itemType = ItemType.WORK_PACKAGE;

                const oldItem = {
                    _id:                    'WORK_PACKAGE_01',
                    designVersionId:        'DESIGN_VERSION_01',
                    designUpdateId:         'DESIGN_UPDATE_01',
                    workPackageStatus:      WorkPackageStatus.WP_AVAILABLE,
                    workPackageName:        'WorkPackage1',
                    workPackageLink:        'NONE'
                };

                const newItem = {
                    _id:                    'WORK_PACKAGE_01',
                    designVersionId:        'DESIGN_VERSION_01',
                    designUpdateId:         'DESIGN_UPDATE_01',
                    workPackageStatus:      WorkPackageStatus.WP_AVAILABLE,
                    workPackageName:        'WorkPackage1',
                    workPackageLink:        'NONE'
                };

                const oldContext = {
                    designId:           'DESIGN_01',
                    designVersionId:    'DESIGN_VERSION_01',
                    designUpdateId:     'DESIGN_UPDATE_01',
                    workPackageId:      'WORK_PACKAGE_02'
                };

                const newContext = {
                    designId:           'DESIGN_01',
                    designVersionId:    'DESIGN_VERSION_01',
                    designUpdateId:     'DESIGN_UPDATE_01',
                    workPackageId:      'WORK_PACKAGE_01'
                };

                const shouldUpdate = testUpdate(itemType, oldItem, newItem, oldContext, newContext);

                chai.assert.isTrue(shouldUpdate, 'Update was expected');
            });

            it('update allowed on de-selection', () => {

                const itemType = ItemType.WORK_PACKAGE;

                const oldItem = {
                    _id:                    'WORK_PACKAGE_01',
                    designVersionId:        'DESIGN_VERSION_01',
                    designUpdateId:         'DESIGN_UPDATE_01',
                    workPackageStatus:      WorkPackageStatus.WP_AVAILABLE,
                    workPackageName:        'WorkPackage1',
                    workPackageLink:        'NONE'
                };

                const newItem = {
                    _id:                    'WORK_PACKAGE_01',
                    designVersionId:        'DESIGN_VERSION_01',
                    designUpdateId:         'DESIGN_UPDATE_01',
                    workPackageStatus:      WorkPackageStatus.WP_AVAILABLE,
                    workPackageName:        'WorkPackage1',
                    workPackageLink:        'NONE'
                };

                const oldContext = {
                    designId:           'DESIGN_01',
                    designVersionId:    'DESIGN_VERSION_01',
                    designUpdateId:     'DESIGN_UPDATE_01',
                    workPackageId:      'WORK_PACKAGE_01'
                };

                const newContext = {
                    designId:           'DESIGN_01',
                    designVersionId:    'DESIGN_VERSION_01',
                    designUpdateId:     'DESIGN_UPDATE_01',
                    workPackageId:      'WORK_PACKAGE_02'
                };

                const shouldUpdate = testUpdate(itemType, oldItem, newItem, oldContext, newContext);

                chai.assert.isTrue(shouldUpdate, 'Update was expected');
            });
        });

    });


    // DESIGN TESTS ----------------------------------------------------------------------------------------------------

    describe('DES', () => {

        describe('The current working Design for the user is highlighted', () => {

            it('is highlighted if is the User Context Design', () => {

                const itemType = ItemType.DESIGN;

                const itemData = {
                    _id:                'DESIGN_01',
                    designName:         'Design1',
                    isRemovable:        true,
                    designStatus:       DesignStatus.DESIGN_LIVE
                };

                const userContext = {
                    userId:             'USER1',
                    designId:           'DESIGN_01',
                    designVersionId:    'NONE',
                    designUpdateId:     'NONE',
                    workPackageId:      'NONE',
                };

                const userRole = RoleType.DESIGNER;

                const item = testLayout(itemType, itemData, userContext, userRole);
                const expectedUiItem = hashID(UI.UW_ITEM_SELECTED, 'Design1');

                chai.assert.equal(item.find(expectedUiItem).length, 1, expectedUiItem + ' was not found');



            });

            it('is not highlighted if is not the User Context Design', () => {

                const itemType = ItemType.DESIGN;

                const itemData = {
                    _id:                'DESIGN_01',
                    designName:         'Design1',
                    isRemovable:        true,
                    designStatus:       DesignStatus.DESIGN_LIVE
                };

                const userContext = {
                    userId:             'USER1',
                    designId:           'DESIGN_02',
                    designVersionId:    'NONE',
                    designUpdateId:     'NONE',
                    workPackageId:      'NONE',
                };

                const userRole = RoleType.DESIGNER;

                const item = testLayout(itemType, itemData, userContext, userRole);
                const expectedUiItem = hashID(UI.UW_ITEM_UNSELECTED, 'Design1');

                chai.assert.equal(item.find(expectedUiItem).length, 1, expectedUiItem + ' was not found');

            });

        });

        describe('A live Design in the Designs administration list has an option to archive it', () => {

            it('has archive option for live admin', () => {

                const itemType = ItemType.DESIGN;

                const itemData = {
                    _id:                'DESIGN_01',
                    designName:         'Design1',
                    isRemovable:        false,
                    designStatus:       DesignStatus.DESIGN_LIVE
                };

                const userContext = {
                    userId:             'USER1',
                    designId:           'DESIGN_01',
                    designVersionId:    'NONE',
                    designUpdateId:     'NONE',
                    workPackageId:      'NONE',
                };

                const userRole = RoleType.ADMIN;

                const item = testLayout(itemType, itemData, userContext, userRole);
                const expectedUiItem = hashID(UI.BUTTON_ARCHIVE, 'Design1');

                chai.assert.equal(item.find(expectedUiItem).length, 1, expectedUiItem + ' was not found');
            });

            it('has no archive option for live designer', () => {

                const itemType = ItemType.DESIGN;

                const itemData = {
                    _id:                'DESIGN_01',
                    designName:         'Design1',
                    isRemovable:        false,
                    designStatus:       DesignStatus.DESIGN_LIVE
                };

                const userContext = {
                    userId:             'USER1',
                    designId:           'DESIGN_01',
                    designVersionId:    'NONE',
                    designUpdateId:     'NONE',
                    workPackageId:      'NONE',
                };

                const userRole = RoleType.DESIGNER;

                const item = testLayout(itemType, itemData, userContext, userRole);
                const expectedUiItem = hashID(UI.BUTTON_ARCHIVE, 'Design1');

                chai.assert.equal(item.find(expectedUiItem).length, 0, expectedUiItem + ' was found');
            });

            it('has no archive option for archived admin', () => {

                const itemType = ItemType.DESIGN;

                const itemData = {
                    _id:                'DESIGN_01',
                    designName:         'Design1',
                    isRemovable:        false,
                    designStatus:       DesignStatus.DESIGN_ARCHIVED
                };

                const userContext = {
                    userId:             'USER1',
                    designId:           'DESIGN_01',
                    designVersionId:    'NONE',
                    designUpdateId:     'NONE',
                    workPackageId:      'NONE',
                };

                const userRole = RoleType.ADMIN;

                const item = testLayout(itemType, itemData, userContext, userRole);
                const expectedUiItem = hashID(UI.BUTTON_ARCHIVE, 'Design1');

                chai.assert.equal(item.find(expectedUiItem).length, 0, expectedUiItem + ' was found');
            });
        });

        describe('If a Design is removable, the Design has an option to remove the Design', () => {

            it('has a Remove button if the Design is removable', () => {

                const itemType = ItemType.DESIGN;

                const itemData = {
                    _id:                'DESIGN_01',
                    designName:         'Design1',
                    isRemovable:        true,
                    designStatus:       DesignStatus.DESIGN_LIVE
                };

                const userContext = {
                    userId:             'USER1',
                    designId:           'DESIGN_01',
                    designVersionId:    'NONE',
                    designUpdateId:     'NONE',
                    workPackageId:      'NONE',
                };

                const userRole = RoleType.DESIGNER;

                const item = testLayout(itemType, itemData, userContext, userRole);
                const expectedUiItem = hashID(UI.BUTTON_REMOVE, 'Design1');

                chai.assert.equal(item.find(expectedUiItem).length, 1, expectedUiItem + ' was not found');

            });

            it('does not have a Remove button if the Design is not removable', () => {

                const itemType = ItemType.DESIGN;

                const itemData = {
                    _id:                'DESIGN_01',
                    designName:         'Design1',
                    isRemovable:        false,
                    designStatus:       DesignStatus.DESIGN_LIVE
                };

                const userContext = {
                    userId:             'USER1',
                    designId:           'DESIGN_01',
                    designVersionId:    'NONE',
                    designUpdateId:     'NONE',
                    workPackageId:      'NONE',
                };

                const userRole = RoleType.DESIGNER;

                const item = testLayout(itemType, itemData, userContext, userRole);
                const expectedUiItem = hashID(UI.BUTTON_REMOVE, 'Design1');

                chai.assert.equal(item.find(expectedUiItem).length, 0, expectedUiItem + ' was found');


            });

        });

        describe('An option to remove a Design is only visible to a Designer', () => {

            it('does not have a remove button for a Developer', () => {

                const itemType = ItemType.DESIGN;

                const itemData = {
                    _id:                'DESIGN_01',
                    designName:         'Design1',
                    isRemovable:        true,
                    designStatus:       DesignStatus.DESIGN_LIVE
                };

                const userContext = {
                    userId:             'USER1',
                    designId:           'DESIGN_01',
                    designVersionId:    'NONE',
                    designUpdateId:     'NONE',
                    workPackageId:      'NONE',
                };

                const userRole = RoleType.DEVELOPER;

                const item = testLayout(itemType, itemData, userContext, userRole);
                const expectedUiItem = hashID(UI.BUTTON_REMOVE, 'Design1');

                chai.assert.equal(item.find(expectedUiItem).length, 0, expectedUiItem + ' was found');

            });

            it('does not have a remove button for a Manager', () => {

                const itemType = ItemType.DESIGN;

                const itemData = {
                    _id:                'DESIGN_01',
                    designName:         'Design1',
                    isRemovable:        true,
                    designStatus:       DesignStatus.DESIGN_LIVE
                };

                const userContext = {
                    userId:             'USER1',
                    designId:           'DESIGN_01',
                    designVersionId:    'NONE',
                    designUpdateId:     'NONE',
                    workPackageId:      'NONE',
                };

                const userRole = RoleType.MANAGER;

                const item = testLayout(itemType, itemData, userContext, userRole);
                const expectedUiItem = hashID(UI.BUTTON_REMOVE, 'Design1');

                chai.assert.equal(item.find(expectedUiItem).length, 0, expectedUiItem + ' was found');

            });


            it('does not have a remove button for a Guest Viewer', () => {

                const itemType = ItemType.DESIGN;

                const itemData = {
                    _id:                'DESIGN_01',
                    designName:         'Design1',
                    isRemovable:        true,
                    designStatus:       DesignStatus.DESIGN_LIVE
                };

                const userContext = {
                    userId:             'USER1',
                    designId:           'DESIGN_01',
                    designVersionId:    'NONE',
                    designUpdateId:     'NONE',
                    workPackageId:      'NONE',
                };

                const userRole = RoleType.GUEST_VIEWER;

                const item = testLayout(itemType, itemData, userContext, userRole);
                const expectedUiItem = hashID(UI.BUTTON_REMOVE, 'Design1');

                chai.assert.equal(item.find(expectedUiItem).length, 0, expectedUiItem + ' was found');

            });

        });

        describe('Each non-archived Design in the data management Designs list has an option to take a backup of the Design', () => {

            it('has a Backup button if the Design is not removable and not archived', () => {

                const itemType = ItemType.DESIGN;

                const itemData = {
                    _id:                'DESIGN_01',
                    designName:         'Design1',
                    isRemovable:        false,
                    designStatus:       DesignStatus.DESIGN_LIVE
                };

                const userContext = {
                    userId:             'USER1',
                    designId:           'DESIGN_01',
                    designVersionId:    'NONE',
                    designUpdateId:     'NONE',
                    workPackageId:      'NONE',
                };

                const userRole = RoleType.DESIGNER;

                const item = testLayout(itemType, itemData, userContext, userRole);
                const expectedUiItem = hashID(UI.BUTTON_BACKUP, 'Design1');

                chai.assert.equal(item.find(expectedUiItem).length, 1, expectedUiItem + ' was not found');

            });

            it('does not have a Backup button if the Design is removable', () => {

                const itemType = ItemType.DESIGN;

                const itemData = {
                    _id:                'DESIGN_01',
                    designName:         'Design1',
                    isRemovable:        true,
                    designStatus:       DesignStatus.DESIGN_LIVE
                };

                const userContext = {
                    userId:             'USER1',
                    designId:           'DESIGN_01',
                    designVersionId:    'NONE',
                    designUpdateId:     'NONE',
                    workPackageId:      'NONE',
                };

                const userRole = RoleType.DESIGNER;

                const item = testLayout(itemType, itemData, userContext, userRole);
                const expectedUiItem = hashID(UI.BUTTON_BACKUP, 'Design1');

                chai.assert.equal(item.find(expectedUiItem).length, 0, expectedUiItem + ' was found');

            });

            it('does not have a Backup button if the Design is archived', () => {

                const itemType = ItemType.DESIGN;

                const itemData = {
                    _id:                'DESIGN_01',
                    designName:         'Design1',
                    isRemovable:        false,
                    designStatus:       DesignStatus.DESIGN_ARCHIVED
                };

                const userContext = {
                    userId:             'USER1',
                    designId:           'DESIGN_01',
                    designVersionId:    'NONE',
                    designUpdateId:     'NONE',
                    workPackageId:      'NONE',
                };

                const userRole = RoleType.DESIGNER;

                const item = testLayout(itemType, itemData, userContext, userRole);
                const expectedUiItem = hashID(UI.BUTTON_BACKUP, 'Design1');

                chai.assert.equal(item.find(expectedUiItem).length, 0, expectedUiItem + ' was found');
            });

        });

        describe('The current working Design shows full details and options', () => {

            it('shows details if is the User Context Design', () => {

                const itemType = ItemType.DESIGN;

                const itemData = {
                    _id:                'DESIGN_01',
                    designName:         'Design1',
                    isRemovable:        false,
                    designStatus:       DesignStatus.DESIGN_ARCHIVED
                };

                const userContext = {
                    userId:             'USER1',
                    designId:           'DESIGN_01',
                    designVersionId:    'NONE',
                    designUpdateId:     'NONE',
                    workPackageId:      'NONE',
                };

                const userRole = RoleType.DESIGNER;

                const item = testLayout(itemType, itemData, userContext, userRole);
                // If selected the Name editing field will be visible.
                const expectedUiItem = hashID(UI.EDITABLE_FIELD, 'Design1') + '-' + FieldType.NAME;

                chai.assert.equal(item.find(expectedUiItem).length, 1, expectedUiItem + ' was not found');
            });

            it('has no details if is not the User Context Design', () => {

                const itemType = ItemType.DESIGN;

                const itemData = {
                    _id:                'DESIGN_01',
                    designName:         'Design1',
                    isRemovable:        false,
                    designStatus:       DesignStatus.DESIGN_ARCHIVED
                };

                const userContext = {
                    userId:             'USER1',
                    designId:           'DESIGN_02',
                    designVersionId:    'NONE',
                    designUpdateId:     'NONE',
                    workPackageId:      'NONE',
                };

                const userRole = RoleType.DESIGNER;

                const item = testLayout(itemType, itemData, userContext, userRole);
                // If selected the Name editing field will be visible.
                const expectedUiItem = hashID(UI.EDITABLE_FIELD, 'Design1') + '-' + FieldType.NAME;

                chai.assert.equal(item.find(expectedUiItem).length, 0, expectedUiItem + ' was found');

            });
        });

        describe('Designs not currently selected show the Design name only', () => {

            it('no summary if is the User Context Design', () => {

                const itemType = ItemType.DESIGN;

                const itemData = {
                    _id:                'DESIGN_01',
                    designName:         'Design1',
                    isRemovable:        false,
                    designStatus:       DesignStatus.DESIGN_LIVE
                };

                const userContext = {
                    userId:             'USER1',
                    designId:           'DESIGN_01',
                    designVersionId:    'NONE',
                    designUpdateId:     'NONE',
                    workPackageId:      'NONE',
                };

                const userRole = RoleType.DESIGNER;

                const item = testLayout(itemType, itemData, userContext, userRole);
                const expectedUiItem = hashID(UI.ITEM_SUMMARY, 'Design1') + '-' + ItemType.DESIGN;

                chai.assert.equal(item.find(expectedUiItem).length, 0, expectedUiItem + ' was found');
            });

            it('just summary if is not the User Context Design', () => {

                const itemType = ItemType.DESIGN;

                const itemData = {
                    _id:                'DESIGN_01',
                    designName:         'Design1',
                    isRemovable:        false,
                    designStatus:       DesignStatus.DESIGN_LIVE
                };

                const userContext = {
                    userId:             'USER1',
                    designId:           'DESIGN_02',
                    designVersionId:    'NONE',
                    designUpdateId:     'NONE',
                    workPackageId:      'NONE',
                };

                const userRole = RoleType.DESIGNER;

                const item = testLayout(itemType, itemData, userContext, userRole);
                const expectedUiItem = hashID(UI.ITEM_SUMMARY, 'Design1') + '-' + ItemType.DESIGN;

                chai.assert.equal(item.find(expectedUiItem).length, 1, expectedUiItem + ' was not found');

            });
        });

    });

    // DESIGN VERSION TESTS --------------------------------------------------------------------------------------------

    describe('DV', () => {

        describe('The currently selected Design Version is highlighted', () => {

            it('is highlighted if is the User Context Design Version', () => {

                const itemType = ItemType.DESIGN_VERSION;

                const itemData = {
                    _id:                    'DESIGN_VERSION_01',
                    designVersionName:      'DesignVersion1',
                    designVersionNumber:    '01',
                    designVersionStatus:    DesignVersionStatus.VERSION_DRAFT
                };

                const userContext = {
                    userId:             'USER1',
                    designId:           'DESIGN_01',
                    designVersionId:    'DESIGN_VERSION_01',
                    designUpdateId:     'NONE',
                    workPackageId:      'NONE',
                };

                const userRole = RoleType.DESIGNER;

                const item = testLayout(itemType, itemData, userContext, userRole);
                const expectedUiItem = hashID(UI.UW_ITEM_SELECTED, 'DesignVersion1');

                chai.assert.equal(item.find(expectedUiItem).length, 1, expectedUiItem + ' was not found');

            });

            it('is not highlighted if is not the User Context Design Version', () => {

                const itemType = ItemType.DESIGN_VERSION;

                const itemData = {
                    _id:                    'DESIGN_VERSION_01',
                    designVersionName:      'DesignVersion1',
                    designVersionNumber:    '01',
                    designVersionStatus:    DesignVersionStatus.VERSION_DRAFT
                };

                const userContext = {
                    userId:             'USER1',
                    designId:           'DESIGN_01',
                    designVersionId:    'DESIGN_VERSION_02',
                    designUpdateId:     'NONE',
                    workPackageId:      'NONE',
                };

                const userRole = RoleType.DESIGNER;

                const item = testLayout(itemType, itemData, userContext, userRole);
                const expectedUiItem = hashID(UI.UW_ITEM_UNSELECTED, 'DesignVersion1');

                chai.assert.equal(item.find(expectedUiItem).length, 1, expectedUiItem + ' was not found');

            });

        });

        describe('The currently selected Design Version shows full details and options', () => {

            it('full details if is the User Context Design Version', () => {

                const itemType = ItemType.DESIGN_VERSION;

                const itemData = {
                    _id:                    'DESIGN_VERSION_01',
                    designVersionName:      'DesignVersion1',
                    designVersionNumber:    '01',
                    designVersionStatus:    DesignVersionStatus.VERSION_DRAFT
                };

                const userContext = {
                    userId:             'USER1',
                    designId:           'DESIGN_01',
                    designVersionId:    'DESIGN_VERSION_01',
                    designUpdateId:     'NONE',
                    workPackageId:      'NONE',
                };

                const userRole = RoleType.DESIGNER;

                const item = testLayout(itemType, itemData, userContext, userRole);
                const expectedUiItem1 = hashID(UI.EDITABLE_FIELD, 'DesignVersion1') + '-' + FieldType.NAME;
                const expectedUiItem2 = hashID(UI.EDITABLE_FIELD, 'DesignVersion1') + '-' + FieldType.VERSION;

                chai.assert.equal(item.find(expectedUiItem1).length, 1, expectedUiItem1 + ' was not found');
                chai.assert.equal(item.find(expectedUiItem2).length, 1, expectedUiItem2 + ' was not found');

            });

            it('summary if is not the User Context Design Version', () => {

                const itemType = ItemType.DESIGN_VERSION;

                const itemData = {
                    _id:                    'DESIGN_VERSION_01',
                    designVersionName:      'DesignVersion1',
                    designVersionNumber:    '01',
                    designVersionStatus:    DesignVersionStatus.VERSION_DRAFT
                };

                const userContext = {
                    userId:             'USER1',
                    designId:           'DESIGN_01',
                    designVersionId:    'DESIGN_VERSION_02',
                    designUpdateId:     'NONE',
                    workPackageId:      'NONE',
                };

                const userRole = RoleType.DESIGNER;

                const item = testLayout(itemType, itemData, userContext, userRole);
                const expectedUiItem = hashID(UI.ITEM_SUMMARY, 'DesignVersion1') + '-' + ItemType.DESIGN_VERSION;

                chai.assert.equal(item.find(expectedUiItem).length, 1, expectedUiItem + ' was not found');

            });
        });

        describe('Design Versions not currently selected show the Design Version number and name only', () => {

            it('no summary if is the User Context Design Version', () => {

                const itemType = ItemType.DESIGN_VERSION;

                const itemData = {
                    _id:                    'DESIGN_VERSION_01',
                    designVersionName:      'DesignVersion1',
                    designVersionNumber:    '01',
                    designVersionStatus:    DesignVersionStatus.VERSION_DRAFT
                };

                const userContext = {
                    userId:             'USER1',
                    designId:           'DESIGN_01',
                    designVersionId:    'DESIGN_VERSION_01',
                    designUpdateId:     'NONE',
                    workPackageId:      'NONE',
                };

                const userRole = RoleType.DESIGNER;

                const item = testLayout(itemType, itemData, userContext, userRole);
                const expectedUiItem = hashID(UI.ITEM_SUMMARY, 'DesignVersion1') + '-' + ItemType.DESIGN_VERSION;

                chai.assert.equal(item.find(expectedUiItem).length, 0, expectedUiItem + ' was found');

            });

            it('summary details if is not the User Context Design Version', () => {

                const itemType = ItemType.DESIGN_VERSION;

                const itemData = {
                    _id:                    'DESIGN_VERSION_01',
                    designVersionName:      'DesignVersion1',
                    designVersionNumber:    '01',
                    designVersionStatus:    DesignVersionStatus.VERSION_DRAFT
                };

                const userContext = {
                    userId:             'USER1',
                    designId:           'DESIGN_01',
                    designVersionId:    'DESIGN_VERSION_02',
                    designUpdateId:     'NONE',
                    workPackageId:      'NONE',
                };

                const userRole = RoleType.DESIGNER;

                const item = testLayout(itemType, itemData, userContext, userRole);
                const expectedUiItem = hashID(UI.ITEM_SUMMARY, 'DesignVersion1') + '-' + ItemType.DESIGN_VERSION;

                chai.assert.equal(item.find(expectedUiItem).length, 1, expectedUiItem + ' was not found');
                chai.assert.equal(item.find(expectedUiItem).text(), '01 - DesignVersion1');

            });

        });

        describe('A Design Version in a Draft or Updatable state has an option to create a new Design Version', () => {

            it('has a Create New option for a Designer when Draft', () => {

                const itemType = ItemType.DESIGN_VERSION;

                const itemData = {
                    _id:                    'DESIGN_VERSION_01',
                    designVersionName:      'DesignVersion1',
                    designVersionNumber:    '01',
                    designVersionStatus:    DesignVersionStatus.VERSION_DRAFT
                };

                const userContext = {
                    userId:             'USER1',
                    designId:           'DESIGN_01',
                    designVersionId:    'DESIGN_VERSION_01',
                    designUpdateId:     'NONE',
                    workPackageId:      'NONE',
                };

                const userRole = RoleType.DESIGNER;

                const item = testLayout(itemType, itemData, userContext, userRole);
                const expectedUiItem = hashID(UI.BUTTON_CREATE_NEXT, 'DesignVersion1');

                chai.assert.equal(item.find(expectedUiItem).length, 1, expectedUiItem + ' was not found');

            });

            it('has a Create New option for a Designer when Updatable', () => {

                const itemType = ItemType.DESIGN_VERSION;

                const itemData = {
                    _id:                    'DESIGN_VERSION_01',
                    designVersionName:      'DesignVersion1',
                    designVersionNumber:    '01',
                    designVersionStatus:    DesignVersionStatus.VERSION_UPDATABLE
                };

                const userContext = {
                    userId:             'USER1',
                    designId:           'DESIGN_01',
                    designVersionId:    'DESIGN_VERSION_01',
                    designUpdateId:     'NONE',
                    workPackageId:      'NONE',
                };

                const userRole = RoleType.DESIGNER;

                const item = testLayout(itemType, itemData, userContext, userRole);
                const expectedUiItem = hashID(UI.BUTTON_CREATE_NEXT, 'DesignVersion1');

                chai.assert.equal(item.find(expectedUiItem).length, 1, expectedUiItem + ' was not found');

            });

            it('has no Create New option for a Designer when New', () => {

                const itemType = ItemType.DESIGN_VERSION;

                const itemData = {
                    _id:                    'DESIGN_VERSION_01',
                    designVersionName:      'DesignVersion1',
                    designVersionNumber:    '01',
                    designVersionStatus:    DesignVersionStatus.VERSION_NEW
                };

                const userContext = {
                    userId:             'USER1',
                    designId:           'DESIGN_01',
                    designVersionId:    'DESIGN_VERSION_01',
                    designUpdateId:     'NONE',
                    workPackageId:      'NONE',
                };

                const userRole = RoleType.DESIGNER;

                const item = testLayout(itemType, itemData, userContext, userRole);
                const expectedUiItem = hashID(UI.BUTTON_CREATE_NEXT, 'DesignVersion1');

                chai.assert.equal(item.find(expectedUiItem).length, 0, expectedUiItem + ' was found');

            });

            it('has no Create New option for a Designer when Draft Complete', () => {

                const itemType = ItemType.DESIGN_VERSION;

                const itemData = {
                    _id:                    'DESIGN_VERSION_01',
                    designVersionName:      'DesignVersion1',
                    designVersionNumber:    '01',
                    designVersionStatus:    DesignVersionStatus.VERSION_DRAFT_COMPLETE
                };

                const userContext = {
                    userId:             'USER1',
                    designId:           'DESIGN_01',
                    designVersionId:    'DESIGN_VERSION_01',
                    designUpdateId:     'NONE',
                    workPackageId:      'NONE',
                };

                const userRole = RoleType.DESIGNER;

                const item = testLayout(itemType, itemData, userContext, userRole);
                const expectedUiItem = hashID(UI.BUTTON_CREATE_NEXT, 'DesignVersion1');

                chai.assert.equal(item.find(expectedUiItem).length, 0, expectedUiItem + ' was found');

            });

            it('has no Create New option for a Designer when Updatable Complete', () => {

                const itemType = ItemType.DESIGN_VERSION;

                const itemData = {
                    _id:                    'DESIGN_VERSION_01',
                    designVersionName:      'DesignVersion1',
                    designVersionNumber:    '01',
                    designVersionStatus:    DesignVersionStatus.VERSION_UPDATABLE_COMPLETE
                };

                const userContext = {
                    userId:             'USER1',
                    designId:           'DESIGN_01',
                    designVersionId:    'DESIGN_VERSION_01',
                    designUpdateId:     'NONE',
                    workPackageId:      'NONE',
                };

                const userRole = RoleType.DESIGNER;

                const item = testLayout(itemType, itemData, userContext, userRole);
                const expectedUiItem = hashID(UI.BUTTON_CREATE_NEXT, 'DesignVersion1');

                chai.assert.equal(item.find(expectedUiItem).length, 0, expectedUiItem + ' was found');

            });
        });

        describe('A Design Version in a New state has a Publish option on it', () => {

            it('has a Publish option for a Designer', () => {

                const itemType = ItemType.DESIGN_VERSION;

                const itemData = {
                    _id:                    'DESIGN_VERSION_01',
                    designVersionName:      'DesignVersion1',
                    designVersionNumber:    '01',
                    designVersionStatus:    DesignVersionStatus.VERSION_NEW
                };

                const userContext = {
                    userId:             'USER1',
                    designId:           'DESIGN_01',
                    designVersionId:    'DESIGN_VERSION_01',
                    designUpdateId:     'NONE',
                    workPackageId:      'NONE',
                };

                const userRole = RoleType.DESIGNER;

                const item = testLayout(itemType, itemData, userContext, userRole);
                const expectedUiItem = hashID(UI.BUTTON_PUBLISH, 'DesignVersion1');

                chai.assert.equal(item.find(expectedUiItem).length, 1, expectedUiItem + ' was not found');

            });
        });

        describe('A Design Version in a Draft state has a Withdraw option on it', () => {

            it('has a Withdraw option for a Designer', () => {

                const itemType = ItemType.DESIGN_VERSION;

                const itemData = {
                    _id:                    'DESIGN_VERSION_01',
                    designVersionName:      'DesignVersion1',
                    designVersionNumber:    '01',
                    designVersionStatus:    DesignVersionStatus.VERSION_DRAFT
                };

                const userContext = {
                    userId:             'USER1',
                    designId:           'DESIGN_01',
                    designVersionId:    'DESIGN_VERSION_01',
                    designUpdateId:     'NONE',
                    workPackageId:      'NONE',
                };

                const userRole = RoleType.DESIGNER;

                const item = testLayout(itemType, itemData, userContext, userRole);
                const expectedUiItem = hashID(UI.BUTTON_WITHDRAW, 'DesignVersion1');

                chai.assert.equal(item.find(expectedUiItem).length, 1, expectedUiItem + ' was not found');

            });
        });

        describe('The Publish option is only visible to Designers', () => {

            it('has no Publish option for a Developer', () => {

                const itemType = ItemType.DESIGN_VERSION;

                const itemData = {
                    _id:                    'DESIGN_VERSION_01',
                    designVersionName:      'DesignVersion1',
                    designVersionNumber:    '01',
                    designVersionStatus:    DesignVersionStatus.VERSION_NEW
                };

                const userContext = {
                    userId:             'USER1',
                    designId:           'DESIGN_01',
                    designVersionId:    'DESIGN_VERSION_01',
                    designUpdateId:     'NONE',
                    workPackageId:      'NONE',
                };

                const userRole = RoleType.DEVELOPER;

                const item = testLayout(itemType, itemData, userContext, userRole);
                const expectedUiItem = hashID(UI.BUTTON_PUBLISH, 'DesignVersion1');

                chai.assert.equal(item.find(expectedUiItem).length, 0, expectedUiItem + ' was found');

            });

            it('has no Publish option for a Manager', () => {

                const itemType = ItemType.DESIGN_VERSION;

                const itemData = {
                    _id:                    'DESIGN_VERSION_01',
                    designVersionName:      'DesignVersion1',
                    designVersionNumber:    '01',
                    designVersionStatus:    DesignVersionStatus.VERSION_NEW
                };

                const userContext = {
                    userId:             'USER1',
                    designId:           'DESIGN_01',
                    designVersionId:    'DESIGN_VERSION_01',
                    designUpdateId:     'NONE',
                    workPackageId:      'NONE',
                };

                const userRole = RoleType.MANAGER;

                const item = testLayout(itemType, itemData, userContext, userRole);
                const expectedUiItem = hashID(UI.BUTTON_PUBLISH, 'DesignVersion1');

                chai.assert.equal(item.find(expectedUiItem).length, 0, expectedUiItem + ' was found');

            });

            it('has no Publish option for a Guest Viewer', () => {

                const itemType = ItemType.DESIGN_VERSION;

                const itemData = {
                    _id:                    'DESIGN_VERSION_01',
                    designVersionName:      'DesignVersion1',
                    designVersionNumber:    '01',
                    designVersionStatus:    DesignVersionStatus.VERSION_NEW
                };

                const userContext = {
                    userId:             'USER1',
                    designId:           'DESIGN_01',
                    designVersionId:    'DESIGN_VERSION_01',
                    designUpdateId:     'NONE',
                    workPackageId:      'NONE',
                };

                const userRole = RoleType.GUEST_VIEWER;

                const item = testLayout(itemType, itemData, userContext, userRole);
                const expectedUiItem = hashID(UI.BUTTON_PUBLISH, 'DesignVersion1');

                chai.assert.equal(item.find(expectedUiItem).length, 0, expectedUiItem + ' was found');

            });
        });

        describe('The Withdraw option is only visible to Designers', () => {

            it('has no Withdraw option for a Developer', () => {

                const itemType = ItemType.DESIGN_VERSION;

                const itemData = {
                    _id:                    'DESIGN_VERSION_01',
                    designVersionName:      'DesignVersion1',
                    designVersionNumber:    '01',
                    designVersionStatus:    DesignVersionStatus.VERSION_DRAFT
                };

                const userContext = {
                    userId:             'USER1',
                    designId:           'DESIGN_01',
                    designVersionId:    'DESIGN_VERSION_01',
                    designUpdateId:     'NONE',
                    workPackageId:      'NONE',
                };

                const userRole = RoleType.DEVELOPER;

                const item = testLayout(itemType, itemData, userContext, userRole);
                const expectedUiItem = hashID(UI.BUTTON_WITHDRAW, 'DesignVersion1');

                chai.assert.equal(item.find(expectedUiItem).length, 0, expectedUiItem + ' was found');

            });

            it('has no Withdraw option for a Manager', () => {

                const itemType = ItemType.DESIGN_VERSION;

                const itemData = {
                    _id:                    'DESIGN_VERSION_01',
                    designVersionName:      'DesignVersion1',
                    designVersionNumber:    '01',
                    designVersionStatus:    DesignVersionStatus.VERSION_DRAFT
                };

                const userContext = {
                    userId:             'USER1',
                    designId:           'DESIGN_01',
                    designVersionId:    'DESIGN_VERSION_01',
                    designUpdateId:     'NONE',
                    workPackageId:      'NONE',
                };

                const userRole = RoleType.MANAGER;

                const item = testLayout(itemType, itemData, userContext, userRole);
                const expectedUiItem = hashID(UI.BUTTON_WITHDRAW, 'DesignVersion1');

                chai.assert.equal(item.find(expectedUiItem).length, 0, expectedUiItem + ' was found');

            });

            it('has no Withdraw option for a Guest Viewer', () => {

                const itemType = ItemType.DESIGN_VERSION;

                const itemData = {
                    _id:                    'DESIGN_VERSION_01',
                    designVersionName:      'DesignVersion1',
                    designVersionNumber:    '01',
                    designVersionStatus:    DesignVersionStatus.VERSION_DRAFT
                };

                const userContext = {
                    userId:             'USER1',
                    designId:           'DESIGN_01',
                    designVersionId:    'DESIGN_VERSION_01',
                    designUpdateId:     'NONE',
                    workPackageId:      'NONE',
                };

                const userRole = RoleType.GUEST_VIEWER;

                const item = testLayout(itemType, itemData, userContext, userRole);
                const expectedUiItem = hashID(UI.BUTTON_WITHDRAW, 'DesignVersion1');

                chai.assert.equal(item.find(expectedUiItem).length, 0, expectedUiItem + ' was found');

            });
        });

        describe('The create new Design Version option is only visible to Designers', () => {

            it('has no Create New option for a Developer', () => {

                const itemType = ItemType.DESIGN_VERSION;

                const itemData = {
                    _id:                    'DESIGN_VERSION_01',
                    designVersionName:      'DesignVersion1',
                    designVersionNumber:    '01',
                    designVersionStatus:    DesignVersionStatus.VERSION_DRAFT
                };

                const userContext = {
                    userId:             'USER1',
                    designId:           'DESIGN_01',
                    designVersionId:    'DESIGN_VERSION_01',
                    designUpdateId:     'NONE',
                    workPackageId:      'NONE',
                };

                const userRole = RoleType.DEVELOPER;

                const item = testLayout(itemType, itemData, userContext, userRole);
                const expectedUiItem = hashID(UI.BUTTON_CREATE_NEXT, 'DesignVersion1');

                chai.assert.equal(item.find(expectedUiItem).length, 0, expectedUiItem + ' was found');

            });

            it('has no Create New option for a Manager', () => {

                const itemType = ItemType.DESIGN_VERSION;

                const itemData = {
                    _id:                    'DESIGN_VERSION_01',
                    designVersionName:      'DesignVersion1',
                    designVersionNumber:    '01',
                    designVersionStatus:    DesignVersionStatus.VERSION_DRAFT
                };

                const userContext = {
                    userId:             'USER1',
                    designId:           'DESIGN_01',
                    designVersionId:    'DESIGN_VERSION_01',
                    designUpdateId:     'NONE',
                    workPackageId:      'NONE',
                };

                const userRole = RoleType.MANAGER;

                const item = testLayout(itemType, itemData, userContext, userRole);
                const expectedUiItem = hashID(UI.BUTTON_CREATE_NEXT, 'DesignVersion1');

                chai.assert.equal(item.find(expectedUiItem).length, 0, expectedUiItem + ' was found');

            });

            it('has no Create New option for a Guest Viewer', () => {

                const itemType = ItemType.DESIGN_VERSION;

                const itemData = {
                    _id:                    'DESIGN_VERSION_01',
                    designVersionName:      'DesignVersion1',
                    designVersionNumber:    '01',
                    designVersionStatus:    DesignVersionStatus.VERSION_DRAFT
                };

                const userContext = {
                    userId:             'USER1',
                    designId:           'DESIGN_01',
                    designVersionId:    'DESIGN_VERSION_01',
                    designUpdateId:     'NONE',
                    workPackageId:      'NONE',
                };

                const userRole = RoleType.GUEST_VIEWER;

                const item = testLayout(itemType, itemData, userContext, userRole);
                const expectedUiItem = hashID(UI.BUTTON_CREATE_NEXT, 'DesignVersion1');

                chai.assert.equal(item.find(expectedUiItem).length, 0, expectedUiItem + ' was found');

            });
        });

        describe('The Publish option is only visible on a New Design Version', () => {

            it('has no Publish option for a Draft Design', () => {

                const itemType = ItemType.DESIGN_VERSION;

                const itemData = {
                    _id:                    'DESIGN_VERSION_01',
                    designVersionName:      'DesignVersion1',
                    designVersionNumber:    '01',
                    designVersionStatus:    DesignVersionStatus.VERSION_DRAFT
                };

                const userContext = {
                    userId:             'USER1',
                    designId:           'DESIGN_01',
                    designVersionId:    'DESIGN_VERSION_01',
                    designUpdateId:     'NONE',
                    workPackageId:      'NONE',
                };

                const userRole = RoleType.DESIGNER;

                const item = testLayout(itemType, itemData, userContext, userRole);
                const expectedUiItem = hashID(UI.BUTTON_PUBLISH, 'DesignVersion1');

                chai.assert.equal(item.find(expectedUiItem).length, 0, expectedUiItem + ' was found');

            });

            it('has no Publish option for an Updatable Design Version', () => {

                const itemType = ItemType.DESIGN_VERSION;

                const itemData = {
                    _id:                    'DESIGN_VERSION_01',
                    designVersionName:      'DesignVersion1',
                    designVersionNumber:    '01',
                    designVersionStatus:    DesignVersionStatus.VERSION_UPDATABLE
                };

                const userContext = {
                    userId:             'USER1',
                    designId:           'DESIGN_01',
                    designVersionId:    'DESIGN_VERSION_01',
                    designUpdateId:     'NONE',
                    workPackageId:      'NONE',
                };

                const userRole = RoleType.DESIGNER;

                const item = testLayout(itemType, itemData, userContext, userRole);
                const expectedUiItem = hashID(UI.BUTTON_PUBLISH, 'DesignVersion1');

                chai.assert.equal(item.find(expectedUiItem).length, 0, expectedUiItem + ' was found');

            });

            it('has no Publish option for a Draft Complete Design Version', () => {

                const itemType = ItemType.DESIGN_VERSION;

                const itemData = {
                    _id:                    'DESIGN_VERSION_01',
                    designVersionName:      'DesignVersion1',
                    designVersionNumber:    '01',
                    designVersionStatus:    DesignVersionStatus.VERSION_DRAFT_COMPLETE
                };

                const userContext = {
                    userId:             'USER1',
                    designId:           'DESIGN_01',
                    designVersionId:    'DESIGN_VERSION_01',
                    designUpdateId:     'NONE',
                    workPackageId:      'NONE',
                };

                const userRole = RoleType.DESIGNER;

                const item = testLayout(itemType, itemData, userContext, userRole);
                const expectedUiItem = hashID(UI.BUTTON_PUBLISH, 'DesignVersion1');

                chai.assert.equal(item.find(expectedUiItem).length, 0, expectedUiItem + ' was found');

            });

            it('has no Publish option for a Updatable Complete Design Version', () => {

                const itemType = ItemType.DESIGN_VERSION;

                const itemData = {
                    _id:                    'DESIGN_VERSION_01',
                    designVersionName:      'DesignVersion1',
                    designVersionNumber:    '01',
                    designVersionStatus:    DesignVersionStatus.VERSION_UPDATABLE_COMPLETE
                };

                const userContext = {
                    userId:             'USER1',
                    designId:           'DESIGN_01',
                    designVersionId:    'DESIGN_VERSION_01',
                    designUpdateId:     'NONE',
                    workPackageId:      'NONE',
                };

                const userRole = RoleType.DESIGNER;

                const item = testLayout(itemType, itemData, userContext, userRole);
                const expectedUiItem = hashID(UI.BUTTON_PUBLISH, 'DesignVersion1');

                chai.assert.equal(item.find(expectedUiItem).length, 0, expectedUiItem + ' was found');

            });
        });

        describe('The Withdraw option is only visible on a Draft Design Version', () => {

            it('has no Withdraw option for a New Design', () => {

                const itemType = ItemType.DESIGN_VERSION;

                const itemData = {
                    _id:                    'DESIGN_VERSION_01',
                    designVersionName:      'DesignVersion1',
                    designVersionNumber:    '01',
                    designVersionStatus:    DesignVersionStatus.VERSION_NEW
                };

                const userContext = {
                    userId:             'USER1',
                    designId:           'DESIGN_01',
                    designVersionId:    'DESIGN_VERSION_01',
                    designUpdateId:     'NONE',
                    workPackageId:      'NONE',
                };

                const userRole = RoleType.DESIGNER;

                const item = testLayout(itemType, itemData, userContext, userRole);
                const expectedUiItem = hashID(UI.BUTTON_WITHDRAW, 'DesignVersion1');

                chai.assert.equal(item.find(expectedUiItem).length, 0, expectedUiItem + ' was found');

            });

            it('has no Withdraw option for an Updatable Design Version', () => {

                const itemType = ItemType.DESIGN_VERSION;

                const itemData = {
                    _id:                    'DESIGN_VERSION_01',
                    designVersionName:      'DesignVersion1',
                    designVersionNumber:    '01',
                    designVersionStatus:    DesignVersionStatus.VERSION_UPDATABLE
                };

                const userContext = {
                    userId:             'USER1',
                    designId:           'DESIGN_01',
                    designVersionId:    'DESIGN_VERSION_01',
                    designUpdateId:     'NONE',
                    workPackageId:      'NONE',
                };

                const userRole = RoleType.DESIGNER;

                const item = testLayout(itemType, itemData, userContext, userRole);
                const expectedUiItem = hashID(UI.BUTTON_WITHDRAW, 'DesignVersion1');

                chai.assert.equal(item.find(expectedUiItem).length, 0, expectedUiItem + ' was found');

            });

            it('has no Withdraw option for a Draft Complete Design Version', () => {

                const itemType = ItemType.DESIGN_VERSION;

                const itemData = {
                    _id:                    'DESIGN_VERSION_01',
                    designVersionName:      'DesignVersion1',
                    designVersionNumber:    '01',
                    designVersionStatus:    DesignVersionStatus.VERSION_DRAFT_COMPLETE
                };

                const userContext = {
                    userId:             'USER1',
                    designId:           'DESIGN_01',
                    designVersionId:    'DESIGN_VERSION_01',
                    designUpdateId:     'NONE',
                    workPackageId:      'NONE',
                };

                const userRole = RoleType.DESIGNER;

                const item = testLayout(itemType, itemData, userContext, userRole);
                const expectedUiItem = hashID(UI.BUTTON_WITHDRAW, 'DesignVersion1');

                chai.assert.equal(item.find(expectedUiItem).length, 0, expectedUiItem + ' was found');

            });

            it('has no Withdraw option for a Updatable Complete Design Version', () => {

                const itemType = ItemType.DESIGN_VERSION;

                const itemData = {
                    _id:                    'DESIGN_VERSION_01',
                    designVersionName:      'DesignVersion1',
                    designVersionNumber:    '01',
                    designVersionStatus:    DesignVersionStatus.VERSION_UPDATABLE_COMPLETE
                };

                const userContext = {
                    userId:             'USER1',
                    designId:           'DESIGN_01',
                    designVersionId:    'DESIGN_VERSION_01',
                    designUpdateId:     'NONE',
                    workPackageId:      'NONE',
                };

                const userRole = RoleType.DESIGNER;

                const item = testLayout(itemType, itemData, userContext, userRole);
                const expectedUiItem = hashID(UI.BUTTON_WITHDRAW, 'DesignVersion1');

                chai.assert.equal(item.find(expectedUiItem).length, 0, expectedUiItem + ' was found');

            });
        });

        describe('An editable Design Version contains an Edit option', () => {

            it('visible for a New Design Version', () => {

                const itemType = ItemType.DESIGN_VERSION;

                const itemData = {
                    _id:                    'DESIGN_VERSION_01',
                    designVersionName:      'DesignVersion1',
                    designVersionNumber:    '01',
                    designVersionStatus:    DesignVersionStatus.VERSION_NEW
                };

                const userContext = {
                    userId:             'USER1',
                    designId:           'DESIGN_01',
                    designVersionId:    'DESIGN_VERSION_01',
                    designUpdateId:     'NONE',
                    workPackageId:      'NONE',
                };

                const userRole = RoleType.DESIGNER;

                const item = testLayout(itemType, itemData, userContext, userRole);
                const expectedUiItem = hashID(UI.BUTTON_EDIT, 'DesignVersion1');

                chai.assert.equal(item.find(expectedUiItem).length, 1, expectedUiItem + ' was not found');
            });

            it('visible for a Draft Design Version', () => {

                const itemType = ItemType.DESIGN_VERSION;

                const itemData = {
                    _id:                    'DESIGN_VERSION_01',
                    designVersionName:      'DesignVersion1',
                    designVersionNumber:    '01',
                    designVersionStatus:    DesignVersionStatus.VERSION_DRAFT
                };

                const userContext = {
                    userId:             'USER1',
                    designId:           'DESIGN_01',
                    designVersionId:    'DESIGN_VERSION_01',
                    designUpdateId:     'NONE',
                    workPackageId:      'NONE',
                };

                const userRole = RoleType.DESIGNER;

                const item = testLayout(itemType, itemData, userContext, userRole);
                const expectedUiItem = hashID(UI.BUTTON_EDIT, 'DesignVersion1');

                chai.assert.equal(item.find(expectedUiItem).length, 1, expectedUiItem + ' was not found');
            });

            it('NOT visible for a Draft Complete Design Version', () => {

                const itemType = ItemType.DESIGN_VERSION;

                const itemData = {
                    _id:                    'DESIGN_VERSION_01',
                    designVersionName:      'DesignVersion1',
                    designVersionNumber:    '01',
                    designVersionStatus:    DesignVersionStatus.VERSION_DRAFT_COMPLETE
                };

                const userContext = {
                    userId:             'USER1',
                    designId:           'DESIGN_01',
                    designVersionId:    'DESIGN_VERSION_01',
                    designUpdateId:     'NONE',
                    workPackageId:      'NONE',
                };

                const userRole = RoleType.DESIGNER;

                const item = testLayout(itemType, itemData, userContext, userRole);
                const expectedUiItem = hashID(UI.BUTTON_EDIT, 'DesignVersion1');

                chai.assert.equal(item.find(expectedUiItem).length, 0, expectedUiItem + ' was found');
            });

            it('NOT visible for an Updatable Complete Design Version', () => {

                const itemType = ItemType.DESIGN_VERSION;

                const itemData = {
                    _id:                    'DESIGN_VERSION_01',
                    designVersionName:      'DesignVersion1',
                    designVersionNumber:    '01',
                    designVersionStatus:    DesignVersionStatus.VERSION_UPDATABLE_COMPLETE
                };

                const userContext = {
                    userId:             'USER1',
                    designId:           'DESIGN_01',
                    designVersionId:    'DESIGN_VERSION_01',
                    designUpdateId:     'NONE',
                    workPackageId:      'NONE',
                };

                const userRole = RoleType.DESIGNER;

                const item = testLayout(itemType, itemData, userContext, userRole);
                const expectedUiItem = hashID(UI.BUTTON_EDIT, 'DesignVersion1');

                chai.assert.equal(item.find(expectedUiItem).length, 0, expectedUiItem + ' was found');
            });

            it('NOT visible for an Updatable Design Version', () => {

                const itemType = ItemType.DESIGN_VERSION;

                const itemData = {
                    _id:                    'DESIGN_VERSION_01',
                    designVersionName:      'DesignVersion1',
                    designVersionNumber:    '01',
                    designVersionStatus:    DesignVersionStatus.VERSION_UPDATABLE
                };

                const userContext = {
                    userId:             'USER1',
                    designId:           'DESIGN_01',
                    designVersionId:    'DESIGN_VERSION_01',
                    designUpdateId:     'NONE',
                    workPackageId:      'NONE',
                };

                const userRole = RoleType.DESIGNER;

                const item = testLayout(itemType, itemData, userContext, userRole);
                const expectedUiItem = hashID(UI.BUTTON_EDIT, 'DesignVersion1');

                chai.assert.equal(item.find(expectedUiItem).length, 0, expectedUiItem + ' was found');
            });
        });

        describe('The Edit option is only visible to Designers', () => {

            it('visible for a Designer', () => {

                const itemType = ItemType.DESIGN_VERSION;

                const itemData = {
                    _id:                    'DESIGN_VERSION_01',
                    designVersionName:      'DesignVersion1',
                    designVersionNumber:    '01',
                    designVersionStatus:    DesignVersionStatus.VERSION_NEW
                };

                const userContext = {
                    userId:             'USER1',
                    designId:           'DESIGN_01',
                    designVersionId:    'DESIGN_VERSION_01',
                    designUpdateId:     'NONE',
                    workPackageId:      'NONE',
                };

                const userRole = RoleType.DESIGNER;

                const item = testLayout(itemType, itemData, userContext, userRole);
                const expectedUiItem = hashID(UI.BUTTON_EDIT, 'DesignVersion1');

                chai.assert.equal(item.find(expectedUiItem).length, 1, expectedUiItem + ' was not found');
            });

            it('NOT visible for a Developer', () => {

                const itemType = ItemType.DESIGN_VERSION;

                const itemData = {
                    _id:                    'DESIGN_VERSION_01',
                    designVersionName:      'DesignVersion1',
                    designVersionNumber:    '01',
                    designVersionStatus:    DesignVersionStatus.VERSION_NEW
                };

                const userContext = {
                    userId:             'USER1',
                    designId:           'DESIGN_01',
                    designVersionId:    'DESIGN_VERSION_01',
                    designUpdateId:     'NONE',
                    workPackageId:      'NONE',
                };

                const userRole = RoleType.DEVELOPER;

                const item = testLayout(itemType, itemData, userContext, userRole);
                const expectedUiItem = hashID(UI.BUTTON_EDIT, 'DesignVersion1');

                chai.assert.equal(item.find(expectedUiItem).length, 0, expectedUiItem + ' was found');
            });

            it('NOT visible for a Manager', () => {

                const itemType = ItemType.DESIGN_VERSION;

                const itemData = {
                    _id:                    'DESIGN_VERSION_01',
                    designVersionName:      'DesignVersion1',
                    designVersionNumber:    '01',
                    designVersionStatus:    DesignVersionStatus.VERSION_NEW
                };

                const userContext = {
                    userId:             'USER1',
                    designId:           'DESIGN_01',
                    designVersionId:    'DESIGN_VERSION_01',
                    designUpdateId:     'NONE',
                    workPackageId:      'NONE',
                };

                const userRole = RoleType.MANAGER;

                const item = testLayout(itemType, itemData, userContext, userRole);
                const expectedUiItem = hashID(UI.BUTTON_EDIT, 'DesignVersion1');

                chai.assert.equal(item.find(expectedUiItem).length, 0, expectedUiItem + ' was found');
            });

            it('NOT visible for a Guest Viewer', () => {

                const itemType = ItemType.DESIGN_VERSION;

                const itemData = {
                    _id:                    'DESIGN_VERSION_01',
                    designVersionName:      'DesignVersion1',
                    designVersionNumber:    '01',
                    designVersionStatus:    DesignVersionStatus.VERSION_NEW
                };

                const userContext = {
                    userId:             'USER1',
                    designId:           'DESIGN_01',
                    designVersionId:    'DESIGN_VERSION_01',
                    designUpdateId:     'NONE',
                    workPackageId:      'NONE',
                };

                const userRole = RoleType.GUEST_VIEWER;

                const item = testLayout(itemType, itemData, userContext, userRole);
                const expectedUiItem = hashID(UI.BUTTON_EDIT, 'DesignVersion1');

                chai.assert.equal(item.find(expectedUiItem).length, 0, expectedUiItem + ' was found');
            });
        });

        describe('A Design Version contains a View option', () => {

            it('visible for a New Design Version for Designer', () => {

                const itemType = ItemType.DESIGN_VERSION;

                const itemData = {
                    _id:                    'DESIGN_VERSION_01',
                    designVersionName:      'DesignVersion1',
                    designVersionNumber:    '01',
                    designVersionStatus:    DesignVersionStatus.VERSION_NEW
                };

                const userContext = {
                    userId:             'USER1',
                    designId:           'DESIGN_01',
                    designVersionId:    'DESIGN_VERSION_01',
                    designUpdateId:     'NONE',
                    workPackageId:      'NONE',
                };

                const userRole = RoleType.DESIGNER;

                const item = testLayout(itemType, itemData, userContext, userRole);
                const expectedUiItem = hashID(UI.BUTTON_VIEW, 'DesignVersion1');

                chai.assert.equal(item.find(expectedUiItem).length, 1, expectedUiItem + ' was not found');
            });

            it('visible for a Draft Design Version for Designer', () => {

                const itemType = ItemType.DESIGN_VERSION;

                const itemData = {
                    _id:                    'DESIGN_VERSION_01',
                    designVersionName:      'DesignVersion1',
                    designVersionNumber:    '01',
                    designVersionStatus:    DesignVersionStatus.VERSION_DRAFT
                };

                const userContext = {
                    userId:             'USER1',
                    designId:           'DESIGN_01',
                    designVersionId:    'DESIGN_VERSION_01',
                    designUpdateId:     'NONE',
                    workPackageId:      'NONE',
                };

                const userRole = RoleType.DESIGNER;

                const item = testLayout(itemType, itemData, userContext, userRole);
                const expectedUiItem = hashID(UI.BUTTON_VIEW, 'DesignVersion1');

                chai.assert.equal(item.find(expectedUiItem).length, 1, expectedUiItem + ' was not found');
            });

            it('visible for a Draft Design Version for Developer', () => {

                const itemType = ItemType.DESIGN_VERSION;

                const itemData = {
                    _id:                    'DESIGN_VERSION_01',
                    designVersionName:      'DesignVersion1',
                    designVersionNumber:    '01',
                    designVersionStatus:    DesignVersionStatus.VERSION_DRAFT
                };

                const userContext = {
                    userId:             'USER1',
                    designId:           'DESIGN_01',
                    designVersionId:    'DESIGN_VERSION_01',
                    designUpdateId:     'NONE',
                    workPackageId:      'NONE',
                };

                const userRole = RoleType.DEVELOPER;

                const item = testLayout(itemType, itemData, userContext, userRole);
                const expectedUiItem = hashID(UI.BUTTON_VIEW, 'DesignVersion1');

                chai.assert.equal(item.find(expectedUiItem).length, 1, expectedUiItem + ' was not found');
            });

            it('visible for a Draft Design Version for Manager', () => {

                const itemType = ItemType.DESIGN_VERSION;

                const itemData = {
                    _id:                    'DESIGN_VERSION_01',
                    designVersionName:      'DesignVersion1',
                    designVersionNumber:    '01',
                    designVersionStatus:    DesignVersionStatus.VERSION_DRAFT
                };

                const userContext = {
                    userId:             'USER1',
                    designId:           'DESIGN_01',
                    designVersionId:    'DESIGN_VERSION_01',
                    designUpdateId:     'NONE',
                    workPackageId:      'NONE',
                };

                const userRole = RoleType.MANAGER;

                const item = testLayout(itemType, itemData, userContext, userRole);
                const expectedUiItem = hashID(UI.BUTTON_VIEW, 'DesignVersion1');

                chai.assert.equal(item.find(expectedUiItem).length, 1, expectedUiItem + ' was not found');
            });

            it('visible for a Draft Design Version for Guest Viewer', () => {

                const itemType = ItemType.DESIGN_VERSION;

                const itemData = {
                    _id:                    'DESIGN_VERSION_01',
                    designVersionName:      'DesignVersion1',
                    designVersionNumber:    '01',
                    designVersionStatus:    DesignVersionStatus.VERSION_DRAFT
                };

                const userContext = {
                    userId:             'USER1',
                    designId:           'DESIGN_01',
                    designVersionId:    'DESIGN_VERSION_01',
                    designUpdateId:     'NONE',
                    workPackageId:      'NONE',
                };

                const userRole = RoleType.GUEST_VIEWER;

                const item = testLayout(itemType, itemData, userContext, userRole);
                const expectedUiItem = hashID(UI.BUTTON_VIEW, 'DesignVersion1');

                chai.assert.equal(item.find(expectedUiItem).length, 1, expectedUiItem + ' was not found');
            });

            it('visible for a Draft Complete Design Version for Designer', () => {

                const itemType = ItemType.DESIGN_VERSION;

                const itemData = {
                    _id:                    'DESIGN_VERSION_01',
                    designVersionName:      'DesignVersion1',
                    designVersionNumber:    '01',
                    designVersionStatus:    DesignVersionStatus.VERSION_DRAFT_COMPLETE
                };

                const userContext = {
                    userId:             'USER1',
                    designId:           'DESIGN_01',
                    designVersionId:    'DESIGN_VERSION_01',
                    designUpdateId:     'NONE',
                    workPackageId:      'NONE',
                };

                const userRole = RoleType.DESIGNER;

                const item = testLayout(itemType, itemData, userContext, userRole);
                const expectedUiItem = hashID(UI.BUTTON_VIEW, 'DesignVersion1');

                chai.assert.equal(item.find(expectedUiItem).length, 1, expectedUiItem + ' was not found');
            });

            it('visible for a Draft Complete Design Version for Developer', () => {

                const itemType = ItemType.DESIGN_VERSION;

                const itemData = {
                    _id:                    'DESIGN_VERSION_01',
                    designVersionName:      'DesignVersion1',
                    designVersionNumber:    '01',
                    designVersionStatus:    DesignVersionStatus.VERSION_DRAFT_COMPLETE
                };

                const userContext = {
                    userId:             'USER1',
                    designId:           'DESIGN_01',
                    designVersionId:    'DESIGN_VERSION_01',
                    designUpdateId:     'NONE',
                    workPackageId:      'NONE',
                };

                const userRole = RoleType.DEVELOPER;

                const item = testLayout(itemType, itemData, userContext, userRole);
                const expectedUiItem = hashID(UI.BUTTON_VIEW, 'DesignVersion1');

                chai.assert.equal(item.find(expectedUiItem).length, 1, expectedUiItem + ' was not found');
            });

            it('visible for a Draft Complete Design Version for Manager', () => {

                const itemType = ItemType.DESIGN_VERSION;

                const itemData = {
                    _id:                    'DESIGN_VERSION_01',
                    designVersionName:      'DesignVersion1',
                    designVersionNumber:    '01',
                    designVersionStatus:    DesignVersionStatus.VERSION_DRAFT_COMPLETE
                };

                const userContext = {
                    userId:             'USER1',
                    designId:           'DESIGN_01',
                    designVersionId:    'DESIGN_VERSION_01',
                    designUpdateId:     'NONE',
                    workPackageId:      'NONE',
                };

                const userRole = RoleType.MANAGER;

                const item = testLayout(itemType, itemData, userContext, userRole);
                const expectedUiItem = hashID(UI.BUTTON_VIEW, 'DesignVersion1');

                chai.assert.equal(item.find(expectedUiItem).length, 1, expectedUiItem + ' was not found');
            });

            it('visible for a Draft Complete Design Version for Guest Viewer', () => {

                const itemType = ItemType.DESIGN_VERSION;

                const itemData = {
                    _id:                    'DESIGN_VERSION_01',
                    designVersionName:      'DesignVersion1',
                    designVersionNumber:    '01',
                    designVersionStatus:    DesignVersionStatus.VERSION_DRAFT_COMPLETE
                };

                const userContext = {
                    userId:             'USER1',
                    designId:           'DESIGN_01',
                    designVersionId:    'DESIGN_VERSION_01',
                    designUpdateId:     'NONE',
                    workPackageId:      'NONE',
                };

                const userRole = RoleType.GUEST_VIEWER;

                const item = testLayout(itemType, itemData, userContext, userRole);
                const expectedUiItem = hashID(UI.BUTTON_VIEW, 'DesignVersion1');

                chai.assert.equal(item.find(expectedUiItem).length, 1, expectedUiItem + ' was not found');
            });

            it('visible for an Updatable Complete Design Version for Designer', () => {

                const itemType = ItemType.DESIGN_VERSION;

                const itemData = {
                    _id:                    'DESIGN_VERSION_01',
                    designVersionName:      'DesignVersion1',
                    designVersionNumber:    '01',
                    designVersionStatus:    DesignVersionStatus.VERSION_UPDATABLE_COMPLETE
                };

                const userContext = {
                    userId:             'USER1',
                    designId:           'DESIGN_01',
                    designVersionId:    'DESIGN_VERSION_01',
                    designUpdateId:     'NONE',
                    workPackageId:      'NONE',
                };

                const userRole = RoleType.DESIGNER;

                const item = testLayout(itemType, itemData, userContext, userRole);
                const expectedUiItem = hashID(UI.BUTTON_VIEW, 'DesignVersion1');

                chai.assert.equal(item.find(expectedUiItem).length, 1, expectedUiItem + ' was not found');
            });

            it('visible for an Updatable Complete Design Version for Developer', () => {

                const itemType = ItemType.DESIGN_VERSION;

                const itemData = {
                    _id:                    'DESIGN_VERSION_01',
                    designVersionName:      'DesignVersion1',
                    designVersionNumber:    '01',
                    designVersionStatus:    DesignVersionStatus.VERSION_UPDATABLE_COMPLETE
                };

                const userContext = {
                    userId:             'USER1',
                    designId:           'DESIGN_01',
                    designVersionId:    'DESIGN_VERSION_01',
                    designUpdateId:     'NONE',
                    workPackageId:      'NONE',
                };

                const userRole = RoleType.DEVELOPER;

                const item = testLayout(itemType, itemData, userContext, userRole);
                const expectedUiItem = hashID(UI.BUTTON_VIEW, 'DesignVersion1');

                chai.assert.equal(item.find(expectedUiItem).length, 1, expectedUiItem + ' was not found');
            });

            it('visible for an Updatable Complete Design Version for Manager', () => {

                const itemType = ItemType.DESIGN_VERSION;

                const itemData = {
                    _id:                    'DESIGN_VERSION_01',
                    designVersionName:      'DesignVersion1',
                    designVersionNumber:    '01',
                    designVersionStatus:    DesignVersionStatus.VERSION_UPDATABLE_COMPLETE
                };

                const userContext = {
                    userId:             'USER1',
                    designId:           'DESIGN_01',
                    designVersionId:    'DESIGN_VERSION_01',
                    designUpdateId:     'NONE',
                    workPackageId:      'NONE',
                };

                const userRole = RoleType.MANAGER;

                const item = testLayout(itemType, itemData, userContext, userRole);
                const expectedUiItem = hashID(UI.BUTTON_VIEW, 'DesignVersion1');

                chai.assert.equal(item.find(expectedUiItem).length, 1, expectedUiItem + ' was not found');
            });

            it('visible for an Updatable Complete Design Version for Guest Viewer', () => {

                const itemType = ItemType.DESIGN_VERSION;

                const itemData = {
                    _id:                    'DESIGN_VERSION_01',
                    designVersionName:      'DesignVersion1',
                    designVersionNumber:    '01',
                    designVersionStatus:    DesignVersionStatus.VERSION_UPDATABLE_COMPLETE
                };

                const userContext = {
                    userId:             'USER1',
                    designId:           'DESIGN_01',
                    designVersionId:    'DESIGN_VERSION_01',
                    designUpdateId:     'NONE',
                    workPackageId:      'NONE',
                };

                const userRole = RoleType.GUEST_VIEWER;

                const item = testLayout(itemType, itemData, userContext, userRole);
                const expectedUiItem = hashID(UI.BUTTON_VIEW, 'DesignVersion1');

                chai.assert.equal(item.find(expectedUiItem).length, 1, expectedUiItem + ' was not found');
            });

            it('visible for an Updatable Design Version for Designer', () => {

                it('visible for an Updatable Complete Design Version for Manager', () => {

                    const itemType = ItemType.DESIGN_VERSION;

                    const itemData = {
                        _id:                    'DESIGN_VERSION_01',
                        designVersionName:      'DesignVersion1',
                        designVersionNumber:    '01',
                        designVersionStatus:    DesignVersionStatus.VERSION_UPDATABLE
                    };

                    const userContext = {
                        userId:             'USER1',
                        designId:           'DESIGN_01',
                        designVersionId:    'DESIGN_VERSION_01',
                        designUpdateId:     'NONE',
                        workPackageId:      'NONE',
                    };

                    const userRole = RoleType.DESIGNER;

                    const item = testLayout(itemType, itemData, userContext, userRole);
                    const expectedUiItem = hashID(UI.BUTTON_VIEW, 'DesignVersion1');

                    chai.assert.equal(item.find(expectedUiItem).length, 1, expectedUiItem + ' was not found');
                });
            });

            it('visible for an Updatable Design Version for Developer', () => {

                const itemType = ItemType.DESIGN_VERSION;

                const itemData = {
                    _id:                    'DESIGN_VERSION_01',
                    designVersionName:      'DesignVersion1',
                    designVersionNumber:    '01',
                    designVersionStatus:    DesignVersionStatus.VERSION_UPDATABLE
                };

                const userContext = {
                    userId:             'USER1',
                    designId:           'DESIGN_01',
                    designVersionId:    'DESIGN_VERSION_01',
                    designUpdateId:     'NONE',
                    workPackageId:      'NONE',
                };

                const userRole = RoleType.DEVELOPER;

                const item = testLayout(itemType, itemData, userContext, userRole);
                const expectedUiItem = hashID(UI.BUTTON_VIEW, 'DesignVersion1');

                chai.assert.equal(item.find(expectedUiItem).length, 1, expectedUiItem + ' was not found');
            });

            it('visible for an Updatable Design Version for Manager', () => {

                const itemType = ItemType.DESIGN_VERSION;

                const itemData = {
                    _id:                    'DESIGN_VERSION_01',
                    designVersionName:      'DesignVersion1',
                    designVersionNumber:    '01',
                    designVersionStatus:    DesignVersionStatus.VERSION_UPDATABLE
                };

                const userContext = {
                    userId:             'USER1',
                    designId:           'DESIGN_01',
                    designVersionId:    'DESIGN_VERSION_01',
                    designUpdateId:     'NONE',
                    workPackageId:      'NONE',
                };

                const userRole = RoleType.MANAGER;

                const item = testLayout(itemType, itemData, userContext, userRole);
                const expectedUiItem = hashID(UI.BUTTON_VIEW, 'DesignVersion1');

                chai.assert.equal(item.find(expectedUiItem).length, 1, expectedUiItem + ' was not found');
            });

            it('visible for an Updatable Design Version for Guest Viewer', () => {

                const itemType = ItemType.DESIGN_VERSION;

                const itemData = {
                    _id:                    'DESIGN_VERSION_01',
                    designVersionName:      'DesignVersion1',
                    designVersionNumber:    '01',
                    designVersionStatus:    DesignVersionStatus.VERSION_UPDATABLE
                };

                const userContext = {
                    userId:             'USER1',
                    designId:           'DESIGN_01',
                    designVersionId:    'DESIGN_VERSION_01',
                    designUpdateId:     'NONE',
                    workPackageId:      'NONE',
                };

                const userRole = RoleType.GUEST_VIEWER;

                const item = testLayout(itemType, itemData, userContext, userRole);
                const expectedUiItem = hashID(UI.BUTTON_VIEW, 'DesignVersion1');

                chai.assert.equal(item.find(expectedUiItem).length, 1, expectedUiItem + ' was not found');
            });
        });

        describe('The View option is only visible to Designers for New Design Versions', () => {

            it('NOT visible for a New Design Version for Developer', () => {

                const itemType = ItemType.DESIGN_VERSION;

                const itemData = {
                    _id:                    'DESIGN_VERSION_01',
                    designVersionName:      'DesignVersion1',
                    designVersionNumber:    '01',
                    designVersionStatus:    DesignVersionStatus.VERSION_NEW
                };

                const userContext = {
                    userId:             'USER1',
                    designId:           'DESIGN_01',
                    designVersionId:    'DESIGN_VERSION_01',
                    designUpdateId:     'NONE',
                    workPackageId:      'NONE',
                };

                const userRole = RoleType.DEVELOPER;

                const item = testLayout(itemType, itemData, userContext, userRole);
                const expectedUiItem = hashID(UI.BUTTON_VIEW, 'DesignVersion1');

                chai.assert.equal(item.find(expectedUiItem).length, 0, expectedUiItem + ' was found');
            });

            it('NOT visible for a New Design Version for Manager', () => {

                const itemType = ItemType.DESIGN_VERSION;

                const itemData = {
                    _id:                    'DESIGN_VERSION_01',
                    designVersionName:      'DesignVersion1',
                    designVersionNumber:    '01',
                    designVersionStatus:    DesignVersionStatus.VERSION_NEW
                };

                const userContext = {
                    userId:             'USER1',
                    designId:           'DESIGN_01',
                    designVersionId:    'DESIGN_VERSION_01',
                    designUpdateId:     'NONE',
                    workPackageId:      'NONE',
                };

                const userRole = RoleType.MANAGER;

                const item = testLayout(itemType, itemData, userContext, userRole);
                const expectedUiItem = hashID(UI.BUTTON_VIEW, 'DesignVersion1');

                chai.assert.equal(item.find(expectedUiItem).length, 0, expectedUiItem + ' was found');
            });

            it('NOT visible for a New Design Version for Guest Viewer', () => {

                const itemType = ItemType.DESIGN_VERSION;

                const itemData = {
                    _id:                    'DESIGN_VERSION_01',
                    designVersionName:      'DesignVersion1',
                    designVersionNumber:    '01',
                    designVersionStatus:    DesignVersionStatus.VERSION_NEW
                };

                const userContext = {
                    userId:             'USER1',
                    designId:           'DESIGN_01',
                    designVersionId:    'DESIGN_VERSION_01',
                    designUpdateId:     'NONE',
                    workPackageId:      'NONE',
                };

                const userRole = RoleType.GUEST_VIEWER;

                const item = testLayout(itemType, itemData, userContext, userRole);
                const expectedUiItem = hashID(UI.BUTTON_VIEW, 'DesignVersion1');

                chai.assert.equal(item.find(expectedUiItem).length, 0, expectedUiItem + ' was found');
            });

        });

    });

    // DESIGN UPDATE TESTS ---------------------------------------------------------------------------------------------

    describe('DU', () => {

        describe('The currently selected Design Update is highlighted', () => {

            it('is highlighted when the current update', () => {

                const itemType = ItemType.DESIGN_UPDATE;

                const itemData = {
                    _id:                'DESIGN_UPDATE_01',
                    designVersionId:    'DESIGN_VERSION_01',
                    updateName:         'DesignUpdate1',
                    updateReference:    'CR001',
                    updateStatus:       DesignUpdateStatus.UPDATE_PUBLISHED_DRAFT,
                    updateMergeAction:  DesignUpdateMergeAction.MERGE_INCLUDE,
                    updateWpStatus:     DesignUpdateWpStatus.DU_NO_WP_SCENARIOS,
                    updateTestStatus:   DesignUpdateTestStatus.DU_NO_SCENARIOS_PASSING,
                    updateWpTestStatus: DuWorkPackageTestStatus.DU_WPS_NOT_COMPLETE
                };

                const userContext = {
                    userId:             'USER1',
                    designId:           'DESIGN_01',
                    designVersionId:    'DESIGN_VERSION_01',
                    designUpdateId:     'DESIGN_UPDATE_01',
                    workPackageId:      'NONE',
                };

                const userRole = RoleType.DESIGNER;

                const item = testLayout(itemType, itemData, userContext, userRole);
                const expectedUiItem = hashID(UI.UW_ITEM_SELECTED, 'DesignUpdate1');

                chai.assert.equal(item.find(expectedUiItem).length, 1, expectedUiItem + ' not found');
            });

            it('is not highlighted when not the current update', () => {

                const itemType = ItemType.DESIGN_UPDATE;

                const itemData = {
                    _id:                'DESIGN_UPDATE_01',
                    designVersionId:    'DESIGN_VERSION_01',
                    updateName:         'DesignUpdate1',
                    updateReference:    'CR001',
                    updateStatus:       DesignUpdateStatus.UPDATE_PUBLISHED_DRAFT,
                    updateMergeAction:  DesignUpdateMergeAction.MERGE_INCLUDE,
                    updateWpStatus:     DesignUpdateWpStatus.DU_NO_WP_SCENARIOS,
                    updateTestStatus:   DesignUpdateTestStatus.DU_NO_SCENARIOS_PASSING,
                    updateWpTestStatus: DuWorkPackageTestStatus.DU_WPS_NOT_COMPLETE
                };

                const userContext = {
                    userId:             'USER1',
                    designId:           'DESIGN_01',
                    designVersionId:    'DESIGN_VERSION_01',
                    designUpdateId:     'DESIGN_UPDATE_02',
                    workPackageId:      'NONE',
                };

                const userRole = RoleType.DESIGNER;

                const item = testLayout(itemType, itemData, userContext, userRole);
                const expectedUiItem = hashID(UI.UW_ITEM_UNSELECTED, 'DesignUpdate1');

                chai.assert.equal(item.find(expectedUiItem).length, 1, expectedUiItem + ' not found');
            });
        });

        // View Update Content ---------------------------------------------------------------------------------------------

        describe('A Design Update item has an option to view it', () => {

            it('has a view option for new update for designer', () => {

                const itemType = ItemType.DESIGN_UPDATE;

                const itemData = {
                    _id:                'DESIGN_UPDATE_01',
                    designVersionId:    'DESIGN_VERSION_01',
                    updateName:         'DesignUpdate1',
                    updateReference:    'CR001',
                    updateStatus:       DesignUpdateStatus.UPDATE_NEW,
                    updateMergeAction:  DesignUpdateMergeAction.MERGE_INCLUDE,
                    updateWpStatus:     DesignUpdateWpStatus.DU_NO_WP_SCENARIOS,
                    updateTestStatus:   DesignUpdateTestStatus.DU_NO_SCENARIOS_PASSING,
                    updateWpTestStatus: DuWorkPackageTestStatus.DU_WPS_NOT_COMPLETE
                };

                const userContext = {
                    userId:             'USER1',
                    designId:           'DESIGN_01',
                    designVersionId:    'DESIGN_VERSION_01',
                    designUpdateId:     'DESIGN_UPDATE_01',
                    workPackageId:      'NONE',
                };

                const userRole = RoleType.DESIGNER;

                const item = testLayout(itemType, itemData, userContext, userRole);
                const expectedUiItem = hashID(UI.BUTTON_VIEW, 'DesignUpdate1');

                chai.assert.equal(item.find(expectedUiItem).length, 1, expectedUiItem + ' not found');
            });

            it('has a view option for published update for designer', () => {

                const itemType = ItemType.DESIGN_UPDATE;

                const itemData = {
                    _id:                'DESIGN_UPDATE_01',
                    designVersionId:    'DESIGN_VERSION_01',
                    updateName:         'DesignUpdate1',
                    updateReference:    'CR001',
                    updateStatus:       DesignUpdateStatus.UPDATE_PUBLISHED_DRAFT,
                    updateMergeAction:  DesignUpdateMergeAction.MERGE_INCLUDE,
                    updateWpStatus:     DesignUpdateWpStatus.DU_NO_WP_SCENARIOS,
                    updateTestStatus:   DesignUpdateTestStatus.DU_NO_SCENARIOS_PASSING,
                    updateWpTestStatus: DuWorkPackageTestStatus.DU_WPS_NOT_COMPLETE
                };

                const userContext = {
                    userId:             'USER1',
                    designId:           'DESIGN_01',
                    designVersionId:    'DESIGN_VERSION_01',
                    designUpdateId:     'DESIGN_UPDATE_01',
                    workPackageId:      'NONE',
                };

                const userRole = RoleType.DESIGNER;

                const item = testLayout(itemType, itemData, userContext, userRole);
                const expectedUiItem = hashID(UI.BUTTON_VIEW, 'DesignUpdate1');

                chai.assert.equal(item.find(expectedUiItem).length, 1, expectedUiItem + ' not found');
            });

            it('has a view option for merged update for designer', () => {

                const itemType = ItemType.DESIGN_UPDATE;

                const itemData = {
                    _id:                'DESIGN_UPDATE_01',
                    designVersionId:    'DESIGN_VERSION_01',
                    updateName:         'DesignUpdate1',
                    updateReference:    'CR001',
                    updateStatus:       DesignUpdateStatus.UPDATE_MERGED,
                    updateMergeAction:  DesignUpdateMergeAction.MERGE_INCLUDE,
                    updateWpStatus:     DesignUpdateWpStatus.DU_NO_WP_SCENARIOS,
                    updateTestStatus:   DesignUpdateTestStatus.DU_NO_SCENARIOS_PASSING,
                    updateWpTestStatus: DuWorkPackageTestStatus.DU_WPS_NOT_COMPLETE
                };

                const userContext = {
                    userId:             'USER1',
                    designId:           'DESIGN_01',
                    designVersionId:    'DESIGN_VERSION_01',
                    designUpdateId:     'DESIGN_UPDATE_01',
                    workPackageId:      'NONE',
                };

                const userRole = RoleType.DESIGNER;

                const item = testLayout(itemType, itemData, userContext, userRole);
                const expectedUiItem = hashID(UI.BUTTON_VIEW, 'DesignUpdate1');

                chai.assert.equal(item.find(expectedUiItem).length, 1, expectedUiItem + ' not found');
            });

            it('has a view option for published update for developer', () => {

                const itemType = ItemType.DESIGN_UPDATE;

                const itemData = {
                    _id:                'DESIGN_UPDATE_01',
                    designVersionId:    'DESIGN_VERSION_01',
                    updateName:         'DesignUpdate1',
                    updateReference:    'CR001',
                    updateStatus:       DesignUpdateStatus.UPDATE_PUBLISHED_DRAFT,
                    updateMergeAction:  DesignUpdateMergeAction.MERGE_INCLUDE,
                    updateWpStatus:     DesignUpdateWpStatus.DU_NO_WP_SCENARIOS,
                    updateTestStatus:   DesignUpdateTestStatus.DU_NO_SCENARIOS_PASSING,
                    updateWpTestStatus: DuWorkPackageTestStatus.DU_WPS_NOT_COMPLETE
                };

                const userContext = {
                    userId:             'USER1',
                    designId:           'DESIGN_01',
                    designVersionId:    'DESIGN_VERSION_01',
                    designUpdateId:     'DESIGN_UPDATE_01',
                    workPackageId:      'NONE',
                };

                const userRole = RoleType.DEVELOPER;

                const item = testLayout(itemType, itemData, userContext, userRole);
                const expectedUiItem = hashID(UI.BUTTON_VIEW, 'DesignUpdate1');

                chai.assert.equal(item.find(expectedUiItem).length, 1, expectedUiItem + ' not found');
            });

            it('has a view option for merged update for developer', () => {

                const itemType = ItemType.DESIGN_UPDATE;

                const itemData = {
                    _id:                'DESIGN_UPDATE_01',
                    designVersionId:    'DESIGN_VERSION_01',
                    updateName:         'DesignUpdate1',
                    updateReference:    'CR001',
                    updateStatus:       DesignUpdateStatus.UPDATE_MERGED,
                    updateMergeAction:  DesignUpdateMergeAction.MERGE_INCLUDE,
                    updateWpStatus:     DesignUpdateWpStatus.DU_NO_WP_SCENARIOS,
                    updateTestStatus:   DesignUpdateTestStatus.DU_NO_SCENARIOS_PASSING,
                    updateWpTestStatus: DuWorkPackageTestStatus.DU_WPS_NOT_COMPLETE
                };

                const userContext = {
                    userId:             'USER1',
                    designId:           'DESIGN_01',
                    designVersionId:    'DESIGN_VERSION_01',
                    designUpdateId:     'DESIGN_UPDATE_01',
                    workPackageId:      'NONE',
                };

                const userRole = RoleType.DEVELOPER;

                const item = testLayout(itemType, itemData, userContext, userRole);
                const expectedUiItem = hashID(UI.BUTTON_VIEW, 'DesignUpdate1');

                chai.assert.equal(item.find(expectedUiItem).length, 1, expectedUiItem + ' not found');
            });

            it('has a view option for published update for manager', () => {

                const itemType = ItemType.DESIGN_UPDATE;

                const itemData = {
                    _id:                'DESIGN_UPDATE_01',
                    designVersionId:    'DESIGN_VERSION_01',
                    updateName:         'DesignUpdate1',
                    updateReference:    'CR001',
                    updateStatus:       DesignUpdateStatus.UPDATE_PUBLISHED_DRAFT,
                    updateMergeAction:  DesignUpdateMergeAction.MERGE_INCLUDE,
                    updateWpStatus:     DesignUpdateWpStatus.DU_NO_WP_SCENARIOS,
                    updateTestStatus:   DesignUpdateTestStatus.DU_NO_SCENARIOS_PASSING,
                    updateWpTestStatus: DuWorkPackageTestStatus.DU_WPS_NOT_COMPLETE
                };

                const userContext = {
                    userId:             'USER1',
                    designId:           'DESIGN_01',
                    designVersionId:    'DESIGN_VERSION_01',
                    designUpdateId:     'DESIGN_UPDATE_01',
                    workPackageId:      'NONE',
                };

                const userRole = RoleType.MANAGER;

                const item = testLayout(itemType, itemData, userContext, userRole);
                const expectedUiItem = hashID(UI.BUTTON_VIEW, 'DesignUpdate1');

                chai.assert.equal(item.find(expectedUiItem).length, 1, expectedUiItem + ' not found');
            });

            it('has a view option for merged update for manager', () => {

                const itemType = ItemType.DESIGN_UPDATE;

                const itemData = {
                    _id:                'DESIGN_UPDATE_01',
                    designVersionId:    'DESIGN_VERSION_01',
                    updateName:         'DesignUpdate1',
                    updateReference:    'CR001',
                    updateStatus:       DesignUpdateStatus.UPDATE_MERGED,
                    updateMergeAction:  DesignUpdateMergeAction.MERGE_INCLUDE,
                    updateWpStatus:     DesignUpdateWpStatus.DU_NO_WP_SCENARIOS,
                    updateTestStatus:   DesignUpdateTestStatus.DU_NO_SCENARIOS_PASSING,
                    updateWpTestStatus: DuWorkPackageTestStatus.DU_WPS_NOT_COMPLETE
                };

                const userContext = {
                    userId:             'USER1',
                    designId:           'DESIGN_01',
                    designVersionId:    'DESIGN_VERSION_01',
                    designUpdateId:     'DESIGN_UPDATE_01',
                    workPackageId:      'NONE',
                };

                const userRole = RoleType.MANAGER;

                const item = testLayout(itemType, itemData, userContext, userRole);
                const expectedUiItem = hashID(UI.BUTTON_VIEW, 'DesignUpdate1');

                chai.assert.equal(item.find(expectedUiItem).length, 1, expectedUiItem + ' not found');
            });

            it('has no view option for published update for guest', () => {

                const itemType = ItemType.DESIGN_UPDATE;

                const itemData = {
                    _id:                'DESIGN_UPDATE_01',
                    designVersionId:    'DESIGN_VERSION_01',
                    updateName:         'DesignUpdate1',
                    updateReference:    'CR001',
                    updateStatus:       DesignUpdateStatus.UPDATE_PUBLISHED_DRAFT,
                    updateMergeAction:  DesignUpdateMergeAction.MERGE_INCLUDE,
                    updateWpStatus:     DesignUpdateWpStatus.DU_NO_WP_SCENARIOS,
                    updateTestStatus:   DesignUpdateTestStatus.DU_NO_SCENARIOS_PASSING,
                    updateWpTestStatus: DuWorkPackageTestStatus.DU_WPS_NOT_COMPLETE
                };

                const userContext = {
                    userId:             'USER1',
                    designId:           'DESIGN_01',
                    designVersionId:    'DESIGN_VERSION_01',
                    designUpdateId:     'DESIGN_UPDATE_01',
                    workPackageId:      'NONE',
                };

                const userRole = RoleType.GUEST_VIEWER;

                const item = testLayout(itemType, itemData, userContext, userRole);
                const expectedUiItem = hashID(UI.BUTTON_VIEW, 'DesignUpdate1');

                chai.assert.equal(item.find(expectedUiItem).length, 0, expectedUiItem + ' was  found');
            });

            it('has a view option for merged update for guest', () => {

                const itemType = ItemType.DESIGN_UPDATE;

                const itemData = {
                    _id:                'DESIGN_UPDATE_01',
                    designVersionId:    'DESIGN_VERSION_01',
                    updateName:         'DesignUpdate1',
                    updateReference:    'CR001',
                    updateStatus:       DesignUpdateStatus.UPDATE_MERGED,
                    updateMergeAction:  DesignUpdateMergeAction.MERGE_INCLUDE,
                    updateWpStatus:     DesignUpdateWpStatus.DU_NO_WP_SCENARIOS,
                    updateTestStatus:   DesignUpdateTestStatus.DU_NO_SCENARIOS_PASSING,
                    updateWpTestStatus: DuWorkPackageTestStatus.DU_WPS_NOT_COMPLETE
                };

                const userContext = {
                    userId:             'USER1',
                    designId:           'DESIGN_01',
                    designVersionId:    'DESIGN_VERSION_01',
                    designUpdateId:     'DESIGN_UPDATE_01',
                    workPackageId:      'NONE',
                };

                const userRole = RoleType.GUEST_VIEWER;

                const item = testLayout(itemType, itemData, userContext, userRole);
                const expectedUiItem = hashID(UI.BUTTON_VIEW, 'DesignUpdate1');

                chai.assert.equal(item.find(expectedUiItem).length, 1, expectedUiItem + ' not found');
            });
        });

        describe('The view option is only visible to a Designer for a New Design Update', () => {

            it('has no view option for developer', () => {

                const itemType = ItemType.DESIGN_UPDATE;

                const itemData = {
                    _id:                'DESIGN_UPDATE_01',
                    designVersionId:    'DESIGN_VERSION_01',
                    updateName:         'DesignUpdate1',
                    updateReference:    'CR001',
                    updateStatus:       DesignUpdateStatus.UPDATE_NEW,
                    updateMergeAction:  DesignUpdateMergeAction.MERGE_INCLUDE,
                    updateWpStatus:     DesignUpdateWpStatus.DU_NO_WP_SCENARIOS,
                    updateTestStatus:   DesignUpdateTestStatus.DU_NO_SCENARIOS_PASSING,
                    updateWpTestStatus: DuWorkPackageTestStatus.DU_WPS_NOT_COMPLETE
                };

                const userContext = {
                    userId:             'USER1',
                    designId:           'DESIGN_01',
                    designVersionId:    'DESIGN_VERSION_01',
                    designUpdateId:     'DESIGN_UPDATE_01',
                    workPackageId:      'NONE',
                };

                const userRole = RoleType.DEVELOPER;

                const item = testLayout(itemType, itemData, userContext, userRole);
                const expectedUiItem = hashID(UI.BUTTON_VIEW, 'DesignUpdate1');

                chai.assert.equal(item.find(expectedUiItem).length, 0, expectedUiItem + ' was found');
            });

            it('has no view option for manager', () => {

                const itemType = ItemType.DESIGN_UPDATE;

                const itemData = {
                    _id:                'DESIGN_UPDATE_01',
                    designVersionId:    'DESIGN_VERSION_01',
                    updateName:         'DesignUpdate1',
                    updateReference:    'CR001',
                    updateStatus:       DesignUpdateStatus.UPDATE_NEW,
                    updateMergeAction:  DesignUpdateMergeAction.MERGE_INCLUDE,
                    updateWpStatus:     DesignUpdateWpStatus.DU_NO_WP_SCENARIOS,
                    updateTestStatus:   DesignUpdateTestStatus.DU_NO_SCENARIOS_PASSING,
                    updateWpTestStatus: DuWorkPackageTestStatus.DU_WPS_NOT_COMPLETE
                };

                const userContext = {
                    userId:             'USER1',
                    designId:           'DESIGN_01',
                    designVersionId:    'DESIGN_VERSION_01',
                    designUpdateId:     'DESIGN_UPDATE_01',
                    workPackageId:      'NONE',
                };

                const userRole = RoleType.MANAGER;

                const item = testLayout(itemType, itemData, userContext, userRole);
                const expectedUiItem = hashID(UI.BUTTON_VIEW, 'DesignUpdate1');

                chai.assert.equal(item.find(expectedUiItem).length, 0, expectedUiItem + ' was found');
            });

            it('has no view option for guest', () => {

                const itemType = ItemType.DESIGN_UPDATE;

                const itemData = {
                    _id:                'DESIGN_UPDATE_01',
                    designVersionId:    'DESIGN_VERSION_01',
                    updateName:         'DesignUpdate1',
                    updateReference:    'CR001',
                    updateStatus:       DesignUpdateStatus.UPDATE_NEW,
                    updateMergeAction:  DesignUpdateMergeAction.MERGE_INCLUDE,
                    updateWpStatus:     DesignUpdateWpStatus.DU_NO_WP_SCENARIOS,
                    updateTestStatus:   DesignUpdateTestStatus.DU_NO_SCENARIOS_PASSING,
                    updateWpTestStatus: DuWorkPackageTestStatus.DU_WPS_NOT_COMPLETE
                };

                const userContext = {
                    userId:             'USER1',
                    designId:           'DESIGN_01',
                    designVersionId:    'DESIGN_VERSION_01',
                    designUpdateId:     'DESIGN_UPDATE_01',
                    workPackageId:      'NONE',
                };

                const userRole = RoleType.GUEST_VIEWER;

                const item = testLayout(itemType, itemData, userContext, userRole);
                const expectedUiItem = hashID(UI.BUTTON_VIEW, 'DesignUpdate1');

                chai.assert.equal(item.find(expectedUiItem).length, 0, expectedUiItem + ' was found');
            });
        });

        // Edit Update Content ---------------------------------------------------------------------------------------------

        describe('A Design Update item has an option to edit it', () => {

            it('has an edit option for new update for designer', () => {

                const itemType = ItemType.DESIGN_UPDATE;

                const itemData = {
                    _id:                'DESIGN_UPDATE_01',
                    designVersionId:    'DESIGN_VERSION_01',
                    updateName:         'DesignUpdate1',
                    updateReference:    'CR001',
                    updateStatus:       DesignUpdateStatus.UPDATE_NEW,
                    updateMergeAction:  DesignUpdateMergeAction.MERGE_INCLUDE,
                    updateWpStatus:     DesignUpdateWpStatus.DU_NO_WP_SCENARIOS,
                    updateTestStatus:   DesignUpdateTestStatus.DU_NO_SCENARIOS_PASSING,
                    updateWpTestStatus: DuWorkPackageTestStatus.DU_WPS_NOT_COMPLETE
                };

                const userContext = {
                    userId:             'USER1',
                    designId:           'DESIGN_01',
                    designVersionId:    'DESIGN_VERSION_01',
                    designUpdateId:     'DESIGN_UPDATE_01',
                    workPackageId:      'NONE',
                };

                const userRole = RoleType.DESIGNER;

                const item = testLayout(itemType, itemData, userContext, userRole);
                const expectedUiItem = hashID(UI.BUTTON_EDIT, 'DesignUpdate1');

                chai.assert.equal(item.find(expectedUiItem).length, 1, expectedUiItem + ' not found');
            });

            it('has an edit option for published update for designer', () => {

                const itemType = ItemType.DESIGN_UPDATE;

                const itemData = {
                    _id:                'DESIGN_UPDATE_01',
                    designVersionId:    'DESIGN_VERSION_01',
                    updateName:         'DesignUpdate1',
                    updateReference:    'CR001',
                    updateStatus:       DesignUpdateStatus.UPDATE_PUBLISHED_DRAFT,
                    updateMergeAction:  DesignUpdateMergeAction.MERGE_INCLUDE,
                    updateWpStatus:     DesignUpdateWpStatus.DU_NO_WP_SCENARIOS,
                    updateTestStatus:   DesignUpdateTestStatus.DU_NO_SCENARIOS_PASSING,
                    updateWpTestStatus: DuWorkPackageTestStatus.DU_WPS_NOT_COMPLETE
                };

                const userContext = {
                    userId:             'USER1',
                    designId:           'DESIGN_01',
                    designVersionId:    'DESIGN_VERSION_01',
                    designUpdateId:     'DESIGN_UPDATE_01',
                    workPackageId:      'NONE',
                };

                const userRole = RoleType.DESIGNER;

                const item = testLayout(itemType, itemData, userContext, userRole);
                const expectedUiItem = hashID(UI.BUTTON_EDIT, 'DesignUpdate1');

                chai.assert.equal(item.find(expectedUiItem).length, 1, expectedUiItem + ' not found');
            });
        });

        describe('The edit option on a Complete Design Update is not visible for a Designer', () => {

            it('has no edit option for designer', () => {

                const itemType = ItemType.DESIGN_UPDATE;

                const itemData = {
                    _id:                'DESIGN_UPDATE_01',
                    designVersionId:    'DESIGN_VERSION_01',
                    updateName:         'DesignUpdate1',
                    updateReference:    'CR001',
                    updateStatus:       DesignUpdateStatus.UPDATE_MERGED,
                    updateMergeAction:  DesignUpdateMergeAction.MERGE_INCLUDE,
                    updateWpStatus:     DesignUpdateWpStatus.DU_NO_WP_SCENARIOS,
                    updateTestStatus:   DesignUpdateTestStatus.DU_NO_SCENARIOS_PASSING,
                    updateWpTestStatus: DuWorkPackageTestStatus.DU_WPS_NOT_COMPLETE
                };

                const userContext = {
                    userId:             'USER1',
                    designId:           'DESIGN_01',
                    designVersionId:    'DESIGN_VERSION_01',
                    designUpdateId:     'DESIGN_UPDATE_01',
                    workPackageId:      'NONE',
                };

                const userRole = RoleType.DESIGNER;

                const item = testLayout(itemType, itemData, userContext, userRole);
                const expectedUiItem = hashID(UI.BUTTON_EDIT, 'DesignUpdate1');

                chai.assert.equal(item.find(expectedUiItem).length, 0, expectedUiItem + ' was found');
            });
        });

        describe('The edit option on a Design Update is only visible for a Designer', () => {

            it('developer has no edit option for new design update', () => {

                const itemType = ItemType.DESIGN_UPDATE;

                const itemData = {
                    _id:                'DESIGN_UPDATE_01',
                    designVersionId:    'DESIGN_VERSION_01',
                    updateName:         'DesignUpdate1',
                    updateReference:    'CR001',
                    updateStatus:       DesignUpdateStatus.UPDATE_NEW,
                    updateMergeAction:  DesignUpdateMergeAction.MERGE_INCLUDE,
                    updateWpStatus:     DesignUpdateWpStatus.DU_NO_WP_SCENARIOS,
                    updateTestStatus:   DesignUpdateTestStatus.DU_NO_SCENARIOS_PASSING,
                    updateWpTestStatus: DuWorkPackageTestStatus.DU_WPS_NOT_COMPLETE
                };

                const userContext = {
                    userId:             'USER1',
                    designId:           'DESIGN_01',
                    designVersionId:    'DESIGN_VERSION_01',
                    designUpdateId:     'DESIGN_UPDATE_01',
                    workPackageId:      'NONE',
                };

                const userRole = RoleType.DEVELOPER;

                const item = testLayout(itemType, itemData, userContext, userRole);
                const expectedUiItem = hashID(UI.BUTTON_EDIT, 'DesignUpdate1');

                chai.assert.equal(item.find(expectedUiItem).length, 0, expectedUiItem + ' was found');
            });

            it('developer has no edit option for published design update', () => {

                const itemType = ItemType.DESIGN_UPDATE;

                const itemData = {
                    _id:                'DESIGN_UPDATE_01',
                    designVersionId:    'DESIGN_VERSION_01',
                    updateName:         'DesignUpdate1',
                    updateReference:    'CR001',
                    updateStatus:       DesignUpdateStatus.UPDATE_PUBLISHED_DRAFT,
                    updateMergeAction:  DesignUpdateMergeAction.MERGE_INCLUDE,
                    updateWpStatus:     DesignUpdateWpStatus.DU_NO_WP_SCENARIOS,
                    updateTestStatus:   DesignUpdateTestStatus.DU_NO_SCENARIOS_PASSING,
                    updateWpTestStatus: DuWorkPackageTestStatus.DU_WPS_NOT_COMPLETE
                };

                const userContext = {
                    userId:             'USER1',
                    designId:           'DESIGN_01',
                    designVersionId:    'DESIGN_VERSION_01',
                    designUpdateId:     'DESIGN_UPDATE_01',
                    workPackageId:      'NONE',
                };

                const userRole = RoleType.DEVELOPER;

                const item = testLayout(itemType, itemData, userContext, userRole);
                const expectedUiItem = hashID(UI.BUTTON_EDIT, 'DesignUpdate1');

                chai.assert.equal(item.find(expectedUiItem).length, 0, expectedUiItem + ' was found');
            });

            it('developer has no edit option for merged design update', () => {

                const itemType = ItemType.DESIGN_UPDATE;

                const itemData = {
                    _id:                'DESIGN_UPDATE_01',
                    designVersionId:    'DESIGN_VERSION_01',
                    updateName:         'DesignUpdate1',
                    updateReference:    'CR001',
                    updateStatus:       DesignUpdateStatus.UPDATE_MERGED,
                    updateMergeAction:  DesignUpdateMergeAction.MERGE_INCLUDE,
                    updateWpStatus:     DesignUpdateWpStatus.DU_NO_WP_SCENARIOS,
                    updateTestStatus:   DesignUpdateTestStatus.DU_NO_SCENARIOS_PASSING,
                    updateWpTestStatus: DuWorkPackageTestStatus.DU_WPS_NOT_COMPLETE
                };

                const userContext = {
                    userId:             'USER1',
                    designId:           'DESIGN_01',
                    designVersionId:    'DESIGN_VERSION_01',
                    designUpdateId:     'DESIGN_UPDATE_01',
                    workPackageId:      'NONE',
                };

                const userRole = RoleType.DEVELOPER;

                const item = testLayout(itemType, itemData, userContext, userRole);
                const expectedUiItem = hashID(UI.BUTTON_EDIT, 'DesignUpdate1');

                chai.assert.equal(item.find(expectedUiItem).length, 0, expectedUiItem + ' was found');
            });

            it('manager has no edit option for new design update', () => {

                const itemType = ItemType.DESIGN_UPDATE;

                const itemData = {
                    _id:                'DESIGN_UPDATE_01',
                    designVersionId:    'DESIGN_VERSION_01',
                    updateName:         'DesignUpdate1',
                    updateReference:    'CR001',
                    updateStatus:       DesignUpdateStatus.UPDATE_NEW,
                    updateMergeAction:  DesignUpdateMergeAction.MERGE_INCLUDE,
                    updateWpStatus:     DesignUpdateWpStatus.DU_NO_WP_SCENARIOS,
                    updateTestStatus:   DesignUpdateTestStatus.DU_NO_SCENARIOS_PASSING,
                    updateWpTestStatus: DuWorkPackageTestStatus.DU_WPS_NOT_COMPLETE
                };

                const userContext = {
                    userId:             'USER1',
                    designId:           'DESIGN_01',
                    designVersionId:    'DESIGN_VERSION_01',
                    designUpdateId:     'DESIGN_UPDATE_01',
                    workPackageId:      'NONE',
                };

                const userRole = RoleType.MANAGER;

                const item = testLayout(itemType, itemData, userContext, userRole);
                const expectedUiItem = hashID(UI.BUTTON_EDIT, 'DesignUpdate1');

                chai.assert.equal(item.find(expectedUiItem).length, 0, expectedUiItem + ' was found');
            });

            it('manager has no edit option for published design update', () => {

                const itemType = ItemType.DESIGN_UPDATE;

                const itemData = {
                    _id:                'DESIGN_UPDATE_01',
                    designVersionId:    'DESIGN_VERSION_01',
                    updateName:         'DesignUpdate1',
                    updateReference:    'CR001',
                    updateStatus:       DesignUpdateStatus.UPDATE_PUBLISHED_DRAFT,
                    updateMergeAction:  DesignUpdateMergeAction.MERGE_INCLUDE,
                    updateWpStatus:     DesignUpdateWpStatus.DU_NO_WP_SCENARIOS,
                    updateTestStatus:   DesignUpdateTestStatus.DU_NO_SCENARIOS_PASSING,
                    updateWpTestStatus: DuWorkPackageTestStatus.DU_WPS_NOT_COMPLETE
                };

                const userContext = {
                    userId:             'USER1',
                    designId:           'DESIGN_01',
                    designVersionId:    'DESIGN_VERSION_01',
                    designUpdateId:     'DESIGN_UPDATE_01',
                    workPackageId:      'NONE',
                };

                const userRole = RoleType.MANAGER;

                const item = testLayout(itemType, itemData, userContext, userRole);
                const expectedUiItem = hashID(UI.BUTTON_EDIT, 'DesignUpdate1');

                chai.assert.equal(item.find(expectedUiItem).length, 0, expectedUiItem + ' was found');
            });

            it('manager has no edit option for merged design update', () => {

                const itemType = ItemType.DESIGN_UPDATE;

                const itemData = {
                    _id:                'DESIGN_UPDATE_01',
                    designVersionId:    'DESIGN_VERSION_01',
                    updateName:         'DesignUpdate1',
                    updateReference:    'CR001',
                    updateStatus:       DesignUpdateStatus.UPDATE_MERGED,
                    updateMergeAction:  DesignUpdateMergeAction.MERGE_INCLUDE,
                    updateWpStatus:     DesignUpdateWpStatus.DU_NO_WP_SCENARIOS,
                    updateTestStatus:   DesignUpdateTestStatus.DU_NO_SCENARIOS_PASSING,
                    updateWpTestStatus: DuWorkPackageTestStatus.DU_WPS_NOT_COMPLETE
                };

                const userContext = {
                    userId:             'USER1',
                    designId:           'DESIGN_01',
                    designVersionId:    'DESIGN_VERSION_01',
                    designUpdateId:     'DESIGN_UPDATE_01',
                    workPackageId:      'NONE',
                };

                const userRole = RoleType.MANAGER;

                const item = testLayout(itemType, itemData, userContext, userRole);
                const expectedUiItem = hashID(UI.BUTTON_EDIT, 'DesignUpdate1');

                chai.assert.equal(item.find(expectedUiItem).length, 0, expectedUiItem + ' was found');
            });

            it('guest has no edit option for new design update', () => {

                const itemType = ItemType.DESIGN_UPDATE;

                const itemData = {
                    _id:                'DESIGN_UPDATE_01',
                    designVersionId:    'DESIGN_VERSION_01',
                    updateName:         'DesignUpdate1',
                    updateReference:    'CR001',
                    updateStatus:       DesignUpdateStatus.UPDATE_NEW,
                    updateMergeAction:  DesignUpdateMergeAction.MERGE_INCLUDE,
                    updateWpStatus:     DesignUpdateWpStatus.DU_NO_WP_SCENARIOS,
                    updateTestStatus:   DesignUpdateTestStatus.DU_NO_SCENARIOS_PASSING,
                    updateWpTestStatus: DuWorkPackageTestStatus.DU_WPS_NOT_COMPLETE
                };

                const userContext = {
                    userId:             'USER1',
                    designId:           'DESIGN_01',
                    designVersionId:    'DESIGN_VERSION_01',
                    designUpdateId:     'DESIGN_UPDATE_01',
                    workPackageId:      'NONE',
                };

                const userRole = RoleType.GUEST_VIEWER;

                const item = testLayout(itemType, itemData, userContext, userRole);
                const expectedUiItem = hashID(UI.BUTTON_EDIT, 'DesignUpdate1');

                chai.assert.equal(item.find(expectedUiItem).length, 0, expectedUiItem + ' was found');
            });

            it('guest has no edit option for published design update', () => {

                const itemType = ItemType.DESIGN_UPDATE;

                const itemData = {
                    _id:                'DESIGN_UPDATE_01',
                    designVersionId:    'DESIGN_VERSION_01',
                    updateName:         'DesignUpdate1',
                    updateReference:    'CR001',
                    updateStatus:       DesignUpdateStatus.UPDATE_PUBLISHED_DRAFT,
                    updateMergeAction:  DesignUpdateMergeAction.MERGE_INCLUDE,
                    updateWpStatus:     DesignUpdateWpStatus.DU_NO_WP_SCENARIOS,
                    updateTestStatus:   DesignUpdateTestStatus.DU_NO_SCENARIOS_PASSING,
                    updateWpTestStatus: DuWorkPackageTestStatus.DU_WPS_NOT_COMPLETE
                };

                const userContext = {
                    userId:             'USER1',
                    designId:           'DESIGN_01',
                    designVersionId:    'DESIGN_VERSION_01',
                    designUpdateId:     'DESIGN_UPDATE_01',
                    workPackageId:      'NONE',
                };

                const userRole = RoleType.GUEST_VIEWER;

                const item = testLayout(itemType, itemData, userContext, userRole);
                const expectedUiItem = hashID(UI.BUTTON_EDIT, 'DesignUpdate1');

                chai.assert.equal(item.find(expectedUiItem).length, 0, expectedUiItem + ' was found');
            });

            it('guest has no edit option for merged design update', () => {

                const itemType = ItemType.DESIGN_UPDATE;

                const itemData = {
                    _id:                'DESIGN_UPDATE_01',
                    designVersionId:    'DESIGN_VERSION_01',
                    updateName:         'DesignUpdate1',
                    updateReference:    'CR001',
                    updateStatus:       DesignUpdateStatus.UPDATE_MERGED,
                    updateMergeAction:  DesignUpdateMergeAction.MERGE_INCLUDE,
                    updateWpStatus:     DesignUpdateWpStatus.DU_NO_WP_SCENARIOS,
                    updateTestStatus:   DesignUpdateTestStatus.DU_NO_SCENARIOS_PASSING,
                    updateWpTestStatus: DuWorkPackageTestStatus.DU_WPS_NOT_COMPLETE
                };

                const userContext = {
                    userId:             'USER1',
                    designId:           'DESIGN_01',
                    designVersionId:    'DESIGN_VERSION_01',
                    designUpdateId:     'DESIGN_UPDATE_01',
                    workPackageId:      'NONE',
                };

                const userRole = RoleType.GUEST_VIEWER;

                const item = testLayout(itemType, itemData, userContext, userRole);
                const expectedUiItem = hashID(UI.BUTTON_EDIT, 'DesignUpdate1');

                chai.assert.equal(item.find(expectedUiItem).length, 0, expectedUiItem + ' was found');
            });
        });

        // Publish -----------------------------------------------------------------------------------------------------

        describe('A New Design Update item has an option to publish it', () => {

            it('has a publish option for new update for designer', () => {

                const itemType = ItemType.DESIGN_UPDATE;

                const itemData = {
                    _id:                'DESIGN_UPDATE_01',
                    designVersionId:    'DESIGN_VERSION_01',
                    updateName:         'DesignUpdate1',
                    updateReference:    'CR001',
                    updateStatus:       DesignUpdateStatus.UPDATE_NEW,
                    updateMergeAction:  DesignUpdateMergeAction.MERGE_INCLUDE,
                    updateWpStatus:     DesignUpdateWpStatus.DU_NO_WP_SCENARIOS,
                    updateTestStatus:   DesignUpdateTestStatus.DU_NO_SCENARIOS_PASSING,
                    updateWpTestStatus: DuWorkPackageTestStatus.DU_WPS_NOT_COMPLETE
                };

                const userContext = {
                    userId:             'USER1',
                    designId:           'DESIGN_01',
                    designVersionId:    'DESIGN_VERSION_01',
                    designUpdateId:     'DESIGN_UPDATE_01',
                    workPackageId:      'NONE',
                };

                const userRole = RoleType.DESIGNER;

                const item = testLayout(itemType, itemData, userContext, userRole);
                const expectedUiItem = hashID(UI.BUTTON_PUBLISH, 'DesignUpdate1');

                chai.assert.equal(item.find(expectedUiItem).length, 1, expectedUiItem + ' not found');
            });

        });

        describe('The publish option is only visible to Designers for New Design Updates', () => {

            it('designer has no publish option for published design update', () => {

                const itemType = ItemType.DESIGN_UPDATE;

                const itemData = {
                    _id:                'DESIGN_UPDATE_01',
                    designVersionId:    'DESIGN_VERSION_01',
                    updateName:         'DesignUpdate1',
                    updateReference:    'CR001',
                    updateStatus:       DesignUpdateStatus.UPDATE_PUBLISHED_DRAFT,
                    updateMergeAction:  DesignUpdateMergeAction.MERGE_INCLUDE,
                    updateWpStatus:     DesignUpdateWpStatus.DU_NO_WP_SCENARIOS,
                    updateTestStatus:   DesignUpdateTestStatus.DU_NO_SCENARIOS_PASSING,
                    updateWpTestStatus: DuWorkPackageTestStatus.DU_WPS_NOT_COMPLETE
                };

                const userContext = {
                    userId:             'USER1',
                    designId:           'DESIGN_01',
                    designVersionId:    'DESIGN_VERSION_01',
                    designUpdateId:     'DESIGN_UPDATE_01',
                    workPackageId:      'NONE',
                };

                const userRole = RoleType.DESIGNER;

                const item = testLayout(itemType, itemData, userContext, userRole);
                const expectedUiItem = hashID(UI.BUTTON_PUBLISH, 'DesignUpdate1');

                chai.assert.equal(item.find(expectedUiItem).length, 0, expectedUiItem + ' was found');
            });

            it('designer has no publish option for merged design update', () => {

                const itemType = ItemType.DESIGN_UPDATE;

                const itemData = {
                    _id:                'DESIGN_UPDATE_01',
                    designVersionId:    'DESIGN_VERSION_01',
                    updateName:         'DesignUpdate1',
                    updateReference:    'CR001',
                    updateStatus:       DesignUpdateStatus.UPDATE_MERGED,
                    updateMergeAction:  DesignUpdateMergeAction.MERGE_INCLUDE,
                    updateWpStatus:     DesignUpdateWpStatus.DU_NO_WP_SCENARIOS,
                    updateTestStatus:   DesignUpdateTestStatus.DU_NO_SCENARIOS_PASSING,
                    updateWpTestStatus: DuWorkPackageTestStatus.DU_WPS_NOT_COMPLETE
                };

                const userContext = {
                    userId:             'USER1',
                    designId:           'DESIGN_01',
                    designVersionId:    'DESIGN_VERSION_01',
                    designUpdateId:     'DESIGN_UPDATE_01',
                    workPackageId:      'NONE',
                };

                const userRole = RoleType.DESIGNER;

                const item = testLayout(itemType, itemData, userContext, userRole);
                const expectedUiItem = hashID(UI.BUTTON_PUBLISH, 'DesignUpdate1');

                chai.assert.equal(item.find(expectedUiItem).length, 0, expectedUiItem + ' was found');
            });

            it('developer has no publish option for new update', () => {

                const itemType = ItemType.DESIGN_UPDATE;

                const itemData = {
                    _id:                'DESIGN_UPDATE_01',
                    designVersionId:    'DESIGN_VERSION_01',
                    updateName:         'DesignUpdate1',
                    updateReference:    'CR001',
                    updateStatus:       DesignUpdateStatus.UPDATE_NEW,
                    updateMergeAction:  DesignUpdateMergeAction.MERGE_INCLUDE,
                    updateWpStatus:     DesignUpdateWpStatus.DU_NO_WP_SCENARIOS,
                    updateTestStatus:   DesignUpdateTestStatus.DU_NO_SCENARIOS_PASSING,
                    updateWpTestStatus: DuWorkPackageTestStatus.DU_WPS_NOT_COMPLETE
                };

                const userContext = {
                    userId:             'USER1',
                    designId:           'DESIGN_01',
                    designVersionId:    'DESIGN_VERSION_01',
                    designUpdateId:     'DESIGN_UPDATE_01',
                    workPackageId:      'NONE',
                };

                const userRole = RoleType.DEVELOPER;

                const item = testLayout(itemType, itemData, userContext, userRole);
                const expectedUiItem = hashID(UI.BUTTON_PUBLISH, 'DesignUpdate1');

                chai.assert.equal(item.find(expectedUiItem).length, 0, expectedUiItem + ' was found');
            });

            it('developer has no publish option for published update', () => {

                const itemType = ItemType.DESIGN_UPDATE;

                const itemData = {
                    _id:                'DESIGN_UPDATE_01',
                    designVersionId:    'DESIGN_VERSION_01',
                    updateName:         'DesignUpdate1',
                    updateReference:    'CR001',
                    updateStatus:       DesignUpdateStatus.UPDATE_PUBLISHED_DRAFT,
                    updateMergeAction:  DesignUpdateMergeAction.MERGE_INCLUDE,
                    updateWpStatus:     DesignUpdateWpStatus.DU_NO_WP_SCENARIOS,
                    updateTestStatus:   DesignUpdateTestStatus.DU_NO_SCENARIOS_PASSING,
                    updateWpTestStatus: DuWorkPackageTestStatus.DU_WPS_NOT_COMPLETE
                };

                const userContext = {
                    userId:             'USER1',
                    designId:           'DESIGN_01',
                    designVersionId:    'DESIGN_VERSION_01',
                    designUpdateId:     'DESIGN_UPDATE_01',
                    workPackageId:      'NONE',
                };

                const userRole = RoleType.DEVELOPER;

                const item = testLayout(itemType, itemData, userContext, userRole);
                const expectedUiItem = hashID(UI.BUTTON_PUBLISH, 'DesignUpdate1');

                chai.assert.equal(item.find(expectedUiItem).length, 0, expectedUiItem + ' was found');
            });

            it('developer has no publish option for merged update', () => {

                const itemType = ItemType.DESIGN_UPDATE;

                const itemData = {
                    _id:                'DESIGN_UPDATE_01',
                    designVersionId:    'DESIGN_VERSION_01',
                    updateName:         'DesignUpdate1',
                    updateReference:    'CR001',
                    updateStatus:       DesignUpdateStatus.UPDATE_MERGED,
                    updateMergeAction:  DesignUpdateMergeAction.MERGE_INCLUDE,
                    updateWpStatus:     DesignUpdateWpStatus.DU_NO_WP_SCENARIOS,
                    updateTestStatus:   DesignUpdateTestStatus.DU_NO_SCENARIOS_PASSING,
                    updateWpTestStatus: DuWorkPackageTestStatus.DU_WPS_NOT_COMPLETE
                };

                const userContext = {
                    userId:             'USER1',
                    designId:           'DESIGN_01',
                    designVersionId:    'DESIGN_VERSION_01',
                    designUpdateId:     'DESIGN_UPDATE_01',
                    workPackageId:      'NONE',
                };

                const userRole = RoleType.DEVELOPER;

                const item = testLayout(itemType, itemData, userContext, userRole);
                const expectedUiItem = hashID(UI.BUTTON_PUBLISH, 'DesignUpdate1');

                chai.assert.equal(item.find(expectedUiItem).length, 0, expectedUiItem + ' was found');
            });

            it('manager has no publish option for new design update', () => {

                const itemType = ItemType.DESIGN_UPDATE;

                const itemData = {
                    _id:                'DESIGN_UPDATE_01',
                    designVersionId:    'DESIGN_VERSION_01',
                    updateName:         'DesignUpdate1',
                    updateReference:    'CR001',
                    updateStatus:       DesignUpdateStatus.UPDATE_NEW,
                    updateMergeAction:  DesignUpdateMergeAction.MERGE_INCLUDE,
                    updateWpStatus:     DesignUpdateWpStatus.DU_NO_WP_SCENARIOS,
                    updateTestStatus:   DesignUpdateTestStatus.DU_NO_SCENARIOS_PASSING,
                    updateWpTestStatus: DuWorkPackageTestStatus.DU_WPS_NOT_COMPLETE
                };

                const userContext = {
                    userId:             'USER1',
                    designId:           'DESIGN_01',
                    designVersionId:    'DESIGN_VERSION_01',
                    designUpdateId:     'DESIGN_UPDATE_01',
                    workPackageId:      'NONE',
                };

                const userRole = RoleType.MANAGER;

                const item = testLayout(itemType, itemData, userContext, userRole);
                const expectedUiItem = hashID(UI.BUTTON_PUBLISH, 'DesignUpdate1');

                chai.assert.equal(item.find(expectedUiItem).length, 0, expectedUiItem + ' was found');
            });

            it('manager has no publish option for published design update', () => {

                const itemType = ItemType.DESIGN_UPDATE;

                const itemData = {
                    _id:                'DESIGN_UPDATE_01',
                    designVersionId:    'DESIGN_VERSION_01',
                    updateName:         'DesignUpdate1',
                    updateReference:    'CR001',
                    updateStatus:       DesignUpdateStatus.UPDATE_PUBLISHED_DRAFT,
                    updateMergeAction:  DesignUpdateMergeAction.MERGE_INCLUDE,
                    updateWpStatus:     DesignUpdateWpStatus.DU_NO_WP_SCENARIOS,
                    updateTestStatus:   DesignUpdateTestStatus.DU_NO_SCENARIOS_PASSING,
                    updateWpTestStatus: DuWorkPackageTestStatus.DU_WPS_NOT_COMPLETE
                };

                const userContext = {
                    userId:             'USER1',
                    designId:           'DESIGN_01',
                    designVersionId:    'DESIGN_VERSION_01',
                    designUpdateId:     'DESIGN_UPDATE_01',
                    workPackageId:      'NONE',
                };

                const userRole = RoleType.MANAGER;

                const item = testLayout(itemType, itemData, userContext, userRole);
                const expectedUiItem = hashID(UI.BUTTON_PUBLISH, 'DesignUpdate1');

                chai.assert.equal(item.find(expectedUiItem).length, 0, expectedUiItem + ' was found');
            });

            it('manager has no publish option for merged design update', () => {

                const itemType = ItemType.DESIGN_UPDATE;

                const itemData = {
                    _id:                'DESIGN_UPDATE_01',
                    designVersionId:    'DESIGN_VERSION_01',
                    updateName:         'DesignUpdate1',
                    updateReference:    'CR001',
                    updateStatus:       DesignUpdateStatus.UPDATE_MERGED,
                    updateMergeAction:  DesignUpdateMergeAction.MERGE_INCLUDE,
                    updateWpStatus:     DesignUpdateWpStatus.DU_NO_WP_SCENARIOS,
                    updateTestStatus:   DesignUpdateTestStatus.DU_NO_SCENARIOS_PASSING,
                    updateWpTestStatus: DuWorkPackageTestStatus.DU_WPS_NOT_COMPLETE
                };

                const userContext = {
                    userId:             'USER1',
                    designId:           'DESIGN_01',
                    designVersionId:    'DESIGN_VERSION_01',
                    designUpdateId:     'DESIGN_UPDATE_01',
                    workPackageId:      'NONE',
                };

                const userRole = RoleType.MANAGER;

                const item = testLayout(itemType, itemData, userContext, userRole);
                const expectedUiItem = hashID(UI.BUTTON_PUBLISH, 'DesignUpdate1');

                chai.assert.equal(item.find(expectedUiItem).length, 0, expectedUiItem + ' was found');
            });

            it('guest has no publish option for new design update', () => {

                const itemType = ItemType.DESIGN_UPDATE;

                const itemData = {
                    _id:                'DESIGN_UPDATE_01',
                    designVersionId:    'DESIGN_VERSION_01',
                    updateName:         'DesignUpdate1',
                    updateReference:    'CR001',
                    updateStatus:       DesignUpdateStatus.UPDATE_NEW,
                    updateMergeAction:  DesignUpdateMergeAction.MERGE_INCLUDE,
                    updateWpStatus:     DesignUpdateWpStatus.DU_NO_WP_SCENARIOS,
                    updateTestStatus:   DesignUpdateTestStatus.DU_NO_SCENARIOS_PASSING,
                    updateWpTestStatus: DuWorkPackageTestStatus.DU_WPS_NOT_COMPLETE
                };

                const userContext = {
                    userId:             'USER1',
                    designId:           'DESIGN_01',
                    designVersionId:    'DESIGN_VERSION_01',
                    designUpdateId:     'DESIGN_UPDATE_01',
                    workPackageId:      'NONE',
                };

                const userRole = RoleType.GUEST_VIEWER;

                const item = testLayout(itemType, itemData, userContext, userRole);
                const expectedUiItem = hashID(UI.BUTTON_PUBLISH, 'DesignUpdate1');

                chai.assert.equal(item.find(expectedUiItem).length, 0, expectedUiItem + ' was found');
            });

            it('guest has no publish option for published design update', () => {

                const itemType = ItemType.DESIGN_UPDATE;

                const itemData = {
                    _id:                'DESIGN_UPDATE_01',
                    designVersionId:    'DESIGN_VERSION_01',
                    updateName:         'DesignUpdate1',
                    updateReference:    'CR001',
                    updateStatus:       DesignUpdateStatus.UPDATE_PUBLISHED_DRAFT,
                    updateMergeAction:  DesignUpdateMergeAction.MERGE_INCLUDE,
                    updateWpStatus:     DesignUpdateWpStatus.DU_NO_WP_SCENARIOS,
                    updateTestStatus:   DesignUpdateTestStatus.DU_NO_SCENARIOS_PASSING,
                    updateWpTestStatus: DuWorkPackageTestStatus.DU_WPS_NOT_COMPLETE
                };

                const userContext = {
                    userId:             'USER1',
                    designId:           'DESIGN_01',
                    designVersionId:    'DESIGN_VERSION_01',
                    designUpdateId:     'DESIGN_UPDATE_01',
                    workPackageId:      'NONE',
                };

                const userRole = RoleType.GUEST_VIEWER;

                const item = testLayout(itemType, itemData, userContext, userRole);
                const expectedUiItem = hashID(UI.BUTTON_PUBLISH, 'DesignUpdate1');

                chai.assert.equal(item.find(expectedUiItem).length, 0, expectedUiItem + ' was found');
            });

            it('guest has no publish option for merged design update', () => {

                const itemType = ItemType.DESIGN_UPDATE;

                const itemData = {
                    _id:                'DESIGN_UPDATE_01',
                    designVersionId:    'DESIGN_VERSION_01',
                    updateName:         'DesignUpdate1',
                    updateReference:    'CR001',
                    updateStatus:       DesignUpdateStatus.UPDATE_MERGED,
                    updateMergeAction:  DesignUpdateMergeAction.MERGE_INCLUDE,
                    updateWpStatus:     DesignUpdateWpStatus.DU_NO_WP_SCENARIOS,
                    updateTestStatus:   DesignUpdateTestStatus.DU_NO_SCENARIOS_PASSING,
                    updateWpTestStatus: DuWorkPackageTestStatus.DU_WPS_NOT_COMPLETE
                };

                const userContext = {
                    userId:             'USER1',
                    designId:           'DESIGN_01',
                    designVersionId:    'DESIGN_VERSION_01',
                    designUpdateId:     'DESIGN_UPDATE_01',
                    workPackageId:      'NONE',
                };

                const userRole = RoleType.GUEST_VIEWER;

                const item = testLayout(itemType, itemData, userContext, userRole);
                const expectedUiItem = hashID(UI.BUTTON_PUBLISH, 'DesignUpdate1');

                chai.assert.equal(item.find(expectedUiItem).length, 0, expectedUiItem + ' was found');
            });
        });

        // Withdraw ----------------------------------------------------------------------------------------------------

        describe('A Draft Design Update has an option to withdraw it', () => {

            it('has a withdraw option for published update for designer', () => {

                const itemType = ItemType.DESIGN_UPDATE;

                const itemData = {
                    _id:                'DESIGN_UPDATE_01',
                    designVersionId:    'DESIGN_VERSION_01',
                    updateName:         'DesignUpdate1',
                    updateReference:    'CR001',
                    updateStatus:       DesignUpdateStatus.UPDATE_PUBLISHED_DRAFT,
                    updateMergeAction:  DesignUpdateMergeAction.MERGE_INCLUDE,
                    updateWpStatus:     DesignUpdateWpStatus.DU_NO_WP_SCENARIOS,
                    updateTestStatus:   DesignUpdateTestStatus.DU_NO_SCENARIOS_PASSING,
                    updateWpTestStatus: DuWorkPackageTestStatus.DU_WPS_NOT_COMPLETE
                };

                const userContext = {
                    userId:             'USER1',
                    designId:           'DESIGN_01',
                    designVersionId:    'DESIGN_VERSION_01',
                    designUpdateId:     'DESIGN_UPDATE_01',
                    workPackageId:      'NONE',
                };

                const userRole = RoleType.DESIGNER;

                const item = testLayout(itemType, itemData, userContext, userRole);
                const expectedUiItem = hashID(UI.BUTTON_WITHDRAW, 'DesignUpdate1');

                chai.assert.equal(item.find(expectedUiItem).length, 1, expectedUiItem + ' not found');
            });
        });

        describe('The withdraw option is only visible to Designers for Draft Design Updates', () => {

            it('new has no withdraw option for designer', () => {

                const itemType = ItemType.DESIGN_UPDATE;

                const itemData = {
                    _id:                'DESIGN_UPDATE_01',
                    designVersionId:    'DESIGN_VERSION_01',
                    updateName:         'DesignUpdate1',
                    updateReference:    'CR001',
                    updateStatus:       DesignUpdateStatus.UPDATE_NEW,
                    updateMergeAction:  DesignUpdateMergeAction.MERGE_INCLUDE,
                    updateWpStatus:     DesignUpdateWpStatus.DU_NO_WP_SCENARIOS,
                    updateTestStatus:   DesignUpdateTestStatus.DU_NO_SCENARIOS_PASSING,
                    updateWpTestStatus: DuWorkPackageTestStatus.DU_WPS_NOT_COMPLETE
                };

                const userContext = {
                    userId:             'USER1',
                    designId:           'DESIGN_01',
                    designVersionId:    'DESIGN_VERSION_01',
                    designUpdateId:     'DESIGN_UPDATE_01',
                    workPackageId:      'NONE',
                };

                const userRole = RoleType.DESIGNER;

                const item = testLayout(itemType, itemData, userContext, userRole);
                const expectedUiItem = hashID(UI.BUTTON_WITHDRAW, 'DesignUpdate1');

                chai.assert.equal(item.find(expectedUiItem).length, 0, expectedUiItem + ' was found');
            });

            it('new has no withdraw option for developer', () => {

                const itemType = ItemType.DESIGN_UPDATE;

                const itemData = {
                    _id:                'DESIGN_UPDATE_01',
                    designVersionId:    'DESIGN_VERSION_01',
                    updateName:         'DesignUpdate1',
                    updateReference:    'CR001',
                    updateStatus:       DesignUpdateStatus.UPDATE_NEW,
                    updateMergeAction:  DesignUpdateMergeAction.MERGE_INCLUDE,
                    updateWpStatus:     DesignUpdateWpStatus.DU_NO_WP_SCENARIOS,
                    updateTestStatus:   DesignUpdateTestStatus.DU_NO_SCENARIOS_PASSING,
                    updateWpTestStatus: DuWorkPackageTestStatus.DU_WPS_NOT_COMPLETE
                };

                const userContext = {
                    userId:             'USER1',
                    designId:           'DESIGN_01',
                    designVersionId:    'DESIGN_VERSION_01',
                    designUpdateId:     'DESIGN_UPDATE_01',
                    workPackageId:      'NONE',
                };

                const userRole = RoleType.DEVELOPER;

                const item = testLayout(itemType, itemData, userContext, userRole);
                const expectedUiItem = hashID(UI.BUTTON_WITHDRAW, 'DesignUpdate1');

                chai.assert.equal(item.find(expectedUiItem).length, 0, expectedUiItem + ' was found');
            });

            it('new has no withdraw option for manager', () => {

                const itemType = ItemType.DESIGN_UPDATE;

                const itemData = {
                    _id:                'DESIGN_UPDATE_01',
                    designVersionId:    'DESIGN_VERSION_01',
                    updateName:         'DesignUpdate1',
                    updateReference:    'CR001',
                    updateStatus:       DesignUpdateStatus.UPDATE_NEW,
                    updateMergeAction:  DesignUpdateMergeAction.MERGE_INCLUDE,
                    updateWpStatus:     DesignUpdateWpStatus.DU_NO_WP_SCENARIOS,
                    updateTestStatus:   DesignUpdateTestStatus.DU_NO_SCENARIOS_PASSING,
                    updateWpTestStatus: DuWorkPackageTestStatus.DU_WPS_NOT_COMPLETE
                };

                const userContext = {
                    userId:             'USER1',
                    designId:           'DESIGN_01',
                    designVersionId:    'DESIGN_VERSION_01',
                    designUpdateId:     'DESIGN_UPDATE_01',
                    workPackageId:      'NONE',
                };

                const userRole = RoleType.MANAGER;

                const item = testLayout(itemType, itemData, userContext, userRole);
                const expectedUiItem = hashID(UI.BUTTON_WITHDRAW, 'DesignUpdate1');

                chai.assert.equal(item.find(expectedUiItem).length, 0, expectedUiItem + ' was found');
            });

            it('new has no withdraw option for guest', () => {

                const itemType = ItemType.DESIGN_UPDATE;

                const itemData = {
                    _id:                'DESIGN_UPDATE_01',
                    designVersionId:    'DESIGN_VERSION_01',
                    updateName:         'DesignUpdate1',
                    updateReference:    'CR001',
                    updateStatus:       DesignUpdateStatus.UPDATE_NEW,
                    updateMergeAction:  DesignUpdateMergeAction.MERGE_INCLUDE,
                    updateWpStatus:     DesignUpdateWpStatus.DU_NO_WP_SCENARIOS,
                    updateTestStatus:   DesignUpdateTestStatus.DU_NO_SCENARIOS_PASSING,
                    updateWpTestStatus: DuWorkPackageTestStatus.DU_WPS_NOT_COMPLETE
                };

                const userContext = {
                    userId:             'USER1',
                    designId:           'DESIGN_01',
                    designVersionId:    'DESIGN_VERSION_01',
                    designUpdateId:     'DESIGN_UPDATE_01',
                    workPackageId:      'NONE',
                };

                const userRole = RoleType.GUEST_VIEWER;

                const item = testLayout(itemType, itemData, userContext, userRole);
                const expectedUiItem = hashID(UI.BUTTON_WITHDRAW, 'DesignUpdate1');

                chai.assert.equal(item.find(expectedUiItem).length, 0, expectedUiItem + ' was found');
            });

            it('complete has no withdraw option for designer', () => {

                const itemType = ItemType.DESIGN_UPDATE;

                const itemData = {
                    _id:                'DESIGN_UPDATE_01',
                    designVersionId:    'DESIGN_VERSION_01',
                    updateName:         'DesignUpdate1',
                    updateReference:    'CR001',
                    updateStatus:       DesignUpdateStatus.UPDATE_MERGED,
                    updateMergeAction:  DesignUpdateMergeAction.MERGE_INCLUDE,
                    updateWpStatus:     DesignUpdateWpStatus.DU_NO_WP_SCENARIOS,
                    updateTestStatus:   DesignUpdateTestStatus.DU_NO_SCENARIOS_PASSING,
                    updateWpTestStatus: DuWorkPackageTestStatus.DU_WPS_NOT_COMPLETE
                };

                const userContext = {
                    userId:             'USER1',
                    designId:           'DESIGN_01',
                    designVersionId:    'DESIGN_VERSION_01',
                    designUpdateId:     'DESIGN_UPDATE_01',
                    workPackageId:      'NONE',
                };

                const userRole = RoleType.DESIGNER;

                const item = testLayout(itemType, itemData, userContext, userRole);
                const expectedUiItem = hashID(UI.BUTTON_WITHDRAW, 'DesignUpdate1');

                chai.assert.equal(item.find(expectedUiItem).length, 0, expectedUiItem + ' was found');
            });

            it('complete has no withdraw option for developer', () => {

                const itemType = ItemType.DESIGN_UPDATE;

                const itemData = {
                    _id:                'DESIGN_UPDATE_01',
                    designVersionId:    'DESIGN_VERSION_01',
                    updateName:         'DesignUpdate1',
                    updateReference:    'CR001',
                    updateStatus:       DesignUpdateStatus.UPDATE_MERGED,
                    updateMergeAction:  DesignUpdateMergeAction.MERGE_INCLUDE,
                    updateWpStatus:     DesignUpdateWpStatus.DU_NO_WP_SCENARIOS,
                    updateTestStatus:   DesignUpdateTestStatus.DU_NO_SCENARIOS_PASSING,
                    updateWpTestStatus: DuWorkPackageTestStatus.DU_WPS_NOT_COMPLETE
                };

                const userContext = {
                    userId:             'USER1',
                    designId:           'DESIGN_01',
                    designVersionId:    'DESIGN_VERSION_01',
                    designUpdateId:     'DESIGN_UPDATE_01',
                    workPackageId:      'NONE',
                };

                const userRole = RoleType.DEVELOPER;

                const item = testLayout(itemType, itemData, userContext, userRole);
                const expectedUiItem = hashID(UI.BUTTON_WITHDRAW, 'DesignUpdate1');

                chai.assert.equal(item.find(expectedUiItem).length, 0, expectedUiItem + ' was found');
            });

            it('complete has no withdraw option for manager', () => {

                const itemType = ItemType.DESIGN_UPDATE;

                const itemData = {
                    _id:                'DESIGN_UPDATE_01',
                    designVersionId:    'DESIGN_VERSION_01',
                    updateName:         'DesignUpdate1',
                    updateReference:    'CR001',
                    updateStatus:       DesignUpdateStatus.UPDATE_MERGED,
                    updateMergeAction:  DesignUpdateMergeAction.MERGE_INCLUDE,
                    updateWpStatus:     DesignUpdateWpStatus.DU_NO_WP_SCENARIOS,
                    updateTestStatus:   DesignUpdateTestStatus.DU_NO_SCENARIOS_PASSING,
                    updateWpTestStatus: DuWorkPackageTestStatus.DU_WPS_NOT_COMPLETE
                };

                const userContext = {
                    userId:             'USER1',
                    designId:           'DESIGN_01',
                    designVersionId:    'DESIGN_VERSION_01',
                    designUpdateId:     'DESIGN_UPDATE_01',
                    workPackageId:      'NONE',
                };

                const userRole = RoleType.MANAGER;

                const item = testLayout(itemType, itemData, userContext, userRole);
                const expectedUiItem = hashID(UI.BUTTON_WITHDRAW, 'DesignUpdate1');

                chai.assert.equal(item.find(expectedUiItem).length, 0, expectedUiItem + ' was found');
            });

            it('complete has no withdraw option for guest', () => {

                const itemType = ItemType.DESIGN_UPDATE;

                const itemData = {
                    _id:                'DESIGN_UPDATE_01',
                    designVersionId:    'DESIGN_VERSION_01',
                    updateName:         'DesignUpdate1',
                    updateReference:    'CR001',
                    updateStatus:       DesignUpdateStatus.UPDATE_MERGED,
                    updateMergeAction:  DesignUpdateMergeAction.MERGE_INCLUDE,
                    updateWpStatus:     DesignUpdateWpStatus.DU_NO_WP_SCENARIOS,
                    updateTestStatus:   DesignUpdateTestStatus.DU_NO_SCENARIOS_PASSING,
                    updateWpTestStatus: DuWorkPackageTestStatus.DU_WPS_NOT_COMPLETE
                };

                const userContext = {
                    userId:             'USER1',
                    designId:           'DESIGN_01',
                    designVersionId:    'DESIGN_VERSION_01',
                    designUpdateId:     'DESIGN_UPDATE_01',
                    workPackageId:      'NONE',
                };

                const userRole = RoleType.GUEST_VIEWER;

                const item = testLayout(itemType, itemData, userContext, userRole);
                const expectedUiItem = hashID(UI.BUTTON_WITHDRAW, 'DesignUpdate1');

                chai.assert.equal(item.find(expectedUiItem).length, 0, expectedUiItem + ' was found');
            });

            it('draft has no withdraw option for developer', () => {

                const itemType = ItemType.DESIGN_UPDATE;

                const itemData = {
                    _id:                'DESIGN_UPDATE_01',
                    designVersionId:    'DESIGN_VERSION_01',
                    updateName:         'DesignUpdate1',
                    updateReference:    'CR001',
                    updateStatus:       DesignUpdateStatus.UPDATE_PUBLISHED_DRAFT,
                    updateMergeAction:  DesignUpdateMergeAction.MERGE_INCLUDE,
                    updateWpStatus:     DesignUpdateWpStatus.DU_NO_WP_SCENARIOS,
                    updateTestStatus:   DesignUpdateTestStatus.DU_NO_SCENARIOS_PASSING,
                    updateWpTestStatus: DuWorkPackageTestStatus.DU_WPS_NOT_COMPLETE
                };

                const userContext = {
                    userId:             'USER1',
                    designId:           'DESIGN_01',
                    designVersionId:    'DESIGN_VERSION_01',
                    designUpdateId:     'DESIGN_UPDATE_01',
                    workPackageId:      'NONE',
                };

                const userRole = RoleType.DEVELOPER;

                const item = testLayout(itemType, itemData, userContext, userRole);
                const expectedUiItem = hashID(UI.BUTTON_WITHDRAW, 'DesignUpdate1');

                chai.assert.equal(item.find(expectedUiItem).length, 0, expectedUiItem + ' was found');
            });

            it('draft has no withdraw option for manager', () => {

                const itemType = ItemType.DESIGN_UPDATE;

                const itemData = {
                    _id:                'DESIGN_UPDATE_01',
                    designVersionId:    'DESIGN_VERSION_01',
                    updateName:         'DesignUpdate1',
                    updateReference:    'CR001',
                    updateStatus:       DesignUpdateStatus.UPDATE_PUBLISHED_DRAFT,
                    updateMergeAction:  DesignUpdateMergeAction.MERGE_INCLUDE,
                    updateWpStatus:     DesignUpdateWpStatus.DU_NO_WP_SCENARIOS,
                    updateTestStatus:   DesignUpdateTestStatus.DU_NO_SCENARIOS_PASSING,
                    updateWpTestStatus: DuWorkPackageTestStatus.DU_WPS_NOT_COMPLETE
                };

                const userContext = {
                    userId:             'USER1',
                    designId:           'DESIGN_01',
                    designVersionId:    'DESIGN_VERSION_01',
                    designUpdateId:     'DESIGN_UPDATE_01',
                    workPackageId:      'NONE',
                };

                const userRole = RoleType.MANAGER;

                const item = testLayout(itemType, itemData, userContext, userRole);
                const expectedUiItem = hashID(UI.BUTTON_WITHDRAW, 'DesignUpdate1');

                chai.assert.equal(item.find(expectedUiItem).length, 0, expectedUiItem + ' was found');
            });

            it('draft has no withdraw option for guest', () => {

                const itemType = ItemType.DESIGN_UPDATE;

                const itemData = {
                    _id:                'DESIGN_UPDATE_01',
                    designVersionId:    'DESIGN_VERSION_01',
                    updateName:         'DesignUpdate1',
                    updateReference:    'CR001',
                    updateStatus:       DesignUpdateStatus.UPDATE_PUBLISHED_DRAFT,
                    updateMergeAction:  DesignUpdateMergeAction.MERGE_INCLUDE,
                    updateWpStatus:     DesignUpdateWpStatus.DU_NO_WP_SCENARIOS,
                    updateTestStatus:   DesignUpdateTestStatus.DU_NO_SCENARIOS_PASSING,
                    updateWpTestStatus: DuWorkPackageTestStatus.DU_WPS_NOT_COMPLETE
                };

                const userContext = {
                    userId:             'USER1',
                    designId:           'DESIGN_01',
                    designVersionId:    'DESIGN_VERSION_01',
                    designUpdateId:     'DESIGN_UPDATE_01',
                    workPackageId:      'NONE',
                };

                const userRole = RoleType.GUEST_VIEWER;

                const item = testLayout(itemType, itemData, userContext, userRole);
                const expectedUiItem = hashID(UI.BUTTON_WITHDRAW, 'DesignUpdate1');

                chai.assert.equal(item.find(expectedUiItem).length, 0, expectedUiItem + ' was found');
            });
        });

        // Remove Update ---------------------------------------------------------------------------------------------------

        describe('A Design Update item has an option to remove it', () => {

            it('has a remove option for new update for designer', () => {

                const itemType = ItemType.DESIGN_UPDATE;

                const itemData = {
                    _id:                'DESIGN_UPDATE_01',
                    designVersionId:    'DESIGN_VERSION_01',
                    updateName:         'DesignUpdate1',
                    updateReference:    'CR001',
                    updateStatus:       DesignUpdateStatus.UPDATE_NEW,
                    updateMergeAction:  DesignUpdateMergeAction.MERGE_INCLUDE,
                    updateWpStatus:     DesignUpdateWpStatus.DU_NO_WP_SCENARIOS,
                    updateTestStatus:   DesignUpdateTestStatus.DU_NO_SCENARIOS_PASSING,
                    updateWpTestStatus: DuWorkPackageTestStatus.DU_WPS_NOT_COMPLETE
                };

                const userContext = {
                    userId:             'USER1',
                    designId:           'DESIGN_01',
                    designVersionId:    'DESIGN_VERSION_01',
                    designUpdateId:     'DESIGN_UPDATE_01',
                    workPackageId:      'NONE',
                };

                const userRole = RoleType.DESIGNER;

                const item = testLayout(itemType, itemData, userContext, userRole);
                const expectedUiItem = hashID(UI.BUTTON_REMOVE, 'DesignUpdate1');

                chai.assert.equal(item.find(expectedUiItem).length, 1, expectedUiItem + ' not found');
            });
        });

        describe('The remove option is only visible to Designers for New Design Updates', () => {

            it('has no remove option for published update for designer', () => {

                const itemType = ItemType.DESIGN_UPDATE;

                const itemData = {
                    _id:                'DESIGN_UPDATE_01',
                    designVersionId:    'DESIGN_VERSION_01',
                    updateName:         'DesignUpdate1',
                    updateReference:    'CR001',
                    updateStatus:       DesignUpdateStatus.UPDATE_PUBLISHED_DRAFT,
                    updateMergeAction:  DesignUpdateMergeAction.MERGE_INCLUDE,
                    updateWpStatus:     DesignUpdateWpStatus.DU_NO_WP_SCENARIOS,
                    updateTestStatus:   DesignUpdateTestStatus.DU_NO_SCENARIOS_PASSING,
                    updateWpTestStatus: DuWorkPackageTestStatus.DU_WPS_NOT_COMPLETE
                };

                const userContext = {
                    userId:             'USER1',
                    designId:           'DESIGN_01',
                    designVersionId:    'DESIGN_VERSION_01',
                    designUpdateId:     'DESIGN_UPDATE_01',
                    workPackageId:      'NONE',
                };

                const userRole = RoleType.DESIGNER;

                const item = testLayout(itemType, itemData, userContext, userRole);
                const expectedUiItem = hashID(UI.BUTTON_REMOVE, 'DesignUpdate1');

                chai.assert.equal(item.find(expectedUiItem).length, 0, expectedUiItem + ' was found');
            });

            it('has no remove option for completed update for designer', () => {

                const itemType = ItemType.DESIGN_UPDATE;

                const itemData = {
                    _id:                'DESIGN_UPDATE_01',
                    designVersionId:    'DESIGN_VERSION_01',
                    updateName:         'DesignUpdate1',
                    updateReference:    'CR001',
                    updateStatus:       DesignUpdateStatus.UPDATE_MERGED,
                    updateMergeAction:  DesignUpdateMergeAction.MERGE_INCLUDE,
                    updateWpStatus:     DesignUpdateWpStatus.DU_NO_WP_SCENARIOS,
                    updateTestStatus:   DesignUpdateTestStatus.DU_NO_SCENARIOS_PASSING,
                    updateWpTestStatus: DuWorkPackageTestStatus.DU_WPS_NOT_COMPLETE
                };

                const userContext = {
                    userId:             'USER1',
                    designId:           'DESIGN_01',
                    designVersionId:    'DESIGN_VERSION_01',
                    designUpdateId:     'DESIGN_UPDATE_01',
                    workPackageId:      'NONE',
                };

                const userRole = RoleType.DESIGNER;

                const item = testLayout(itemType, itemData, userContext, userRole);
                const expectedUiItem = hashID(UI.BUTTON_REMOVE, 'DesignUpdate1');

                chai.assert.equal(item.find(expectedUiItem).length, 0, expectedUiItem + ' was found');
            });
        });

        describe('A Designer cannot remove a Draft Design Update', () => {

            it('has no remove option for designer', () => {

                const itemType = ItemType.DESIGN_UPDATE;

                const itemData = {
                    _id:                'DESIGN_UPDATE_01',
                    designVersionId:    'DESIGN_VERSION_01',
                    updateName:         'DesignUpdate1',
                    updateReference:    'CR001',
                    updateStatus:       DesignUpdateStatus.UPDATE_PUBLISHED_DRAFT,
                    updateMergeAction:  DesignUpdateMergeAction.MERGE_INCLUDE,
                    updateWpStatus:     DesignUpdateWpStatus.DU_NO_WP_SCENARIOS,
                    updateTestStatus:   DesignUpdateTestStatus.DU_NO_SCENARIOS_PASSING,
                    updateWpTestStatus: DuWorkPackageTestStatus.DU_WPS_NOT_COMPLETE
                };

                const userContext = {
                    userId:             'USER1',
                    designId:           'DESIGN_01',
                    designVersionId:    'DESIGN_VERSION_01',
                    designUpdateId:     'DESIGN_UPDATE_01',
                    workPackageId:      'NONE',
                };

                const userRole = RoleType.DESIGNER;

                const item = testLayout(itemType, itemData, userContext, userRole);
                const expectedUiItem = hashID(UI.BUTTON_REMOVE, 'DesignUpdate1');

                chai.assert.equal(item.find(expectedUiItem).length, 0, expectedUiItem + ' was found');
            });
        });

        describe('A Designer cannot remove a Complete Design Update', () => {

            it('has no remove option for designer', () => {

                const itemType = ItemType.DESIGN_UPDATE;

                const itemData = {
                    _id:                'DESIGN_UPDATE_01',
                    designVersionId:    'DESIGN_VERSION_01',
                    updateName:         'DesignUpdate1',
                    updateReference:    'CR001',
                    updateStatus:       DesignUpdateStatus.UPDATE_MERGED,
                    updateMergeAction:  DesignUpdateMergeAction.MERGE_INCLUDE,
                    updateWpStatus:     DesignUpdateWpStatus.DU_NO_WP_SCENARIOS,
                    updateTestStatus:   DesignUpdateTestStatus.DU_NO_SCENARIOS_PASSING,
                    updateWpTestStatus: DuWorkPackageTestStatus.DU_WPS_NOT_COMPLETE
                };

                const userContext = {
                    userId:             'USER1',
                    designId:           'DESIGN_01',
                    designVersionId:    'DESIGN_VERSION_01',
                    designUpdateId:     'DESIGN_UPDATE_01',
                    workPackageId:      'NONE',
                };

                const userRole = RoleType.DESIGNER;

                const item = testLayout(itemType, itemData, userContext, userRole);
                const expectedUiItem = hashID(UI.BUTTON_REMOVE, 'DesignUpdate1');

                chai.assert.equal(item.find(expectedUiItem).length, 0, expectedUiItem + ' was found');
            });
        });

        describe('A Developer cannot remove a Design Update', () => {

            it('has no remove option for new design update', () => {

                const itemType = ItemType.DESIGN_UPDATE;

                const itemData = {
                    _id:                'DESIGN_UPDATE_01',
                    designVersionId:    'DESIGN_VERSION_01',
                    updateName:         'DesignUpdate1',
                    updateReference:    'CR001',
                    updateStatus:       DesignUpdateStatus.UPDATE_NEW,
                    updateMergeAction:  DesignUpdateMergeAction.MERGE_INCLUDE,
                    updateWpStatus:     DesignUpdateWpStatus.DU_NO_WP_SCENARIOS,
                    updateTestStatus:   DesignUpdateTestStatus.DU_NO_SCENARIOS_PASSING,
                    updateWpTestStatus: DuWorkPackageTestStatus.DU_WPS_NOT_COMPLETE
                };

                const userContext = {
                    userId:             'USER1',
                    designId:           'DESIGN_01',
                    designVersionId:    'DESIGN_VERSION_01',
                    designUpdateId:     'DESIGN_UPDATE_01',
                    workPackageId:      'NONE',
                };

                const userRole = RoleType.DEVELOPER;

                const item = testLayout(itemType, itemData, userContext, userRole);
                const expectedUiItem = hashID(UI.BUTTON_REMOVE, 'DesignUpdate1');

                chai.assert.equal(item.find(expectedUiItem).length, 0, expectedUiItem + ' was found');
            });

            it('has no remove option for published design update', () => {

                const itemType = ItemType.DESIGN_UPDATE;

                const itemData = {
                    _id:                'DESIGN_UPDATE_01',
                    designVersionId:    'DESIGN_VERSION_01',
                    updateName:         'DesignUpdate1',
                    updateReference:    'CR001',
                    updateStatus:       DesignUpdateStatus.UPDATE_PUBLISHED_DRAFT,
                    updateMergeAction:  DesignUpdateMergeAction.MERGE_INCLUDE,
                    updateWpStatus:     DesignUpdateWpStatus.DU_NO_WP_SCENARIOS,
                    updateTestStatus:   DesignUpdateTestStatus.DU_NO_SCENARIOS_PASSING,
                    updateWpTestStatus: DuWorkPackageTestStatus.DU_WPS_NOT_COMPLETE
                };

                const userContext = {
                    userId:             'USER1',
                    designId:           'DESIGN_01',
                    designVersionId:    'DESIGN_VERSION_01',
                    designUpdateId:     'DESIGN_UPDATE_01',
                    workPackageId:      'NONE',
                };

                const userRole = RoleType.DEVELOPER;

                const item = testLayout(itemType, itemData, userContext, userRole);
                const expectedUiItem = hashID(UI.BUTTON_REMOVE, 'DesignUpdate1');

                chai.assert.equal(item.find(expectedUiItem).length, 0, expectedUiItem + ' was found');
            });

            it('has no remove option for merged design update', () => {

                const itemType = ItemType.DESIGN_UPDATE;

                const itemData = {
                    _id:                'DESIGN_UPDATE_01',
                    designVersionId:    'DESIGN_VERSION_01',
                    updateName:         'DesignUpdate1',
                    updateReference:    'CR001',
                    updateStatus:       DesignUpdateStatus.UPDATE_MERGED,
                    updateMergeAction:  DesignUpdateMergeAction.MERGE_INCLUDE,
                    updateWpStatus:     DesignUpdateWpStatus.DU_NO_WP_SCENARIOS,
                    updateTestStatus:   DesignUpdateTestStatus.DU_NO_SCENARIOS_PASSING,
                    updateWpTestStatus: DuWorkPackageTestStatus.DU_WPS_NOT_COMPLETE
                };

                const userContext = {
                    userId:             'USER1',
                    designId:           'DESIGN_01',
                    designVersionId:    'DESIGN_VERSION_01',
                    designUpdateId:     'DESIGN_UPDATE_01',
                    workPackageId:      'NONE',
                };

                const userRole = RoleType.DEVELOPER;

                const item = testLayout(itemType, itemData, userContext, userRole);
                const expectedUiItem = hashID(UI.BUTTON_REMOVE, 'DesignUpdate1');

                chai.assert.equal(item.find(expectedUiItem).length, 0, expectedUiItem + ' was found');
            });
        });

        describe('A Manager cannot remove a Design Update', () => {

            it('has no remove option for new design update', () => {

                const itemType = ItemType.DESIGN_UPDATE;

                const itemData = {
                    _id:                'DESIGN_UPDATE_01',
                    designVersionId:    'DESIGN_VERSION_01',
                    updateName:         'DesignUpdate1',
                    updateReference:    'CR001',
                    updateStatus:       DesignUpdateStatus.UPDATE_NEW,
                    updateMergeAction:  DesignUpdateMergeAction.MERGE_INCLUDE,
                    updateWpStatus:     DesignUpdateWpStatus.DU_NO_WP_SCENARIOS,
                    updateTestStatus:   DesignUpdateTestStatus.DU_NO_SCENARIOS_PASSING,
                    updateWpTestStatus: DuWorkPackageTestStatus.DU_WPS_NOT_COMPLETE
                };

                const userContext = {
                    userId:             'USER1',
                    designId:           'DESIGN_01',
                    designVersionId:    'DESIGN_VERSION_01',
                    designUpdateId:     'DESIGN_UPDATE_01',
                    workPackageId:      'NONE',
                };

                const userRole = RoleType.MANAGER;

                const item = testLayout(itemType, itemData, userContext, userRole);
                const expectedUiItem = hashID(UI.BUTTON_REMOVE, 'DesignUpdate1');

                chai.assert.equal(item.find(expectedUiItem).length, 0, expectedUiItem + ' was found');
            });

            it('has no remove option for published design update', () => {

                const itemType = ItemType.DESIGN_UPDATE;

                const itemData = {
                    _id:                'DESIGN_UPDATE_01',
                    designVersionId:    'DESIGN_VERSION_01',
                    updateName:         'DesignUpdate1',
                    updateReference:    'CR001',
                    updateStatus:       DesignUpdateStatus.UPDATE_PUBLISHED_DRAFT,
                    updateMergeAction:  DesignUpdateMergeAction.MERGE_INCLUDE,
                    updateWpStatus:     DesignUpdateWpStatus.DU_NO_WP_SCENARIOS,
                    updateTestStatus:   DesignUpdateTestStatus.DU_NO_SCENARIOS_PASSING,
                    updateWpTestStatus: DuWorkPackageTestStatus.DU_WPS_NOT_COMPLETE
                };

                const userContext = {
                    userId:             'USER1',
                    designId:           'DESIGN_01',
                    designVersionId:    'DESIGN_VERSION_01',
                    designUpdateId:     'DESIGN_UPDATE_01',
                    workPackageId:      'NONE',
                };

                const userRole = RoleType.MANAGER;

                const item = testLayout(itemType, itemData, userContext, userRole);
                const expectedUiItem = hashID(UI.BUTTON_REMOVE, 'DesignUpdate1');

                chai.assert.equal(item.find(expectedUiItem).length, 0, expectedUiItem + ' was found');
            });

            it('has no remove option for merged design update', () => {

                const itemType = ItemType.DESIGN_UPDATE;

                const itemData = {
                    _id:                'DESIGN_UPDATE_01',
                    designVersionId:    'DESIGN_VERSION_01',
                    updateName:         'DesignUpdate1',
                    updateReference:    'CR001',
                    updateStatus:       DesignUpdateStatus.UPDATE_MERGED,
                    updateMergeAction:  DesignUpdateMergeAction.MERGE_INCLUDE,
                    updateWpStatus:     DesignUpdateWpStatus.DU_NO_WP_SCENARIOS,
                    updateTestStatus:   DesignUpdateTestStatus.DU_NO_SCENARIOS_PASSING,
                    updateWpTestStatus: DuWorkPackageTestStatus.DU_WPS_NOT_COMPLETE
                };

                const userContext = {
                    userId:             'USER1',
                    designId:           'DESIGN_01',
                    designVersionId:    'DESIGN_VERSION_01',
                    designUpdateId:     'DESIGN_UPDATE_01',
                    workPackageId:      'NONE',
                };

                const userRole = RoleType.MANAGER;

                const item = testLayout(itemType, itemData, userContext, userRole);
                const expectedUiItem = hashID(UI.BUTTON_REMOVE, 'DesignUpdate1');

                chai.assert.equal(item.find(expectedUiItem).length, 0, expectedUiItem + ' was found');
            });
        });

        // Set Merge Action ------------------------------------------------------------------------------------------------

        describe('A Design Update has a radio option to Merge', () => {

            it('published update has a merge include option for designer', () => {

                const itemType = ItemType.DESIGN_UPDATE;

                const itemData = {
                    _id:                'DESIGN_UPDATE_01',
                    designVersionId:    'DESIGN_VERSION_01',
                    updateName:         'DesignUpdate1',
                    updateReference:    'CR001',
                    updateStatus:       DesignUpdateStatus.UPDATE_PUBLISHED_DRAFT,
                    updateMergeAction:  DesignUpdateMergeAction.MERGE_INCLUDE,
                    updateWpStatus:     DesignUpdateWpStatus.DU_NO_WP_SCENARIOS,
                    updateTestStatus:   DesignUpdateTestStatus.DU_NO_SCENARIOS_PASSING,
                    updateWpTestStatus: DuWorkPackageTestStatus.DU_WPS_NOT_COMPLETE
                };

                const userContext = {
                    userId:             'USER1',
                    designId:           'DESIGN_01',
                    designVersionId:    'DESIGN_VERSION_01',
                    designUpdateId:     'DESIGN_UPDATE_01',
                    workPackageId:      'NONE',
                };

                const userRole = RoleType.DESIGNER;

                const item = testLayout(itemType, itemData, userContext, userRole);
                const expectedUiItem = hashID(UI.MERGE_OPTION_INCLUDE, 'DesignUpdate1');

                chai.assert.equal(item.find(expectedUiItem).length, 1, expectedUiItem + ' not found');
            });
        });

        describe('A Design Update has a radio option to Carry Forward', () => {

            it('published update has a merge roll option for designer', () => {

                const itemType = ItemType.DESIGN_UPDATE;

                const itemData = {
                    _id:                'DESIGN_UPDATE_01',
                    designVersionId:    'DESIGN_VERSION_01',
                    updateName:         'DesignUpdate1',
                    updateReference:    'CR001',
                    updateStatus:       DesignUpdateStatus.UPDATE_PUBLISHED_DRAFT,
                    updateMergeAction:  DesignUpdateMergeAction.MERGE_INCLUDE,
                    updateWpStatus:     DesignUpdateWpStatus.DU_NO_WP_SCENARIOS,
                    updateTestStatus:   DesignUpdateTestStatus.DU_NO_SCENARIOS_PASSING,
                    updateWpTestStatus: DuWorkPackageTestStatus.DU_WPS_NOT_COMPLETE
                };

                const userContext = {
                    userId:             'USER1',
                    designId:           'DESIGN_01',
                    designVersionId:    'DESIGN_VERSION_01',
                    designUpdateId:     'DESIGN_UPDATE_01',
                    workPackageId:      'NONE',
                };

                const userRole = RoleType.DESIGNER;

                const item = testLayout(itemType, itemData, userContext, userRole);
                const expectedUiItem = hashID(UI.MERGE_OPTION_ROLL, 'DesignUpdate1');

                chai.assert.equal(item.find(expectedUiItem).length, 1, expectedUiItem + ' not found');
            });
        });

        describe('A Design Update has a radio option to Ignore', () => {

            it('published update has a merge ignore option for designer', () => {

                const itemType = ItemType.DESIGN_UPDATE;

                const itemData = {
                    _id:                'DESIGN_UPDATE_01',
                    designVersionId:    'DESIGN_VERSION_01',
                    updateName:         'DesignUpdate1',
                    updateReference:    'CR001',
                    updateStatus:       DesignUpdateStatus.UPDATE_PUBLISHED_DRAFT,
                    updateMergeAction:  DesignUpdateMergeAction.MERGE_INCLUDE,
                    updateWpStatus:     DesignUpdateWpStatus.DU_NO_WP_SCENARIOS,
                    updateTestStatus:   DesignUpdateTestStatus.DU_NO_SCENARIOS_PASSING,
                    updateWpTestStatus: DuWorkPackageTestStatus.DU_WPS_NOT_COMPLETE
                };

                const userContext = {
                    userId:             'USER1',
                    designId:           'DESIGN_01',
                    designVersionId:    'DESIGN_VERSION_01',
                    designUpdateId:     'DESIGN_UPDATE_01',
                    workPackageId:      'NONE',
                };

                const userRole = RoleType.DESIGNER;

                const item = testLayout(itemType, itemData, userContext, userRole);
                const expectedUiItem = hashID(UI.MERGE_OPTION_IGNORE, 'DesignUpdate1');

                chai.assert.equal(item.find(expectedUiItem).length, 1, expectedUiItem + ' not found');
            });
        });

        describe('Design Update merge actions are not visible for New Design Updates', () => {

            it('no merge include option', () => {

                const itemType = ItemType.DESIGN_UPDATE;

                const itemData = {
                    _id:                'DESIGN_UPDATE_01',
                    designVersionId:    'DESIGN_VERSION_01',
                    updateName:         'DesignUpdate1',
                    updateReference:    'CR001',
                    updateStatus:       DesignUpdateStatus.UPDATE_NEW,
                    updateMergeAction:  DesignUpdateMergeAction.MERGE_INCLUDE,
                    updateWpStatus:     DesignUpdateWpStatus.DU_NO_WP_SCENARIOS,
                    updateTestStatus:   DesignUpdateTestStatus.DU_NO_SCENARIOS_PASSING,
                    updateWpTestStatus: DuWorkPackageTestStatus.DU_WPS_NOT_COMPLETE
                };

                const userContext = {
                    userId:             'USER1',
                    designId:           'DESIGN_01',
                    designVersionId:    'DESIGN_VERSION_01',
                    designUpdateId:     'DESIGN_UPDATE_01',
                    workPackageId:      'NONE',
                };

                const userRole = RoleType.DESIGNER;

                const item = testLayout(itemType, itemData, userContext, userRole);
                const expectedUiItem = hashID(UI.MERGE_OPTION_INCLUDE, 'DesignUpdate1');

                chai.assert.equal(item.find(expectedUiItem).length, 0, expectedUiItem + ' was found');
            });

            it('no carry forward option', () => {

                const itemType = ItemType.DESIGN_UPDATE;

                const itemData = {
                    _id:                'DESIGN_UPDATE_01',
                    designVersionId:    'DESIGN_VERSION_01',
                    updateName:         'DesignUpdate1',
                    updateReference:    'CR001',
                    updateStatus:       DesignUpdateStatus.UPDATE_NEW,
                    updateMergeAction:  DesignUpdateMergeAction.MERGE_INCLUDE,
                    updateWpStatus:     DesignUpdateWpStatus.DU_NO_WP_SCENARIOS,
                    updateTestStatus:   DesignUpdateTestStatus.DU_NO_SCENARIOS_PASSING,
                    updateWpTestStatus: DuWorkPackageTestStatus.DU_WPS_NOT_COMPLETE
                };

                const userContext = {
                    userId:             'USER1',
                    designId:           'DESIGN_01',
                    designVersionId:    'DESIGN_VERSION_01',
                    designUpdateId:     'DESIGN_UPDATE_01',
                    workPackageId:      'NONE',
                };

                const userRole = RoleType.DESIGNER;

                const item = testLayout(itemType, itemData, userContext, userRole);
                const expectedUiItem = hashID(UI.MERGE_OPTION_ROLL, 'DesignUpdate1');

                chai.assert.equal(item.find(expectedUiItem).length, 0, expectedUiItem + ' was found');
            });

            it('no ignore option', () => {

                const itemType = ItemType.DESIGN_UPDATE;

                const itemData = {
                    _id:                'DESIGN_UPDATE_01',
                    designVersionId:    'DESIGN_VERSION_01',
                    updateName:         'DesignUpdate1',
                    updateReference:    'CR001',
                    updateStatus:       DesignUpdateStatus.UPDATE_NEW,
                    updateMergeAction:  DesignUpdateMergeAction.MERGE_INCLUDE,
                    updateWpStatus:     DesignUpdateWpStatus.DU_NO_WP_SCENARIOS,
                    updateTestStatus:   DesignUpdateTestStatus.DU_NO_SCENARIOS_PASSING,
                    updateWpTestStatus: DuWorkPackageTestStatus.DU_WPS_NOT_COMPLETE
                };

                const userContext = {
                    userId:             'USER1',
                    designId:           'DESIGN_01',
                    designVersionId:    'DESIGN_VERSION_01',
                    designUpdateId:     'DESIGN_UPDATE_01',
                    workPackageId:      'NONE',
                };

                const userRole = RoleType.DESIGNER;

                const item = testLayout(itemType, itemData, userContext, userRole);
                const expectedUiItem = hashID(UI.MERGE_OPTION_IGNORE, 'DesignUpdate1');

                chai.assert.equal(item.find(expectedUiItem).length, 0, expectedUiItem + ' was found');
            });
        });

        describe('A Designer cannot set Design Update actions for a New Design Update', () => {

            it('no merge include option', () => {

                const itemType = ItemType.DESIGN_UPDATE;

                const itemData = {
                    _id:                'DESIGN_UPDATE_01',
                    designVersionId:    'DESIGN_VERSION_01',
                    updateName:         'DesignUpdate1',
                    updateReference:    'CR001',
                    updateStatus:       DesignUpdateStatus.UPDATE_NEW,
                    updateMergeAction:  DesignUpdateMergeAction.MERGE_INCLUDE,
                    updateWpStatus:     DesignUpdateWpStatus.DU_NO_WP_SCENARIOS,
                    updateTestStatus:   DesignUpdateTestStatus.DU_NO_SCENARIOS_PASSING,
                    updateWpTestStatus: DuWorkPackageTestStatus.DU_WPS_NOT_COMPLETE
                };

                const userContext = {
                    userId:             'USER1',
                    designId:           'DESIGN_01',
                    designVersionId:    'DESIGN_VERSION_01',
                    designUpdateId:     'DESIGN_UPDATE_01',
                    workPackageId:      'NONE',
                };

                const userRole = RoleType.DESIGNER;

                const item = testLayout(itemType, itemData, userContext, userRole);
                const expectedUiItem = hashID(UI.MERGE_OPTION_INCLUDE, 'DesignUpdate1');

                chai.assert.equal(item.find(expectedUiItem).length, 0, expectedUiItem + ' was found');
            });

            it('no carry forward option', () => {

                const itemType = ItemType.DESIGN_UPDATE;

                const itemData = {
                    _id:                'DESIGN_UPDATE_01',
                    designVersionId:    'DESIGN_VERSION_01',
                    updateName:         'DesignUpdate1',
                    updateReference:    'CR001',
                    updateStatus:       DesignUpdateStatus.UPDATE_NEW,
                    updateMergeAction:  DesignUpdateMergeAction.MERGE_INCLUDE,
                    updateWpStatus:     DesignUpdateWpStatus.DU_NO_WP_SCENARIOS,
                    updateTestStatus:   DesignUpdateTestStatus.DU_NO_SCENARIOS_PASSING,
                    updateWpTestStatus: DuWorkPackageTestStatus.DU_WPS_NOT_COMPLETE
                };

                const userContext = {
                    userId:             'USER1',
                    designId:           'DESIGN_01',
                    designVersionId:    'DESIGN_VERSION_01',
                    designUpdateId:     'DESIGN_UPDATE_01',
                    workPackageId:      'NONE',
                };

                const userRole = RoleType.DESIGNER;

                const item = testLayout(itemType, itemData, userContext, userRole);
                const expectedUiItem = hashID(UI.MERGE_OPTION_ROLL, 'DesignUpdate1');

                chai.assert.equal(item.find(expectedUiItem).length, 0, expectedUiItem + ' was found');
            });

            it('no ignore option', () => {

                const itemType = ItemType.DESIGN_UPDATE;

                const itemData = {
                    _id:                'DESIGN_UPDATE_01',
                    designVersionId:    'DESIGN_VERSION_01',
                    updateName:         'DesignUpdate1',
                    updateReference:    'CR001',
                    updateStatus:       DesignUpdateStatus.UPDATE_NEW,
                    updateMergeAction:  DesignUpdateMergeAction.MERGE_INCLUDE,
                    updateWpStatus:     DesignUpdateWpStatus.DU_NO_WP_SCENARIOS,
                    updateTestStatus:   DesignUpdateTestStatus.DU_NO_SCENARIOS_PASSING,
                    updateWpTestStatus: DuWorkPackageTestStatus.DU_WPS_NOT_COMPLETE
                };

                const userContext = {
                    userId:             'USER1',
                    designId:           'DESIGN_01',
                    designVersionId:    'DESIGN_VERSION_01',
                    designUpdateId:     'DESIGN_UPDATE_01',
                    workPackageId:      'NONE',
                };

                const userRole = RoleType.DESIGNER;

                const item = testLayout(itemType, itemData, userContext, userRole);
                const expectedUiItem = hashID(UI.MERGE_OPTION_IGNORE, 'DesignUpdate1');

                chai.assert.equal(item.find(expectedUiItem).length, 0, expectedUiItem + ' was found');
            });
        });

        describe('A Designer cannot set Design Update actions for a Complete Design Update', () => {

            it('no merge include option', () => {

                const itemType = ItemType.DESIGN_UPDATE;

                const itemData = {
                    _id:                'DESIGN_UPDATE_01',
                    designVersionId:    'DESIGN_VERSION_01',
                    updateName:         'DesignUpdate1',
                    updateReference:    'CR001',
                    updateStatus:       DesignUpdateStatus.UPDATE_MERGED,
                    updateMergeAction:  DesignUpdateMergeAction.MERGE_INCLUDE,
                    updateWpStatus:     DesignUpdateWpStatus.DU_NO_WP_SCENARIOS,
                    updateTestStatus:   DesignUpdateTestStatus.DU_NO_SCENARIOS_PASSING,
                    updateWpTestStatus: DuWorkPackageTestStatus.DU_WPS_NOT_COMPLETE
                };

                const userContext = {
                    userId:             'USER1',
                    designId:           'DESIGN_01',
                    designVersionId:    'DESIGN_VERSION_01',
                    designUpdateId:     'DESIGN_UPDATE_01',
                    workPackageId:      'NONE',
                };

                const userRole = RoleType.DESIGNER;

                const item = testLayout(itemType, itemData, userContext, userRole);
                const expectedUiItem = hashID(UI.MERGE_OPTION_INCLUDE, 'DesignUpdate1');

                chai.assert.equal(item.find(expectedUiItem).length, 0, expectedUiItem + ' was found');
            });

            it('no carry forward option', () => {

                const itemType = ItemType.DESIGN_UPDATE;

                const itemData = {
                    _id:                'DESIGN_UPDATE_01',
                    designVersionId:    'DESIGN_VERSION_01',
                    updateName:         'DesignUpdate1',
                    updateReference:    'CR001',
                    updateStatus:       DesignUpdateStatus.UPDATE_MERGED,
                    updateMergeAction:  DesignUpdateMergeAction.MERGE_INCLUDE,
                    updateWpStatus:     DesignUpdateWpStatus.DU_NO_WP_SCENARIOS,
                    updateTestStatus:   DesignUpdateTestStatus.DU_NO_SCENARIOS_PASSING,
                    updateWpTestStatus: DuWorkPackageTestStatus.DU_WPS_NOT_COMPLETE
                };

                const userContext = {
                    userId:             'USER1',
                    designId:           'DESIGN_01',
                    designVersionId:    'DESIGN_VERSION_01',
                    designUpdateId:     'DESIGN_UPDATE_01',
                    workPackageId:      'NONE',
                };

                const userRole = RoleType.DESIGNER;

                const item = testLayout(itemType, itemData, userContext, userRole);
                const expectedUiItem = hashID(UI.MERGE_OPTION_ROLL, 'DesignUpdate1');

                chai.assert.equal(item.find(expectedUiItem).length, 0, expectedUiItem + ' was found');
            });

            it('no ignore option', () => {

                const itemType = ItemType.DESIGN_UPDATE;

                const itemData = {
                    _id:                'DESIGN_UPDATE_01',
                    designVersionId:    'DESIGN_VERSION_01',
                    updateName:         'DesignUpdate1',
                    updateReference:    'CR001',
                    updateStatus:       DesignUpdateStatus.UPDATE_MERGED,
                    updateMergeAction:  DesignUpdateMergeAction.MERGE_INCLUDE,
                    updateWpStatus:     DesignUpdateWpStatus.DU_NO_WP_SCENARIOS,
                    updateTestStatus:   DesignUpdateTestStatus.DU_NO_SCENARIOS_PASSING,
                    updateWpTestStatus: DuWorkPackageTestStatus.DU_WPS_NOT_COMPLETE
                };

                const userContext = {
                    userId:             'USER1',
                    designId:           'DESIGN_01',
                    designVersionId:    'DESIGN_VERSION_01',
                    designUpdateId:     'DESIGN_UPDATE_01',
                    workPackageId:      'NONE',
                };

                const userRole = RoleType.DESIGNER;

                const item = testLayout(itemType, itemData, userContext, userRole);
                const expectedUiItem = hashID(UI.MERGE_OPTION_IGNORE, 'DesignUpdate1');

                chai.assert.equal(item.find(expectedUiItem).length, 0, expectedUiItem + ' was found');
            });
        });

        describe('A Designer cannot set Design Update actions for an Ignore Design Update', () => {

            it('no merge include option', () => {

                const itemType = ItemType.DESIGN_UPDATE;

                const itemData = {
                    _id:                'DESIGN_UPDATE_01',
                    designVersionId:    'DESIGN_VERSION_01',
                    updateName:         'DesignUpdate1',
                    updateReference:    'CR001',
                    updateStatus:       DesignUpdateStatus.UPDATE_IGNORED,
                    updateMergeAction:  DesignUpdateMergeAction.MERGE_INCLUDE,
                    updateWpStatus:     DesignUpdateWpStatus.DU_NO_WP_SCENARIOS,
                    updateTestStatus:   DesignUpdateTestStatus.DU_NO_SCENARIOS_PASSING,
                    updateWpTestStatus: DuWorkPackageTestStatus.DU_WPS_NOT_COMPLETE
                };

                const userContext = {
                    userId:             'USER1',
                    designId:           'DESIGN_01',
                    designVersionId:    'DESIGN_VERSION_01',
                    designUpdateId:     'DESIGN_UPDATE_01',
                    workPackageId:      'NONE',
                };

                const userRole = RoleType.DESIGNER;

                const item = testLayout(itemType, itemData, userContext, userRole);
                const expectedUiItem = hashID(UI.MERGE_OPTION_INCLUDE, 'DesignUpdate1');

                chai.assert.equal(item.find(expectedUiItem).length, 0, expectedUiItem + ' was found');
            });

            it('no carry forward option', () => {

                const itemType = ItemType.DESIGN_UPDATE;

                const itemData = {
                    _id:                'DESIGN_UPDATE_01',
                    designVersionId:    'DESIGN_VERSION_01',
                    updateName:         'DesignUpdate1',
                    updateReference:    'CR001',
                    updateStatus:       DesignUpdateStatus.UPDATE_IGNORED,
                    updateMergeAction:  DesignUpdateMergeAction.MERGE_INCLUDE,
                    updateWpStatus:     DesignUpdateWpStatus.DU_NO_WP_SCENARIOS,
                    updateTestStatus:   DesignUpdateTestStatus.DU_NO_SCENARIOS_PASSING,
                    updateWpTestStatus: DuWorkPackageTestStatus.DU_WPS_NOT_COMPLETE
                };

                const userContext = {
                    userId:             'USER1',
                    designId:           'DESIGN_01',
                    designVersionId:    'DESIGN_VERSION_01',
                    designUpdateId:     'DESIGN_UPDATE_01',
                    workPackageId:      'NONE',
                };

                const userRole = RoleType.DESIGNER;

                const item = testLayout(itemType, itemData, userContext, userRole);
                const expectedUiItem = hashID(UI.MERGE_OPTION_ROLL, 'DesignUpdate1');

                chai.assert.equal(item.find(expectedUiItem).length, 0, expectedUiItem + ' was found');
            });

            it('no ignore option', () => {

                const itemType = ItemType.DESIGN_UPDATE;

                const itemData = {
                    _id:                'DESIGN_UPDATE_01',
                    designVersionId:    'DESIGN_VERSION_01',
                    updateName:         'DesignUpdate1',
                    updateReference:    'CR001',
                    updateStatus:       DesignUpdateStatus.UPDATE_IGNORED,
                    updateMergeAction:  DesignUpdateMergeAction.MERGE_INCLUDE,
                    updateWpStatus:     DesignUpdateWpStatus.DU_NO_WP_SCENARIOS,
                    updateTestStatus:   DesignUpdateTestStatus.DU_NO_SCENARIOS_PASSING,
                    updateWpTestStatus: DuWorkPackageTestStatus.DU_WPS_NOT_COMPLETE
                };

                const userContext = {
                    userId:             'USER1',
                    designId:           'DESIGN_01',
                    designVersionId:    'DESIGN_VERSION_01',
                    designUpdateId:     'DESIGN_UPDATE_01',
                    workPackageId:      'NONE',
                };

                const userRole = RoleType.DESIGNER;

                const item = testLayout(itemType, itemData, userContext, userRole);
                const expectedUiItem = hashID(UI.MERGE_OPTION_IGNORE, 'DesignUpdate1');

                chai.assert.equal(item.find(expectedUiItem).length, 0, expectedUiItem + ' was found');
            });
        });

        describe('A Developer cannot set Design Update actions', () => {

            it('has no merge option for new', () => {

                const itemType = ItemType.DESIGN_UPDATE;

                const itemData = {
                    _id:                'DESIGN_UPDATE_01',
                    designVersionId:    'DESIGN_VERSION_01',
                    updateName:         'DesignUpdate1',
                    updateReference:    'CR001',
                    updateStatus:       DesignUpdateStatus.UPDATE_NEW,
                    updateMergeAction:  DesignUpdateMergeAction.MERGE_INCLUDE,
                    updateWpStatus:     DesignUpdateWpStatus.DU_NO_WP_SCENARIOS,
                    updateTestStatus:   DesignUpdateTestStatus.DU_NO_SCENARIOS_PASSING,
                    updateWpTestStatus: DuWorkPackageTestStatus.DU_WPS_NOT_COMPLETE
                };

                const userContext = {
                    userId:             'USER1',
                    designId:           'DESIGN_01',
                    designVersionId:    'DESIGN_VERSION_01',
                    designUpdateId:     'DESIGN_UPDATE_01',
                    workPackageId:      'NONE',
                };

                const userRole = RoleType.DEVELOPER;

                const item = testLayout(itemType, itemData, userContext, userRole);
                const expectedUiItem = hashID(UI.MERGE_OPTION_INCLUDE, 'DesignUpdate1');

                chai.assert.equal(item.find(expectedUiItem).length, 0, expectedUiItem + ' was found');
            });

            it('has no merge option for published', () => {

                const itemType = ItemType.DESIGN_UPDATE;

                const itemData = {
                    _id:                'DESIGN_UPDATE_01',
                    designVersionId:    'DESIGN_VERSION_01',
                    updateName:         'DesignUpdate1',
                    updateReference:    'CR001',
                    updateStatus:       DesignUpdateStatus.UPDATE_PUBLISHED_DRAFT,
                    updateMergeAction:  DesignUpdateMergeAction.MERGE_INCLUDE,
                    updateWpStatus:     DesignUpdateWpStatus.DU_NO_WP_SCENARIOS,
                    updateTestStatus:   DesignUpdateTestStatus.DU_NO_SCENARIOS_PASSING,
                    updateWpTestStatus: DuWorkPackageTestStatus.DU_WPS_NOT_COMPLETE
                };

                const userContext = {
                    userId:             'USER1',
                    designId:           'DESIGN_01',
                    designVersionId:    'DESIGN_VERSION_01',
                    designUpdateId:     'DESIGN_UPDATE_01',
                    workPackageId:      'NONE',
                };

                const userRole = RoleType.DEVELOPER;

                const item = testLayout(itemType, itemData, userContext, userRole);
                const expectedUiItem = hashID(UI.MERGE_OPTION_INCLUDE, 'DesignUpdate1');

                chai.assert.equal(item.find(expectedUiItem).length, 0, expectedUiItem + ' was found');
            });

            it('has no merge option for complete', () => {

                const itemType = ItemType.DESIGN_UPDATE;

                const itemData = {
                    _id:                'DESIGN_UPDATE_01',
                    designVersionId:    'DESIGN_VERSION_01',
                    updateName:         'DesignUpdate1',
                    updateReference:    'CR001',
                    updateStatus:       DesignUpdateStatus.UPDATE_MERGED,
                    updateMergeAction:  DesignUpdateMergeAction.MERGE_INCLUDE,
                    updateWpStatus:     DesignUpdateWpStatus.DU_NO_WP_SCENARIOS,
                    updateTestStatus:   DesignUpdateTestStatus.DU_NO_SCENARIOS_PASSING,
                    updateWpTestStatus: DuWorkPackageTestStatus.DU_WPS_NOT_COMPLETE
                };

                const userContext = {
                    userId:             'USER1',
                    designId:           'DESIGN_01',
                    designVersionId:    'DESIGN_VERSION_01',
                    designUpdateId:     'DESIGN_UPDATE_01',
                    workPackageId:      'NONE',
                };

                const userRole = RoleType.DEVELOPER;

                const item = testLayout(itemType, itemData, userContext, userRole);
                const expectedUiItem = hashID(UI.MERGE_OPTION_INCLUDE, 'DesignUpdate1');

                chai.assert.equal(item.find(expectedUiItem).length, 0, expectedUiItem + ' was found');
            });

            it('has no carry forward option for new', () => {

                const itemType = ItemType.DESIGN_UPDATE;

                const itemData = {
                    _id:                'DESIGN_UPDATE_01',
                    designVersionId:    'DESIGN_VERSION_01',
                    updateName:         'DesignUpdate1',
                    updateReference:    'CR001',
                    updateStatus:       DesignUpdateStatus.UPDATE_NEW,
                    updateMergeAction:  DesignUpdateMergeAction.MERGE_INCLUDE,
                    updateWpStatus:     DesignUpdateWpStatus.DU_NO_WP_SCENARIOS,
                    updateTestStatus:   DesignUpdateTestStatus.DU_NO_SCENARIOS_PASSING,
                    updateWpTestStatus: DuWorkPackageTestStatus.DU_WPS_NOT_COMPLETE
                };

                const userContext = {
                    userId:             'USER1',
                    designId:           'DESIGN_01',
                    designVersionId:    'DESIGN_VERSION_01',
                    designUpdateId:     'DESIGN_UPDATE_01',
                    workPackageId:      'NONE',
                };

                const userRole = RoleType.DEVELOPER;

                const item = testLayout(itemType, itemData, userContext, userRole);
                const expectedUiItem = hashID(UI.MERGE_OPTION_ROLL, 'DesignUpdate1');

                chai.assert.equal(item.find(expectedUiItem).length, 0, expectedUiItem + ' was found');
            });

            it('has no carry forward option for published', () => {

                const itemType = ItemType.DESIGN_UPDATE;

                const itemData = {
                    _id:                'DESIGN_UPDATE_01',
                    designVersionId:    'DESIGN_VERSION_01',
                    updateName:         'DesignUpdate1',
                    updateReference:    'CR001',
                    updateStatus:       DesignUpdateStatus.UPDATE_PUBLISHED_DRAFT,
                    updateMergeAction:  DesignUpdateMergeAction.MERGE_INCLUDE,
                    updateWpStatus:     DesignUpdateWpStatus.DU_NO_WP_SCENARIOS,
                    updateTestStatus:   DesignUpdateTestStatus.DU_NO_SCENARIOS_PASSING,
                    updateWpTestStatus: DuWorkPackageTestStatus.DU_WPS_NOT_COMPLETE
                };

                const userContext = {
                    userId:             'USER1',
                    designId:           'DESIGN_01',
                    designVersionId:    'DESIGN_VERSION_01',
                    designUpdateId:     'DESIGN_UPDATE_01',
                    workPackageId:      'NONE',
                };

                const userRole = RoleType.DEVELOPER;

                const item = testLayout(itemType, itemData, userContext, userRole);
                const expectedUiItem = hashID(UI.MERGE_OPTION_ROLL, 'DesignUpdate1');

                chai.assert.equal(item.find(expectedUiItem).length, 0, expectedUiItem + ' was found');
            });

            it('has no carry forward option for complete', () => {

                const itemType = ItemType.DESIGN_UPDATE;

                const itemData = {
                    _id:                'DESIGN_UPDATE_01',
                    designVersionId:    'DESIGN_VERSION_01',
                    updateName:         'DesignUpdate1',
                    updateReference:    'CR001',
                    updateStatus:       DesignUpdateStatus.UPDATE_MERGED,
                    updateMergeAction:  DesignUpdateMergeAction.MERGE_INCLUDE,
                    updateWpStatus:     DesignUpdateWpStatus.DU_NO_WP_SCENARIOS,
                    updateTestStatus:   DesignUpdateTestStatus.DU_NO_SCENARIOS_PASSING,
                    updateWpTestStatus: DuWorkPackageTestStatus.DU_WPS_NOT_COMPLETE
                };

                const userContext = {
                    userId:             'USER1',
                    designId:           'DESIGN_01',
                    designVersionId:    'DESIGN_VERSION_01',
                    designUpdateId:     'DESIGN_UPDATE_01',
                    workPackageId:      'NONE',
                };

                const userRole = RoleType.DEVELOPER;

                const item = testLayout(itemType, itemData, userContext, userRole);
                const expectedUiItem = hashID(UI.MERGE_OPTION_ROLL, 'DesignUpdate1');

                chai.assert.equal(item.find(expectedUiItem).length, 0, expectedUiItem + ' was found');
            });

            it('has no ignore option for new', () => {

                const itemType = ItemType.DESIGN_UPDATE;

                const itemData = {
                    _id:                'DESIGN_UPDATE_01',
                    designVersionId:    'DESIGN_VERSION_01',
                    updateName:         'DesignUpdate1',
                    updateReference:    'CR001',
                    updateStatus:       DesignUpdateStatus.UPDATE_NEW,
                    updateMergeAction:  DesignUpdateMergeAction.MERGE_INCLUDE,
                    updateWpStatus:     DesignUpdateWpStatus.DU_NO_WP_SCENARIOS,
                    updateTestStatus:   DesignUpdateTestStatus.DU_NO_SCENARIOS_PASSING,
                    updateWpTestStatus: DuWorkPackageTestStatus.DU_WPS_NOT_COMPLETE
                };

                const userContext = {
                    userId:             'USER1',
                    designId:           'DESIGN_01',
                    designVersionId:    'DESIGN_VERSION_01',
                    designUpdateId:     'DESIGN_UPDATE_01',
                    workPackageId:      'NONE',
                };

                const userRole = RoleType.DEVELOPER;

                const item = testLayout(itemType, itemData, userContext, userRole);
                const expectedUiItem = hashID(UI.MERGE_OPTION_IGNORE, 'DesignUpdate1');

                chai.assert.equal(item.find(expectedUiItem).length, 0, expectedUiItem + ' was found');
            });

            it('has no ignore option for published', () => {

                const itemType = ItemType.DESIGN_UPDATE;

                const itemData = {
                    _id:                'DESIGN_UPDATE_01',
                    designVersionId:    'DESIGN_VERSION_01',
                    updateName:         'DesignUpdate1',
                    updateReference:    'CR001',
                    updateStatus:       DesignUpdateStatus.UPDATE_PUBLISHED_DRAFT,
                    updateMergeAction:  DesignUpdateMergeAction.MERGE_INCLUDE,
                    updateWpStatus:     DesignUpdateWpStatus.DU_NO_WP_SCENARIOS,
                    updateTestStatus:   DesignUpdateTestStatus.DU_NO_SCENARIOS_PASSING,
                    updateWpTestStatus: DuWorkPackageTestStatus.DU_WPS_NOT_COMPLETE
                };

                const userContext = {
                    userId:             'USER1',
                    designId:           'DESIGN_01',
                    designVersionId:    'DESIGN_VERSION_01',
                    designUpdateId:     'DESIGN_UPDATE_01',
                    workPackageId:      'NONE',
                };

                const userRole = RoleType.DEVELOPER;

                const item = testLayout(itemType, itemData, userContext, userRole);
                const expectedUiItem = hashID(UI.MERGE_OPTION_IGNORE, 'DesignUpdate1');

                chai.assert.equal(item.find(expectedUiItem).length, 0, expectedUiItem + ' was found');
            });

            it('has no ignore option for complete', () => {

                const itemType = ItemType.DESIGN_UPDATE;

                const itemData = {
                    _id:                'DESIGN_UPDATE_01',
                    designVersionId:    'DESIGN_VERSION_01',
                    updateName:         'DesignUpdate1',
                    updateReference:    'CR001',
                    updateStatus:       DesignUpdateStatus.UPDATE_MERGED,
                    updateMergeAction:  DesignUpdateMergeAction.MERGE_INCLUDE,
                    updateWpStatus:     DesignUpdateWpStatus.DU_NO_WP_SCENARIOS,
                    updateTestStatus:   DesignUpdateTestStatus.DU_NO_SCENARIOS_PASSING,
                    updateWpTestStatus: DuWorkPackageTestStatus.DU_WPS_NOT_COMPLETE
                };

                const userContext = {
                    userId:             'USER1',
                    designId:           'DESIGN_01',
                    designVersionId:    'DESIGN_VERSION_01',
                    designUpdateId:     'DESIGN_UPDATE_01',
                    workPackageId:      'NONE',
                };

                const userRole = RoleType.DEVELOPER;

                const item = testLayout(itemType, itemData, userContext, userRole);
                const expectedUiItem = hashID(UI.MERGE_OPTION_IGNORE, 'DesignUpdate1');

                chai.assert.equal(item.find(expectedUiItem).length, 0, expectedUiItem + ' was found');
            });
        });

        describe('A Manager cannot set Design Update actions', () => {

            it('has no merge option for new', () => {

                const itemType = ItemType.DESIGN_UPDATE;

                const itemData = {
                    _id:                'DESIGN_UPDATE_01',
                    designVersionId:    'DESIGN_VERSION_01',
                    updateName:         'DesignUpdate1',
                    updateReference:    'CR001',
                    updateStatus:       DesignUpdateStatus.UPDATE_NEW,
                    updateMergeAction:  DesignUpdateMergeAction.MERGE_INCLUDE,
                    updateWpStatus:     DesignUpdateWpStatus.DU_NO_WP_SCENARIOS,
                    updateTestStatus:   DesignUpdateTestStatus.DU_NO_SCENARIOS_PASSING,
                    updateWpTestStatus: DuWorkPackageTestStatus.DU_WPS_NOT_COMPLETE
                };

                const userContext = {
                    userId:             'USER1',
                    designId:           'DESIGN_01',
                    designVersionId:    'DESIGN_VERSION_01',
                    designUpdateId:     'DESIGN_UPDATE_01',
                    workPackageId:      'NONE',
                };

                const userRole = RoleType.MANAGER;

                const item = testLayout(itemType, itemData, userContext, userRole);
                const expectedUiItem = hashID(UI.MERGE_OPTION_INCLUDE, 'DesignUpdate1');

                chai.assert.equal(item.find(expectedUiItem).length, 0, expectedUiItem + ' was found');
            });

            it('has no merge option for published', () => {

                const itemType = ItemType.DESIGN_UPDATE;

                const itemData = {
                    _id:                'DESIGN_UPDATE_01',
                    designVersionId:    'DESIGN_VERSION_01',
                    updateName:         'DesignUpdate1',
                    updateReference:    'CR001',
                    updateStatus:       DesignUpdateStatus.UPDATE_PUBLISHED_DRAFT,
                    updateMergeAction:  DesignUpdateMergeAction.MERGE_INCLUDE,
                    updateWpStatus:     DesignUpdateWpStatus.DU_NO_WP_SCENARIOS,
                    updateTestStatus:   DesignUpdateTestStatus.DU_NO_SCENARIOS_PASSING,
                    updateWpTestStatus: DuWorkPackageTestStatus.DU_WPS_NOT_COMPLETE
                };

                const userContext = {
                    userId:             'USER1',
                    designId:           'DESIGN_01',
                    designVersionId:    'DESIGN_VERSION_01',
                    designUpdateId:     'DESIGN_UPDATE_01',
                    workPackageId:      'NONE',
                };

                const userRole = RoleType.MANAGER;

                const item = testLayout(itemType, itemData, userContext, userRole);
                const expectedUiItem = hashID(UI.MERGE_OPTION_INCLUDE, 'DesignUpdate1');

                chai.assert.equal(item.find(expectedUiItem).length, 0, expectedUiItem + ' was found');
            });

            it('has no merge option for complete', () => {

                const itemType = ItemType.DESIGN_UPDATE;

                const itemData = {
                    _id:                'DESIGN_UPDATE_01',
                    designVersionId:    'DESIGN_VERSION_01',
                    updateName:         'DesignUpdate1',
                    updateReference:    'CR001',
                    updateStatus:       DesignUpdateStatus.UPDATE_MERGED,
                    updateMergeAction:  DesignUpdateMergeAction.MERGE_INCLUDE,
                    updateWpStatus:     DesignUpdateWpStatus.DU_NO_WP_SCENARIOS,
                    updateTestStatus:   DesignUpdateTestStatus.DU_NO_SCENARIOS_PASSING,
                    updateWpTestStatus: DuWorkPackageTestStatus.DU_WPS_NOT_COMPLETE
                };

                const userContext = {
                    userId:             'USER1',
                    designId:           'DESIGN_01',
                    designVersionId:    'DESIGN_VERSION_01',
                    designUpdateId:     'DESIGN_UPDATE_01',
                    workPackageId:      'NONE',
                };

                const userRole = RoleType.MANAGER;

                const item = testLayout(itemType, itemData, userContext, userRole);
                const expectedUiItem = hashID(UI.MERGE_OPTION_INCLUDE, 'DesignUpdate1');

                chai.assert.equal(item.find(expectedUiItem).length, 0, expectedUiItem + ' was found');
            });

            it('has no carry forward option for new', () => {

                const itemType = ItemType.DESIGN_UPDATE;

                const itemData = {
                    _id:                'DESIGN_UPDATE_01',
                    designVersionId:    'DESIGN_VERSION_01',
                    updateName:         'DesignUpdate1',
                    updateReference:    'CR001',
                    updateStatus:       DesignUpdateStatus.UPDATE_NEW,
                    updateMergeAction:  DesignUpdateMergeAction.MERGE_INCLUDE,
                    updateWpStatus:     DesignUpdateWpStatus.DU_NO_WP_SCENARIOS,
                    updateTestStatus:   DesignUpdateTestStatus.DU_NO_SCENARIOS_PASSING,
                    updateWpTestStatus: DuWorkPackageTestStatus.DU_WPS_NOT_COMPLETE
                };

                const userContext = {
                    userId:             'USER1',
                    designId:           'DESIGN_01',
                    designVersionId:    'DESIGN_VERSION_01',
                    designUpdateId:     'DESIGN_UPDATE_01',
                    workPackageId:      'NONE',
                };

                const userRole = RoleType.MANAGER;

                const item = testLayout(itemType, itemData, userContext, userRole);
                const expectedUiItem = hashID(UI.MERGE_OPTION_ROLL, 'DesignUpdate1');

                chai.assert.equal(item.find(expectedUiItem).length, 0, expectedUiItem + ' was found');
            });

            it('has no carry forward option for published', () => {

                const itemType = ItemType.DESIGN_UPDATE;

                const itemData = {
                    _id:                'DESIGN_UPDATE_01',
                    designVersionId:    'DESIGN_VERSION_01',
                    updateName:         'DesignUpdate1',
                    updateReference:    'CR001',
                    updateStatus:       DesignUpdateStatus.UPDATE_PUBLISHED_DRAFT,
                    updateMergeAction:  DesignUpdateMergeAction.MERGE_INCLUDE,
                    updateWpStatus:     DesignUpdateWpStatus.DU_NO_WP_SCENARIOS,
                    updateTestStatus:   DesignUpdateTestStatus.DU_NO_SCENARIOS_PASSING,
                    updateWpTestStatus: DuWorkPackageTestStatus.DU_WPS_NOT_COMPLETE
                };

                const userContext = {
                    userId:             'USER1',
                    designId:           'DESIGN_01',
                    designVersionId:    'DESIGN_VERSION_01',
                    designUpdateId:     'DESIGN_UPDATE_01',
                    workPackageId:      'NONE',
                };

                const userRole = RoleType.MANAGER;

                const item = testLayout(itemType, itemData, userContext, userRole);
                const expectedUiItem = hashID(UI.MERGE_OPTION_ROLL, 'DesignUpdate1');

                chai.assert.equal(item.find(expectedUiItem).length, 0, expectedUiItem + ' was found');
            });

            it('has no carry forward option for complete', () => {

                const itemType = ItemType.DESIGN_UPDATE;

                const itemData = {
                    _id:                'DESIGN_UPDATE_01',
                    designVersionId:    'DESIGN_VERSION_01',
                    updateName:         'DesignUpdate1',
                    updateReference:    'CR001',
                    updateStatus:       DesignUpdateStatus.UPDATE_MERGED,
                    updateMergeAction:  DesignUpdateMergeAction.MERGE_INCLUDE,
                    updateWpStatus:     DesignUpdateWpStatus.DU_NO_WP_SCENARIOS,
                    updateTestStatus:   DesignUpdateTestStatus.DU_NO_SCENARIOS_PASSING,
                    updateWpTestStatus: DuWorkPackageTestStatus.DU_WPS_NOT_COMPLETE
                };

                const userContext = {
                    userId:             'USER1',
                    designId:           'DESIGN_01',
                    designVersionId:    'DESIGN_VERSION_01',
                    designUpdateId:     'DESIGN_UPDATE_01',
                    workPackageId:      'NONE',
                };

                const userRole = RoleType.MANAGER;

                const item = testLayout(itemType, itemData, userContext, userRole);
                const expectedUiItem = hashID(UI.MERGE_OPTION_ROLL, 'DesignUpdate1');

                chai.assert.equal(item.find(expectedUiItem).length, 0, expectedUiItem + ' was found');
            });

            it('has no ignore option for new', () => {

                const itemType = ItemType.DESIGN_UPDATE;

                const itemData = {
                    _id:                'DESIGN_UPDATE_01',
                    designVersionId:    'DESIGN_VERSION_01',
                    updateName:         'DesignUpdate1',
                    updateReference:    'CR001',
                    updateStatus:       DesignUpdateStatus.UPDATE_NEW,
                    updateMergeAction:  DesignUpdateMergeAction.MERGE_INCLUDE,
                    updateWpStatus:     DesignUpdateWpStatus.DU_NO_WP_SCENARIOS,
                    updateTestStatus:   DesignUpdateTestStatus.DU_NO_SCENARIOS_PASSING,
                    updateWpTestStatus: DuWorkPackageTestStatus.DU_WPS_NOT_COMPLETE
                };

                const userContext = {
                    userId:             'USER1',
                    designId:           'DESIGN_01',
                    designVersionId:    'DESIGN_VERSION_01',
                    designUpdateId:     'DESIGN_UPDATE_01',
                    workPackageId:      'NONE',
                };

                const userRole = RoleType.MANAGER;

                const item = testLayout(itemType, itemData, userContext, userRole);
                const expectedUiItem = hashID(UI.MERGE_OPTION_IGNORE, 'DesignUpdate1');

                chai.assert.equal(item.find(expectedUiItem).length, 0, expectedUiItem + ' was found');
            });

            it('has no ignore option for published', () => {

                const itemType = ItemType.DESIGN_UPDATE;

                const itemData = {
                    _id:                'DESIGN_UPDATE_01',
                    designVersionId:    'DESIGN_VERSION_01',
                    updateName:         'DesignUpdate1',
                    updateReference:    'CR001',
                    updateStatus:       DesignUpdateStatus.UPDATE_PUBLISHED_DRAFT,
                    updateMergeAction:  DesignUpdateMergeAction.MERGE_INCLUDE,
                    updateWpStatus:     DesignUpdateWpStatus.DU_NO_WP_SCENARIOS,
                    updateTestStatus:   DesignUpdateTestStatus.DU_NO_SCENARIOS_PASSING,
                    updateWpTestStatus: DuWorkPackageTestStatus.DU_WPS_NOT_COMPLETE
                };

                const userContext = {
                    userId:             'USER1',
                    designId:           'DESIGN_01',
                    designVersionId:    'DESIGN_VERSION_01',
                    designUpdateId:     'DESIGN_UPDATE_01',
                    workPackageId:      'NONE',
                };

                const userRole = RoleType.MANAGER;

                const item = testLayout(itemType, itemData, userContext, userRole);
                const expectedUiItem = hashID(UI.MERGE_OPTION_IGNORE, 'DesignUpdate1');

                chai.assert.equal(item.find(expectedUiItem).length, 0, expectedUiItem + ' was found');
            });

            it('has no ignore option for complete', () => {

                const itemType = ItemType.DESIGN_UPDATE;

                const itemData = {
                    _id:                'DESIGN_UPDATE_01',
                    designVersionId:    'DESIGN_VERSION_01',
                    updateName:         'DesignUpdate1',
                    updateReference:    'CR001',
                    updateStatus:       DesignUpdateStatus.UPDATE_MERGED,
                    updateMergeAction:  DesignUpdateMergeAction.MERGE_INCLUDE,
                    updateWpStatus:     DesignUpdateWpStatus.DU_NO_WP_SCENARIOS,
                    updateTestStatus:   DesignUpdateTestStatus.DU_NO_SCENARIOS_PASSING,
                    updateWpTestStatus: DuWorkPackageTestStatus.DU_WPS_NOT_COMPLETE
                };

                const userContext = {
                    userId:             'USER1',
                    designId:           'DESIGN_01',
                    designVersionId:    'DESIGN_VERSION_01',
                    designUpdateId:     'DESIGN_UPDATE_01',
                    workPackageId:      'NONE',
                };

                const userRole = RoleType.MANAGER;

                const item = testLayout(itemType, itemData, userContext, userRole);
                const expectedUiItem = hashID(UI.MERGE_OPTION_IGNORE, 'DesignUpdate1');

                chai.assert.equal(item.find(expectedUiItem).length, 0, expectedUiItem + ' was found');
            });
        });


    });


    // WORK PACKAGE TESTS ----------------------------------------------------------------------------------------------

    describe('WP', () => {

        describe('When a Work Package is selected it is highlighted in the Work Package list', () => {

            it('is highlighted when it is the current work package', () => {

                const itemType = ItemType.WORK_PACKAGE;

                const itemData = {
                    _id:                    'WORK_PACKAGE_01',
                    designVersionId:        'DESIGN_VERSION_01',
                    designUpdateId:         'DESIGN_UPDATE_01',
                    workPackageType:        WorkPackageType.WP_UPDATE,
                    workPackageName:        'WorkPackage1',
                    workPackageStatus:      WorkPackageStatus.WP_NEW,
                    workPackageTestStatus:  WorkPackageTestStatus.WP_TESTS_NOT_COMPLETE,
                    adoptingUserId:         'NONE',
                    workPackageLink:        'NONE'
                };

                const userContext = {
                    userId:             'USER1',
                    designId:           'DESIGN_01',
                    designVersionId:    'DESIGN_VERSION_01',
                    designUpdateId:     'DESIGN_UPDATE_01',
                    workPackageId:      'WORK_PACKAGE_01',
                };

                const userRole = RoleType.MANAGER;

                const item = testLayout(itemType, itemData, userContext, userRole);
                const expectedUiItem = hashID(UI.UW_ITEM_SELECTED, 'WorkPackage1');

                chai.assert.equal(item.find(expectedUiItem).length, 1, expectedUiItem + ' not found');
            });

            it('is not highlighted when it is not the current work package', () => {

                const itemType = ItemType.WORK_PACKAGE;

                const itemData = {
                    _id:                    'WORK_PACKAGE_01',
                    designVersionId:        'DESIGN_VERSION_01',
                    designUpdateId:         'DESIGN_UPDATE_01',
                    workPackageType:        WorkPackageType.WP_UPDATE,
                    workPackageName:        'WorkPackage1',
                    workPackageStatus:      WorkPackageStatus.WP_NEW,
                    workPackageTestStatus:  WorkPackageTestStatus.WP_TESTS_NOT_COMPLETE,
                    adoptingUserId:         'NONE',
                    workPackageLink:        'NONE'
                };

                const userContext = {
                    userId:             'USER1',
                    designId:           'DESIGN_01',
                    designVersionId:    'DESIGN_VERSION_01',
                    designUpdateId:     'DESIGN_UPDATE_01',
                    workPackageId:      'WORK_PACKAGE_02',
                };

                const userRole = RoleType.MANAGER;

                const item = testLayout(itemType, itemData, userContext, userRole);
                const expectedUiItem = hashID(UI.UW_ITEM_UNSELECTED, 'WorkPackage1');

                chai.assert.equal(item.find(expectedUiItem).length, 1, expectedUiItem + ' not found');
            });
        });

        // Publish -----------------------------------------------------------------------------------------------------

        describe('A Work Package has an option to publish it', () => {

            it('has a publish option for new base work package', () => {

                const itemType = ItemType.WORK_PACKAGE;

                const itemData = {
                    _id:                    'WORK_PACKAGE_01',
                    designVersionId:        'DESIGN_VERSION_01',
                    designUpdateId:         'NONE',
                    workPackageType:        WorkPackageType.WP_BASE,
                    workPackageName:        'WorkPackage1',
                    workPackageStatus:      WorkPackageStatus.WP_NEW,
                    workPackageTestStatus:  WorkPackageTestStatus.WP_TESTS_NOT_COMPLETE,
                    adoptingUserId:         'NONE',
                    workPackageLink:        'NONE'
                };

                const userContext = {
                    userId:             'USER1',
                    designId:           'DESIGN_01',
                    designVersionId:    'DESIGN_VERSION_01',
                    designUpdateId:     'NONE',
                    workPackageId:      'WORK_PACKAGE_01',
                };

                const userRole = RoleType.MANAGER;

                const item = testLayout(itemType, itemData, userContext, userRole);
                const expectedUiItem = hashID(UI.BUTTON_PUBLISH, 'WorkPackage1');

                chai.assert.equal(item.find(expectedUiItem).length, 1, expectedUiItem + ' not found');

            });

            it('has a publish option for new update work package', () => {

                const itemType = ItemType.WORK_PACKAGE;

                const itemData = {
                    _id:                    'WORK_PACKAGE_01',
                    designVersionId:        'DESIGN_VERSION_01',
                    designUpdateId:         'DESIGN_UPDATE_01',
                    workPackageType:        WorkPackageType.WP_UPDATE,
                    workPackageName:        'WorkPackage1',
                    workPackageStatus:      WorkPackageStatus.WP_NEW,
                    workPackageTestStatus:  WorkPackageTestStatus.WP_TESTS_NOT_COMPLETE,
                    adoptingUserId:         'NONE',
                    workPackageLink:        'NONE'
                };

                const userContext = {
                    userId:             'USER1',
                    designId:           'DESIGN_01',
                    designVersionId:    'DESIGN_VERSION_01',
                    designUpdateId:     'DESIGN_UPDATE_01',
                    workPackageId:      'WORK_PACKAGE_01',
                };

                const userRole = RoleType.MANAGER;

                const item = testLayout(itemType, itemData, userContext, userRole);
                const expectedUiItem = hashID(UI.BUTTON_PUBLISH, 'WorkPackage1');

                chai.assert.equal(item.find(expectedUiItem).length, 1, expectedUiItem + ' not found');

            });
        });

        describe('Only a Manager can publish a New Work Package', () => {

            it('has no publish option for Designer', () => {

                const itemType = ItemType.WORK_PACKAGE;

                const itemData = {
                    _id:                    'WORK_PACKAGE_01',
                    designVersionId:        'DESIGN_VERSION_01',
                    designUpdateId:         'NONE',
                    workPackageType:        WorkPackageType.WP_BASE,
                    workPackageName:        'WorkPackage1',
                    workPackageStatus:      WorkPackageStatus.WP_NEW,
                    workPackageTestStatus:  WorkPackageTestStatus.WP_TESTS_NOT_COMPLETE,
                    adoptingUserId:         'NONE',
                    workPackageLink:        'NONE'
                };

                const userContext = {
                    userId:             'USER1',
                    designId:           'DESIGN_01',
                    designVersionId:    'DESIGN_VERSION_01',
                    designUpdateId:     'NONE',
                    workPackageId:      'WORK_PACKAGE_01',
                };

                const userRole = RoleType.DESIGNER;

                const item = testLayout(itemType, itemData, userContext, userRole);
                const expectedUiItem = hashID(UI.BUTTON_PUBLISH, 'WorkPackage1');

                chai.assert.equal(item.find(expectedUiItem).length, 0, expectedUiItem + ' was found');

            });

            it('has no publish option for Developer', () => {

                const itemType = ItemType.WORK_PACKAGE;

                const itemData = {
                    _id:                    'WORK_PACKAGE_01',
                    designVersionId:        'DESIGN_VERSION_01',
                    designUpdateId:         'NONE',
                    workPackageType:        WorkPackageType.WP_BASE,
                    workPackageName:        'WorkPackage1',
                    workPackageStatus:      WorkPackageStatus.WP_NEW,
                    workPackageTestStatus:  WorkPackageTestStatus.WP_TESTS_NOT_COMPLETE,
                    adoptingUserId:         'NONE',
                    workPackageLink:        'NONE'
                };

                const userContext = {
                    userId:             'USER1',
                    designId:           'DESIGN_01',
                    designVersionId:    'DESIGN_VERSION_01',
                    designUpdateId:     'NONE',
                    workPackageId:      'WORK_PACKAGE_01',
                };

                const userRole = RoleType.DEVELOPER;

                const item = testLayout(itemType, itemData, userContext, userRole);
                const expectedUiItem = hashID(UI.BUTTON_PUBLISH, 'WorkPackage1');

                chai.assert.equal(item.find(expectedUiItem).length, 0, expectedUiItem + ' was found');

            });

            it('has no publish option for Guest', () => {

                const itemType = ItemType.WORK_PACKAGE;

                const itemData = {
                    _id:                    'WORK_PACKAGE_01',
                    designVersionId:        'DESIGN_VERSION_01',
                    designUpdateId:         'NONE',
                    workPackageType:        WorkPackageType.WP_BASE,
                    workPackageName:        'WorkPackage1',
                    workPackageStatus:      WorkPackageStatus.WP_NEW,
                    workPackageTestStatus:  WorkPackageTestStatus.WP_TESTS_NOT_COMPLETE,
                    adoptingUserId:         'NONE',
                    workPackageLink:        'NONE'
                };

                const userContext = {
                    userId:             'USER1',
                    designId:           'DESIGN_01',
                    designVersionId:    'DESIGN_VERSION_01',
                    designUpdateId:     'NONE',
                    workPackageId:      'WORK_PACKAGE_01',
                };

                const userRole = RoleType.GUEST_VIEWER;

                const item = testLayout(itemType, itemData, userContext, userRole);
                const expectedUiItem = hashID(UI.BUTTON_PUBLISH, 'WorkPackage1');

                chai.assert.equal(item.find(expectedUiItem).length, 0, expectedUiItem + ' was found');

            });
        });

        describe('Only a New Work Package can be published', () => {

            it('has no publish option for available', () => {

                const itemType = ItemType.WORK_PACKAGE;

                const itemData = {
                    _id:                    'WORK_PACKAGE_01',
                    designVersionId:        'DESIGN_VERSION_01',
                    designUpdateId:         'NONE',
                    workPackageType:        WorkPackageType.WP_BASE,
                    workPackageName:        'WorkPackage1',
                    workPackageStatus:      WorkPackageStatus.WP_AVAILABLE,
                    workPackageTestStatus:  WorkPackageTestStatus.WP_TESTS_NOT_COMPLETE,
                    adoptingUserId:         'NONE',
                    workPackageLink:        'NONE'
                };

                const userContext = {
                    userId:             'USER1',
                    designId:           'DESIGN_01',
                    designVersionId:    'DESIGN_VERSION_01',
                    designUpdateId:     'NONE',
                    workPackageId:      'WORK_PACKAGE_01',
                };

                const userRole = RoleType.MANAGER;

                const item = testLayout(itemType, itemData, userContext, userRole);
                const expectedUiItem = hashID(UI.BUTTON_PUBLISH, 'WorkPackage1');

                chai.assert.equal(item.find(expectedUiItem).length, 0, expectedUiItem + ' was found');

            });

            it('has no publish option for adopted', () => {

                const itemType = ItemType.WORK_PACKAGE;

                const itemData = {
                    _id:                    'WORK_PACKAGE_01',
                    designVersionId:        'DESIGN_VERSION_01',
                    designUpdateId:         'NONE',
                    workPackageType:        WorkPackageType.WP_BASE,
                    workPackageName:        'WorkPackage1',
                    workPackageStatus:      WorkPackageStatus.WP_ADOPTED,
                    workPackageTestStatus:  WorkPackageTestStatus.WP_TESTS_NOT_COMPLETE,
                    adoptingUserId:         'NONE',
                    workPackageLink:        'NONE'
                };

                const userContext = {
                    userId:             'USER1',
                    designId:           'DESIGN_01',
                    designVersionId:    'DESIGN_VERSION_01',
                    designUpdateId:     'NONE',
                    workPackageId:      'WORK_PACKAGE_01',
                };

                const userRole = RoleType.MANAGER;

                const item = testLayout(itemType, itemData, userContext, userRole);
                const expectedUiItem = hashID(UI.BUTTON_PUBLISH, 'WorkPackage1');

                chai.assert.equal(item.find(expectedUiItem).length, 0, expectedUiItem + ' was found');

            });
        });

        // WP Withdraw -----------------------------------------------------------------------------------------------------

        describe('An Available Work Package has an option to withdraw it', () => {

            it('has a withdraw option for available base work package', () => {

                const itemType = ItemType.WORK_PACKAGE;

                const itemData = {
                    _id:                    'WORK_PACKAGE_01',
                    designVersionId:        'DESIGN_VERSION_01',
                    designUpdateId:         'NONE',
                    workPackageType:        WorkPackageType.WP_BASE,
                    workPackageName:        'WorkPackage1',
                    workPackageStatus:      WorkPackageStatus.WP_AVAILABLE,
                    workPackageTestStatus:  WorkPackageTestStatus.WP_TESTS_NOT_COMPLETE,
                    adoptingUserId:         'NONE',
                    workPackageLink:        'NONE'
                };

                const userContext = {
                    userId:             'USER1',
                    designId:           'DESIGN_01',
                    designVersionId:    'DESIGN_VERSION_01',
                    designUpdateId:     'NONE',
                    workPackageId:      'WORK_PACKAGE_01',
                };

                const userRole = RoleType.MANAGER;

                const item = testLayout(itemType, itemData, userContext, userRole);
                const expectedUiItem = hashID(UI.BUTTON_WITHDRAW, 'WorkPackage1');

                chai.assert.equal(item.find(expectedUiItem).length, 1, expectedUiItem + ' not found');

            });

            it('has a withdraw option for available update work package', () => {

                const itemType = ItemType.WORK_PACKAGE;

                const itemData = {
                    _id:                    'WORK_PACKAGE_01',
                    designVersionId:        'DESIGN_VERSION_01',
                    designUpdateId:         'DESIGN_UPDATE_01',
                    workPackageType:        WorkPackageType.WP_UPDATE,
                    workPackageName:        'WorkPackage1',
                    workPackageStatus:      WorkPackageStatus.WP_AVAILABLE,
                    workPackageTestStatus:  WorkPackageTestStatus.WP_TESTS_NOT_COMPLETE,
                    adoptingUserId:         'NONE',
                    workPackageLink:        'NONE'
                };

                const userContext = {
                    userId:             'USER1',
                    designId:           'DESIGN_01',
                    designVersionId:    'DESIGN_VERSION_01',
                    designUpdateId:     'DESIGN_UPDATE_01',
                    workPackageId:      'WORK_PACKAGE_01',
                };

                const userRole = RoleType.MANAGER;

                const item = testLayout(itemType, itemData, userContext, userRole);
                const expectedUiItem = hashID(UI.BUTTON_WITHDRAW, 'WorkPackage1');

                chai.assert.equal(item.find(expectedUiItem).length, 1, expectedUiItem + ' not found');

            });
        });

        describe('Only a Manager can withdraw a New Work Package', () => {

            it('has no withdraw option for Designer', () => {

                const itemType = ItemType.WORK_PACKAGE;

                const itemData = {
                    _id:                    'WORK_PACKAGE_01',
                    designVersionId:        'DESIGN_VERSION_01',
                    designUpdateId:         'NONE',
                    workPackageType:        WorkPackageType.WP_BASE,
                    workPackageName:        'WorkPackage1',
                    workPackageStatus:      WorkPackageStatus.WP_AVAILABLE,
                    workPackageTestStatus:  WorkPackageTestStatus.WP_TESTS_NOT_COMPLETE,
                    adoptingUserId:         'NONE',
                    workPackageLink:        'NONE'
                };

                const userContext = {
                    userId:             'USER1',
                    designId:           'DESIGN_01',
                    designVersionId:    'DESIGN_VERSION_01',
                    designUpdateId:     'NONE',
                    workPackageId:      'WORK_PACKAGE_01',
                };

                const userRole = RoleType.DESIGNER;

                const item = testLayout(itemType, itemData, userContext, userRole);
                const expectedUiItem = hashID(UI.BUTTON_WITHDRAW, 'WorkPackage1');

                chai.assert.equal(item.find(expectedUiItem).length, 0, expectedUiItem + ' was found');

            });

            it('has no withdraw option for Developer', () => {

                const itemType = ItemType.WORK_PACKAGE;

                const itemData = {
                    _id:                    'WORK_PACKAGE_01',
                    designVersionId:        'DESIGN_VERSION_01',
                    designUpdateId:         'NONE',
                    workPackageType:        WorkPackageType.WP_BASE,
                    workPackageName:        'WorkPackage1',
                    workPackageStatus:      WorkPackageStatus.WP_AVAILABLE,
                    workPackageTestStatus:  WorkPackageTestStatus.WP_TESTS_NOT_COMPLETE,
                    adoptingUserId:         'NONE',
                    workPackageLink:        'NONE'
                };

                const userContext = {
                    userId:             'USER1',
                    designId:           'DESIGN_01',
                    designVersionId:    'DESIGN_VERSION_01',
                    designUpdateId:     'NONE',
                    workPackageId:      'WORK_PACKAGE_01',
                };

                const userRole = RoleType.DEVELOPER;

                const item = testLayout(itemType, itemData, userContext, userRole);
                const expectedUiItem = hashID(UI.BUTTON_WITHDRAW, 'WorkPackage1');

                chai.assert.equal(item.find(expectedUiItem).length, 0, expectedUiItem + ' was found');

            });
        });

        describe('Only a published and not adopted Work Package can be withdrawn', () => {

            it('has no withdraw option for new', () => {

                const itemType = ItemType.WORK_PACKAGE;

                const itemData = {
                    _id:                    'WORK_PACKAGE_01',
                    designVersionId:        'DESIGN_VERSION_01',
                    designUpdateId:         'NONE',
                    workPackageType:        WorkPackageType.WP_BASE,
                    workPackageName:        'WorkPackage1',
                    workPackageStatus:      WorkPackageStatus.WP_NEW,
                    workPackageTestStatus:  WorkPackageTestStatus.WP_TESTS_NOT_COMPLETE,
                    adoptingUserId:         'NONE',
                    workPackageLink:        'NONE'
                };

                const userContext = {
                    userId:             'USER1',
                    designId:           'DESIGN_01',
                    designVersionId:    'DESIGN_VERSION_01',
                    designUpdateId:     'NONE',
                    workPackageId:      'WORK_PACKAGE_01',
                };

                const userRole = RoleType.MANAGER;

                const item = testLayout(itemType, itemData, userContext, userRole);
                const expectedUiItem = hashID(UI.BUTTON_WITHDRAW, 'WorkPackage1');

                chai.assert.equal(item.find(expectedUiItem).length, 0, expectedUiItem + ' was found');

            });

            it('has no withdraw option for adopted', () => {

                const itemType = ItemType.WORK_PACKAGE;

                const itemData = {
                    _id:                    'WORK_PACKAGE_01',
                    designVersionId:        'DESIGN_VERSION_01',
                    designUpdateId:         'NONE',
                    workPackageType:        WorkPackageType.WP_BASE,
                    workPackageName:        'WorkPackage1',
                    workPackageStatus:      WorkPackageStatus.WP_ADOPTED,
                    workPackageTestStatus:  WorkPackageTestStatus.WP_TESTS_NOT_COMPLETE,
                    adoptingUserId:         'NONE',
                    workPackageLink:        'NONE'
                };

                const userContext = {
                    userId:             'USER1',
                    designId:           'DESIGN_01',
                    designVersionId:    'DESIGN_VERSION_01',
                    designUpdateId:     'NONE',
                    workPackageId:      'WORK_PACKAGE_01',
                };

                const userRole = RoleType.MANAGER;

                const item = testLayout(itemType, itemData, userContext, userRole);
                const expectedUiItem = hashID(UI.BUTTON_WITHDRAW, 'WorkPackage1');

                chai.assert.equal(item.find(expectedUiItem).length, 0, expectedUiItem + ' was found');

            });
        });

        // WP Remove -------------------------------------------------------------------------------------------------------

        describe('A Work Package has an option to remove it from the list', () => {

            it('has a remove option for new base work package', () => {

                const itemType = ItemType.WORK_PACKAGE;

                const itemData = {
                    _id:                    'WORK_PACKAGE_01',
                    designVersionId:        'DESIGN_VERSION_01',
                    designUpdateId:         'NONE',
                    workPackageType:        WorkPackageType.WP_BASE,
                    workPackageName:        'WorkPackage1',
                    workPackageStatus:      WorkPackageStatus.WP_NEW,
                    workPackageTestStatus:  WorkPackageTestStatus.WP_TESTS_NOT_COMPLETE,
                    adoptingUserId:         'NONE',
                    workPackageLink:        'NONE'
                };

                const userContext = {
                    userId:             'USER1',
                    designId:           'DESIGN_01',
                    designVersionId:    'DESIGN_VERSION_01',
                    designUpdateId:     'NONE',
                    workPackageId:      'WORK_PACKAGE_01',
                };

                const userRole = RoleType.MANAGER;

                const item = testLayout(itemType, itemData, userContext, userRole);
                const expectedUiItem = hashID(UI.BUTTON_REMOVE, 'WorkPackage1');

                chai.assert.equal(item.find(expectedUiItem).length, 1, expectedUiItem + ' not found');

            });

            it('has a remove option for new update work package', () => {

                const itemType = ItemType.WORK_PACKAGE;

                const itemData = {
                    _id:                    'WORK_PACKAGE_01',
                    designVersionId:        'DESIGN_VERSION_01',
                    designUpdateId:         'DESIGN_UPDATE_01',
                    workPackageType:        WorkPackageType.WP_UPDATE,
                    workPackageName:        'WorkPackage1',
                    workPackageStatus:      WorkPackageStatus.WP_NEW,
                    workPackageTestStatus:  WorkPackageTestStatus.WP_TESTS_NOT_COMPLETE,
                    adoptingUserId:         'NONE',
                    workPackageLink:        'NONE'
                };

                const userContext = {
                    userId:             'USER1',
                    designId:           'DESIGN_01',
                    designVersionId:    'DESIGN_VERSION_01',
                    designUpdateId:     'DESIGN_UPDATE_01',
                    workPackageId:      'WORK_PACKAGE_01',
                };

                const userRole = RoleType.MANAGER;

                const item = testLayout(itemType, itemData, userContext, userRole);
                const expectedUiItem = hashID(UI.BUTTON_REMOVE, 'WorkPackage1');

                chai.assert.equal(item.find(expectedUiItem).length, 1, expectedUiItem + ' not found');

            });
        });

        describe('Only a Manager may remove a Work Package', () => {

            it('has no remove option for Designer', () => {

                const itemType = ItemType.WORK_PACKAGE;

                const itemData = {
                    _id:                    'WORK_PACKAGE_01',
                    designVersionId:        'DESIGN_VERSION_01',
                    designUpdateId:         'NONE',
                    workPackageType:        WorkPackageType.WP_BASE,
                    workPackageName:        'WorkPackage1',
                    workPackageStatus:      WorkPackageStatus.WP_NEW,
                    workPackageTestStatus:  WorkPackageTestStatus.WP_TESTS_NOT_COMPLETE,
                    adoptingUserId:         'NONE',
                    workPackageLink:        'NONE'
                };

                const userContext = {
                    userId:             'USER1',
                    designId:           'DESIGN_01',
                    designVersionId:    'DESIGN_VERSION_01',
                    designUpdateId:     'NONE',
                    workPackageId:      'WORK_PACKAGE_01',
                };

                const userRole = RoleType.DESIGNER;

                const item = testLayout(itemType, itemData, userContext, userRole);
                const expectedUiItem = hashID(UI.BUTTON_REMOVE, 'WorkPackage1');

                chai.assert.equal(item.find(expectedUiItem).length, 0, expectedUiItem + ' was found');

            });

            it('has no remove option for Developer', () => {

                const itemType = ItemType.WORK_PACKAGE;

                const itemData = {
                    _id:                    'WORK_PACKAGE_01',
                    designVersionId:        'DESIGN_VERSION_01',
                    designUpdateId:         'NONE',
                    workPackageType:        WorkPackageType.WP_BASE,
                    workPackageName:        'WorkPackage1',
                    workPackageStatus:      WorkPackageStatus.WP_NEW,
                    workPackageTestStatus:  WorkPackageTestStatus.WP_TESTS_NOT_COMPLETE,
                    adoptingUserId:         'NONE',
                    workPackageLink:        'NONE'
                };

                const userContext = {
                    userId:             'USER1',
                    designId:           'DESIGN_01',
                    designVersionId:    'DESIGN_VERSION_01',
                    designUpdateId:     'NONE',
                    workPackageId:      'WORK_PACKAGE_01',
                };

                const userRole = RoleType.DEVELOPER;

                const item = testLayout(itemType, itemData, userContext, userRole);
                const expectedUiItem = hashID(UI.BUTTON_REMOVE, 'WorkPackage1');

                chai.assert.equal(item.find(expectedUiItem).length, 0, expectedUiItem + ' was found');

            });
        });

        describe('Only a New Work Package may be removed', () => {

            it('has no remove option for available', () => {

                const itemType = ItemType.WORK_PACKAGE;

                const itemData = {
                    _id:                    'WORK_PACKAGE_01',
                    designVersionId:        'DESIGN_VERSION_01',
                    designUpdateId:         'NONE',
                    workPackageType:        WorkPackageType.WP_BASE,
                    workPackageName:        'WorkPackage1',
                    workPackageStatus:      WorkPackageStatus.WP_AVAILABLE,
                    workPackageTestStatus:  WorkPackageTestStatus.WP_TESTS_NOT_COMPLETE,
                    adoptingUserId:         'NONE',
                    workPackageLink:        'NONE'
                };

                const userContext = {
                    userId:             'USER1',
                    designId:           'DESIGN_01',
                    designVersionId:    'DESIGN_VERSION_01',
                    designUpdateId:     'NONE',
                    workPackageId:      'WORK_PACKAGE_01',
                };

                const userRole = RoleType.MANAGER;

                const item = testLayout(itemType, itemData, userContext, userRole);
                const expectedUiItem = hashID(UI.BUTTON_REMOVE, 'WorkPackage1');

                chai.assert.equal(item.find(expectedUiItem).length, 0, expectedUiItem + ' was found');

            });

            it('has no remove option for adopted', () => {

                const itemType = ItemType.WORK_PACKAGE;

                const itemData = {
                    _id:                    'WORK_PACKAGE_01',
                    designVersionId:        'DESIGN_VERSION_01',
                    designUpdateId:         'NONE',
                    workPackageType:        WorkPackageType.WP_BASE,
                    workPackageName:        'WorkPackage1',
                    workPackageStatus:      WorkPackageStatus.WP_ADOPTED,
                    workPackageTestStatus:  WorkPackageTestStatus.WP_TESTS_NOT_COMPLETE,
                    adoptingUserId:         'NONE',
                    workPackageLink:        'NONE'
                };

                const userContext = {
                    userId:             'USER1',
                    designId:           'DESIGN_01',
                    designVersionId:    'DESIGN_VERSION_01',
                    designUpdateId:     'NONE',
                    workPackageId:      'WORK_PACKAGE_01',
                };

                const userRole = RoleType.MANAGER;

                const item = testLayout(itemType, itemData, userContext, userRole);
                const expectedUiItem = hashID(UI.BUTTON_REMOVE, 'WorkPackage1');

                chai.assert.equal(item.find(expectedUiItem).length, 0, expectedUiItem + ' was found');

            });
        });

        // WP Edit ---------------------------------------------------------------------------------------------------------

        describe('A Work Package has an option to edit its content', () => {

            it('has an edit option for new base work package', () => {

                const itemType = ItemType.WORK_PACKAGE;

                const itemData = {
                    _id:                    'WORK_PACKAGE_01',
                    designVersionId:        'DESIGN_VERSION_01',
                    designUpdateId:         'NONE',
                    workPackageType:        WorkPackageType.WP_BASE,
                    workPackageName:        'WorkPackage1',
                    workPackageStatus:      WorkPackageStatus.WP_NEW,
                    workPackageTestStatus:  WorkPackageTestStatus.WP_TESTS_NOT_COMPLETE,
                    adoptingUserId:         'NONE',
                    workPackageLink:        'NONE'
                };

                const userContext = {
                    userId:             'USER1',
                    designId:           'DESIGN_01',
                    designVersionId:    'DESIGN_VERSION_01',
                    designUpdateId:     'NONE',
                    workPackageId:      'WORK_PACKAGE_01',
                };

                const userRole = RoleType.MANAGER;

                const item = testLayout(itemType, itemData, userContext, userRole);
                const expectedUiItem = hashID(UI.BUTTON_EDIT, 'WorkPackage1');

                chai.assert.equal(item.find(expectedUiItem).length, 1, expectedUiItem + ' not found');

            });

            it('has an edit option for published base work package', () => {

                const itemType = ItemType.WORK_PACKAGE;

                const itemData = {
                    _id:                    'WORK_PACKAGE_01',
                    designVersionId:        'DESIGN_VERSION_01',
                    designUpdateId:         'NONE',
                    workPackageType:        WorkPackageType.WP_BASE,
                    workPackageName:        'WorkPackage1',
                    workPackageStatus:      WorkPackageStatus.WP_AVAILABLE,
                    workPackageTestStatus:  WorkPackageTestStatus.WP_TESTS_NOT_COMPLETE,
                    adoptingUserId:         'NONE',
                    workPackageLink:        'NONE'
                };

                const userContext = {
                    userId:             'USER1',
                    designId:           'DESIGN_01',
                    designVersionId:    'DESIGN_VERSION_01',
                    designUpdateId:     'NONE',
                    workPackageId:      'WORK_PACKAGE_01',
                };

                const userRole = RoleType.MANAGER;

                const item = testLayout(itemType, itemData, userContext, userRole);
                const expectedUiItem = hashID(UI.BUTTON_EDIT, 'WorkPackage1');

                chai.assert.equal(item.find(expectedUiItem).length, 1, expectedUiItem + ' not found');

            });

            it('has an edit option for adopted base work package', () => {

                const itemType = ItemType.WORK_PACKAGE;

                const itemData = {
                    _id:                    'WORK_PACKAGE_01',
                    designVersionId:        'DESIGN_VERSION_01',
                    designUpdateId:         'NONE',
                    workPackageType:        WorkPackageType.WP_BASE,
                    workPackageName:        'WorkPackage1',
                    workPackageStatus:      WorkPackageStatus.WP_ADOPTED,
                    workPackageTestStatus:  WorkPackageTestStatus.WP_TESTS_NOT_COMPLETE,
                    adoptingUserId:         'NONE',
                    workPackageLink:        'NONE'
                };

                const userContext = {
                    userId:             'USER1',
                    designId:           'DESIGN_01',
                    designVersionId:    'DESIGN_VERSION_01',
                    designUpdateId:     'NONE',
                    workPackageId:      'WORK_PACKAGE_01',
                };

                const userRole = RoleType.MANAGER;

                const item = testLayout(itemType, itemData, userContext, userRole);
                const expectedUiItem = hashID(UI.BUTTON_EDIT, 'WorkPackage1');

                chai.assert.equal(item.find(expectedUiItem).length, 1, expectedUiItem + ' not found');

            });

            it('has an edit option for new update work package', () => {

                const itemType = ItemType.WORK_PACKAGE;

                const itemData = {
                    _id:                    'WORK_PACKAGE_01',
                    designVersionId:        'DESIGN_VERSION_01',
                    designUpdateId:         'DESIGN_UPDATE_01',
                    workPackageType:        WorkPackageType.WP_UPDATE,
                    workPackageName:        'WorkPackage1',
                    workPackageStatus:      WorkPackageStatus.WP_NEW,
                    workPackageTestStatus:  WorkPackageTestStatus.WP_TESTS_NOT_COMPLETE,
                    adoptingUserId:         'NONE',
                    workPackageLink:        'NONE'
                };

                const userContext = {
                    userId:             'USER1',
                    designId:           'DESIGN_01',
                    designVersionId:    'DESIGN_VERSION_01',
                    designUpdateId:     'DESIGN_UPDATE_01',
                    workPackageId:      'WORK_PACKAGE_01',
                };

                const userRole = RoleType.MANAGER;

                const item = testLayout(itemType, itemData, userContext, userRole);
                const expectedUiItem = hashID(UI.BUTTON_EDIT, 'WorkPackage1');

                chai.assert.equal(item.find(expectedUiItem).length, 1, expectedUiItem + ' not found');

            });

            it('has an edit option for published update work package', () => {

                const itemType = ItemType.WORK_PACKAGE;

                const itemData = {
                    _id:                    'WORK_PACKAGE_01',
                    designVersionId:        'DESIGN_VERSION_01',
                    designUpdateId:         'DESIGN_UPDATE_01',
                    workPackageType:        WorkPackageType.WP_UPDATE,
                    workPackageName:        'WorkPackage1',
                    workPackageStatus:      WorkPackageStatus.WP_AVAILABLE,
                    workPackageTestStatus:  WorkPackageTestStatus.WP_TESTS_NOT_COMPLETE,
                    adoptingUserId:         'NONE',
                    workPackageLink:        'NONE'
                };

                const userContext = {
                    userId:             'USER1',
                    designId:           'DESIGN_01',
                    designVersionId:    'DESIGN_VERSION_01',
                    designUpdateId:     'DESIGN_UPDATE_01',
                    workPackageId:      'WORK_PACKAGE_01',
                };

                const userRole = RoleType.MANAGER;

                const item = testLayout(itemType, itemData, userContext, userRole);
                const expectedUiItem = hashID(UI.BUTTON_EDIT, 'WorkPackage1');

                chai.assert.equal(item.find(expectedUiItem).length, 1, expectedUiItem + ' not found');

            });

            it('has an edit option for adopted update work package', () => {

                const itemType = ItemType.WORK_PACKAGE;

                const itemData = {
                    _id:                    'WORK_PACKAGE_01',
                    designVersionId:        'DESIGN_VERSION_01',
                    designUpdateId:         'DESIGN_UPDATE_01',
                    workPackageType:        WorkPackageType.WP_UPDATE,
                    workPackageName:        'WorkPackage1',
                    workPackageStatus:      WorkPackageStatus.WP_ADOPTED,
                    workPackageTestStatus:  WorkPackageTestStatus.WP_TESTS_NOT_COMPLETE,
                    adoptingUserId:         'NONE',
                    workPackageLink:        'NONE'
                };

                const userContext = {
                    userId:             'USER1',
                    designId:           'DESIGN_01',
                    designVersionId:    'DESIGN_VERSION_01',
                    designUpdateId:     'DESIGN_UPDATE_01',
                    workPackageId:      'WORK_PACKAGE_01',
                };

                const userRole = RoleType.MANAGER;

                const item = testLayout(itemType, itemData, userContext, userRole);
                const expectedUiItem = hashID(UI.BUTTON_EDIT, 'WorkPackage1');

                chai.assert.equal(item.find(expectedUiItem).length, 1, expectedUiItem + ' not found');

            });
        });

        describe('Only a Manager may edit a Work Package content', () => {

            it('is not editable by Designer', () => {

                const itemType = ItemType.WORK_PACKAGE;

                const itemData = {
                    _id:                    'WORK_PACKAGE_01',
                    designVersionId:        'DESIGN_VERSION_01',
                    designUpdateId:         'DESIGN_UPDATE_01',
                    workPackageType:        WorkPackageType.WP_UPDATE,
                    workPackageName:        'WorkPackage1',
                    workPackageStatus:      WorkPackageStatus.WP_ADOPTED,
                    workPackageTestStatus:  WorkPackageTestStatus.WP_TESTS_NOT_COMPLETE,
                    adoptingUserId:         'NONE',
                    workPackageLink:        'NONE'
                };

                const userContext = {
                    userId:             'USER1',
                    designId:           'DESIGN_01',
                    designVersionId:    'DESIGN_VERSION_01',
                    designUpdateId:     'DESIGN_UPDATE_01',
                    workPackageId:      'WORK_PACKAGE_01',
                };

                const userRole = RoleType.DESIGNER;

                const item = testLayout(itemType, itemData, userContext, userRole);
                const expectedUiItem = hashID(UI.BUTTON_EDIT, 'WorkPackage1');

                chai.assert.equal(item.find(expectedUiItem).length, 0, expectedUiItem + ' was found');
            });

            it('is not editable by Developer', () => {

                const itemType = ItemType.WORK_PACKAGE;

                const itemData = {
                    _id:                    'WORK_PACKAGE_01',
                    designVersionId:        'DESIGN_VERSION_01',
                    designUpdateId:         'DESIGN_UPDATE_01',
                    workPackageType:        WorkPackageType.WP_UPDATE,
                    workPackageName:        'WorkPackage1',
                    workPackageStatus:      WorkPackageStatus.WP_ADOPTED,
                    workPackageTestStatus:  WorkPackageTestStatus.WP_TESTS_NOT_COMPLETE,
                    adoptingUserId:         'NONE',
                    workPackageLink:        'NONE'
                };

                const userContext = {
                    userId:             'USER1',
                    designId:           'DESIGN_01',
                    designVersionId:    'DESIGN_VERSION_01',
                    designUpdateId:     'DESIGN_UPDATE_01',
                    workPackageId:      'WORK_PACKAGE_01',
                };

                const userRole = RoleType.DEVELOPER;

                const item = testLayout(itemType, itemData, userContext, userRole);
                const expectedUiItem = hashID(UI.BUTTON_EDIT, 'WorkPackage1');

                chai.assert.equal(item.find(expectedUiItem).length, 0, expectedUiItem + ' was found');
            });

            it('is not editable by Guest', () => {

                const itemType = ItemType.WORK_PACKAGE;

                const itemData = {
                    _id:                    'WORK_PACKAGE_01',
                    designVersionId:        'DESIGN_VERSION_01',
                    designUpdateId:         'DESIGN_UPDATE_01',
                    workPackageType:        WorkPackageType.WP_UPDATE,
                    workPackageName:        'WorkPackage1',
                    workPackageStatus:      WorkPackageStatus.WP_ADOPTED,
                    workPackageTestStatus:  WorkPackageTestStatus.WP_TESTS_NOT_COMPLETE,
                    adoptingUserId:         'NONE',
                    workPackageLink:        'NONE'
                };

                const userContext = {
                    userId:             'USER1',
                    designId:           'DESIGN_01',
                    designVersionId:    'DESIGN_VERSION_01',
                    designUpdateId:     'DESIGN_UPDATE_01',
                    workPackageId:      'WORK_PACKAGE_01',
                };

                const userRole = RoleType.GUEST_VIEWER;

                const item = testLayout(itemType, itemData, userContext, userRole);
                const expectedUiItem = hashID(UI.BUTTON_EDIT, 'WorkPackage1');

                chai.assert.equal(item.find(expectedUiItem).length, 0, expectedUiItem + ' was found');
            });
        });

        // WP View ---------------------------------------------------------------------------------------------------------

        describe('A Work Package has an option to view its content', () => {

            it('has a view option for new work package for manager', () => {

                const itemType = ItemType.WORK_PACKAGE;

                const itemData = {
                    _id:                    'WORK_PACKAGE_01',
                    designVersionId:        'DESIGN_VERSION_01',
                    designUpdateId:         'NONE',
                    workPackageType:        WorkPackageType.WP_BASE,
                    workPackageName:        'WorkPackage1',
                    workPackageStatus:      WorkPackageStatus.WP_NEW,
                    workPackageTestStatus:  WorkPackageTestStatus.WP_TESTS_NOT_COMPLETE,
                    adoptingUserId:         'NONE',
                    workPackageLink:        'NONE'
                };

                const userContext = {
                    userId:             'USER1',
                    designId:           'DESIGN_01',
                    designVersionId:    'DESIGN_VERSION_01',
                    designUpdateId:     'NONE',
                    workPackageId:      'WORK_PACKAGE_01',
                };

                const userRole = RoleType.MANAGER;

                const item = testLayout(itemType, itemData, userContext, userRole);
                const expectedUiItem = hashID(UI.BUTTON_VIEW, 'WorkPackage1');

                chai.assert.equal(item.find(expectedUiItem).length, 1, expectedUiItem + ' not found');

            });

            it('has a view option for published work package for manager', () => {

                const itemType = ItemType.WORK_PACKAGE;

                const itemData = {
                    _id:                    'WORK_PACKAGE_01',
                    designVersionId:        'DESIGN_VERSION_01',
                    designUpdateId:         'NONE',
                    workPackageType:        WorkPackageType.WP_BASE,
                    workPackageName:        'WorkPackage1',
                    workPackageStatus:      WorkPackageStatus.WP_AVAILABLE,
                    workPackageTestStatus:  WorkPackageTestStatus.WP_TESTS_NOT_COMPLETE,
                    adoptingUserId:         'NONE',
                    workPackageLink:        'NONE'
                };

                const userContext = {
                    userId:             'USER1',
                    designId:           'DESIGN_01',
                    designVersionId:    'DESIGN_VERSION_01',
                    designUpdateId:     'NONE',
                    workPackageId:      'WORK_PACKAGE_01',
                };

                const userRole = RoleType.MANAGER;

                const item = testLayout(itemType, itemData, userContext, userRole);
                const expectedUiItem = hashID(UI.BUTTON_VIEW, 'WorkPackage1');

                chai.assert.equal(item.find(expectedUiItem).length, 1, expectedUiItem + ' not found');

            });

            it('has a view option for adopted work package for manager', () => {

                const itemType = ItemType.WORK_PACKAGE;

                const itemData = {
                    _id:                    'WORK_PACKAGE_01',
                    designVersionId:        'DESIGN_VERSION_01',
                    designUpdateId:         'NONE',
                    workPackageType:        WorkPackageType.WP_BASE,
                    workPackageName:        'WorkPackage1',
                    workPackageStatus:      WorkPackageStatus.WP_ADOPTED,
                    workPackageTestStatus:  WorkPackageTestStatus.WP_TESTS_NOT_COMPLETE,
                    adoptingUserId:         'NONE',
                    workPackageLink:        'NONE'
                };

                const userContext = {
                    userId:             'USER1',
                    designId:           'DESIGN_01',
                    designVersionId:    'DESIGN_VERSION_01',
                    designUpdateId:     'NONE',
                    workPackageId:      'WORK_PACKAGE_01',
                };

                const userRole = RoleType.MANAGER;

                const item = testLayout(itemType, itemData, userContext, userRole);
                const expectedUiItem = hashID(UI.BUTTON_VIEW, 'WorkPackage1');

                chai.assert.equal(item.find(expectedUiItem).length, 1, expectedUiItem + ' not found');

            });

            it('has a view option for published work package for designer', () => {

                const itemType = ItemType.WORK_PACKAGE;

                const itemData = {
                    _id:                    'WORK_PACKAGE_01',
                    designVersionId:        'DESIGN_VERSION_01',
                    designUpdateId:         'NONE',
                    workPackageType:        WorkPackageType.WP_BASE,
                    workPackageName:        'WorkPackage1',
                    workPackageStatus:      WorkPackageStatus.WP_AVAILABLE,
                    workPackageTestStatus:  WorkPackageTestStatus.WP_TESTS_NOT_COMPLETE,
                    adoptingUserId:         'NONE',
                    workPackageLink:        'NONE'
                };

                const userContext = {
                    userId:             'USER1',
                    designId:           'DESIGN_01',
                    designVersionId:    'DESIGN_VERSION_01',
                    designUpdateId:     'NONE',
                    workPackageId:      'WORK_PACKAGE_01',
                };

                const userRole = RoleType.DESIGNER;

                const item = testLayout(itemType, itemData, userContext, userRole);
                const expectedUiItem = hashID(UI.BUTTON_VIEW, 'WorkPackage1');

                chai.assert.equal(item.find(expectedUiItem).length, 1, expectedUiItem + ' not found');

            });

            it('has a view option for adopted work package for designer', () => {

                const itemType = ItemType.WORK_PACKAGE;

                const itemData = {
                    _id:                    'WORK_PACKAGE_01',
                    designVersionId:        'DESIGN_VERSION_01',
                    designUpdateId:         'NONE',
                    workPackageType:        WorkPackageType.WP_BASE,
                    workPackageName:        'WorkPackage1',
                    workPackageStatus:      WorkPackageStatus.WP_ADOPTED,
                    workPackageTestStatus:  WorkPackageTestStatus.WP_TESTS_NOT_COMPLETE,
                    adoptingUserId:         'NONE',
                    workPackageLink:        'NONE'
                };

                const userContext = {
                    userId:             'USER1',
                    designId:           'DESIGN_01',
                    designVersionId:    'DESIGN_VERSION_01',
                    designUpdateId:     'NONE',
                    workPackageId:      'WORK_PACKAGE_01',
                };

                const userRole = RoleType.DESIGNER;

                const item = testLayout(itemType, itemData, userContext, userRole);
                const expectedUiItem = hashID(UI.BUTTON_VIEW, 'WorkPackage1');

                chai.assert.equal(item.find(expectedUiItem).length, 1, expectedUiItem + ' not found');

            });

            it('has a view option for published work package for developer', () => {

                const itemType = ItemType.WORK_PACKAGE;

                const itemData = {
                    _id:                    'WORK_PACKAGE_01',
                    designVersionId:        'DESIGN_VERSION_01',
                    designUpdateId:         'NONE',
                    workPackageType:        WorkPackageType.WP_BASE,
                    workPackageName:        'WorkPackage1',
                    workPackageStatus:      WorkPackageStatus.WP_AVAILABLE,
                    workPackageTestStatus:  WorkPackageTestStatus.WP_TESTS_NOT_COMPLETE,
                    adoptingUserId:         'NONE',
                    workPackageLink:        'NONE'
                };

                const userContext = {
                    userId:             'USER1',
                    designId:           'DESIGN_01',
                    designVersionId:    'DESIGN_VERSION_01',
                    designUpdateId:     'NONE',
                    workPackageId:      'WORK_PACKAGE_01',
                };

                const userRole = RoleType.DEVELOPER;

                const item = testLayout(itemType, itemData, userContext, userRole);
                const expectedUiItem = hashID(UI.BUTTON_VIEW, 'WorkPackage1');

                chai.assert.equal(item.find(expectedUiItem).length, 1, expectedUiItem + ' not found');

            });

            it('has a view option for adopted work package for developer', () => {

                const itemType = ItemType.WORK_PACKAGE;

                const itemData = {
                    _id:                    'WORK_PACKAGE_01',
                    designVersionId:        'DESIGN_VERSION_01',
                    designUpdateId:         'NONE',
                    workPackageType:        WorkPackageType.WP_BASE,
                    workPackageName:        'WorkPackage1',
                    workPackageStatus:      WorkPackageStatus.WP_ADOPTED,
                    workPackageTestStatus:  WorkPackageTestStatus.WP_TESTS_NOT_COMPLETE,
                    adoptingUserId:         'NONE',
                    workPackageLink:        'NONE'
                };

                const userContext = {
                    userId:             'USER1',
                    designId:           'DESIGN_01',
                    designVersionId:    'DESIGN_VERSION_01',
                    designUpdateId:     'NONE',
                    workPackageId:      'WORK_PACKAGE_01',
                };

                const userRole = RoleType.DEVELOPER;

                const item = testLayout(itemType, itemData, userContext, userRole);
                const expectedUiItem = hashID(UI.BUTTON_VIEW, 'WorkPackage1');

                chai.assert.equal(item.find(expectedUiItem).length, 1, expectedUiItem + ' not found');

            });
        });

        describe('Only a Manager may view a New Work Package', () => {

            it('is not viewable by Designer', () => {

                const itemType = ItemType.WORK_PACKAGE;

                const itemData = {
                    _id:                    'WORK_PACKAGE_01',
                    designVersionId:        'DESIGN_VERSION_01',
                    designUpdateId:         'NONE',
                    workPackageType:        WorkPackageType.WP_BASE,
                    workPackageName:        'WorkPackage1',
                    workPackageStatus:      WorkPackageStatus.WP_NEW,
                    workPackageTestStatus:  WorkPackageTestStatus.WP_TESTS_NOT_COMPLETE,
                    adoptingUserId:         'NONE',
                    workPackageLink:        'NONE'
                };

                const userContext = {
                    userId:             'USER1',
                    designId:           'DESIGN_01',
                    designVersionId:    'DESIGN_VERSION_01',
                    designUpdateId:     'NONE',
                    workPackageId:      'WORK_PACKAGE_01',
                };

                const userRole = RoleType.DESIGNER;

                const item = testLayout(itemType, itemData, userContext, userRole);
                const expectedUiItem = hashID(UI.BUTTON_VIEW, 'WorkPackage1');

                chai.assert.equal(item.find(expectedUiItem).length, 0, expectedUiItem + ' was found');
            });

            it('is not viewable by Developer', () => {

                const itemType = ItemType.WORK_PACKAGE;

                const itemData = {
                    _id:                    'WORK_PACKAGE_01',
                    designVersionId:        'DESIGN_VERSION_01',
                    designUpdateId:         'NONE',
                    workPackageType:        WorkPackageType.WP_BASE,
                    workPackageName:        'WorkPackage1',
                    workPackageStatus:      WorkPackageStatus.WP_NEW,
                    workPackageTestStatus:  WorkPackageTestStatus.WP_TESTS_NOT_COMPLETE,
                    adoptingUserId:         'NONE',
                    workPackageLink:        'NONE'
                };

                const userContext = {
                    userId:             'USER1',
                    designId:           'DESIGN_01',
                    designVersionId:    'DESIGN_VERSION_01',
                    designUpdateId:     'NONE',
                    workPackageId:      'WORK_PACKAGE_01',
                };

                const userRole = RoleType.DEVELOPER;

                const item = testLayout(itemType, itemData, userContext, userRole);
                const expectedUiItem = hashID(UI.BUTTON_VIEW, 'WorkPackage1');

                chai.assert.equal(item.find(expectedUiItem).length, 0, expectedUiItem + ' was found');
            });
        });

        // WP Adopt
        describe('An Available Work Package has an option to adopt it', () => {

            it('has an adopt option for a Developer', () => {

                const itemType = ItemType.WORK_PACKAGE;

                const itemData = {
                    _id:                    'WORK_PACKAGE_01',
                    designVersionId:        'DESIGN_VERSION_01',
                    designUpdateId:         'NONE',
                    workPackageType:        WorkPackageType.WP_BASE,
                    workPackageName:        'WorkPackage1',
                    workPackageStatus:      WorkPackageStatus.WP_AVAILABLE,
                    workPackageTestStatus:  WorkPackageTestStatus.WP_TESTS_NOT_COMPLETE,
                    adoptingUserId:         'NONE',
                    workPackageLink:        'NONE'
                };

                const userContext = {
                    userId:             'USER1',
                    designId:           'DESIGN_01',
                    designVersionId:    'DESIGN_VERSION_01',
                    designUpdateId:     'NONE',
                    workPackageId:      'WORK_PACKAGE_01',
                };

                const userRole = RoleType.DEVELOPER;

                const item = testLayout(itemType, itemData, userContext, userRole);
                const expectedUiItem = hashID(UI.BUTTON_ADOPT, 'WorkPackage1');

                chai.assert.equal(item.find(expectedUiItem).length, 1, expectedUiItem + ' not found');
            });
        });

        describe('Only a Developer can adopt a Work Package', () => {

            it('has no adopt option for a Designer', () => {

                const itemType = ItemType.WORK_PACKAGE;

                const itemData = {
                    _id:                    'WORK_PACKAGE_01',
                    designVersionId:        'DESIGN_VERSION_01',
                    designUpdateId:         'NONE',
                    workPackageType:        WorkPackageType.WP_BASE,
                    workPackageName:        'WorkPackage1',
                    workPackageStatus:      WorkPackageStatus.WP_AVAILABLE,
                    workPackageTestStatus:  WorkPackageTestStatus.WP_TESTS_NOT_COMPLETE,
                    adoptingUserId:         'NONE',
                    workPackageLink:        'NONE'
                };

                const userContext = {
                    userId:             'USER1',
                    designId:           'DESIGN_01',
                    designVersionId:    'DESIGN_VERSION_01',
                    designUpdateId:     'NONE',
                    workPackageId:      'WORK_PACKAGE_01',
                };

                const userRole = RoleType.DESIGNER;

                const item = testLayout(itemType, itemData, userContext, userRole);
                const expectedUiItem = hashID(UI.BUTTON_ADOPT, 'WorkPackage1');

                chai.assert.equal(item.find(expectedUiItem).length, 0, expectedUiItem + ' was found');
            });

            it('has no adopt option for a Manager', () => {

                const itemType = ItemType.WORK_PACKAGE;

                const itemData = {
                    _id:                    'WORK_PACKAGE_01',
                    designVersionId:        'DESIGN_VERSION_01',
                    designUpdateId:         'NONE',
                    workPackageType:        WorkPackageType.WP_BASE,
                    workPackageName:        'WorkPackage1',
                    workPackageStatus:      WorkPackageStatus.WP_AVAILABLE,
                    workPackageTestStatus:  WorkPackageTestStatus.WP_TESTS_NOT_COMPLETE,
                    adoptingUserId:         'NONE',
                    workPackageLink:        'NONE'
                };

                const userContext = {
                    userId:             'USER1',
                    designId:           'DESIGN_01',
                    designVersionId:    'DESIGN_VERSION_01',
                    designUpdateId:     'NONE',
                    workPackageId:      'WORK_PACKAGE_01',
                };

                const userRole = RoleType.MANAGER;

                const item = testLayout(itemType, itemData, userContext, userRole);
                const expectedUiItem = hashID(UI.BUTTON_ADOPT, 'WorkPackage1');

                chai.assert.equal(item.find(expectedUiItem).length, 0, expectedUiItem + ' was found');
            });

            it('has no adopt option for a Guest', () => {

                const itemType = ItemType.WORK_PACKAGE;

                const itemData = {
                    _id:                    'WORK_PACKAGE_01',
                    designVersionId:        'DESIGN_VERSION_01',
                    designUpdateId:         'NONE',
                    workPackageType:        WorkPackageType.WP_BASE,
                    workPackageName:        'WorkPackage1',
                    workPackageStatus:      WorkPackageStatus.WP_AVAILABLE,
                    workPackageTestStatus:  WorkPackageTestStatus.WP_TESTS_NOT_COMPLETE,
                    adoptingUserId:         'NONE',
                    workPackageLink:        'NONE'
                };

                const userContext = {
                    userId:             'USER1',
                    designId:           'DESIGN_01',
                    designVersionId:    'DESIGN_VERSION_01',
                    designUpdateId:     'NONE',
                    workPackageId:      'WORK_PACKAGE_01',
                };

                const userRole = RoleType.GUEST_VIEWER;

                const item = testLayout(itemType, itemData, userContext, userRole);
                const expectedUiItem = hashID(UI.BUTTON_ADOPT, 'WorkPackage1');

                chai.assert.equal(item.find(expectedUiItem).length, 0, expectedUiItem + ' was found');
            });
        });

        describe('Only an Available Work Package can be adopted', () => {

            it('has no adopt option when new', () => {

                const itemType = ItemType.WORK_PACKAGE;

                const itemData = {
                    _id:                    'WORK_PACKAGE_01',
                    designVersionId:        'DESIGN_VERSION_01',
                    designUpdateId:         'NONE',
                    workPackageType:        WorkPackageType.WP_BASE,
                    workPackageName:        'WorkPackage1',
                    workPackageStatus:      WorkPackageStatus.WP_NEW,
                    workPackageTestStatus:  WorkPackageTestStatus.WP_TESTS_NOT_COMPLETE,
                    adoptingUserId:         'NONE',
                    workPackageLink:        'NONE'
                };

                const userContext = {
                    userId:             'USER1',
                    designId:           'DESIGN_01',
                    designVersionId:    'DESIGN_VERSION_01',
                    designUpdateId:     'NONE',
                    workPackageId:      'WORK_PACKAGE_01',
                };

                const userRole = RoleType.DEVELOPER;

                const item = testLayout(itemType, itemData, userContext, userRole);
                const expectedUiItem = hashID(UI.BUTTON_ADOPT, 'WorkPackage1');

                chai.assert.equal(item.find(expectedUiItem).length, 0, expectedUiItem + ' was found');
            });

            it('has no adopt option when adopted', () => {

                const itemType = ItemType.WORK_PACKAGE;

                const itemData = {
                    _id:                    'WORK_PACKAGE_01',
                    designVersionId:        'DESIGN_VERSION_01',
                    designUpdateId:         'NONE',
                    workPackageType:        WorkPackageType.WP_BASE,
                    workPackageName:        'WorkPackage1',
                    workPackageStatus:      WorkPackageStatus.WP_ADOPTED,
                    workPackageTestStatus:  WorkPackageTestStatus.WP_TESTS_NOT_COMPLETE,
                    adoptingUserId:         'NONE',
                    workPackageLink:        'NONE'
                };

                const userContext = {
                    userId:             'USER1',
                    designId:           'DESIGN_01',
                    designVersionId:    'DESIGN_VERSION_01',
                    designUpdateId:     'NONE',
                    workPackageId:      'WORK_PACKAGE_01',
                };

                const userRole = RoleType.DEVELOPER;

                const item = testLayout(itemType, itemData, userContext, userRole);
                const expectedUiItem = hashID(UI.BUTTON_ADOPT, 'WorkPackage1');

                chai.assert.equal(item.find(expectedUiItem).length, 0, expectedUiItem + ' was found');
            });
        });

        // WP Release
        describe('An Adopted Work Package has an option to release it', () => {

            it('has a release option for a Developer', () => {

                const itemType = ItemType.WORK_PACKAGE;

                const itemData = {
                    _id:                    'WORK_PACKAGE_01',
                    designVersionId:        'DESIGN_VERSION_01',
                    designUpdateId:         'NONE',
                    workPackageType:        WorkPackageType.WP_BASE,
                    workPackageName:        'WorkPackage1',
                    workPackageStatus:      WorkPackageStatus.WP_ADOPTED,
                    workPackageTestStatus:  WorkPackageTestStatus.WP_TESTS_NOT_COMPLETE,
                    adoptingUserId:         'NONE',
                    workPackageLink:        'NONE'
                };

                const userContext = {
                    userId:             'USER1',
                    designId:           'DESIGN_01',
                    designVersionId:    'DESIGN_VERSION_01',
                    designUpdateId:     'NONE',
                    workPackageId:      'WORK_PACKAGE_01',
                };

                const userRole = RoleType.DEVELOPER;

                const item = testLayout(itemType, itemData, userContext, userRole);
                const expectedUiItem = hashID(UI.BUTTON_RELEASE, 'WorkPackage1');

                chai.assert.equal(item.find(expectedUiItem).length, 1, expectedUiItem + ' not found');
            });

            it('has a release option for a Manager', () => {

                const itemType = ItemType.WORK_PACKAGE;

                const itemData = {
                    _id:                    'WORK_PACKAGE_01',
                    designVersionId:        'DESIGN_VERSION_01',
                    designUpdateId:         'NONE',
                    workPackageType:        WorkPackageType.WP_BASE,
                    workPackageName:        'WorkPackage1',
                    workPackageStatus:      WorkPackageStatus.WP_ADOPTED,
                    workPackageTestStatus:  WorkPackageTestStatus.WP_TESTS_NOT_COMPLETE,
                    adoptingUserId:         'NONE',
                    workPackageLink:        'NONE'
                };

                const userContext = {
                    userId:             'USER1',
                    designId:           'DESIGN_01',
                    designVersionId:    'DESIGN_VERSION_01',
                    designUpdateId:     'NONE',
                    workPackageId:      'WORK_PACKAGE_01',
                };

                const userRole = RoleType.MANAGER;

                const item = testLayout(itemType, itemData, userContext, userRole);
                const expectedUiItem = hashID(UI.BUTTON_RELEASE, 'WorkPackage1');

                chai.assert.equal(item.find(expectedUiItem).length, 1, expectedUiItem + ' not found');
            });
        });
    });

});