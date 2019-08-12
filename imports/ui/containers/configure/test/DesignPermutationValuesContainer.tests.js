import React from 'react';


import { shallow, mount} from 'enzyme';
import { chai } from 'meteor/practicalmeteor:chai';

import { DesignPermutationValuesScreen } from '../DesignPermutationValuesContainer';  // Non container wrapped

import { DesignStatus, RoleType } from '../../../../constants/constants.js'
import {MashTestStatus} from "../../../../constants/constants";


describe('JSX: DesignPermutationValuesContainer', () => {

    function testPermutationValuesList(permutationValuesData, permutationId, permutationName, userRole, userContext) {

        return shallow(
            <DesignPermutationValuesScreen
                permutationValuesData={permutationValuesData}
                permutationId={permutationId}
                permutationName={permutationName}
                userRole={userRole}
                userContext={userContext}
            />
        );
    }

    describe('UC 843', function() {


        describe('Interface', function () {

            describe('There is an option to add a new value to a Design Permutation for a Designer', function () {
                it('when no permutation values', function(){

                    const permutationValuesData = [];
                    const userRole = RoleType.DESIGNER;
                    const userContext = {designVersionId: 'DV1'};
                    const permutationId = 'PERMUTATION1';
                    const permutationName = 'Permutation 1';

                    const item = testPermutationValuesList(permutationValuesData, permutationId, permutationName, userRole, userContext);

                    chai.assert(item.find('Connect(ItemList)').props().hasFooterAction, 'Expecting a footer action');
                    chai.assert.equal(item.find('Connect(ItemList)').props().footerAction, 'Add New Value', 'Expecting Add New Value footer action');
                });

                it('when permutation values exist', function(){

                    const permutationValuesData = [
                        {
                            permutationId:          'PERMUTATION1',
                            designVersionId:        'DV1',
                            permutationValueName:   'Value 1'
                        }
                    ];
                    const userRole = RoleType.DESIGNER;
                    const userContext = {designVersionId: 'DV1'};
                    const permutationId = 'PERMUTATION1';
                    const permutationName = 'Permutation 1';

                    const item = testPermutationValuesList(permutationValuesData, permutationId, permutationName, userRole, userContext);

                    chai.assert(item.find('Connect(ItemList)').props().hasFooterAction, 'Expecting a footer action');
                    chai.assert.equal(item.find('Connect(ItemList)').props().footerAction, 'Add New Value', 'Expecting Add New Value footer action');
                });
            });


            describe('The add new Permutation Value option is only visible to a Designer', function () {

                it('User Role - Developer', function () {

                    const permutationValuesData = [
                        {
                            permutationId:          'PERMUTATION1',
                            designVersionId:        'DV1',
                            permutationValueName:   'Value 1'
                        }
                    ];
                    const userRole = RoleType.DEVELOPER;
                    const userContext = {designVersionId: 'DV1'};
                    const permutationId = 'PERMUTATION1';
                    const permutationName = 'Permutation 1';

                    const item = testPermutationValuesList(permutationValuesData, permutationId, permutationName, userRole, userContext);
                    chai.assert.isFalse(item.find('Connect(ItemList)').props().hasFooterAction, 'hasFooterAction');
                });


                it('User Role - Manager', function () {

                    const permutationValuesData = [
                        {
                            permutationId:          'PERMUTATION1',
                            designVersionId:        'DV1',
                            permutationValueName:   'Value 1'
                        }
                    ];
                    const userRole = RoleType.MANAGER;
                    const userContext = {designVersionId: 'DV1'};
                    const permutationId = 'PERMUTATION1';
                    const permutationName = 'Permutation 1';

                    const item = testPermutationValuesList(permutationValuesData, permutationId, permutationName, userRole, userContext);
                    chai.assert.isFalse(item.find('Connect(ItemList)').props().hasFooterAction, 'hasFooterAction');
                });


                it('User Role - Guest', function () {

                    const permutationValuesData = [
                        {
                            permutationId:          'PERMUTATION1',
                            designVersionId:        'DV1',
                            permutationValueName:   'Value 1'
                        }
                    ];
                    const userRole = RoleType.GUEST_VIEWER;
                    const userContext = {designVersionId: 'DV1'};
                    const permutationId = 'PERMUTATION1';
                    const permutationName = 'Permutation 1';

                    const item = testPermutationValuesList(permutationValuesData, permutationId, permutationName, userRole, userContext);
                    chai.assert.isFalse(item.find('Connect(ItemList)').props().hasFooterAction, 'hasFooterAction');
                });

            });

            it('The add new Permutation Value option is only visible when a Design Permutation is selected', function () {

                const permutationValuesData = [];
                const userRole = RoleType.DESIGNER;
                const userContext = {designVersionId: 'DV1'};
                const permutationId = 'NONE';
                const permutationName = '';

                const item = testPermutationValuesList(permutationValuesData, permutationId, permutationName, userRole, userContext);

                chai.assert.isFalse(item.find('Connect(ItemList)').props().hasFooterAction, 'hasFooterAction');
            });
        });

    });
});