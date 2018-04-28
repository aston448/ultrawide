import React from 'react';


import { shallow, mount} from 'enzyme';
import { chai } from 'meteor/practicalmeteor:chai';

import { DesignVersionsList } from './DesignVersionsContainer.jsx';  // Non container wrapped

import { DesignStatus, DesignVersionStatus, RoleType } from '../../../constants/constants.js'


describe('JSX: DesignVersionsList', () => {

    function testDesignVersionsList(userRole){

        let designVersions = [];

        const designVersionUpdatable = {
            designId: 'DESIGN_1',
            designVersionName: 'Updatable',
            designVersionNumber: '1.0',
            designVersionStatus: DesignVersionStatus.VERSION_UPDATABLE
        };
        designVersions.push(designVersionUpdatable);

        const userContext = {
            designId: 'DESIGN_1',
            designVersionId: designVersionUpdatable._id
        };

        return shallow(
            <DesignVersionsList designVersions={designVersions} userRole={userRole} userContext={userContext}/>
        );

    }

     describe('A list of Design Versions is visible for the current Design', () => {

        it('is also visible to Manager', () => {

            const userRole = RoleType.MANAGER;

            const item = testDesignVersionsList(userRole);

            chai.assert.equal(item.find('Connect(ItemList)').length, 1, 'Item Container not found');

        });

        it('is also visible to Developer', () => {

            const userRole = RoleType.DEVELOPER;

            const item = testDesignVersionsList(userRole);

            chai.assert.equal(item.find('Connect(ItemList)').length, 1, 'Item Container not found');

        });

         it('is also visible to Guest Viewer', () => {

             const userRole = RoleType.GUEST_VIEWER;

             const item = testDesignVersionsList(userRole);

             chai.assert.equal(item.find('Connect(ItemList)').length, 1, 'Item Container not found');

         });

    });

});
