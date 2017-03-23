import React from 'react';


import { shallow, mount} from 'enzyme';
import { chai } from 'meteor/practicalmeteor:chai';

import { DesignUpdatesList } from './DesignUpdatesContainer.jsx';  // Non container wrapped

import { DesignStatus, DesignVersionStatus, DesignUpdateStatus, DesignUpdateMergeAction, RoleType } from '../../../constants/constants.js'

import { Designs } from '../../../collections/design/designs.js'
import { DesignVersions } from '../../../collections/design/design_versions.js'



describe('JSX: DesignUpdatesList', () => {


    function testDesignUpdatesContainer(designVersionStatus, userRole, userContext){


        // Design Version 1 --------------------------------------------------------------------------------------------

        const dv1newUpdates = [];
        const dv1draftUpdates = [];

        const dv1mergedUpdates = [
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
        ];

        const dv1ignoredUpdates = [
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

        const dv2newUpdates = [
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
            }
        ];

        const dv2draftUpdates = [

            {
                _id:                        '6',
                designVersionId:            'DV2',
                updateName:                 'PublishedUpdate1',
                updateReference:            'Ref6',
                updateStatus:               DesignUpdateStatus.UPDATE_PUBLISHED_DRAFT,
                updateMergeAction:          DesignUpdateMergeAction.MERGE_IGNORE,
                summaryDataStale:           false
            },
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

        const dv2mergedUpdates = [];
        const dv2ignoredUpdates = [];


        let newUpdates = [];
        let draftUpdates = [];
        let mergedUpdates = [];
        let ignoredUpdates = [];

        if(designVersionStatus === DesignVersionStatus.VERSION_UPDATABLE_COMPLETE){
            newUpdates = dv1newUpdates;
            draftUpdates = dv1draftUpdates;
            mergedUpdates = dv1mergedUpdates;
            ignoredUpdates = dv1ignoredUpdates;

        }
        if(designVersionStatus === DesignVersionStatus.VERSION_UPDATABLE){
            newUpdates = dv2newUpdates;
            draftUpdates = dv2draftUpdates;
            mergedUpdates = dv2mergedUpdates;
            ignoredUpdates = dv2ignoredUpdates;
        }

        return shallow(
            <DesignUpdatesList
                newUpdates={newUpdates}
                draftUpdates={draftUpdates}
                mergedUpdates={mergedUpdates}
                ignoredUpdates={ignoredUpdates}
                designVersionStatus={designVersionStatus}
                userRole={userRole}
                userContext={userContext}/>
        );
    }

    // Design Update Selection -----------------------------------------------------------------------------------------

    describe('A list of Design Updates is visible for the current Design Version', () => {

        it('design version with two updates has two in list', () => {

            const designVersionStatus = DesignVersionStatus.VERSION_UPDATABLE_COMPLETE;
            const userRole = RoleType.DESIGNER;
            const userContext = {designVersionId: 'DV1'};

            let item = testDesignUpdatesContainer(designVersionStatus, userRole, userContext);

            chai.assert.equal(item.find('Connect(DesignUpdate)').length, 3, 'Expected 3 updates in Complete DV');
        });

        it('design version with three updates has three in list', () => {

            const designVersionStatus = DesignVersionStatus.VERSION_UPDATABLE;
            const userRole = RoleType.DESIGNER;
            const userContext = {designVersionId: 'DV2'};

            let item = testDesignUpdatesContainer(designVersionStatus, userRole, userContext);

            chai.assert.equal(item.find('Connect(DesignUpdate)').length, 4, 'Expected 4 updates in Complete DV');
        });

        it('also visible to Developer', () => {

            const designVersionStatus = DesignVersionStatus.VERSION_UPDATABLE_COMPLETE;
            const userRole = RoleType.DEVELOPER;
            const userContext = {designVersionId: 'DV1'};

            let item = testDesignUpdatesContainer(designVersionStatus, userRole, userContext);

            chai.assert.equal(item.find('Connect(DesignUpdate)').length, 3, 'Expected 3 updates in Complete DV');
        });

        it('also visible to Manager', () => {

            const designVersionStatus = DesignVersionStatus.VERSION_UPDATABLE_COMPLETE;
            const userRole = RoleType.MANAGER;
            const userContext = {designVersionId: 'DV1'};

            let item = testDesignUpdatesContainer(designVersionStatus, userRole, userContext);

            chai.assert.equal(item.find('Connect(DesignUpdate)').length, 3, 'Expected 3 updates in Complete DV');
        });

    });

    describe('Design Updates are only listed for an Updatable Design Version', () => {

        it('wp list is shown for initial new design version', () => {

            const designVersionStatus = DesignVersionStatus.VERSION_NEW;
            const userRole = RoleType.DESIGNER;
            const userContext = {designVersionId: 'DV0'};

            let item = testDesignUpdatesContainer(designVersionStatus, userRole, userContext);

            chai.assert.equal(item.find('Connect(DesignUpdate)').length, 0, 'Expected no updates');
            chai.assert.equal(item.find('#baseWps').length, 1, 'Expected to find base WPs list');
        });

        it('wp list is shown for initial draft design version', () => {

            const designVersionStatus = DesignVersionStatus.VERSION_DRAFT;
            const userRole = RoleType.DESIGNER;
            const userContext = {designVersionId: 'DV0'};

            let item = testDesignUpdatesContainer(designVersionStatus, userRole, userContext);

            chai.assert.equal(item.find('Connect(DesignUpdate)').length, 0, 'Expected no updates');
            chai.assert.equal(item.find('#baseWps').length, 1, 'Expected to find base WPs list');
        });

        it('wp list is shown for initial complete design version', () => {

            const designVersionStatus = DesignVersionStatus.VERSION_DRAFT_COMPLETE;
            const userRole = RoleType.DESIGNER;
            const userContext = {designVersionId: 'DV0'};

            let item = testDesignUpdatesContainer(designVersionStatus, userRole, userContext);

            chai.assert.equal(item.find('Connect(DesignUpdate)').length, 0, 'Expected no updates');
            chai.assert.equal(item.find('#baseWps').length, 1, 'Expected to find base WPs list');
        });
    });

    // Add Design Update -----------------------------------------------------------------------------------------------

    describe('An Updatable Design Version has an option to add a new Design Update', () => {

        it('has an add option for a manager', () => {

            const designVersionStatus = DesignVersionStatus.VERSION_UPDATABLE;
            const userRole = RoleType.DESIGNER;
            const userContext = {designVersionId: 'DV2'};

            let item = testDesignUpdatesContainer(designVersionStatus, userRole, userContext);

            chai.assert.equal(item.find('#addUpdate').length, 1, 'Add update not found');
        });
    });

    describe('The add Design Update option is only visible to Designers', () => {

        it('no add option for Developer', () => {

            const designVersionStatus = DesignVersionStatus.VERSION_UPDATABLE;
            const userRole = RoleType.DEVELOPER;
            const userContext = {designVersionId: 'DV2'};

            let item = testDesignUpdatesContainer(designVersionStatus, userRole, userContext);

            chai.assert.equal(item.find('#addUpdate').length, 0, 'Add update found!');
        });

        it('no add option for Manager', () => {

            const designVersionStatus = DesignVersionStatus.VERSION_UPDATABLE;
            const userRole = RoleType.MANAGER;
            const userContext = {designVersionId: 'DV2'};

            let item = testDesignUpdatesContainer(designVersionStatus, userRole, userContext);

            chai.assert.equal(item.find('#addUpdate').length, 0, 'Add update found!');
        });
    });

    describe('The add Design Update option is only visible for an Updatable Design Version', () =>{

        it('no add option for new initial design version', () => {

            const designVersionStatus = DesignVersionStatus.VERSION_NEW;
            const userRole = RoleType.DESIGNER;
            const userContext = {designVersionId: 'DV0'};

            let item = testDesignUpdatesContainer(designVersionStatus, userRole, userContext);

            chai.assert.equal(item.find('#addUpdate').length, 0, 'Add update found!');
        });

        it('no add option for published initial design version', () => {

            const designVersionStatus = DesignVersionStatus.VERSION_DRAFT;
            const userRole = RoleType.DESIGNER;
            const userContext = {designVersionId: 'DV0'};

            let item = testDesignUpdatesContainer(designVersionStatus, userRole, userContext);

            chai.assert.equal(item.find('#addUpdate').length, 0, 'Add update found!');
        });

        it('no add option for complete initial design version', () => {

            const designVersionStatus = DesignVersionStatus.VERSION_DRAFT_COMPLETE;
            const userRole = RoleType.DESIGNER;
            const userContext = {designVersionId: 'DV0'};

            let item = testDesignUpdatesContainer(designVersionStatus, userRole, userContext);

            chai.assert.equal(item.find('#addUpdate').length, 0, 'Add update found!');
        });

        it('no add option for complete updatable design version', () => {

            const designVersionStatus = DesignVersionStatus.VERSION_UPDATABLE_COMPLETE;
            const userRole = RoleType.DESIGNER;
            const userContext = {designVersionId: 'DV0'};

            let item = testDesignUpdatesContainer(designVersionStatus, userRole, userContext);

            chai.assert.equal(item.find('#addUpdate').length, 0, 'Add update found!');
        });
    })

});