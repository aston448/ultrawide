
import {ScenarioTestExpectationValidationServices} from "../scenario_test_expectation_validation_services";
import { RoleType}     from '../../../constants/constants.js';
import { Validation, TestExpectationValidationErrors }   from '../../../constants/validation_errors.js';

import { chai } from 'meteor/practicalmeteor:chai';

describe('VAL: User Management', () => {

    describe('UC 400', function(){

        describe('Only a Designer may set a test type as expected for a Scenario', function(){

            it('User Role - Developer', function(){

                const expectation = TestExpectationValidationErrors.EXPECTATION_ADD_INVALID_ROLE;
                const result = ScenarioTestExpectationValidationServices.validateAddTestTypeExpectation(RoleType.DEVELOPER);

                chai.assert.equal(result, expectation);
            });


            it('User Role - Manager', function(){

                const expectation = TestExpectationValidationErrors.EXPECTATION_ADD_INVALID_ROLE;
                const result = ScenarioTestExpectationValidationServices.validateAddTestTypeExpectation(RoleType.MANAGER);

                chai.assert.equal(result, expectation);
            });


            it('User Role - Guest', function(){

                const expectation = TestExpectationValidationErrors.EXPECTATION_ADD_INVALID_ROLE;
                const result = ScenarioTestExpectationValidationServices.validateAddTestTypeExpectation(RoleType.GUEST_VIEWER);

                chai.assert.equal(result, expectation);
            });

        });
    });
});
