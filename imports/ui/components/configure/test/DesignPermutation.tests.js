import React from 'react';

import { shallow } from 'enzyme';
import { chai } from 'meteor/practicalmeteor:chai';

import { DesignPermutation } from '../DesignPermutation' // Non Redux wrapped
import {getContextID, hashID} from "../../../../common/utils";
import { UI } from '../../../../constants/ui_context_ids.js'

import {
    RoleType,
    TestLocationFileStatus,
    TestLocationFileType,
    TestRunner,
    UserSettingValue
} from "../../../../constants/constants";

describe('JSX: DesignPermutation', () => {

    function testDesignPermutation(designPermutation, isInUse, userRole, userContext, currentPermutationId){

        return shallow(
            <DesignPermutation
                permutation={designPermutation}
                isInUse={isInUse}
                userRole={userRole}
                userContext={userContext}
                currentPermutationId={currentPermutationId}
            />
        );
    }

    describe('UC 841', function() {

        describe('Interface', function () {

            const designPermutation = {
                _id:                'PERMUTATION1',
                designId:           'DESIGN1',
                permutationName:    'New Permutation'
            };
            const userRole = RoleType.DESIGNER;
            const userContext = {
                designId:           'DESIGN1',
                designVersionId:    'DV1'
            };
            const currentPermutationId = 'PERMUTATION1';

            it('There is an option to edit the Design Permutation name for a Designer', function () {

                const item = testDesignPermutation(designPermutation, true, userRole, userContext, currentPermutationId);

                const expectedItem = hashID(UI.BUTTON_EDIT, designPermutation.permutationName);

                chai.assert.equal(item.find(expectedItem).length, 1, expectedItem + ' not found');
            });

            it('There is an option to save a Design Permutation name being edited', function () {

                const item = testDesignPermutation(designPermutation, true, userRole, userContext, currentPermutationId);

                // Only seen if editing
                item.setState({editing: true});

                const expectedItem = hashID(UI.BUTTON_SAVE, designPermutation.permutationName);

                chai.assert.equal(item.find(expectedItem).length, 1, expectedItem + ' not found');
            });

            it('There is an option to discard a Design Permutation name being edited', function () {

                const item = testDesignPermutation(designPermutation, true, userRole, userContext, currentPermutationId);

                // Only seen if editing
                item.setState({editing: true});

                const expectedItem = hashID(UI.BUTTON_CANCEL, designPermutation.permutationName);

                chai.assert.equal(item.find(expectedItem).length, 1, expectedItem + ' not found');
            });


            describe('The edit Design Permutation option is only visible for a Designer', function () {

                const designPermutation = {
                    _id:                'PERMUTATION1',
                    designId:           'DESIGN1',
                    permutationName:    'New Permutation'
                };
                const userContext = {
                    designId:           'DESIGN1',
                    designVersionId:    'DV1'
                };
                const currentPermutationId = 'PERMUTATION1';

                it('User Role - Developer', function () {

                    const userRole = RoleType.DEVELOPER;

                    const item = testDesignPermutation(designPermutation, true, userRole, userContext, currentPermutationId);

                    const expectedItem = hashID(UI.BUTTON_EDIT, designPermutation.permutationName);

                    chai.assert.equal(item.find(expectedItem).length, 0, expectedItem + ' was found');
                });


                it('User Role - Manager', function () {

                    const userRole = RoleType.MANAGER;

                    const item = testDesignPermutation(designPermutation, true, userRole, userContext, currentPermutationId);

                    const expectedItem = hashID(UI.BUTTON_EDIT, designPermutation.permutationName);

                    chai.assert.equal(item.find(expectedItem).length, 0, expectedItem + ' was found');
                });


                it('User Role - Guest', function () {

                    const userRole = RoleType.GUEST_VIEWER;

                    const item = testDesignPermutation(designPermutation, true, userRole, userContext, currentPermutationId);

                    const expectedItem = hashID(UI.BUTTON_EDIT, designPermutation.permutationName);

                    chai.assert.equal(item.find(expectedItem).length, 0, expectedItem + ' was found');
                });

            });
        });

    });

    describe('UC 842', function() {

        describe('Interface', function () {

            const designPermutation = {
                _id:                'PERMUTATION1',
                designId:           'DESIGN1',
                permutationName:    'New Permutation'
            };
            const userContext = {
                designId:           'DESIGN1',
                designVersionId:    'DV1'
            };
            const currentPermutationId = 'PERMUTATION1';

            it('There is an option to remove a Design Permutation for a Designer', function () {

                const userRole = RoleType.DESIGNER;

                const item = testDesignPermutation(designPermutation, true, userRole, userContext, currentPermutationId);

                const expectedItem = hashID(UI.BUTTON_REMOVE, designPermutation.permutationName);

                chai.assert.equal(item.find(expectedItem).length, 1, expectedItem + ' not found');
            });


            describe('The remove Design Permutation option is only visible for a Designer', function () {

                it('User Role - Developer', function () {

                    const userRole = RoleType.DEVELOPER;

                    const item = testDesignPermutation(designPermutation, true, userRole, userContext, currentPermutationId);

                    const expectedItem = hashID(UI.BUTTON_REMOVE, designPermutation.permutationName);

                    chai.assert.equal(item.find(expectedItem).length, 0, expectedItem + ' was found');
                });


                it('User Role - Manager', function () {

                    const userRole = RoleType.MANAGER;

                    const item = testDesignPermutation(designPermutation, true, userRole, userContext, currentPermutationId);

                    const expectedItem = hashID(UI.BUTTON_REMOVE, designPermutation.permutationName);

                    chai.assert.equal(item.find(expectedItem).length, 0, expectedItem + ' was found');
                });


                it('User Role - Guest', function () {

                    const userRole = RoleType.GUEST_VIEWER;

                    const item = testDesignPermutation(designPermutation, true, userRole, userContext, currentPermutationId);

                    const expectedItem = hashID(UI.BUTTON_REMOVE, designPermutation.permutationName);

                    chai.assert.equal(item.find(expectedItem).length, 0, expectedItem + ' was found');
                });

            });
        });
    });

    describe('UC 846', function(){

        const designPermutation = {
            _id:                'PERMUTATION1',
            designId:           'DESIGN1',
            permutationName:    'New Permutation'
        };
        const userContext = {
            designId:           'DESIGN1',
            designVersionId:    'DV1'
        };
        const currentPermutationId = 'PERMUTATION1';

        describe('Interface', function(){

            describe('Design Permutations that are not in use for Scenario test requirements are greyed out', function(){

                it('unused', function () {

                    const userRole = RoleType.DESIGNER;

                    const item = testDesignPermutation(designPermutation, false, userRole, userContext, currentPermutationId);

                    const expectedItem = 'permutation-unused';

                    chai.assert.equal(item.find('.' + expectedItem).length, 1, expectedItem + ' not found');
                });

                it('used', function () {

                    const userRole = RoleType.DESIGNER;

                    const item = testDesignPermutation(designPermutation, true, userRole, userContext, currentPermutationId);

                    const expectedItem = 'permutation-unused';

                    chai.assert.equal(item.find('.' + expectedItem).length, 0, expectedItem + ' was found');
                });
            });
        });
    });

    describe('UC 847', function(){

        const userRole = RoleType.DESIGNER;
        const designPermutation = {
            _id:                'PERMUTATION1',
            designId:           'DESIGN1',
            permutationName:    'New Permutation'
        };
        const userContext = {
            designId:           'DESIGN1',
            designVersionId:    'DV1'
        };

        describe('A selected Design Permutation is shown as the current Design Permutation', function(){

            it('selected', function () {

                // Current perm is this one
                const currentPermutationId = 'PERMUTATION1';

                const item = testDesignPermutation(designPermutation, true, userRole, userContext, currentPermutationId);

                const expectedItem = 'item-active';

                chai.assert.equal(item.find('.' + expectedItem).length, 1, expectedItem + ' not found');
            });

            it('unselected', function () {

                // Current perm is not this one
                const currentPermutationId = 'PERMUTATION2';

                const item = testDesignPermutation(designPermutation, true, userRole, userContext, currentPermutationId);

                const expectedItem = 'item-active';

                chai.assert.equal(item.find('.' + expectedItem).length, 0, expectedItem + ' was found');
            });
        });
    });
});