import React from 'react';


import { shallow, mount} from 'enzyme';
import { chai } from 'meteor/practicalmeteor:chai';

import { DesignUpdatesList } from '../DesignUpdatesContainer.jsx';  // Non container wrapped

import { DesignUpdateTab, DesignVersionStatus, DesignUpdateStatus, DesignUpdateMergeAction, RoleType } from '../../../../constants/constants.js'


describe('JSX: DesignUpdatesList', () => {


    function testDesignUpdatesContainer(designVersionStatus, designUpdateStatus, userRole, userContext){


        // Design Version 1 --------------------------------------------------------------------------------------------

        const dv1incompleteUpdates = [];
        const dv1assignedUpdates = [];

        const dv1completeUpdates = [
            {
                _id:                        '1',
                designVersionId:            'DV1',
                updateName:                 'MergedUpdate1',
                updateReference:            'Ref1',
                updateStatus:               DesignUpdateStatus.UPDATE_MERGED,
                updateMergeAction:          DesignUpdateMergeAction.MERGE_INCLUDE,
                summaryDataStale:           false
            },
            {
                _id:                        '2',
                designVersionId:            'DV1',
                updateName:                 'MergedUpdate2',
                updateReference:            'Ref2',
                updateStatus:               DesignUpdateStatus.UPDATE_MERGED,
                updateMergeAction:          DesignUpdateMergeAction.MERGE_INCLUDE,
                summaryDataStale:           false
            },
            {
                _id:                        '3',
                designVersionId:            'DV1',
                updateName:                 'IgnoredUpdate',
                updateReference:            'Ref3',
                updateStatus:               DesignUpdateStatus.UPDATE_IGNORED,
                updateMergeAction:          DesignUpdateMergeAction.MERGE_IGNORE,
                summaryDataStale:           false
            }
        ];

        // Design Version 2 --------------------------------------------------------------------------------------------

        const dv2incompleteUpdates = [
            {
                _id:                        '4',
                designVersionId:            'DV2',
                updateName:                 'NewUpdate',
                updateReference:            'Ref4',
                updateStatus:               DesignUpdateStatus.UPDATE_NEW,
                updateMergeAction:          DesignUpdateMergeAction.MERGE_IGNORE,
                summaryDataStale:           false
            },
            {
                _id:                        '5',
                designVersionId:            'DV2',
                updateName:                 'NewUpdate',
                updateReference:            'Ref5',
                updateStatus:               DesignUpdateStatus.UPDATE_NEW,
                updateMergeAction:          DesignUpdateMergeAction.MERGE_IGNORE,
                summaryDataStale:           false
            },
            {
                _id:                        '6',
                designVersionId:            'DV2',
                updateName:                 'PublishedUpdate1',
                updateReference:            'Ref6',
                updateStatus:               DesignUpdateStatus.UPDATE_PUBLISHED_DRAFT,
                updateMergeAction:          DesignUpdateMergeAction.MERGE_IGNORE,
                summaryDataStale:           false
            },
        ];

        const dv2assignedUpdates = [

            {
                _id:                        '7',
                designVersionId:            'DV2',
                updateName:                 'PublishedUpdate2',
                updateReference:            'Ref7',
                updateStatus:               DesignUpdateStatus.UPDATE_PUBLISHED_DRAFT,
                updateMergeAction:          DesignUpdateMergeAction.MERGE_IGNORE,
                summaryDataStale:           false
            }
        ];

        const dv2completedUpdates = [];
        const dv2updateWorkPackages = [
            {
                _id:                        '8',
                designVersionId:            'DV2',
                designUpdateId:             '7',
                workPackageName:            'UpdateWP1'
            }
        ];

        let incompleteUpdates = [];
        let assignedUpdates = [];
        let completedUpdates = [];
        let updateWorkPackages = [];


        if(designVersionStatus === DesignVersionStatus.VERSION_UPDATABLE_COMPLETE){
            incompleteUpdates = dv1incompleteUpdates;
            assignedUpdates = dv1assignedUpdates;
            completedUpdates = dv1completeUpdates;
        }
        if(designVersionStatus === DesignVersionStatus.VERSION_UPDATABLE){
            incompleteUpdates = dv2incompleteUpdates;
            assignedUpdates = dv2assignedUpdates;
            completedUpdates = dv2completedUpdates;
            updateWorkPackages = dv2updateWorkPackages
        }

        return shallow(
            <DesignUpdatesList
                incompleteUpdates={incompleteUpdates}
                assignedUpdates={assignedUpdates}
                completeUpdates={completedUpdates}
                updateWorkPackages={updateWorkPackages}
                designVersionStatus={designVersionStatus}
                designUpdateStatus={designUpdateStatus}
                userRole={userRole}
                userContext={userContext}
                defaultTab={DesignUpdateTab.TAB_NEW}/>
        );
    }

    // Design Update Selection -----------------------------------------------------------------------------------------
    describe('A list of Design Updates is visible for the current Design Version', () => {

        it('also visible to Developer', () => {

            const designVersionStatus = DesignVersionStatus.VERSION_UPDATABLE_COMPLETE;
            const designUpdateStatus = '';
            const userRole = RoleType.DEVELOPER;
            const userContext = {designVersionId: 'DV1'};

            let item = testDesignUpdatesContainer(designVersionStatus, designUpdateStatus, userRole, userContext);

            chai.assert.equal(item.find('Connect(ItemList)').length, 3, 'Item Containers not found');
        });

        it('also visible to Manager', () => {

            const designVersionStatus = DesignVersionStatus.VERSION_UPDATABLE_COMPLETE;
            const designUpdateStatus = '';
            const userRole = RoleType.MANAGER;
            const userContext = {designVersionId: 'DV1'};

            let item = testDesignUpdatesContainer(designVersionStatus, designUpdateStatus, userRole, userContext);

            chai.assert.equal(item.find('Connect(ItemList)').length, 4, 'Item Container not found');
        });

    });

    // Add Design Update -----------------------------------------------------------------------------------------------

    describe('An Updatable Design Version has an option to add a new Design Update', () => {

        it('has an add option for a manager', () => {

            const designVersionStatus = DesignVersionStatus.VERSION_UPDATABLE;
            const userRole = RoleType.DESIGNER;
            const designUpdateStatus = '';
            const userContext = {designVersionId: 'DV2'};

            let item = testDesignUpdatesContainer(designVersionStatus, designUpdateStatus, userRole, userContext);

            chai.assert.equal(item.find('Connect(ItemList)').length, 3, 'Item Containers not found');
            chai.assert.isTrue(item.find('Connect(ItemList)').nodes[0].props.hasFooterAction, 'Expecting a footer action');
            chai.assert.equal(item.find('Connect(ItemList)').nodes[0].props.footerAction, 'Add Design Update', 'Expecting Add Design Update footer action');
        });
    });

    describe('The add Design Update option is only visible to Designers', () => {

        it('no add option for Developer', () => {

            const designVersionStatus = DesignVersionStatus.VERSION_UPDATABLE;
            const designUpdateStatus = '';
            const userRole = RoleType.DEVELOPER;
            const userContext = {designVersionId: 'DV2'};

            let item = testDesignUpdatesContainer(designVersionStatus, designUpdateStatus, userRole, userContext);

            chai.assert.equal(item.find('Connect(ItemList)').length, 3, 'Item Containers not found');
            chai.assert.isFalse(item.find('Connect(ItemList)').nodes[0].props.hasFooterAction, 'Expecting no footer action');
        });

        it('no add option for Manager', () => {

            const designVersionStatus = DesignVersionStatus.VERSION_UPDATABLE;
            const designUpdateStatus = '';
            const userRole = RoleType.MANAGER;
            const userContext = {designVersionId: 'DV2'};

            let item = testDesignUpdatesContainer(designVersionStatus, designUpdateStatus, userRole, userContext);

            chai.assert.equal(item.find('Connect(ItemList)').length, 4, 'Item Containers not found');
            chai.assert.isFalse(item.find('Connect(ItemList)').nodes[0].props.hasFooterAction, 'Expecting no footer action');
        });
    });

    describe('The add Design Update option is only visible for an Updatable Design Version', () =>{

        it('no add option for complete updatable design version', () => {

            const designVersionStatus = DesignVersionStatus.VERSION_UPDATABLE_COMPLETE;
            const designUpdateStatus = '';
            const userRole = RoleType.DESIGNER;
            const userContext = {designVersionId: 'DV0'};

            let item = testDesignUpdatesContainer(designVersionStatus, designUpdateStatus, userRole, userContext);

            chai.assert.equal(item.find('Connect(ItemList)').length, 3, 'Item Container not found');
            chai.assert.isFalse(item.find('Connect(ItemList)').nodes[0].props.hasFooterAction, 'Expecting no footer action');
        });
    });

    // Add Design Update WPs -------------------------------------------------------------------------------------------

    describe('The Work Package list for a Design Update has an option to add a new Work Package', () => {

        it('has an add option for a manager on an updatable design version', () => {

            const designVersionStatus = DesignVersionStatus.VERSION_UPDATABLE;
            const designUpdateStatus = DesignUpdateStatus.UPDATE_PUBLISHED_DRAFT;
            const userRole = RoleType.MANAGER;
            const userContext = {designVersionId: 'DV2', designUpdateId: '6'};

            const item = testDesignUpdatesContainer(designVersionStatus, designUpdateStatus, userRole, userContext);

            chai.assert.equal(item.find('Connect(ItemList)').length, 4, 'Item Containers not found');
            chai.assert.isTrue(item.find('Connect(ItemList)').nodes[3].props.hasFooterAction, 'Expecting a footer action');
            chai.assert.equal(item.find('Connect(ItemList)').nodes[3].props.footerAction, 'Add Work Package', 'Expecting Add Work Package footer action');
        });
    });

    describe('Only a Manager can add new Design Update Work Packages', () => {

        it('is not available for Designer', () => {

            const designVersionStatus = DesignVersionStatus.VERSION_UPDATABLE;
            const designUpdateStatus = DesignUpdateStatus.UPDATE_PUBLISHED_DRAFT;
            const userRole = RoleType.DESIGNER;
            const userContext = {designVersionId: 'DV2', designUpdateId: '6'};

            const item = testDesignUpdatesContainer(designVersionStatus, designUpdateStatus, userRole, userContext);

            chai.assert.isUndefined(item.find('Connect(ItemList)').nodes[4], 3, 'WP List was found');
        });

        it('is not available for Developer', () => {

            const designVersionStatus = DesignVersionStatus.VERSION_UPDATABLE;
            const designUpdateStatus = DesignUpdateStatus.UPDATE_PUBLISHED_DRAFT;
            const userRole = RoleType.DEVELOPER;
            const userContext = {designVersionId: 'DV2', designUpdateId: '6'};

            const item = testDesignUpdatesContainer(designVersionStatus, designUpdateStatus, userRole, userContext);

            chai.assert.isUndefined(item.find('Connect(ItemList)').nodes[4], 3, 'WP List was found');
        });
    });

    describe('A Work Package cannot be added to a New Design Update', () => {

        it('is not available for new design update', () => {

            const designVersionStatus = DesignVersionStatus.VERSION_UPDATABLE;
            const designUpdateStatus = DesignUpdateStatus.UPDATE_NEW;
            const userRole = RoleType.MANAGER;
            const userContext = {designVersionId: 'DV1', designUpdateId: '4'};

            const item = testDesignUpdatesContainer(designVersionStatus, designUpdateStatus, userRole, userContext);

            chai.assert.equal(item.find('Connect(ItemList)').length, 4, 'Item Containers not found');
            chai.assert.isFalse(item.find('Connect(ItemList)').nodes[3].props.hasFooterAction, 'Expecting no footer action');
        });
    });

    describe('A Work Package cannot be added to a Complete Design Update', () => {

        it('is not available for a merged design update', () => {

            const designVersionStatus = DesignVersionStatus.VERSION_UPDATABLE;
            const designUpdateStatus = DesignUpdateStatus.UPDATE_MERGED;
            const userRole = RoleType.MANAGER;
            const userContext = {designVersionId: 'DV1', designUpdateId: '1'};

            const item = testDesignUpdatesContainer(designVersionStatus, designUpdateStatus, userRole, userContext);

            chai.assert.equal(item.find('Connect(ItemList)').length, 4, 'Item Containers not found');
            chai.assert.isFalse(item.find('Connect(ItemList)').nodes[3].props.hasFooterAction, 'Expecting no footer action');
        });
    });

});