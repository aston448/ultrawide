import React from 'react';

import { shallow } from 'enzyme';
import { chai } from 'meteor/practicalmeteor:chai';

import { ItemWrapper } from './ItemWrapper.jsx';  // Non Redux wrapped

import { DesignStatus, DesignVersionStatus, DesignUpdateStatus, DesignUpdateTestStatus, DesignUpdateWpStatus, DuWorkPackageTestStatus,
    DesignUpdateMergeAction, WorkPackageType, WorkPackageStatus, WorkPackageTestStatus, RoleType, ItemType } from '../../../constants/constants.js'


function testItemReference(itemType, item, userContext, userRole){

    return shallow(
        <ItemWrapper
            itemType={itemType}
            item={item}
            userContext={userContext}
            userRole={userRole}
        />
    );
}


describe('JSX: ItemWrapper', () => {


    // Select Design  --------------------------------------------------------------------------------------------------

    describe('The current working Design for the user is highlighted', () => {

        it('is highlighted if is the User Context Design', () => {

            const itemType = ItemType.DESIGN;
            const item = {
                _id:            'DESIGN001',
                designName:     'Design 1',
                isRemovable:    false,
                designStatus:   DesignStatus.DESIGN_LIVE
            };
            const userContext = {designId: 'DESIGN001'}; // Current design in context
            const userRole = RoleType.DESIGNER;

            const uiItem = testItemReference(itemType, item, userContext, userRole);

            // Should find that item is expanded
            chai.expect(uiItem.find('.item-top-left')).to.have.length(1);

        });

        it('is not highlighted if is not the User Context Design', () => {

            const itemType = ItemType.DESIGN;
            const item = {
                _id:            'DESIGN001',
                designName:     'Design 1',
                isRemovable:    false,
                designStatus:   DesignStatus.DESIGN_LIVE
            };
            const userContext = {designId: 'DESIGN002'};  // Not current design in context
            const userRole = RoleType.DESIGNER;

            const uiItem = testItemReference(itemType, item, userContext, userRole);

            // Should find that item is not expanded
            chai.expect(uiItem.find('.item-top-left')).to.have.length(0);

        });

    });

    // Select Design Version -------------------------------------------------------------------------------------------

    describe('The currently selected Design Version is highlighted', () => {

        it('is highlighted if is the User Context Design Version', () => {

            const itemType = ItemType.DESIGN_VERSION;
            const item = {
                _id:                    'DESIGN_VERSION001',
                designId:               'DESIGN001',
                designVersionName:      'Design Version 1',
                designVersionNumber:    '0.1',
                designVersionStatus:    DesignVersionStatus.VERSION_DRAFT,
                baseDesignVersionId:    'NONE',
                designVersionIndex:     0
            };

            const userContext = {
                designId:           'DESIGN001',
                designVersionId:    'DESIGN_VERSION001'
            }; // Current design version in context

            const userRole = RoleType.DESIGNER;

            const uiItem = testItemReference(itemType, item, userContext, userRole);

            // Should find that item is expanded
            chai.expect(uiItem.find('.item-top-left')).to.have.length(1);

        });

        it('is not highlighted if is not the User Context Design Version', () => {

            const itemType = ItemType.DESIGN_VERSION;
            const item = {
                _id:                    'DESIGN_VERSION001',
                designId:               'DESIGN001',
                designVersionName:      'Design Version 1',
                designVersionNumber:    '0.1',
                designVersionStatus:    DesignVersionStatus.VERSION_DRAFT,
                baseDesignVersionId:    'NONE',
                designVersionIndex:     0
            };

            const userContext = {
                designId:           'DESIGN001',
                designVersionId:    'DESIGN_VERSION002'
            }; // Current design version not in context

            const userRole = RoleType.DESIGNER;

            const uiItem = testItemReference(itemType, item, userContext, userRole);

            // Should find that item is expanded
            chai.expect(uiItem.find('.item-top-left')).to.have.length(0);

        });

    });

    // Select Update ---------------------------------------------------------------------------------------------------

    describe('The currently selected Design Update is highlighted', () => {

        it('is highlighted when the current update', () => {

            const itemType = ItemType.DESIGN_UPDATE;
            const item = {
                _id:                    'DESIGN_UPDATE001',
                designVersionId:        'DESIGN_VERSION001',
                updateName:             'Design Update 1',
                updateReference:        'CR001',
                updateStatus:           DesignUpdateStatus.UPDATE_PUBLISHED_DRAFT,
                updateMergeAction:      DesignUpdateMergeAction.MERGE_INCLUDE,
                summaryDataStale:       false,
                updateWpStatus:         DesignUpdateWpStatus.DU_NO_WP_SCENARIOS,
                updateTestStatus:       DesignUpdateTestStatus.DU_NO_SCENARIOS_PASSING,
                updateWpTestStatus:     DuWorkPackageTestStatus.DU_WPS_NOT_COMPLETE
            };

            const userContext = {
                designId:           'DESIGN001',
                designVersionId:    'DESIGN_VERSION001',
                designUpdateId:     'DESIGN_UPDATE001'
            }; // Current design update in context

            const userRole = RoleType.DESIGNER;

            const uiItem = testItemReference(itemType, item, userContext, userRole);

            // Should find that item is expanded
            chai.expect(uiItem.find('.item-top-left')).to.have.length(1);
        });

        it('is not highlighted when not the current update', () => {

            const itemType = ItemType.DESIGN_UPDATE;
            const item = {
                _id:                    'DESIGN_UPDATE001',
                designVersionId:        'DESIGN_VERSION001',
                updateName:             'Design Update 1',
                updateReference:        'CR001',
                updateStatus:           DesignUpdateStatus.UPDATE_PUBLISHED_DRAFT,
                updateMergeAction:      DesignUpdateMergeAction.MERGE_INCLUDE,
                summaryDataStale:       false,
                updateWpStatus:         DesignUpdateWpStatus.DU_NO_WP_SCENARIOS,
                updateTestStatus:       DesignUpdateTestStatus.DU_NO_SCENARIOS_PASSING,
                updateWpTestStatus:     DuWorkPackageTestStatus.DU_WPS_NOT_COMPLETE
            };

            const userContext = {
                designId:           'DESIGN001',
                designVersionId:    'DESIGN_VERSION001',
                designUpdateId:     'DESIGN_UPDATE002'
            }; // Current design update not in context

            const userRole = RoleType.DESIGNER;

            const uiItem = testItemReference(itemType, item, userContext, userRole);

            // Should find that item is expanded
            chai.expect(uiItem.find('.item-top-left')).to.have.length(0);
        });
    });


    // WP Select -----------------------------------------------------------------------------------------------------

    describe('When a Work Package is selected it is highlighted in the Work Package list', () => {

        it('is highlighted when it is the current work package', () => {

            const itemType = ItemType.WORK_PACKAGE;
            const item = {
                _id:                    'WORK_PACKAGE001',
                designVersionId:        'DESIGN_VERSION001',
                designUpdateId:         'DESIGN_UPDATE001',
                workPackageName:        'Work Package 1',
                workPackageStatus:      WorkPackageStatus.WP_AVAILABLE,
                workPackageTestStatus:  WorkPackageTestStatus.WP_TESTS_NOT_COMPLETE,
                adoptingUserId:         'NONE',
                workPackageLink:        'NONE'
            };

            const userContext = {
                designId:           'DESIGN001',
                designVersionId:    'DESIGN_VERSION001',
                designUpdateId:     'DESIGN_UPDATE001',
                workPackageId:      'WORK_PACKAGE001'
            }; // Current WP in context

            const userRole = RoleType.DESIGNER;

            const uiItem = testItemReference(itemType, item, userContext, userRole);

            // Should find that item is expanded
            chai.expect(uiItem.find('.item-top-left')).to.have.length(1);
        });

        it('is not highlighted when it is not the current work package', () => {

            const itemType = ItemType.WORK_PACKAGE;
            const item = {
                _id:                    'WORK_PACKAGE001',
                designVersionId:        'DESIGN_VERSION001',
                designUpdateId:         'DESIGN_UPDATE001',
                workPackageName:        'Work Package 1',
                workPackageStatus:      WorkPackageStatus.WP_AVAILABLE,
                workPackageTestStatus:  WorkPackageTestStatus.WP_TESTS_NOT_COMPLETE,
                adoptingUserId:         'NONE',
                workPackageLink:        'NONE'
            };

            const userContext = {
                designId:           'DESIGN001',
                designVersionId:    'DESIGN_VERSION001',
                designUpdateId:     'DESIGN_UPDATE001',
                workPackageId:      'WORK_PACKAGE002'
            }; // Current WP not in context

            const userRole = RoleType.DESIGNER;

            const uiItem = testItemReference(itemType, item, userContext, userRole);

            // Should find that item is expanded
            chai.expect(uiItem.find('.item-top-left')).to.have.length(0);
        });
    });
});