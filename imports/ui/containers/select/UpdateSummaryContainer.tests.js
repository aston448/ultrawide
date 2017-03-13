import React from 'react';


import { shallow, mount} from 'enzyme';
import { chai } from 'meteor/practicalmeteor:chai';

import { DesignUpdateSummaryList } from './UpdateSummaryContainer.jsx';  // Non container wrapped

import { DesignStatus, DesignVersionStatus, DesignUpdateStatus, DesignUpdateMergeAction, RoleType, ComponentType, DesignUpdateSummaryType, DesignUpdateSummaryItem } from '../../../constants/constants.js'

import { Designs } from '../../../collections/design/designs.js'
import { DesignVersions } from '../../../collections/design/design_versions.js'



describe('JSX: DesignUpdateSummaryList', () => {

    function testUpdateSummaryList(additions, removals, changes, userContext){

        const designUpdateName = 'Update1';

        return shallow(
          <DesignUpdateSummaryList
              functionalAdditions={additions}
              functionalRemovals={removals}
              functionalChanges={changes}
              designUpdateName={designUpdateName}
              userContext={userContext}
          />
        );
    }

    describe('A list of Features and Scenarios added in the selected Design Update', () => {

        it('has additions if there are additions', () => {

            const additions = [
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
            const removals = [];
            const changes = [];
            const userContext = {designId: 'DD', designVersionId: 'DV', designUpdateId: 'DU'};

            let item = testUpdateSummaryList(additions, removals, changes, userContext);

            chai.assert.equal(item.find('#summaryAdditions').length, 1, 'Additions list not found');
        });
    });

    describe('A list of Features and Scenarios removed in the selected Design Update', () => {

        it('has removals if there are removals', () => {

            const additions = [];
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
            const userContext = {designId: 'DD', designVersionId: 'DV', designUpdateId: 'DU'};

            let item = testUpdateSummaryList(additions, removals, changes, userContext);

            chai.assert.equal(item.find('#summaryRemovals').length, 1, 'Removals list not found');
        });
    });

    describe('A list of Features and Scenarios modified in the selected Design Update', () => {

        it('has changes if there are changes', () => {

            const additions = [];
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
            const userContext = {designId: 'DD', designVersionId: 'DV', designUpdateId: 'DU'};

            let item = testUpdateSummaryList(additions, removals, changes, userContext);

            chai.assert.equal(item.find('#summaryChanges').length, 1, 'Changes list not found');
        });
    });

    describe('The additions list is not visible if there are no Features or Scenarios added', () => {

        it('has no additions if there are no additions', () => {
            const additions = [];
            const removals = [];
            const changes = [];
            const userContext = {designId: 'DD', designVersionId: 'DV', designUpdateId: 'DU'};

            let item = testUpdateSummaryList(additions, removals, changes, userContext);

            chai.assert.equal(item.find('#summaryAdditions').length, 0, 'Additions list was found');
        });
    });

    describe('The removals list is not visible if there are no Features or Scenarios removed', () => {

        it('has no removals if there are no removals', () => {
            const additions = [];
            const removals = [];
            const changes = [];
            const userContext = {designId: 'DD', designVersionId: 'DV', designUpdateId: 'DU'};

            let item = testUpdateSummaryList(additions, removals, changes, userContext);

            chai.assert.equal(item.find('#summaryRemovals').length, 0, 'Removals list was found');
        });
    });

    describe('The changes list is not visible if there are no changes to existing Features or Scenarios', () => {

        it('has no changes if there are no changes', () => {
            const additions = [];
            const removals = [];
            const changes = [];
            const userContext = {designId: 'DD', designVersionId: 'DV', designUpdateId: 'DU'};

            let item = testUpdateSummaryList(additions, removals, changes, userContext);

            chai.assert.equal(item.find('#summaryChanges').length, 0, 'Changes list found');
        });
    });

    describe('A Design Update Summary is shown when a Design Update is selected', () => {

        it('summary if design update selected', () => {
            const additions = [
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
            const removals = [];
            const changes = [];
            const userContext = {designId: 'DD', designVersionId: 'DV', designUpdateId: 'DU'};  // DU selected

            let item = testUpdateSummaryList(additions, removals, changes, userContext);

            chai.assert.equal(item.find('#updateSummary').length, 1, 'Summary not found');
            chai.assert.equal(item.find('#noSummary').length, 0, 'No Summary found');
        });

        it('no summary if design update not selected', () => {
            const additions = [];
            const removals = [];
            const changes = [];
            const userContext = {designId: 'DD', designVersionId: 'DV', designUpdateId: 'NONE'};  // No DU selected

            let item = testUpdateSummaryList(additions, removals, changes, userContext);

            chai.assert.equal(item.find('#updateSummary').length, 0, 'Summary was found');
            chai.assert.equal(item.find('#noSummary').length, 1, 'No Summary not found');
        });
    });

});