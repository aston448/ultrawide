import React from 'react';

import {ScenarioTestExpectations} from "../ScenarioTestExpectationsContainer";
import { shallow } from 'enzyme';
import { chai } from 'meteor/practicalmeteor:chai';

import { hashID } from "../../../../common/utils";
import { UI } from '../../../../constants/ui_context_ids.js'
import {MashTestStatus} from "../../../../constants/constants";




describe('JSX: ScenarioTestExpectationsContainer', () => {

    function testScenarioTestExpectationsContainer(scenario){

        return shallow(<ScenarioTestExpectations
            scenario={scenario}
            scenarioUnitMashTestStatus={MashTestStatus.MASH_NO_TESTS}
            scenarioIntMashTestStatus={MashTestStatus.MASH_NO_TESTS}
            scenarioAccMashTestStatus={MashTestStatus.MASH_NO_TESTS}
        />)
    }

    describe('UC 400', () => {

        describe('Interface', function() {

            describe('Each Scenario has an option to specify expectations of Acceptance, Integration or Unit tests', function () {

                const scenario={
                    _id:                    'SCENARIO_1',
                    componentReferenceId:   'AAAA'
                };

                const item = testScenarioTestExpectationsContainer(scenario);

                it('Test Type - Unit', function () {

                    const expectedItem = hashID(UI.TEST_EXPECTATION_UNIT);
                    chai.assert.equal(item.find(expectedItem).length, 1, expectedItem + ' not found');
                });


                it('Test Type - Acceptance', function () {

                    const expectedItem = hashID(UI.TEST_EXPECTATION_ACC);
                    chai.assert.equal(item.find(expectedItem).length, 1, expectedItem + ' not found');
                });


                it('Test Type - Integration', function () {

                    const expectedItem = hashID(UI.TEST_EXPECTATION_INT);
                    chai.assert.equal(item.find(expectedItem).length, 1, expectedItem + ' not found');
                });
            });
        });
    });

});