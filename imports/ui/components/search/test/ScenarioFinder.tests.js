import React from 'react';

import { shallow } from 'enzyme';
import { chai } from 'meteor/practicalmeteor:chai';

import {ScenarioFinder} from '../ScenarioFinder.jsx';

import {hashID} from "../../../../common/utils";
import {UI} from "../../../../constants/ui_context_ids";
import {DisplayContext} from '../../../../constants/constants.js'

describe('JSX: Scenario Finder', () => {

    const DEFAULT_DV_CONTEXT = {
        userId:                         'USER1',
        designId:                       'DESIGN1',
        designVersionId:                'DESIGN_VERSION1',
        designUpdateId:                 'NONE',
        workPackageId:                  'NONE',
        designComponentId:              'NONE',
        designComponentType:            'NONE',
        featureReferenceId:             'NONE',
        featureAspectReferenceId:       'NONE',
        scenarioReferenceId:            'NONE',
        scenarioStepId:                 'NONE',
    };

    const DEFAULT_DU_CONTEXT = {
        userId:                         'USER1',
        designId:                       'DESIGN1',
        designVersionId:                'DESIGN_VERSION1',
        designUpdateId:                 'DESIGN_UPDATE1',
        workPackageId:                  'NONE',
        designComponentId:              'NONE',
        designComponentType:            'NONE',
        featureReferenceId:             'NONE',
        featureAspectReferenceId:       'NONE',
        scenarioReferenceId:            'NONE',
        scenarioStepId:                 'NONE',
    };

    function testScenarioFinder(displayContext, userContext){

        return shallow(
            <ScenarioFinder
                displayContext={displayContext}
                userContext={userContext}
            />
        )
    }

    describe('Interface', () => {

        describe('There is an input for a Scenario search string', () => {

            it('has input for design', () => {

                const displayContext = DisplayContext.BASE_VIEW;

                const item = testScenarioFinder(displayContext, DEFAULT_DV_CONTEXT);

                chai.assert(item.find(hashID(UI.INPUT_SCENARIO_SEARCH, '')).length === 1, 'Input not found');
            });

            it('has input for design update', () => {

                const displayContext = DisplayContext.UPDATE_SCOPE;

                const item = testScenarioFinder(displayContext, DEFAULT_DU_CONTEXT);

                chai.assert(item.find(hashID(UI.INPUT_SCENARIO_SEARCH, '')).length === 1, 'Input not found');
            });
        });

        describe('There is a list containing matching Scenarios', () => {

            it('has output for design', () => {

                const displayContext = DisplayContext.BASE_VIEW;

                const item = testScenarioFinder(displayContext, DEFAULT_DV_CONTEXT);

                chai.assert(item.find(hashID(UI.OUTPUT_SCENARIO_SEARCH, '')).length === 1, 'Output not found');
            });

            it('has output for design update', () => {

                const displayContext = DisplayContext.UPDATE_SCOPE;

                const item = testScenarioFinder(displayContext, DEFAULT_DU_CONTEXT);

                chai.assert(item.find(hashID(UI.OUTPUT_SCENARIO_SEARCH, '')).length === 1, 'Output not found');
            });
        });

    });
});
