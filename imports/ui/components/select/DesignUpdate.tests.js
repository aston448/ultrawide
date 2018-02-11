
import React from 'react';

import { shallow } from 'enzyme';
import { chai } from 'meteor/practicalmeteor:chai';

import { DesignUpdate } from './DesignUpdate.jsx';  // Non Redux wrapped

import { DesignVersionStatus, DesignUpdateStatus, DesignUpdateMergeAction, RoleType } from '../../../constants/constants.js'

import { DesignUpdates } from '../../../collections/design_update/design_updates.js'

describe('JSX: DesignUpdate', () => {

    // Some data
    Factory.define('designUpdateNew', DesignUpdates, {
        designId:                   'DDD',
        designVersionId:            'VVV',
        updateName:                 'NewUpdate',
        updateReference:            'RefNew',
        updateStatus:               DesignUpdateStatus.UPDATE_NEW,
        updateMergeAction:          DesignUpdateMergeAction.MERGE_IGNORE,
        summaryDataStale:           false
    });
    const designUpdateNew = Factory.create('designUpdateNew');

    Factory.define('designUpdatePublished', DesignUpdates, {
        designId:                   'DDD',
        designVersionId:            'VVV',
        updateName:                 'PublishedUpdate',
        updateReference:            'RefPublished',
        updateStatus:               DesignUpdateStatus.UPDATE_PUBLISHED_DRAFT,
        updateMergeAction:          DesignUpdateMergeAction.MERGE_INCLUDE,
        summaryDataStale:           false
    });
    const designUpdatePublished = Factory.create('designUpdatePublished');

    Factory.define('designUpdateMerged', DesignUpdates, {
        designId:                   'DDD',
        designVersionId:            'VVV',
        updateName:                 'MergedUpdate',
        updateReference:            'RefMerged',
        updateStatus:               DesignUpdateStatus.UPDATE_MERGED,
        updateMergeAction:          DesignUpdateMergeAction.MERGE_INCLUDE,
        summaryDataStale:           false
    });
    const designUpdateMerged = Factory.create('designUpdateMerged');

    Factory.define('designUpdateIgnored', DesignUpdates, {
        designId:                   'DDD',
        designVersionId:            'VVV',
        updateName:                 'IgnoredUpdate',
        updateReference:            'RefIgnored',
        updateStatus:               DesignUpdateStatus.UPDATE_IGNORED,
        updateMergeAction:          DesignUpdateMergeAction.MERGE_IGNORE,
        summaryDataStale:           false
    });
    const designUpdateIgnored = Factory.create('designUpdateIgnored');

    function testDesignUpdate(designUpdate, userRole, userContext){

        const viewOptions = {
            designDetailsVisible:       true,
            testSummaryVisible:         false,
            designDomainDictVisible:    true,
            devAccTestsVisible:         false,
            devIntTestsVisible:         false,
            devUnitTestsVisible:        false,
            devFeatureFilesVisible:     false,
        };

        const designVersionStatus = DesignVersionStatus.VERSION_UPDATABLE;

        return shallow(
            <DesignUpdate
                designUpdate={designUpdate}
                designVersionStatus={designVersionStatus}
                userRole={userRole}
                userContext={userContext}
                viewOptions={viewOptions}
                testDataFlag={0}
                dvDataLoaded={true}
                testDataLoaded={true}
                summaryDataLoaded={true}
                mashDataStale={false}
                testDataStale={false}
            />
        );
    }


    // View Update Content ---------------------------------------------------------------------------------------------

    describe('A Design Update item has an option to view it', () => {

        it('has a view option for new update for designer', () => {

            const userRole = RoleType.DESIGNER;
            const userContext = {designId: 'DDD', designVersionId: 'VVV', designUpdateId: designUpdateNew._id};

            let item = testDesignUpdate(designUpdateNew, userRole, userContext);

            chai.assert.equal(item.find('#butView').length, 1, 'View option not found')
        });

        it('has a view option for published update for designer', () => {

            const userRole = RoleType.DESIGNER;
            const userContext = {designId: 'DDD', designVersionId: 'VVV', designUpdateId: designUpdatePublished._id};

            let item = testDesignUpdate(designUpdatePublished, userRole, userContext);

            chai.assert.equal(item.find('#butView').length, 1, 'View option not found')
        });

        it('has a view option for merged update for designer', () => {

            const userRole = RoleType.DESIGNER;
            const userContext = {designId: 'DDD', designVersionId: 'VVV', designUpdateId: designUpdateMerged._id};

            let item = testDesignUpdate(designUpdateMerged, userRole, userContext);

            chai.assert.equal(item.find('#butView').length, 1, 'View option not found')
        });

        it('has a view option for published update for developer', () => {

            const userRole = RoleType.DEVELOPER;
            const userContext = {designId: 'DDD', designVersionId: 'VVV', designUpdateId: designUpdatePublished._id};

            let item = testDesignUpdate(designUpdatePublished, userRole, userContext);

            chai.assert.equal(item.find('#butView').length, 1, 'View option not found')
        });

        it('has a view option for merged update for developer', () => {

            const userRole = RoleType.DEVELOPER;
            const userContext = {designId: 'DDD', designVersionId: 'VVV', designUpdateId: designUpdateMerged._id};

            let item = testDesignUpdate(designUpdateMerged, userRole, userContext);

            chai.assert.equal(item.find('#butView').length, 1, 'View option not found')
        });

        it('has a view option for published update for manager', () => {

            const userRole = RoleType.MANAGER;
            const userContext = {designId: 'DDD', designVersionId: 'VVV', designUpdateId: designUpdatePublished._id};

            let item = testDesignUpdate(designUpdatePublished, userRole, userContext);

            chai.assert.equal(item.find('#butView').length, 1, 'View option not found')
        });

        it('has a view option for merged update for manager', () => {

            const userRole = RoleType.MANAGER;
            const userContext = {designId: 'DDD', designVersionId: 'VVV', designUpdateId: designUpdateMerged._id};

            let item = testDesignUpdate(designUpdateMerged, userRole, userContext);

            chai.assert.equal(item.find('#butView').length, 1, 'View option not found')
        });
    });

    describe('The view option is only visible to a Designer for a New Design Update', () => {

        it('has no view option for developer', () => {

            const userRole = RoleType.DEVELOPER;
            const userContext = {designId: 'DDD', designVersionId: 'VVV', designUpdateId: designUpdateNew._id};

            let item = testDesignUpdate(designUpdateNew, userRole, userContext);

            chai.assert.equal(item.find('#butView').length, 0, 'View option was found')
        });

        it('has no view option for manager', () => {

            const userRole = RoleType.MANAGER;
            const userContext = {designId: 'DDD', designVersionId: 'VVV', designUpdateId: designUpdateNew._id};

            let item = testDesignUpdate(designUpdateNew, userRole, userContext);

            chai.assert.equal(item.find('#butView').length, 0, 'View option was found')
        });
    });

    // Edit Update Content ---------------------------------------------------------------------------------------------

    describe('A Design Update item has an option to edit it', () => {

        it('has an edit option for new update for designer', () => {

            const userRole = RoleType.DESIGNER;
            const userContext = {designId: 'DDD', designVersionId: 'VVV', designUpdateId: designUpdateNew._id};

            let item = testDesignUpdate(designUpdateNew, userRole, userContext);

            chai.assert.equal(item.find('#butEdit').length, 1, 'Edit option not found')
        });

        it('has an edit option for published update for designer', () => {

            const userRole = RoleType.DESIGNER;
            const userContext = {designId: 'DDD', designVersionId: 'VVV', designUpdateId: designUpdatePublished._id};

            let item = testDesignUpdate(designUpdatePublished, userRole, userContext);

            chai.assert.equal(item.find('#butEdit').length, 1, 'Edit option not found')
        });
    });

    describe('The edit option on a Complete Design Update is not visible for a Designer', () => {

        it('has no edit option for designer', () => {

            const userRole = RoleType.DESIGNER;
            const userContext = {designId: 'DDD', designVersionId: 'VVV', designUpdateId: designUpdateMerged._id};

            let item = testDesignUpdate(designUpdateMerged, userRole, userContext);

            chai.assert.equal(item.find('#butEdit').length, 0, 'Edit option was found')
        });
    });

    describe('The edit option on a Design Update is only visible for a Designer', () => {

        it('developer has no edit option for new design update', () => {

            const userRole = RoleType.DEVELOPER;
            const userContext = {designId: 'DDD', designVersionId: 'VVV', designUpdateId: designUpdateNew._id};

            let item = testDesignUpdate(designUpdateNew, userRole, userContext);

            chai.assert.equal(item.find('#butEdit').length, 0, 'Edit option was found')
        });

        it('developer has no edit option for published design update', () => {

            const userRole = RoleType.DEVELOPER;
            const userContext = {designId: 'DDD', designVersionId: 'VVV', designUpdateId: designUpdatePublished._id};

            let item = testDesignUpdate(designUpdatePublished, userRole, userContext);

            chai.assert.equal(item.find('#butEdit').length, 0, 'Edit option was found')
        });

        it('developer has no edit option for merged design update', () => {

            const userRole = RoleType.DEVELOPER;
            const userContext = {designId: 'DDD', designVersionId: 'VVV', designUpdateId: designUpdateMerged._id};

            let item = testDesignUpdate(designUpdateMerged, userRole, userContext);

            chai.assert.equal(item.find('#butEdit').length, 0, 'Edit option was found')
        });

        it('manager has no edit option for new design update', () => {

            const userRole = RoleType.MANAGER;
            const userContext = {designId: 'DDD', designVersionId: 'VVV', designUpdateId: designUpdateNew._id};

            let item = testDesignUpdate(designUpdateNew, userRole, userContext);

            chai.assert.equal(item.find('#butEdit').length, 0, 'Edit option was found')
        });

        it('manager has no edit option for published design update', () => {

            const userRole = RoleType.MANAGER;
            const userContext = {designId: 'DDD', designVersionId: 'VVV', designUpdateId: designUpdatePublished._id};

            let item = testDesignUpdate(designUpdatePublished, userRole, userContext);

            chai.assert.equal(item.find('#butEdit').length, 0, 'Edit option was found')
        });

        it('manager has no edit option for merged design update', () => {

            const userRole = RoleType.MANAGER;
            const userContext = {designId: 'DDD', designVersionId: 'VVV', designUpdateId: designUpdateMerged._id};

            let item = testDesignUpdate(designUpdateMerged, userRole, userContext);

            chai.assert.equal(item.find('#butEdit').length, 0, 'Edit option was found')
        });
    });

    // Publish / Withdraw Update ---------------------------------------------------------------------------------------

    // Publish
    describe('A New Design Update item has an option to publish it', () => {

        it('has a publish option for new update for designer', () => {

            const userRole = RoleType.DESIGNER;
            const userContext = {designId: 'DDD', designVersionId: 'VVV', designUpdateId: designUpdateNew._id};

            let item = testDesignUpdate(designUpdateNew, userRole, userContext);

            chai.assert.equal(item.find('#butPublish').length, 1, 'Publish option not found')
        });

    });

    describe('The publish option is only visible to Designers for New Design Updates', () => {

        it('designer has no publish option for published design update', () => {

            const userRole = RoleType.MANAGER;
            const userContext = {designId: 'DDD', designVersionId: 'VVV', designUpdateId: designUpdatePublished._id};

            let item = testDesignUpdate(designUpdatePublished, userRole, userContext);

            chai.assert.equal(item.find('#butPublish').length, 0, 'Publish option was found')
        });

        it('designer has no publish option for merged design update', () => {

            const userRole = RoleType.MANAGER;
            const userContext = {designId: 'DDD', designVersionId: 'VVV', designUpdateId: designUpdateMerged._id};

            let item = testDesignUpdate(designUpdateMerged, userRole, userContext);

            chai.assert.equal(item.find('#butPublish').length, 0, 'Publish option was found')
        });

        it('developer has no publish option for new update', () => {

            const userRole = RoleType.DEVELOPER;
            const userContext = {designId: 'DDD', designVersionId: 'VVV', designUpdateId: designUpdateNew._id};

            let item = testDesignUpdate(designUpdateMerged, userRole, userContext);

            chai.assert.equal(item.find('#butPublish').length, 0, 'Publish option was found')
        });

        it('developer has no publish option for published update', () => {

            const userRole = RoleType.DEVELOPER;
            const userContext = {designId: 'DDD', designVersionId: 'VVV', designUpdateId: designUpdatePublished._id};

            let item = testDesignUpdate(designUpdatePublished, userRole, userContext);

            chai.assert.equal(item.find('#butPublish').length, 0, 'Publish option was found')
        });

        it('developer has no publish option for merged update', () => {

            const userRole = RoleType.DEVELOPER;
            const userContext = {designId: 'DDD', designVersionId: 'VVV', designUpdateId: designUpdateMerged._id};

            let item = testDesignUpdate(designUpdateMerged, userRole, userContext);

            chai.assert.equal(item.find('#butPublish').length, 0, 'Publish option was found')
        });

        it('manager has no publish option for new design update', () => {

            const userRole = RoleType.MANAGER;
            const userContext = {designId: 'DDD', designVersionId: 'VVV', designUpdateId: designUpdateNew._id};

            let item = testDesignUpdate(designUpdateNew, userRole, userContext);

            chai.assert.equal(item.find('#butPublish').length, 0, 'Publish option was found')
        });

        it('manager has no publish option for published design update', () => {

            const userRole = RoleType.MANAGER;
            const userContext = {designId: 'DDD', designVersionId: 'VVV', designUpdateId: designUpdatePublished._id};

            let item = testDesignUpdate(designUpdatePublished, userRole, userContext);

            chai.assert.equal(item.find('#butPublish').length, 0, 'Publish option was found')
        });

        it('manager has no publish option for merged design update', () => {

            const userRole = RoleType.MANAGER;
            const userContext = {designId: 'DDD', designVersionId: 'VVV', designUpdateId: designUpdateMerged._id};

            let item = testDesignUpdate(designUpdateMerged, userRole, userContext);

            chai.assert.equal(item.find('#butPublish').length, 0, 'Publish option was found')
        });
    });

    // Withdraw
    describe('A Draft Design Update has an option to withdraw it', () => {

        it('has a withdraw option for published update for designer', () => {

            const userRole = RoleType.DESIGNER;
            const userContext = {designId: 'DDD', designVersionId: 'VVV', designUpdateId: designUpdatePublished._id};

            let item = testDesignUpdate(designUpdatePublished, userRole, userContext);

            chai.assert.equal(item.find('#butWithdraw').length, 1, 'Withdraw option not found')
        });

    });

    describe('The withdraw option is only visible to Designers for Draft Design Updates', () => {

        it('new has no withdraw option for designer', () => {

            const userRole = RoleType.DESIGNER;
            const userContext = {designId: 'DDD', designVersionId: 'VVV', designUpdateId: designUpdateNew._id};

            let item = testDesignUpdate(designUpdateNew, userRole, userContext);

            chai.assert.equal(item.find('#butWithdraw').length, 0, 'Withdraw option was found')
        });

        it('new has no withdraw option for developer', () => {

            const userRole = RoleType.DEVELOPER;
            const userContext = {designId: 'DDD', designVersionId: 'VVV', designUpdateId: designUpdateNew._id};

            let item = testDesignUpdate(designUpdateNew, userRole, userContext);

            chai.assert.equal(item.find('#butWithdraw').length, 0, 'Withdraw option was found')
        });

        it('new has no withdraw option for manager', () => {

            const userRole = RoleType.MANAGER;
            const userContext = {designId: 'DDD', designVersionId: 'VVV', designUpdateId: designUpdateNew._id};

            let item = testDesignUpdate(designUpdateNew, userRole, userContext);

            chai.assert.equal(item.find('#butWithdraw').length, 0, 'Withdraw option was found')
        });

        it('complete has no withdraw option for designer', () => {

            const userRole = RoleType.DESIGNER;
            const userContext = {designId: 'DDD', designVersionId: 'VVV', designUpdateId: designUpdateMerged._id};

            let item = testDesignUpdate(designUpdateMerged, userRole, userContext);

            chai.assert.equal(item.find('#butWithdraw').length, 0, 'Withdraw option was found')
        });

        it('complete has no withdraw option for developer', () => {

            const userRole = RoleType.DEVELOPER;
            const userContext = {designId: 'DDD', designVersionId: 'VVV', designUpdateId: designUpdateMerged._id};

            let item = testDesignUpdate(designUpdateMerged, userRole, userContext);

            chai.assert.equal(item.find('#butWithdraw').length, 0, 'Withdraw option was found')
        });

        it('complete has no withdraw option for manager', () => {

            const userRole = RoleType.MANAGER;
            const userContext = {designId: 'DDD', designVersionId: 'VVV', designUpdateId: designUpdateMerged._id};

            let item = testDesignUpdate(designUpdateMerged, userRole, userContext);

            chai.assert.equal(item.find('#butWithdraw').length, 0, 'Withdraw option was found')
        });

        it('draft has no withdraw option for developer', () => {

            const userRole = RoleType.DEVELOPER;
            const userContext = {designId: 'DDD', designVersionId: 'VVV', designUpdateId: designUpdatePublished._id};

            let item = testDesignUpdate(designUpdatePublished, userRole, userContext);

            chai.assert.equal(item.find('#butWithdraw').length, 0, 'Withdraw option was found')
        });

        it('draft has no withdraw option for manager', () => {

            const userRole = RoleType.MANAGER;
            const userContext = {designId: 'DDD', designVersionId: 'VVV', designUpdateId: designUpdatePublished._id};

            let item = testDesignUpdate(designUpdatePublished, userRole, userContext);

            chai.assert.equal(item.find('#butWithdraw').length, 0, 'Withdraw option was found')
        });
    });

    // Remove Update ---------------------------------------------------------------------------------------------------

    describe('A Design Update item has an option to remove it', () => {

        it('has a remove option for new update for designer', () => {

            const userRole = RoleType.DESIGNER;
            const userContext = {designId: 'DDD', designVersionId: 'VVV', designUpdateId: designUpdateNew._id};

            let item = testDesignUpdate(designUpdateNew, userRole, userContext);

            chai.assert.equal(item.find('#butDelete').length, 1, 'Remove option not found')
        });

    });

    describe('The remove option is only visible to Designers for New Design Updates', () => {

        it('has no remove option for published update for designer', () => {

            const userRole = RoleType.DESIGNER;
            const userContext = {designId: 'DDD', designVersionId: 'VVV', designUpdateId: designUpdatePublished._id};

            let item = testDesignUpdate(designUpdatePublished, userRole, userContext);

            chai.assert.equal(item.find('#butDelete').length, 0, 'Remove option found')
        });

        it('has no remove option for completed update for designer', () => {

            const userRole = RoleType.DESIGNER;
            const userContext = {designId: 'DDD', designVersionId: 'VVV', designUpdateId: designUpdateMerged._id};

            let item = testDesignUpdate(designUpdateMerged, userRole, userContext);

            chai.assert.equal(item.find('#butDelete').length, 0, 'Remove option found')
        });

    });

    describe('A Designer cannot remove a Draft Design Update', () => {

        it('has no remove option for designer', () => {

            const userRole = RoleType.DESIGNER;
            const userContext = {designId: 'DDD', designVersionId: 'VVV', designUpdateId: designUpdatePublished._id};

            let item = testDesignUpdate(designUpdatePublished, userRole, userContext);

            chai.assert.equal(item.find('#butDelete').length, 0, 'Remove option was found')
        });
    });

    describe('A Designer cannot remove a Complete Design Update', () => {

        it('has no remove option for designer', () => {

            const userRole = RoleType.DESIGNER;
            const userContext = {designId: 'DDD', designVersionId: 'VVV', designUpdateId: designUpdateMerged._id};

            let item = testDesignUpdate(designUpdateMerged, userRole, userContext);

            chai.assert.equal(item.find('#butDelete').length, 0, 'Remove option was found')
        });
    });

    describe('A Developer cannot remove a Design Update', () => {

        it('has no remove option for new design update', () => {

            const userRole = RoleType.DEVELOPER;
            const userContext = {designId: 'DDD', designVersionId: 'VVV', designUpdateId: designUpdateNew._id};

            let item = testDesignUpdate(designUpdateNew, userRole, userContext);

            chai.assert.equal(item.find('#butDelete').length, 0, 'Remove option was found')
        });

        it('has no remove option for published design update', () => {

            const userRole = RoleType.DEVELOPER;
            const userContext = {designId: 'DDD', designVersionId: 'VVV', designUpdateId: designUpdatePublished._id};

            let item = testDesignUpdate(designUpdatePublished, userRole, userContext);

            chai.assert.equal(item.find('#butDelete').length, 0, 'Remove option was found')
        });

        it('has no remove option for merged design update', () => {

            const userRole = RoleType.DEVELOPER;
            const userContext = {designId: 'DDD', designVersionId: 'VVV', designUpdateId: designUpdateMerged._id};

            let item = testDesignUpdate(designUpdateMerged, userRole, userContext);

            chai.assert.equal(item.find('#butDelete').length, 0, 'Remove option was found')
        });
    });

    describe('A Manager cannot remove a Design Update', () => {

        it('has no remove option for new design update', () => {

            const userRole = RoleType.MANAGER;
            const userContext = {designId: 'DDD', designVersionId: 'VVV', designUpdateId: designUpdateNew._id};

            let item = testDesignUpdate(designUpdateNew, userRole, userContext);

            chai.assert.equal(item.find('#butDelete').length, 0, 'Remove option was found')
        });

        it('has no remove option for published design update', () => {

            const userRole = RoleType.MANAGER;
            const userContext = {designId: 'DDD', designVersionId: 'VVV', designUpdateId: designUpdatePublished._id};

            let item = testDesignUpdate(designUpdatePublished, userRole, userContext);

            chai.assert.equal(item.find('#butDelete').length, 0, 'Remove option was found')
        });

        it('has no remove option for merged design update', () => {

            const userRole = RoleType.MANAGER;
            const userContext = {designId: 'DDD', designVersionId: 'VVV', designUpdateId: designUpdateMerged._id};

            let item = testDesignUpdate(designUpdateMerged, userRole, userContext);

            chai.assert.equal(item.find('#butDelete').length, 0, 'Remove option was found')
        });
    });

    // Set Merge Action ------------------------------------------------------------------------------------------------

    describe('A Design Update has a radio option to Merge', () => {

        it('published update has a merge option for designer', () => {

            const userRole = RoleType.DESIGNER;
            const userContext = {designId: 'DDD', designVersionId: 'VVV', designUpdateId: designUpdatePublished._id};

            let item = testDesignUpdate(designUpdatePublished, userRole, userContext);

            chai.assert.equal(item.find('#optionMerge').length, 1, 'Merge option not found')
        });
    });

    describe('A Design Update has a radio option to Carry Forward', () => {

        it('published update has a merge option for designer', () => {

            const userRole = RoleType.DESIGNER;
            const userContext = {designId: 'DDD', designVersionId: 'VVV', designUpdateId: designUpdatePublished._id};

            let item = testDesignUpdate(designUpdatePublished, userRole, userContext);

            chai.assert.equal(item.find('#optionRoll').length, 1, 'Carry Forward option not found')
        });
    });

    describe('A Design Update has a radio option to Ignore', () => {

        it('published update has a merge option for designer', () => {

            const userRole = RoleType.DESIGNER;
            const userContext = {designId: 'DDD', designVersionId: 'VVV', designUpdateId: designUpdatePublished._id};

            let item = testDesignUpdate(designUpdatePublished, userRole, userContext);

            chai.assert.equal(item.find('#optionIgnore').length, 1, 'Ignore option not found')
        });
    });

    describe('Design Update merge actions are not visible for New Design Updates', () => {

        it('no merge option', () => {

            const userRole = RoleType.DESIGNER;
            const userContext = {designId: 'DDD', designVersionId: 'VVV', designUpdateId: designUpdateNew._id};

            let item = testDesignUpdate(designUpdateNew, userRole, userContext);

            chai.assert.equal(item.find('#optionMerge').length, 0, 'Merge option found')
        });

        it('no carry forward option', () => {

            const userRole = RoleType.DESIGNER;
            const userContext = {designId: 'DDD', designVersionId: 'VVV', designUpdateId: designUpdateNew._id};

            let item = testDesignUpdate(designUpdateNew, userRole, userContext);

            chai.assert.equal(item.find('#optionRoll').length, 0, 'Carry Forward option found')
        });

        it('no ignore option', () => {

            const userRole = RoleType.DESIGNER;
            const userContext = {designId: 'DDD', designVersionId: 'VVV', designUpdateId: designUpdateNew._id};

            let item = testDesignUpdate(designUpdateNew, userRole, userContext);

            chai.assert.equal(item.find('#optionIgnore').length, 0, 'Ignore option found')
        });
    });

    describe('A Designer cannot set Design Update actions for a New Design Update', () => {

        it('has no merge option for designer', () => {

            const userRole = RoleType.DESIGNER;
            const userContext = {designId: 'DDD', designVersionId: 'VVV', designUpdateId: designUpdateNew._id};

            let item = testDesignUpdate(designUpdateNew, userRole, userContext);

            chai.assert.equal(item.find('#optionMerge').length, 0, 'Merge option was found')
        });

        it('has no carry forward option for designer', () => {

            const userRole = RoleType.DESIGNER;
            const userContext = {designId: 'DDD', designVersionId: 'VVV', designUpdateId: designUpdateNew._id};

            let item = testDesignUpdate(designUpdateNew, userRole, userContext);

            chai.assert.equal(item.find('#optionRoll').length, 0, 'Carry Forward option was found')
        });

        it('has no ignore option for designer', () => {

            const userRole = RoleType.DESIGNER;
            const userContext = {designId: 'DDD', designVersionId: 'VVV', designUpdateId: designUpdateNew._id};

            let item = testDesignUpdate(designUpdateNew, userRole, userContext);

            chai.assert.equal(item.find('#optionIgnore').length, 0, 'Ignore option was found')
        });
    });

    describe('A Designer cannot set Design Update actions for a Complete Design Update', () => {

        it('has no merge option for designer', () => {

            const userRole = RoleType.DESIGNER;
            const userContext = {designId: 'DDD', designVersionId: 'VVV', designUpdateId: designUpdateMerged._id};

            let item = testDesignUpdate(designUpdateMerged, userRole, userContext);

            chai.assert.equal(item.find('#optionMerge').length, 0, 'Merge option was found')
        });

        it('has no carry forward option for designer', () => {

            const userRole = RoleType.DESIGNER;
            const userContext = {designId: 'DDD', designVersionId: 'VVV', designUpdateId: designUpdateMerged._id};

            let item = testDesignUpdate(designUpdateMerged, userRole, userContext);

            chai.assert.equal(item.find('#optionRoll').length, 0, 'Carry Forward option was found')
        });

        it('has no ignore option for designer', () => {

            const userRole = RoleType.DESIGNER;
            const userContext = {designId: 'DDD', designVersionId: 'VVV', designUpdateId: designUpdateMerged._id};

            let item = testDesignUpdate(designUpdateMerged, userRole, userContext);

            chai.assert.equal(item.find('#optionIgnore').length, 0, 'Ignore option was found')
        });
    });

    describe('A Designer cannot set Design Update actions for an Ignore Design Update', () => {

        it('has no merge option for designer', () => {

            const userRole = RoleType.DESIGNER;
            const userContext = {designId: 'DDD', designVersionId: 'VVV', designUpdateId: designUpdateIgnored._id};

            let item = testDesignUpdate(designUpdateIgnored, userRole, userContext);

            chai.assert.equal(item.find('#optionMerge').length, 0, 'Merge option was found')
        });

        it('has no carry forward option for designer', () => {

            const userRole = RoleType.DESIGNER;
            const userContext = {designId: 'DDD', designVersionId: 'VVV', designUpdateId: designUpdateIgnored._id};

            let item = testDesignUpdate(designUpdateIgnored, userRole, userContext);

            chai.assert.equal(item.find('#optionRoll').length, 0, 'Carry Forward option was found')
        });

        it('has no ignore option for designer', () => {

            const userRole = RoleType.DESIGNER;
            const userContext = {designId: 'DDD', designVersionId: 'VVV', designUpdateId: designUpdateIgnored._id};

            let item = testDesignUpdate(designUpdateIgnored, userRole, userContext);

            chai.assert.equal(item.find('#optionIgnore').length, 0, 'Ignore option was found')
        });
    });

    describe('A Developer cannot set Design Update actions', () => {

        it('has no merge option for new', () => {

            const userRole = RoleType.DEVELOPER;
            const userContext = {designId: 'DDD', designVersionId: 'VVV', designUpdateId: designUpdateNew._id};

            let item = testDesignUpdate(designUpdateNew, userRole, userContext);

            chai.assert.equal(item.find('#optionMerge').length, 0, 'Merge option was found')
        });

        it('has no merge option for published', () => {

            const userRole = RoleType.DEVELOPER;
            const userContext = {designId: 'DDD', designVersionId: 'VVV', designUpdateId: designUpdatePublished._id};

            let item = testDesignUpdate(designUpdatePublished, userRole, userContext);

            chai.assert.equal(item.find('#optionMerge').length, 0, 'Merge option was found')
        });

        it('has no merge option for complete', () => {

            const userRole = RoleType.DEVELOPER;
            const userContext = {designId: 'DDD', designVersionId: 'VVV', designUpdateId: designUpdateMerged._id};

            let item = testDesignUpdate(designUpdateMerged, userRole, userContext);

            chai.assert.equal(item.find('#optionMerge').length, 0, 'Merge option was found')
        });

        it('has no carry forward option for new', () => {

            const userRole = RoleType.DEVELOPER;
            const userContext = {designId: 'DDD', designVersionId: 'VVV', designUpdateId: designUpdateNew._id};

            let item = testDesignUpdate(designUpdateNew, userRole, userContext);

            chai.assert.equal(item.find('#optionRoll').length, 0, 'Carry Forward option was found')
        });

        it('has no carry forward option for published', () => {

            const userRole = RoleType.DEVELOPER;
            const userContext = {designId: 'DDD', designVersionId: 'VVV', designUpdateId: designUpdatePublished._id};

            let item = testDesignUpdate(designUpdatePublished, userRole, userContext);

            chai.assert.equal(item.find('#optionRoll').length, 0, 'Carry Forward option was found')
        });

        it('has no carry forward option for complete', () => {

            const userRole = RoleType.DEVELOPER;
            const userContext = {designId: 'DDD', designVersionId: 'VVV', designUpdateId: designUpdateMerged._id};

            let item = testDesignUpdate(designUpdateMerged, userRole, userContext);

            chai.assert.equal(item.find('#optionRoll').length, 0, 'Carry Forward option was found')
        });

        it('has no ignore option for new', () => {

            const userRole = RoleType.DEVELOPER;
            const userContext = {designId: 'DDD', designVersionId: 'VVV', designUpdateId: designUpdateNew._id};

            let item = testDesignUpdate(designUpdateNew, userRole, userContext);

            chai.assert.equal(item.find('#optionIgnore').length, 0, 'Ignore option was found')
        });

        it('has no ignore option for published', () => {

            const userRole = RoleType.DEVELOPER;
            const userContext = {designId: 'DDD', designVersionId: 'VVV', designUpdateId: designUpdatePublished._id};

            let item = testDesignUpdate(designUpdatePublished, userRole, userContext);

            chai.assert.equal(item.find('#optionIgnore').length, 0, 'Ignore option was found')
        });

        it('has no ignore option for complete', () => {

            const userRole = RoleType.DEVELOPER;
            const userContext = {designId: 'DDD', designVersionId: 'VVV', designUpdateId: designUpdateMerged._id};

            let item = testDesignUpdate(designUpdateMerged, userRole, userContext);

            chai.assert.equal(item.find('#optionIgnore').length, 0, 'Ignore option was found')
        });
    });

    describe('A Manager cannot set Design Update actions', () => {

        it('has no merge option for new', () => {

            const userRole = RoleType.MANAGER;
            const userContext = {designId: 'DDD', designVersionId: 'VVV', designUpdateId: designUpdateNew._id};

            let item = testDesignUpdate(designUpdateNew, userRole, userContext);

            chai.assert.equal(item.find('#optionMerge').length, 0, 'Merge option was found')
        });

        it('has no merge option for published', () => {

            const userRole = RoleType.MANAGER;
            const userContext = {designId: 'DDD', designVersionId: 'VVV', designUpdateId: designUpdatePublished._id};

            let item = testDesignUpdate(designUpdatePublished, userRole, userContext);

            chai.assert.equal(item.find('#optionMerge').length, 0, 'Merge option was found')
        });

        it('has no merge option for complete', () => {

            const userRole = RoleType.MANAGER;
            const userContext = {designId: 'DDD', designVersionId: 'VVV', designUpdateId: designUpdateMerged._id};

            let item = testDesignUpdate(designUpdateMerged, userRole, userContext);

            chai.assert.equal(item.find('#optionMerge').length, 0, 'Merge option was found')
        });

        it('has no carry forward option for new', () => {

            const userRole = RoleType.MANAGER;
            const userContext = {designId: 'DDD', designVersionId: 'VVV', designUpdateId: designUpdateNew._id};

            let item = testDesignUpdate(designUpdateNew, userRole, userContext);

            chai.assert.equal(item.find('#optionRoll').length, 0, 'Carry Forward option was found')
        });

        it('has no carry forward option for published', () => {

            const userRole = RoleType.MANAGER;
            const userContext = {designId: 'DDD', designVersionId: 'VVV', designUpdateId: designUpdatePublished._id};

            let item = testDesignUpdate(designUpdatePublished, userRole, userContext);

            chai.assert.equal(item.find('#optionRoll').length, 0, 'Carry Forward option was found')
        });

        it('has no carry forward option for complete', () => {

            const userRole = RoleType.MANAGER;
            const userContext = {designId: 'DDD', designVersionId: 'VVV', designUpdateId: designUpdateMerged._id};

            let item = testDesignUpdate(designUpdateMerged, userRole, userContext);

            chai.assert.equal(item.find('#optionRoll').length, 0, 'Carry Forward option was found')
        });

        it('has no ignore option for new', () => {

            const userRole = RoleType.MANAGER;
            const userContext = {designId: 'DDD', designVersionId: 'VVV', designUpdateId: designUpdateNew._id};

            let item = testDesignUpdate(designUpdateNew, userRole, userContext);

            chai.assert.equal(item.find('#optionIgnore').length, 0, 'Ignore option was found')
        });

        it('has no ignore option for published', () => {

            const userRole = RoleType.MANAGER;
            const userContext = {designId: 'DDD', designVersionId: 'VVV', designUpdateId: designUpdatePublished._id};

            let item = testDesignUpdate(designUpdatePublished, userRole, userContext);

            chai.assert.equal(item.find('#optionIgnore').length, 0, 'Ignore option was found')
        });

        it('has no ignore option for complete', () => {

            const userRole = RoleType.MANAGER;
            const userContext = {designId: 'DDD', designVersionId: 'VVV', designUpdateId: designUpdateMerged._id};

            let item = testDesignUpdate(designUpdateMerged, userRole, userContext);

            chai.assert.equal(item.find('#optionIgnore').length, 0, 'Ignore option was found')
        });
    });

});
