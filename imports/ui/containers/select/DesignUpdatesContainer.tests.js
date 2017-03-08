import React from 'react';


import { shallow, mount} from 'enzyme';
import { chai } from 'meteor/practicalmeteor:chai';

import { DesignUpdatesList } from './DesignUpdatesContainer.jsx';  // Non container wrapped

import { DesignStatus, DesignVersionStatus, DesignUpdateStatus, DesignUpdateMergeAction, RoleType } from '../../../constants/constants.js'

import { Designs } from '../../../collections/design/designs.js'
import { DesignVersions } from '../../../collections/design/design_versions.js'



describe('JSX: DesignUpdatesList', () => {


    function testDesignUpdatesContainer(designVersionStatus, userRole, userContext){

        const designUpdatesDv1 = [
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

        const designUpdatesDv2 = [
            {
                _id:                        '3',
                designVersionId:            'DV2',
                updateName:                 'NewUpdate',
                updateReference:            'Ref3',
                updateStatus:               DesignUpdateStatus.UPDATE_NEW,
                updateMergeAction:          DesignUpdateMergeAction.MERGE_IGNORE,
                summaryDataStale:           false
            },
            {
                _id:                        '4',
                designVersionId:            'DV2',
                updateName:                 'PublishedUpdate1',
                updateReference:            'Ref4',
                updateStatus:               DesignUpdateStatus.UPDATE_PUBLISHED_DRAFT,
                updateMergeAction:          DesignUpdateMergeAction.MERGE_IGNORE,
                summaryDataStale:           false
            },
            {
                _id:                        '5',
                designVersionId:            'DV2',
                updateName:                 'PublishedUpdate2',
                updateReference:            'Ref5',
                updateStatus:               DesignUpdateStatus.UPDATE_PUBLISHED_DRAFT,
                updateMergeAction:          DesignUpdateMergeAction.MERGE_IGNORE,
                summaryDataStale:           false
            }
        ];

        let designUpdates = [];
        if(designVersionStatus === DesignVersionStatus.VERSION_UPDATABLE_COMPLETE){
            designUpdates = designUpdatesDv1;
        }
        if(designVersionStatus === DesignVersionStatus.VERSION_UPDATABLE){
            designUpdates = designUpdatesDv2;
        }

        return shallow(
            <DesignUpdatesList
                designUpdates={designUpdates}
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

            chai.assert.equal(item.find('Connect(DesignUpdate)').length, 2, 'Expected 2 updates in Complete DV');
        });

        it('design version with three updates has three in list', () => {

            const designVersionStatus = DesignVersionStatus.VERSION_UPDATABLE;
            const userRole = RoleType.DESIGNER;
            const userContext = {designVersionId: 'DV2'};

            let item = testDesignUpdatesContainer(designVersionStatus, userRole, userContext);

            chai.assert.equal(item.find('Connect(DesignUpdate)').length, 3, 'Expected 3 updates in Complete DV');
        });

        it('also visible to Developer', () => {

            const designVersionStatus = DesignVersionStatus.VERSION_UPDATABLE_COMPLETE;
            const userRole = RoleType.DEVELOPER;
            const userContext = {designVersionId: 'DV1'};

            let item = testDesignUpdatesContainer(designVersionStatus, userRole, userContext);

            chai.assert.equal(item.find('Connect(DesignUpdate)').length, 2, 'Expected 2 updates in Complete DV');
        });

        it('also visible to Manager', () => {

            const designVersionStatus = DesignVersionStatus.VERSION_UPDATABLE_COMPLETE;
            const userRole = RoleType.MANAGER;
            const userContext = {designVersionId: 'DV1'};

            let item = testDesignUpdatesContainer(designVersionStatus, userRole, userContext);

            chai.assert.equal(item.find('Connect(DesignUpdate)').length, 2, 'Expected 2 updates in Complete DV');
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

    describe('Only a Designer may add Design Updates', () => {

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

    describe('A Design Update can only be added to an Updatable Design Version', () =>{

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