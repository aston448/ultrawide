
import React from 'react';

import { shallow } from 'enzyme';
import { chai } from 'meteor/practicalmeteor:chai';

import { WorkPackage } from './WorkPackage.jsx';  // Non Redux wrapped

import { WorkPackageStatus, RoleType } from '../../../constants/constants.js'

describe('JSX: WorkPackage', () => {

    // WP Select -----------------------------------------------------------------------------------------------------

    describe('When a Work Package is selected it is highlighted in the Work Package list', () => {

        it('is highlighted when it is the current work package', () => {

            const workPackage = {_id: 'WP1', workPackageStatus: WorkPackageStatus.WP_NEW};
            const userRole = RoleType.MANAGER;
            const userContext = {designVersionId: 'ABC', designUpdateId: 'DEF', workPackageId: 'WP1'};
            const viewOptions = {};

            const item = shallow(
                <WorkPackage
                    workPackage={workPackage}
                    userRole={userRole}
                    userContext={userContext}
                    viewOptions={viewOptions}
                />
            );

            chai.assert.equal(item.find('#workPackageItem').props().className, 'design-item di-active', 'Not highlighted');
        });

        it('is not highlighted when it is not the current work package', () => {

            const workPackage = {_id: 'WP1', workPackageStatus: WorkPackageStatus.WP_NEW};
            const userRole = RoleType.MANAGER;
            const userContext = {designVersionId: 'ABC', designUpdateId: 'DEF', workPackageId: 'WP2'};  // Different WP selected
            const viewOptions = {};

            const item = shallow(
                <WorkPackage
                    workPackage={workPackage}
                    userRole={userRole}
                    userContext={userContext}
                    viewOptions={viewOptions}
                />
            );

            chai.assert.notEqual(item.find('#workPackageItem').props().className, 'design-item di-active', 'Is highlighted');
        });
    });

    // WP Publish ------------------------------------------------------------------------------------------------------

    describe('A Work Package has an option to publish it', () => {

        it('has a publish option for new work package', () => {

            const workPackage = {workPackageStatus: WorkPackageStatus.WP_NEW};
            const userRole = RoleType.MANAGER;
            const userContext = {designVersionId: 'ABC', designUpdateId: 'DEF'};
            const viewOptions = {};

            const item = shallow(
                <WorkPackage
                    workPackage={workPackage}
                    userRole={userRole}
                    userContext={userContext}
                    viewOptions={viewOptions}
                />
            );

            chai.assert(item.find('#butPublish').length === 1, 'Publish option not found!');

        });

    });

    describe('Only a Manager can publish a New Work Package', () => {

        it('has no publish option for Designer', () => {

            const workPackage = {workPackageStatus: WorkPackageStatus.WP_NEW};
            const userRole = RoleType.DESIGNER;
            const userContext = {designVersionId: 'ABC', designUpdateId: 'DEF'};
            const viewOptions = {};

            const item = shallow(
                <WorkPackage
                    workPackage={workPackage}
                    userRole={userRole}
                    userContext={userContext}
                    viewOptions={viewOptions}
                />
            );

            chai.assert(item.find('#butPublish').length === 0, 'Publish option found!');

        });

        it('has no publish option for Developer', () => {

            const workPackage = {workPackageStatus: WorkPackageStatus.WP_NEW};
            const userRole = RoleType.DEVELOPER;
            const userContext = {designVersionId: 'ABC', designUpdateId: 'DEF'};
            const viewOptions = {};

            const item = shallow(
                <WorkPackage
                    workPackage={workPackage}
                    userRole={userRole}
                    userContext={userContext}
                    viewOptions={viewOptions}
                />
            );

            chai.assert(item.find('#butPublish').length === 0, 'Publish option found!');

        });

    });

    describe('Only a New Work Package can be published', () => {

        it('has no publish option for available', () => {

            const workPackage = {workPackageStatus: WorkPackageStatus.WP_AVAILABLE};
            const userRole = RoleType.MANAGER;
            const userContext = {designVersionId: 'ABC', designUpdateId: 'DEF'};
            const viewOptions = {};

            const item = shallow(
                <WorkPackage
                    workPackage={workPackage}
                    userRole={userRole}
                    userContext={userContext}
                    viewOptions={viewOptions}
                />
            );

            chai.assert(item.find('#butPublish').length === 0, 'Publish option found!');

        });

        it('has no publish option for adopted', () => {

            const workPackage = {workPackageStatus: WorkPackageStatus.WP_ADOPTED};
            const userRole = RoleType.MANAGER;
            const userContext = {designVersionId: 'ABC', designUpdateId: 'DEF'};
            const viewOptions = {};

            const item = shallow(
                <WorkPackage
                    workPackage={workPackage}
                    userRole={userRole}
                    userContext={userContext}
                    viewOptions={viewOptions}
                />
            );

            chai.assert(item.find('#butPublish').length === 0, 'Publish option found!');

        });

    });

    // WP Withdraw -----------------------------------------------------------------------------------------------------

    describe('An Available Work Package has an option to withdraw it', () => {

        it('has a withdraw option for available work package', () => {

            const workPackage = {workPackageStatus: WorkPackageStatus.WP_AVAILABLE};
            const userRole = RoleType.MANAGER;
            const userContext = {designVersionId: 'ABC', designUpdateId: 'DEF'};
            const viewOptions = {};

            const item = shallow(
                <WorkPackage
                    workPackage={workPackage}
                    userRole={userRole}
                    userContext={userContext}
                    viewOptions={viewOptions}
                />
            );

            chai.assert(item.find('#butWithdraw').length === 1, 'Withdraw option not found!');

        });

    });

    describe('Only a Manager can withdraw a New Work Package', () => {

        it('has no withdraw option for Designer', () => {

            const workPackage = {workPackageStatus: WorkPackageStatus.WP_AVAILABLE};
            const userRole = RoleType.DESIGNER;
            const userContext = {designVersionId: 'ABC', designUpdateId: 'DEF'};
            const viewOptions = {};

            const item = shallow(
                <WorkPackage
                    workPackage={workPackage}
                    userRole={userRole}
                    userContext={userContext}
                    viewOptions={viewOptions}
                />
            );

            chai.assert(item.find('#butWithdraw').length === 0, 'Withdraw option found!');

        });

        it('has no withdraw option for Developer', () => {

            const workPackage = {workPackageStatus: WorkPackageStatus.WP_AVAILABLE};
            const userRole = RoleType.DEVELOPER;
            const userContext = {designVersionId: 'ABC', designUpdateId: 'DEF'};
            const viewOptions = {};

            const item = shallow(
                <WorkPackage
                    workPackage={workPackage}
                    userRole={userRole}
                    userContext={userContext}
                    viewOptions={viewOptions}
                />
            );

            chai.assert(item.find('#butWithdraw').length === 0, 'Withdraw option found!');

        });

    });

    describe('Only a published and not adopted Work Package can be withdrawn', () => {

        it('has no withdraw option for new', () => {

            const workPackage = {workPackageStatus: WorkPackageStatus.WP_NEW};
            const userRole = RoleType.MANAGER;
            const userContext = {designVersionId: 'ABC', designUpdateId: 'DEF'};
            const viewOptions = {};

            const item = shallow(
                <WorkPackage
                    workPackage={workPackage}
                    userRole={userRole}
                    userContext={userContext}
                    viewOptions={viewOptions}
                />
            );

            chai.assert(item.find('#butWithdraw').length === 0, 'Withdraw option found!');

        });

        it('has no withdraw option for adopted', () => {

            const workPackage = {workPackageStatus: WorkPackageStatus.WP_ADOPTED};
            const userRole = RoleType.MANAGER;
            const userContext = {designVersionId: 'ABC', designUpdateId: 'DEF'};
            const viewOptions = {};

            const item = shallow(
                <WorkPackage
                    workPackage={workPackage}
                    userRole={userRole}
                    userContext={userContext}
                    viewOptions={viewOptions}
                />
            );

            chai.assert(item.find('#butWithdraw').length === 0, 'Withdraw option found!');

        });

    });

    // WP Remove -------------------------------------------------------------------------------------------------------

    describe('A Work Package has an option to remove it from the list', () => {

        it('has a remove option for new work package', () => {

            const workPackage = {workPackageStatus: WorkPackageStatus.WP_NEW};
            const userRole = RoleType.MANAGER;
            const userContext = {designVersionId: 'ABC', designUpdateId: 'DEF'};
            const viewOptions = {};

            const item = shallow(
                <WorkPackage
                    workPackage={workPackage}
                    userRole={userRole}
                    userContext={userContext}
                    viewOptions={viewOptions}
                />
            );

            chai.assert(item.find('#butRemove').length === 1, 'Remove option not found!');

        });

    });

    describe('Only a Manager may remove a Work Package', () => {

        it('has no remove option for Designer', () => {

            const workPackage = {workPackageStatus: WorkPackageStatus.WP_NEW};
            const userRole = RoleType.DESIGNER;
            const userContext = {designVersionId: 'ABC', designUpdateId: 'DEF'};
            const viewOptions = {};

            const item = shallow(
                <WorkPackage
                    workPackage={workPackage}
                    userRole={userRole}
                    userContext={userContext}
                    viewOptions={viewOptions}
                />
            );

            chai.assert(item.find('#butRemove').length === 0, 'Remove option found!');

        });

        it('has no remove option for Developer', () => {

            const workPackage = {workPackageStatus: WorkPackageStatus.WP_NEW};
            const userRole = RoleType.DEVELOPER;
            const userContext = {designVersionId: 'ABC', designUpdateId: 'DEF'};
            const viewOptions = {};

            const item = shallow(
                <WorkPackage
                    workPackage={workPackage}
                    userRole={userRole}
                    userContext={userContext}
                    viewOptions={viewOptions}
                />
            );

            chai.assert(item.find('#butRemove').length === 0, 'Remove option found!');

        });

    });

    describe('Only a New Work Package may be removed', () => {

        it('has no remove option for available', () => {

            const workPackage = {workPackageStatus: WorkPackageStatus.WP_AVAILABLE};
            const userRole = RoleType.MANAGER;
            const userContext = {designVersionId: 'ABC', designUpdateId: 'DEF'};
            const viewOptions = {};

            const item = shallow(
                <WorkPackage
                    workPackage={workPackage}
                    userRole={userRole}
                    userContext={userContext}
                    viewOptions={viewOptions}
                />
            );

            chai.assert(item.find('#butRemove').length === 0, 'Remove option found!');

        });

        it('has no remove option for adopted', () => {

            const workPackage = {workPackageStatus: WorkPackageStatus.WP_ADOPTED};
            const userRole = RoleType.MANAGER;
            const userContext = {designVersionId: 'ABC', designUpdateId: 'DEF'};
            const viewOptions = {};

            const item = shallow(
                <WorkPackage
                    workPackage={workPackage}
                    userRole={userRole}
                    userContext={userContext}
                    viewOptions={viewOptions}
                />
            );

            chai.assert(item.find('#butRemove').length === 0, 'Remove option found!');

        });

    });

    // WP Edit ---------------------------------------------------------------------------------------------------------

    describe('A Work Package has an option to edit its content', () => {

        it('has an edit option for new work package', () => {

            const workPackage = {workPackageStatus: WorkPackageStatus.WP_NEW};
            const userRole = RoleType.MANAGER;
            const userContext = {designVersionId: 'ABC', designUpdateId: 'DEF'};
            const viewOptions = {};

            const item = shallow(
                <WorkPackage
                    workPackage={workPackage}
                    userRole={userRole}
                    userContext={userContext}
                    viewOptions={viewOptions}
                />
            );

            chai.assert(item.find('#butEdit').length === 1, 'Edit option not found!');

        });

        it('has an edit option for published work package', () => {

            const workPackage = {workPackageStatus: WorkPackageStatus.WP_AVAILABLE};
            const userRole = RoleType.MANAGER;
            const userContext = {designVersionId: 'ABC', designUpdateId: 'DEF'};
            const viewOptions = {};

            const item = shallow(
                <WorkPackage
                    workPackage={workPackage}
                    userRole={userRole}
                    userContext={userContext}
                    viewOptions={viewOptions}
                />
            );

            chai.assert(item.find('#butEdit').length === 1, 'Edit option not found!');

        });

        it('has an edit option for adopted work package', () => {

            const workPackage = {workPackageStatus: WorkPackageStatus.WP_ADOPTED};
            const userRole = RoleType.MANAGER;
            const userContext = {designVersionId: 'ABC', designUpdateId: 'DEF'};
            const viewOptions = {};

            const item = shallow(
                <WorkPackage
                    workPackage={workPackage}
                    userRole={userRole}
                    userContext={userContext}
                    viewOptions={viewOptions}
                />
            );

            chai.assert(item.find('#butEdit').length === 1, 'Edit option not found!');

        });

    });

    describe('Only a Manager may edit a Work Package content', () => {

        it('is not editable by Designer', () => {

            const workPackage = {workPackageStatus: WorkPackageStatus.WP_AVAILABLE};
            const userRole = RoleType.DESIGNER;
            const userContext = {designVersionId: 'ABC', designUpdateId: 'DEF'};
            const viewOptions = {};

            const item = shallow(
                <WorkPackage
                    workPackage={workPackage}
                    userRole={userRole}
                    userContext={userContext}
                    viewOptions={viewOptions}
                />
            );

            chai.assert(item.find('#butEdit').length === 0, 'Edit option found!');
        });

        it('is not editable by Developer', () => {

            const workPackage = {workPackageStatus: WorkPackageStatus.WP_AVAILABLE};
            const userRole = RoleType.DEVELOPER;
            const userContext = {designVersionId: 'ABC', designUpdateId: 'DEF'};
            const viewOptions = {};

            const item = shallow(
                <WorkPackage
                    workPackage={workPackage}
                    userRole={userRole}
                    userContext={userContext}
                    viewOptions={viewOptions}
                />
            );

            chai.assert(item.find('#butEdit').length === 0, 'Edit option found!');
        });
    });

    // WP View ---------------------------------------------------------------------------------------------------------

    describe('A Work Package has an option to view its content', () => {

        it('has a view option for new work package for manager', () => {

            const workPackage = {workPackageStatus: WorkPackageStatus.WP_NEW};
            const userRole = RoleType.MANAGER;
            const userContext = {designVersionId: 'ABC', designUpdateId: 'DEF'};
            const viewOptions = {};

            const item = shallow(
                <WorkPackage
                    workPackage={workPackage}
                    userRole={userRole}
                    userContext={userContext}
                    viewOptions={viewOptions}
                />
            );

            chai.assert(item.find('#butView').length === 1, 'View option not found!');

        });

        it('has a view option for published work package for manager', () => {

            const workPackage = {workPackageStatus: WorkPackageStatus.WP_AVAILABLE};
            const userRole = RoleType.MANAGER;
            const userContext = {designVersionId: 'ABC', designUpdateId: 'DEF'};
            const viewOptions = {};

            const item = shallow(
                <WorkPackage
                    workPackage={workPackage}
                    userRole={userRole}
                    userContext={userContext}
                    viewOptions={viewOptions}
                />
            );

            chai.assert(item.find('#butView').length === 1, 'View option not found!');

        });

        it('has a view option for adopted work package for manager', () => {

            const workPackage = {workPackageStatus: WorkPackageStatus.WP_ADOPTED};
            const userRole = RoleType.MANAGER;
            const userContext = {designVersionId: 'ABC', designUpdateId: 'DEF'};
            const viewOptions = {};

            const item = shallow(
                <WorkPackage
                    workPackage={workPackage}
                    userRole={userRole}
                    userContext={userContext}
                    viewOptions={viewOptions}
                />
            );

            chai.assert(item.find('#butView').length === 1, 'View option not found!');

        });

        it('has a view option for published work package for designer', () => {

            const workPackage = {workPackageStatus: WorkPackageStatus.WP_AVAILABLE};
            const userRole = RoleType.DESIGNER;
            const userContext = {designVersionId: 'ABC', designUpdateId: 'DEF'};
            const viewOptions = {};

            const item = shallow(
                <WorkPackage
                    workPackage={workPackage}
                    userRole={userRole}
                    userContext={userContext}
                    viewOptions={viewOptions}
                />
            );

            chai.assert(item.find('#butView').length === 1, 'View option not found!');

        });

        it('has a view option for adopted work package for designer', () => {

            const workPackage = {workPackageStatus: WorkPackageStatus.WP_ADOPTED};
            const userRole = RoleType.DESIGNER;
            const userContext = {designVersionId: 'ABC', designUpdateId: 'DEF'};
            const viewOptions = {};

            const item = shallow(
                <WorkPackage
                    workPackage={workPackage}
                    userRole={userRole}
                    userContext={userContext}
                    viewOptions={viewOptions}
                />
            );

            chai.assert(item.find('#butView').length === 1, 'View option not found!');

        });

        it('has a view option for published work package for developer', () => {

            const workPackage = {workPackageStatus: WorkPackageStatus.WP_AVAILABLE};
            const userRole = RoleType.DEVELOPER;
            const userContext = {designVersionId: 'ABC', designUpdateId: 'DEF'};
            const viewOptions = {};

            const item = shallow(
                <WorkPackage
                    workPackage={workPackage}
                    userRole={userRole}
                    userContext={userContext}
                    viewOptions={viewOptions}
                />
            );

            chai.assert(item.find('#butView').length === 1, 'View option not found!');

        });

        it('has a view option for adopted work package for developer', () => {

            const workPackage = {workPackageStatus: WorkPackageStatus.WP_ADOPTED};
            const userRole = RoleType.DEVELOPER;
            const userContext = {designVersionId: 'ABC', designUpdateId: 'DEF'};
            const viewOptions = {};

            const item = shallow(
                <WorkPackage
                    workPackage={workPackage}
                    userRole={userRole}
                    userContext={userContext}
                    viewOptions={viewOptions}
                />
            );

            chai.assert(item.find('#butView').length === 1, 'View option not found!');

        });

    });

    describe('Only a Manager may view a New Work Package', () => {

        it('is not viewable by Designer', () => {

            const workPackage = {workPackageStatus: WorkPackageStatus.WP_NEW};
            const userRole = RoleType.DESIGNER;
            const userContext = {designVersionId: 'ABC', designUpdateId: 'DEF'};
            const viewOptions = {};

            const item = shallow(
                <WorkPackage
                    workPackage={workPackage}
                    userRole={userRole}
                    userContext={userContext}
                    viewOptions={viewOptions}
                />
            );

            chai.assert(item.find('#butView').length === 0, 'View option found!');
        });

        it('is not viewable by Developer', () => {

            const workPackage = {workPackageStatus: WorkPackageStatus.WP_NEW};
            const userRole = RoleType.DEVELOPER;
            const userContext = {designVersionId: 'ABC', designUpdateId: 'DEF'};
            const viewOptions = {};

            const item = shallow(
                <WorkPackage
                    workPackage={workPackage}
                    userRole={userRole}
                    userContext={userContext}
                    viewOptions={viewOptions}
                />
            );

            chai.assert(item.find('#butView').length === 0, 'View option found!');
        });
    });

});
