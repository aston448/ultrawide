import React from 'react';

import { shallow, mount} from 'enzyme';
import { chai } from 'meteor/practicalmeteor:chai';

import { WorkPackagesList } from './WorkPackagesContainer.jsx';  // Non container wrapped

import { DesignVersionStatus, DesignUpdateStatus, RoleType, WorkPackageType } from '../../../constants/constants.js'



describe('JSX: WorkPackagesList', () => {

    function testWorkPackagesContainer(wpType, designVersionStatus, designUpdateStatus, userRole, userContext){

        const workPackages = [];
        const openWpItems = [];

        return shallow(
            <WorkPackagesList
                wpType={wpType}
                newWorkPackages={workPackages}
                availableWorkPackages={workPackages}
                adoptedWorkPackages={workPackages}
                completedWorkPackages={workPackages}
                designVersionStatus={designVersionStatus}
                designUpdateStatus={designUpdateStatus}
                userRole={userRole}
                userContext={userContext}
                openWpItems={openWpItems}
            />
        );
    }

    // Add Initial Design WP -------------------------------------------------------------------------------------------

    describe('The Work Package list for an Initial Design Version has an option to add a new Work Package', () => {

        it('has an add option for a manager on a published design version', () => {

            const wpType = WorkPackageType.WP_BASE;
            const designVersionStatus = DesignVersionStatus.VERSION_DRAFT;
            const designUpdateStatus = null;
            const userRole = RoleType.MANAGER;
            const userContext = {designVersionId: 'ABC', designUpdateId: 'NONE'};

            const item = testWorkPackagesContainer(wpType, designVersionStatus, designUpdateStatus, userRole, userContext);

            const containers = item.find('ItemContainer');

            chai.assert.equal(containers.length, 3, 'Item Containers not found');
            chai.assert.isTrue(containers.nodes[0].props.hasFooterAction, 'Expecting a footer action');
            chai.assert.isTrue(containers.nodes[0].props.footerAction.includes('Add Work Package to Design Version'), 'Expecting Add Work Package footer action');
        });
    });

    describe('Only a Manager can add new Initial Design Version Work Packages', () => {

        it('is not available for Designer', () => {

            const wpType = WorkPackageType.WP_BASE;
            const designVersionStatus = DesignVersionStatus.VERSION_DRAFT;
            const designUpdateStatus = null;
            const userRole = RoleType.DESIGNER;
            const userContext = {designVersionId: 'ABC', designUpdateId: 'NONE'};

            const item = testWorkPackagesContainer(wpType, designVersionStatus, designUpdateStatus, userRole, userContext);

            chai.assert.equal(item.find('ItemContainer').length, 3, 'Item Containers not found');
            chai.assert.isFalse(item.find('ItemContainer').nodes[0].props.hasFooterAction, 'Expecting no footer action');
        });

        it('is not available for Developer', () => {

            const wpType = WorkPackageType.WP_BASE;
            const designVersionStatus = DesignVersionStatus.VERSION_DRAFT;
            const designUpdateStatus = null;
            const userRole = RoleType.DEVELOPER;
            const userContext = {designVersionId: 'ABC', designUpdateId: 'NONE'};

            const item = testWorkPackagesContainer(wpType, designVersionStatus, designUpdateStatus, userRole, userContext);

            chai.assert.equal(item.find('ItemContainer').length, 3, 'Item Containers not found');
            chai.assert.isFalse(item.find('ItemContainer').nodes[0].props.hasFooterAction, 'Expecting no footer action');
        });
    });

    describe('A Work Package cannot be added to a New Design Version', () => {

        it('is not available for new design version', () => {

            const wpType = WorkPackageType.WP_BASE;
            const designVersionStatus = DesignVersionStatus.VERSION_NEW;
            const designUpdateStatus = null;
            const userRole = RoleType.MANAGER;
            const userContext = {designVersionId: 'ABC', designUpdateId: 'NONE'};

            const item = testWorkPackagesContainer(wpType, designVersionStatus, designUpdateStatus, userRole, userContext);

            chai.assert.equal(item.find('ItemContainer').length, 3, 'Item Containers not found');
            chai.assert.isFalse(item.find('ItemContainer').nodes[0].props.hasFooterAction, 'Expecting no footer action');
        });
    });

    describe('A Work Package cannot be added to a Complete Design Version', () => {

        it('is not available for initial complete design version', () => {

            const wpType = WorkPackageType.WP_BASE;
            const designVersionStatus = DesignVersionStatus.VERSION_DRAFT_COMPLETE;
            const designUpdateStatus = null;
            const userRole = RoleType.MANAGER;
            const userContext = {designVersionId: 'ABC', designUpdateId: 'NONE'};

            const item = testWorkPackagesContainer(wpType, designVersionStatus, designUpdateStatus, userRole, userContext);

            chai.assert.equal(item.find('ItemContainer').length, 3, 'Item Containers not found');
            chai.assert.isFalse(item.find('ItemContainer').nodes[0].props.hasFooterAction, 'Expecting no footer action');
        });

        it('is not available for updatable complete design version', () => {

            const wpType = WorkPackageType.WP_BASE;
            const designVersionStatus = DesignVersionStatus.VERSION_UPDATABLE_COMPLETE;
            const designUpdateStatus = null;
            const userRole = RoleType.MANAGER;
            const userContext = {designVersionId: 'ABC', designUpdateId: 'NONE'};

            const item = testWorkPackagesContainer(wpType, designVersionStatus, designUpdateStatus, userRole, userContext);

            chai.assert.equal(item.find('ItemContainer').length, 3, 'Item Containers not found');
            chai.assert.isFalse(item.find('ItemContainer').nodes[0].props.hasFooterAction, 'Expecting no footer action');
        });
    });

    describe('A Work Package cannot be added to an Updatable Design Version', () => {

        it('is not available for updatable design version', () => {

            const wpType = WorkPackageType.WP_BASE;
            const designVersionStatus = DesignVersionStatus.VERSION_UPDATABLE;
            const designUpdateStatus = null;
            const userRole = RoleType.MANAGER;
            const userContext = {designVersionId: 'ABC', designUpdateId: 'NONE'};

            const item = testWorkPackagesContainer(wpType, designVersionStatus, designUpdateStatus, userRole, userContext);

            chai.assert.equal(item.find('ItemContainer').length, 3, 'Item Containers not found');
            chai.assert.isFalse(item.find('ItemContainer').nodes[0].props.hasFooterAction, 'Expecting no footer action');
        });
    });

});
