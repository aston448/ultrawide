import React from 'react';


import { shallow, mount} from 'enzyme';
import { chai } from 'meteor/practicalmeteor:chai';

import { DesignPermutationsScreen } from '../DesignPermutationsContainer';  // Non container wrapped

import { DesignStatus, RoleType } from '../../../../constants/constants.js'
import {MashTestStatus} from "../../../../constants/constants";


describe('JSX: DesignPermutationsContainer', () => {

    function testPermutationsList(permutationData, userRole, userContext, permutationId) {

        return shallow(
            <DesignPermutationsScreen
                permutationData={permutationData}
                userRole={userRole}
                userContext={userContext}
                permutationId={permutationId}
            />
        );
    }

    describe('UC 840', function(){

        describe('Interface', function(){

            describe('There is an option to add a new Design Permutation to a Design for a Designer', function(){

                it('when no permutations', function(){

                    const permutationData = [];
                    const userRole = RoleType.DESIGNER;
                    const userContext = {designVersionId: 'ABC'};
                    const permutationId = 'NONE';

                    const item = testPermutationsList(permutationData, userRole, userContext, permutationId);

                    chai.assert(item.find('Connect(ItemList)').props().hasFooterAction, 'Expecting a footer action');
                    chai.assert.equal(item.find('Connect(ItemList)').props().footerAction, 'Add Permutation', 'Expecting Add Design footer action');
                });

                it('when permutations exist', function(){

                    const permutationData = [
                        {
                            permutation: {
                                designId: 'Design1',
                                permutationName: 'Permutation1'
                            },
                            permutationStatus: MashTestStatus.MASH_HAS_EXPECTATIONS
                        }
                    ];
                    const userRole = RoleType.DESIGNER;
                    const userContext = {designVersionId: 'ABC'};
                    const permutationId = 'NONE';

                    const item = testPermutationsList(permutationData, userRole, userContext, permutationId);

                    chai.assert(item.find('Connect(ItemList)').props().hasFooterAction, 'Expecting a footer action');
                    chai.assert.equal(item.find('Connect(ItemList)').props().footerAction, 'Add Permutation', 'Expecting Add Design footer action');
                });

            });


            describe('The option to add a new Design Permutation is only visible for a Designer', function(){

                it('User Role - Developer', function(){

                    const permutationData = [];
                    const userRole = RoleType.DEVELOPER;
                    const userContext = {designVersionId: 'ABC'};
                    const permutationId = 'NONE';

                    const item = testPermutationsList(permutationData, userRole, userContext, permutationId);

                    chai.assert.isFalse(item.find('Connect(ItemList)').props().hasFooterAction, 'hasFooterAction');
                });


                it('User Role - Manager', function(){
                    const permutationData = [];
                    const userRole = RoleType.MANAGER;
                    const userContext = {designVersionId: 'ABC'};
                    const permutationId = 'NONE';

                    const item = testPermutationsList(permutationData, userRole, userContext, permutationId);

                    chai.assert.isFalse(item.find('Connect(ItemList)').props().hasFooterAction, 'hasFooterAction');
                });


                it('User Role - Guest', function(){
                    const permutationData = [];
                    const userRole = RoleType.GUEST_VIEWER;
                    const userContext = {designVersionId: 'ABC'};
                    const permutationId = 'NONE';

                    const item = testPermutationsList(permutationData, userRole, userContext, permutationId);

                    chai.assert.isFalse(item.find('Connect(ItemList)').props().hasFooterAction, 'hasFooterAction');
                });

            });
        });
    });

});