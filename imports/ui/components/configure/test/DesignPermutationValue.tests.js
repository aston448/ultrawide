import React from 'react';

import { shallow } from 'enzyme';
import { chai } from 'meteor/practicalmeteor:chai';

import { DesignPermutationValue } from '../DesignPermutationValue' // Non Redux wrapped
import { hashID} from "../../../../common/utils";
import { UI } from '../../../../constants/ui_context_ids.js'

import {
    RoleType
} from "../../../../constants/constants";

describe('JSX: DesignPermutation', () => {

    function testDesignPermutationValue(permutationValue, userRole, userContext, currentPermutationValueId){

        return shallow(
            <DesignPermutationValue
                permutationValue={permutationValue}
                userRole={userRole}
                userContext={userContext}
                currentPermutationValueId={currentPermutationValueId}
            />
        );
    }

    describe('UC 844 - Edit Design Permutation Value', function(){

        describe('Interface', function(){

            const designPermutationValue = {
                _id:                    'PV1',
                permutationId:          'DP1',
                designVersionId:        'DV1',
                permutationValueName:   'Value 1'
            };
            const userRole = RoleType.DESIGNER;
            const userContext = {
                designId:           'DESIGN1',
                designVersionId:    'DV1'
            };
            const currentPermutationValueId = 'PV1';

            it('There is an option to edit a Permutation Value name for a Designer', function(){

                const item = testDesignPermutationValue(designPermutationValue, userRole, userContext, currentPermutationValueId);

                const expectedItem = hashID(UI.BUTTON_EDIT, designPermutationValue.permutationValueName);

                chai.assert.equal(item.find(expectedItem).length, 1, expectedItem + ' not found');
            });

            it('There is an option to save a Permutation Value name being edited', function(){

                const item = testDesignPermutationValue(designPermutationValue, userRole, userContext, currentPermutationValueId);

                // Only seen if editing
                item.setState({editing: true});

                const expectedItem = hashID(UI.BUTTON_SAVE, designPermutationValue.permutationValueName);

                chai.assert.equal(item.find(expectedItem).length, 1, expectedItem + ' not found');
            });

            it('There is an option to discard a Permutation Value name being edited', function(){

                const item = testDesignPermutationValue(designPermutationValue, userRole, userContext, currentPermutationValueId);

                // Only seen if editing
                item.setState({editing: true});

                const expectedItem = hashID(UI.BUTTON_CANCEL, designPermutationValue.permutationValueName);

                chai.assert.equal(item.find(expectedItem).length, 1, expectedItem + ' not found');
            });

            describe('The edit Permutation Value name option is only visible to a Designer', function(){

                const designPermutationValue = {
                    _id:                    'PV1',
                    permutationId:          'DP1',
                    designVersionId:        'DV1',
                    permutationValueName:   'Value 1'
                };

                const userContext = {
                    designId:           'DESIGN1',
                    designVersionId:    'DV1'
                };
                const currentPermutationValueId = 'PV1';

                it('User Role - Developer', function(){

                    const userRole = RoleType.DEVELOPER;

                    const item = testDesignPermutationValue(designPermutationValue, userRole, userContext, currentPermutationValueId);

                    const expectedItem = hashID(UI.BUTTON_EDIT, designPermutationValue.permutationValueName);

                    chai.assert.equal(item.find(expectedItem).length, 0, expectedItem + ' was found');
                });


                it('User Role - Manager', function(){

                    const userRole = RoleType.MANAGER;

                    const item = testDesignPermutationValue(designPermutationValue, userRole, userContext, currentPermutationValueId);

                    const expectedItem = hashID(UI.BUTTON_EDIT, designPermutationValue.permutationValueName);

                    chai.assert.equal(item.find(expectedItem).length, 0, expectedItem + ' was found');
                });


                it('User Role - Guest', function(){

                    const userRole = RoleType.GUEST_VIEWER;

                    const item = testDesignPermutationValue(designPermutationValue, userRole, userContext, currentPermutationValueId);

                    const expectedItem = hashID(UI.BUTTON_EDIT, designPermutationValue.permutationValueName);

                    chai.assert.equal(item.find(expectedItem).length, 0, expectedItem + ' was found');
                });

            });
        });
    });

    describe('UC 845 - Remove Design Permutation Value', function(){

        describe('Interface', function(){

            const designPermutationValue = {
                _id:                    'PV1',
                permutationId:          'DP1',
                designVersionId:        'DV1',
                permutationValueName:   'Value 1'
            };
            const userContext = {
                designId:           'DESIGN1',
                designVersionId:    'DV1'
            };
            const currentPermutationValueId = 'PV1';

            it('There is an option to remove a Permutation Value from a Design Permutation for a Designer', function(){

                const userRole = RoleType.DESIGNER;

                const item = testDesignPermutationValue(designPermutationValue, userRole, userContext, currentPermutationValueId);

                const expectedItem = hashID(UI.BUTTON_REMOVE, designPermutationValue.permutationValueName);

                chai.assert.equal(item.find(expectedItem).length, 1, expectedItem + ' not found');
            });

            describe('The remove Permutation Value option is only visible to a Designer', function(){

                it('User Role - Developer', function(){

                    const userRole = RoleType.DEVELOPER;

                    const item = testDesignPermutationValue(designPermutationValue, userRole, userContext, currentPermutationValueId);

                    const expectedItem = hashID(UI.BUTTON_REMOVE, designPermutationValue.permutationValueName);

                    chai.assert.equal(item.find(expectedItem).length, 0, expectedItem + ' was found');
                });

                it('User Role - Manager', function(){

                    const userRole = RoleType.MANAGER;

                    const item = testDesignPermutationValue(designPermutationValue, userRole, userContext, currentPermutationValueId);

                    const expectedItem = hashID(UI.BUTTON_REMOVE, designPermutationValue.permutationValueName);

                    chai.assert.equal(item.find(expectedItem).length, 0, expectedItem + ' was found');
                });

                it('User Role - Guest', function(){

                    const userRole = RoleType.GUEST_VIEWER;

                    const item = testDesignPermutationValue(designPermutationValue, userRole, userContext, currentPermutationValueId);

                    const expectedItem = hashID(UI.BUTTON_REMOVE, designPermutationValue.permutationValueName);

                    chai.assert.equal(item.find(expectedItem).length, 0, expectedItem + ' was found');
                });
            });
        });

    });

    describe('UC 847', function(){

        describe('Interface', function(){

            it.skip('A Design Permutation value that is not in use for any Scenario test requirement is shown as greyed out', function(){
                // Replace this with test code
                // Remove skip once implemented
            });

            describe('A selected Permutation Value is shown as the current Permutation Value', function(){

                const userRole = RoleType.DESIGNER;
                const designPermutationValue = {
                    _id:                    'PV1',
                    permutationId:          'DP1',
                    designVersionId:        'DV1',
                    permutationValueName:   'Value 1'
                };
                const userContext = {
                    designId:           'DESIGN1',
                    designVersionId:    'DV1'
                };

                it('selected', function () {

                    // Current perm is this one
                    const currentPermutationValueId = 'PV1';

                    const item = testDesignPermutationValue(designPermutationValue, userRole, userContext, currentPermutationValueId);

                    const expectedItem = 'item-active';

                    chai.assert.equal(item.find('.' + expectedItem).length, 1, expectedItem + ' not found');
                });

                it('unselected', function () {

                    // Current perm is not this one
                    const currentPermutationValueId = 'PV2';

                    const item = testDesignPermutationValue(designPermutationValue, userRole, userContext, currentPermutationValueId);

                    const expectedItem = 'item-active';

                    chai.assert.equal(item.find('.' + expectedItem).length, 0, expectedItem + ' was found');
                });
            });

        });
    });

});