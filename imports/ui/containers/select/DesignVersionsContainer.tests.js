import React from 'react';


import { shallow, mount} from 'enzyme';
import { chai } from 'meteor/practicalmeteor:chai';

import { DesignVersionsList } from './DesignVersionsContainer.jsx';  // Non container wrapped
//import { Design } from '../../components/select/Design.jsx'; // Non Redux

import { DesignStatus, DesignVersionStatus, RoleType } from '../../../constants/constants.js'

import { Designs } from '../../../collections/design/designs.js'
import { DesignVersions } from '../../../collections/design/design_versions.js'


describe('JSX: DesignVersionsList', () => {

    Factory.define('design', Designs, { designName: 'Design1', isRemovable: true, designStatus: DesignStatus.DESIGN_LIVE});
    const design = Factory.create('design');

    Factory.define('designVersionUpdatable', DesignVersions, {
        designId: design._id,
        designVersionName: 'Updatable',
        designVersionNumber: '1.0',
        designVersionStatus: DesignVersionStatus.VERSION_UPDATABLE
    });
    const designVersionUpdatable = Factory.create('designVersionUpdatable');

    Factory.define('designVersionDraftComplete', DesignVersions, {
        designId: design._id,
        designVersionName: 'Draft Complete',
        designVersionNumber: '1.0',
        designVersionStatus: DesignVersionStatus.VERSION_DRAFT_COMPLETE
    });
    const designVersionDraftComplete = Factory.create('designVersionDraftComplete');

    Factory.define('designVersionUpdatableComplete', DesignVersions, {
        designId: design._id,
        designVersionName: 'Draft Complete',
        designVersionNumber: '1.0',
        designVersionStatus: DesignVersionStatus.VERSION_UPDATABLE_COMPLETE
    });

     describe('A list of Design Versions is visible for the current Design', () => {

        it('is also visible to Manager', () => {

            let designVersions = [];
            designVersions.push(designVersionUpdatable);

            const userRole = RoleType.MANAGER;
            const userContext = {
                designId: design._id,
                designVersionId: designVersionUpdatable._id
            };

            const item = shallow(
                <DesignVersionsList designVersions={designVersions} userRole={userRole} userContext={userContext}/>
            );

            chai.assert.equal(item.find('ItemList').length, 1, 'Item Container not found');

        });

        it('is also visible to Developer', () => {

            let designVersions = [];
            designVersions.push(designVersionUpdatable);

            const userRole = RoleType.DEVELOPER;
            const userContext = {
                designId: design._id,
                designVersionId: designVersionUpdatable._id
            };

            const item = shallow(
                <DesignVersionsList designVersions={designVersions} userRole={userRole} userContext={userContext}/>
            );

            chai.assert.equal(item.find('ItemList').length, 1, 'Item Container not found');

        });

    });

});
