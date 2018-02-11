import React from 'react';


import { shallow, mount} from 'enzyme';
import { chai } from 'meteor/practicalmeteor:chai';

import { DesignUpdateSummaryList } from './UpdateSummaryContainer.jsx';  // Non container wrapped

import { DisplayContext, DesignStatus, DesignVersionStatus, DesignUpdateStatus, DesignUpdateMergeAction, RoleType, ComponentType, DesignUpdateSummaryType, DesignUpdateSummaryItem } from '../../../constants/constants.js'

import { Designs } from '../../../collections/design/designs.js'
import { DesignVersions } from '../../../collections/design/design_versions.js'



describe('JSX: DesignUpdateSummaryList', () => {

    function testUpdateSummaryList(orgAdditions, fncAdditions, removals, changes, queries, userContext){

        const designUpdateName = 'Update1';

        return shallow(
          <DesignUpdateSummaryList
              addOrgHeaders={orgAdditions}
              addFncHeaders={fncAdditions}
              removeHeaders={removals}
              changeHeaders={changes}
              moveHeaders={[]}
              queryHeaders={queries}
              userContext={userContext}
              displayContext={DisplayContext.UPDATE_SUMMARY}
          />
        );
    }

    describe('A list of Design Components added in the selected Design Update grouped by the item they are added to', () => {

        it('has organisational additions if there are organisational additions', () => {

            const orgAdditions = [
                {
                    _id:                        'A1',
                    designVersionId:            'DV1',
                    designUpdateId:             'DU1',
                    summaryType:                DesignUpdateSummaryType.SUMMARY_ADD,
                    summaryComponentType:       DesignUpdateSummaryItem.SUMMARY_APPLICATION,
                    itemType:                   ComponentType.APPLICATION,
                    itemName:                   'New App',
                    itemNameOld:                'NONE',
                    itemParentName:             'NONE',
                    itemFeatureName:            'NONE'
                }
            ];
            const fncAdditions = [];
            const removals = [];
            const changes = [];
            const queries = [];
            const userContext = {designId: 'DD', designVersionId: 'DV', designUpdateId: 'DU'};

            let item = testUpdateSummaryList(orgAdditions, fncAdditions, removals, changes, queries, userContext);

            chai.assert.equal(item.find('#orgSummaryAdditions').length, 1, 'Organisational Additions list not found');
        });

        it('has functional additions if there are functional additions', () => {

            const orgAdditions = [];
            const fncAdditions = [
                {
                    _id:                        'A1',
                    designVersionId:            'DV1',
                    designUpdateId:             'DU1',
                    summaryType:                DesignUpdateSummaryType.SUMMARY_ADD,
                    summaryComponentType:       DesignUpdateSummaryItem.SUMMARY_FEATURE,
                    itemType:                   ComponentType.FEATURE,
                    itemName:                   'New Feature',
                    itemNameOld:                'NONE',
                    itemParentName:             'NONE',
                    itemFeatureName:            'NONE'
                }
            ];
            const removals = [];
            const changes = [];
            const queries = [];
            const userContext = {designId: 'DD', designVersionId: 'DV', designUpdateId: 'DU'};

            let item = testUpdateSummaryList(orgAdditions, fncAdditions, removals, changes, queries, userContext);

            chai.assert.equal(item.find('#fncSummaryAdditions').length, 1, 'Organisational Additions list not found');
        });

    });

    describe('A list of Design Components removed in the selected Design Update grouped by the item they are removed from', () => {

        it('has removals if there are removals', () => {

            const orgAdditions = [];
            const fncAdditions = [];
            const removals = [
                {
                    _id:                        'R1',
                    designVersionId:            'DV1',
                    designUpdateId:             'DU1',
                    summaryType:                DesignUpdateSummaryType.SUMMARY_REMOVE_FROM,
                    summaryComponentType:       DesignUpdateSummaryItem.SUMMARY_SCENARIO_IN_ASPECT,
                    itemType:                   ComponentType.SCENARIO,
                    itemName:                   'Scenario1',
                    itemNameOld:                'NONE',
                    itemParentName:             'Actions',
                    itemFeatureName:            'Feature1'
                }
            ];
            const changes = [];
            const queries = [];
            const userContext = {designId: 'DD', designVersionId: 'DV', designUpdateId: 'DU'};

            let item = testUpdateSummaryList(orgAdditions, fncAdditions, removals, changes, queries, userContext);

            chai.assert.equal(item.find('#summaryRemovals').length, 1, 'Removals list not found');
        });
    });

    describe('A list of Design Components modified in the selected Design Update grouped by their parent item', () => {

        it('has changes if there are changes', () => {

            const orgAdditions = [];
            const fncAdditions = [];
            const removals = [];
            const changes = [
                {
                    _id: 'C1',
                    designVersionId: 'DV1',
                    designUpdateId: 'DU1',
                    summaryType: DesignUpdateSummaryType.SUMMARY_CHANGE,
                    summaryComponentType: DesignUpdateSummaryItem.SUMMARY_SCENARIO_IN_ASPECT,
                    itemType: ComponentType.SCENARIO,
                    itemName: 'Scenario1 New',
                    itemNameOld: 'Scenario1',
                    itemParentName: 'Actions',
                    itemFeatureName: 'Feature1'
                }
            ];
            const queries = [];
            const userContext = {designId: 'DD', designVersionId: 'DV', designUpdateId: 'DU'};

            let item = testUpdateSummaryList(orgAdditions, fncAdditions, removals, changes, queries, userContext);

            chai.assert.equal(item.find('#summaryChanges').length, 1, 'Changes list not found');
        });
    });

    //describe('A list of Scenarios to confirm tests for in the selected Design Update grouped by their parent item');

    describe('The additions list is not visible if there are no Design Components added', () => {

        it('has no organisational additions if there are no additions', () => {
            const orgAdditions = [];
            const fncAdditions = [];
            const removals = [];
            const changes = [];
            const queries = [];
            const userContext = {designId: 'DD', designVersionId: 'DV', designUpdateId: 'DU'};

            let item = testUpdateSummaryList(orgAdditions, fncAdditions, removals, changes, queries, userContext);

            chai.assert.equal(item.find('#summaryAdditions').length, 0, 'Additions list was found');
        });

        it('has no functional additions if there are no additions', () => {
            const orgAdditions = [];
            const fncAdditions = [];
            const removals = [];
            const changes = [];
            const queries = [];
            const userContext = {designId: 'DD', designVersionId: 'DV', designUpdateId: 'DU'};

            let item = testUpdateSummaryList(orgAdditions, fncAdditions, removals, changes, queries, userContext);

            chai.assert.equal(item.find('#summaryAdditions').length, 0, 'Additions list was found');
        });
    });

    describe('The removals list is not visible if there are no Design Components removed', () => {

        it('has no removals if there are no removals', () => {
            const orgAdditions = [];
            const fncAdditions = [];
            const removals = [];
            const changes = [];
            const queries = [];
            const userContext = {designId: 'DD', designVersionId: 'DV', designUpdateId: 'DU'};

            let item = testUpdateSummaryList(orgAdditions, fncAdditions, removals, changes, queries, userContext);

            chai.assert.equal(item.find('#summaryRemovals').length, 0, 'Removals list was found');
        });
    });

    describe('The changes list is not visible if there are no changes to existing Design Components', () => {

        it('has no changes if there are no changes', () => {
            const orgAdditions = [];
            const fncAdditions = [];
            const removals = [];
            const changes = [];
            const queries = [];
            const userContext = {designId: 'DD', designVersionId: 'DV', designUpdateId: 'DU'};

            let item = testUpdateSummaryList(orgAdditions, fncAdditions, removals, changes, queries, userContext);

            chai.assert.equal(item.find('#summaryChanges').length, 0, 'Changes list found');
        });
    });

    describe('A Design Update Summary is shown when a Design Update is selected', () => {

        it('summary if design update selected', () => {
            const orgAdditions = [
                {
                    _id:                        'A1',
                    designVersionId:            'DV1',
                    designUpdateId:             'DU1',
                    summaryType:                DesignUpdateSummaryType.SUMMARY_ADD,
                    summaryComponentType:       DesignUpdateSummaryItem.SUMMARY_APPLICATION,
                    itemType:                   ComponentType.APPLICATION,
                    itemName:                   'New App',
                    itemNameOld:                'NONE',
                    itemParentName:             'NONE',
                    itemFeatureName:            'NONE'
                }
            ];
            const fncAdditions = [];
            const removals = [];
            const changes = [];
            const queries = [];
            const userContext = {designId: 'DD', designVersionId: 'DV', designUpdateId: 'DU'};  // DU selected

            let item = testUpdateSummaryList(orgAdditions, fncAdditions, removals, changes, queries, userContext);

            chai.assert.equal(item.find('#updateSummary').length, 1, 'Summary not found');
            chai.assert.equal(item.find('#noSummary').length, 0, 'No Summary found');
        });

        it('no summary if design update not selected', () => {
            const orgAdditions = [];
            const fncAdditions = [];
            const removals = [];
            const changes = [];
            const queries = [];
            const userContext = {designId: 'DD', designVersionId: 'DV', designUpdateId: 'NONE'};  // No DU selected

            let item = testUpdateSummaryList(orgAdditions, fncAdditions, removals, changes, queries, userContext);

            chai.assert.equal(item.find('#updateSummary').length, 0, 'Summary was found');
            chai.assert.equal(item.find('#noSummary').length, 1, 'No Summary not found');
        });
    });

});
