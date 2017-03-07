import React from 'react';

import { shallow, mount} from 'enzyme';
import { chai } from 'meteor/practicalmeteor:chai';

import { WorkPackagesList } from './WorkPackagesContainer.jsx';  // Non container wrapped

import { DesignVersionStatus, DesignUpdateStatus, RoleType, WorkPackageType } from '../../../constants/constants.js'



describe('JSX: WorkPackagesList', () => {

    describe('The Work Package list for an Initial Design Version has an option to add a new Work Package', () => {

        it('has an add option for a manager on a published design version', () => {

            const wpType = WorkPackageType.WP_BASE;
            const workPackages = [];
            const designVersionStatus = DesignVersionStatus.VERSION_DRAFT;
            const designUpdateStatus = null;
            const userRole = RoleType.MANAGER;
            const userContext = {designVersionId: 'ABC', designUpdateId: 'NONE'};
            const openWpItems = [];

            const item = shallow(
                <WorkPackagesList
                    wpType={wpType}
                    workPackages={workPackages}
                    designVersionStatus={designVersionStatus}
                    designUpdateStatus={designUpdateStatus}
                    userRole={userRole}
                    userContext={userContext}
                    openWpItems={openWpItems}
                />
            );

            chai.assert(item.find('#addWorkPackage').length === 1, 'Add option not found!');
        });
    });

    describe('Only a Manager can add new Initial Design Version Work Packages', () => {

        it('is not available for Designer', () => {

            const wpType = WorkPackageType.WP_BASE;
            const workPackages = [];
            const designVersionStatus = DesignVersionStatus.VERSION_DRAFT;
            const designUpdateStatus = null;
            const userRole = RoleType.DESIGNER;
            const userContext = {designVersionId: 'ABC', designUpdateId: 'NONE'};
            const openWpItems = [];

            const item = shallow(
                <WorkPackagesList
                    wpType={wpType}
                    workPackages={workPackages}
                    designVersionStatus={designVersionStatus}
                    designUpdateStatus={designUpdateStatus}
                    userRole={userRole}
                    userContext={userContext}
                    openWpItems={openWpItems}
                />
            );

            chai.assert(item.find('#addWorkPackage').length === 0, 'Add option found!');
        });

        it('is not available for Developer', () => {

            const wpType = WorkPackageType.WP_BASE;
            const workPackages = [];
            const designVersionStatus = DesignVersionStatus.VERSION_DRAFT;
            const designUpdateStatus = null;
            const userRole = RoleType.DEVELOPER;
            const userContext = {designVersionId: 'ABC', designUpdateId: 'NONE'};
            const openWpItems = [];

            const item = shallow(
                <WorkPackagesList
                    wpType={wpType}
                    workPackages={workPackages}
                    designVersionStatus={designVersionStatus}
                    designUpdateStatus={designUpdateStatus}
                    userRole={userRole}
                    userContext={userContext}
                    openWpItems={openWpItems}
                />
            );

            chai.assert(item.find('#addWorkPackage').length === 0, 'Add option found!');
        });
    });

    describe('A Work Package cannot be added to a New Design Version', () => {

        it('is not available for new design version', () => {

            const wpType = WorkPackageType.WP_BASE;
            const workPackages = [];
            const designVersionStatus = DesignVersionStatus.VERSION_NEW;
            const designUpdateStatus = null;
            const userRole = RoleType.MANAGER;
            const userContext = {designVersionId: 'ABC', designUpdateId: 'NONE'};
            const openWpItems = [];

            const item = shallow(
                <WorkPackagesList
                    wpType={wpType}
                    workPackages={workPackages}
                    designVersionStatus={designVersionStatus}
                    designUpdateStatus={designUpdateStatus}
                    userRole={userRole}
                    userContext={userContext}
                    openWpItems={openWpItems}
                />
            );

            chai.assert(item.find('#addWorkPackage').length === 0, 'Add option found!');
        });
    });

    describe('A Work Package cannot be added to a Complete Design Version', () => {

        it('is not available for initial complete design version', () => {

            const wpType = WorkPackageType.WP_BASE;
            const workPackages = [];
            const designVersionStatus = DesignVersionStatus.VERSION_DRAFT_COMPLETE;
            const designUpdateStatus = null;
            const userRole = RoleType.MANAGER;
            const userContext = {designVersionId: 'ABC', designUpdateId: 'NONE'};
            const openWpItems = [];

            const item = shallow(
                <WorkPackagesList
                    wpType={wpType}
                    workPackages={workPackages}
                    designVersionStatus={designVersionStatus}
                    designUpdateStatus={designUpdateStatus}
                    userRole={userRole}
                    userContext={userContext}
                    openWpItems={openWpItems}
                />
            );

            chai.assert(item.find('#addWorkPackage').length === 0, 'Add option found!');
        });

        it('is not available for updatable complete design version', () => {

            const wpType = WorkPackageType.WP_BASE;
            const workPackages = [];
            const designVersionStatus = DesignVersionStatus.VERSION_UPDATABLE_COMPLETE;
            const designUpdateStatus = null;
            const userRole = RoleType.MANAGER;
            const userContext = {designVersionId: 'ABC', designUpdateId: 'NONE'};
            const openWpItems = [];

            const item = shallow(
                <WorkPackagesList
                    wpType={wpType}
                    workPackages={workPackages}
                    designVersionStatus={designVersionStatus}
                    designUpdateStatus={designUpdateStatus}
                    userRole={userRole}
                    userContext={userContext}
                    openWpItems={openWpItems}
                />
            );

            chai.assert(item.find('#addWorkPackage').length === 0, 'Add option found!');
        });
    });

    describe('A Work Package cannot be added to an Updatable Design Version', () => {

        it('is not available for updatable design version', () => {

            const wpType = WorkPackageType.WP_BASE;
            const workPackages = [];
            const designVersionStatus = DesignVersionStatus.VERSION_UPDATABLE;
            const designUpdateStatus = null;
            const userRole = RoleType.MANAGER;
            const userContext = {designVersionId: 'ABC', designUpdateId: 'NONE'};
            const openWpItems = [];

            const item = shallow(
                <WorkPackagesList
                    wpType={wpType}
                    workPackages={workPackages}
                    designVersionStatus={designVersionStatus}
                    designUpdateStatus={designUpdateStatus}
                    userRole={userRole}
                    userContext={userContext}
                    openWpItems={openWpItems}
                />
            );

            chai.assert(item.find('#addWorkPackage').length === 0, 'Add option found!');
        });
    });

    // Design update WPs -----------------------------------------------------------------------------------------------

    describe('The Work Package list for a Design Update has an option to add a new Work Package', () => {

        it('has an add option for a manager on an updatable design version', () => {

            const wpType = WorkPackageType.WP_UPDATE;
            const workPackages = [];
            const designVersionStatus = DesignVersionStatus.VERSION_UPDATABLE;
            const designUpdateStatus = DesignUpdateStatus.UPDATE_PUBLISHED_DRAFT;
            const userRole = RoleType.MANAGER;
            const userContext = {designVersionId: 'ABC', designUpdateId: 'DEF'};
            const openWpItems = [];

            const item = shallow(
                <WorkPackagesList
                    wpType={wpType}
                    workPackages={workPackages}
                    designVersionStatus={designVersionStatus}
                    designUpdateStatus={designUpdateStatus}
                    userRole={userRole}
                    userContext={userContext}
                    openWpItems={openWpItems}
                />
            );

            chai.assert(item.find('#addWorkPackage').length === 1, 'Add option not found!');
        });
    });

    describe('Only a Manager can add new Design Update Work Packages', () => {

        it('is not available for Designer', () => {

            const wpType = WorkPackageType.WP_UPDATE;
            const workPackages = [];
            const designVersionStatus = DesignVersionStatus.VERSION_UPDATABLE;
            const designUpdateStatus = DesignUpdateStatus.UPDATE_PUBLISHED_DRAFT;
            const userRole = RoleType.DESIGNER;
            const userContext = {designVersionId: 'ABC', designUpdateId: 'DEF'};
            const openWpItems = [];

            const item = shallow(
                <WorkPackagesList
                    wpType={wpType}
                    workPackages={workPackages}
                    designVersionStatus={designVersionStatus}
                    designUpdateStatus={designUpdateStatus}
                    userRole={userRole}
                    userContext={userContext}
                    openWpItems={openWpItems}
                />
            );

            chai.assert(item.find('#addWorkPackage').length === 0, 'Add option found!');
        });

        it('is not available for Developer', () => {

            const wpType = WorkPackageType.WP_UPDATE;
            const workPackages = [];
            const designVersionStatus = DesignVersionStatus.VERSION_UPDATABLE;
            const designUpdateStatus = DesignUpdateStatus.UPDATE_PUBLISHED_DRAFT;
            const userRole = RoleType.DEVELOPER;
            const userContext = {designVersionId: 'ABC', designUpdateId: 'DEF'};
            const openWpItems = [];

            const item = shallow(
                <WorkPackagesList
                    wpType={wpType}
                    workPackages={workPackages}
                    designVersionStatus={designVersionStatus}
                    designUpdateStatus={designUpdateStatus}
                    userRole={userRole}
                    userContext={userContext}
                    openWpItems={openWpItems}
                />
            );

            chai.assert(item.find('#addWorkPackage').length === 0, 'Add option found!');
        });
    });

    describe('A Work Package cannot be added to a New Design Update', () => {

        it('is not available for new design update', () => {

            const wpType = WorkPackageType.WP_UPDATE;
            const workPackages = [];
            const designVersionStatus = DesignVersionStatus.VERSION_UPDATABLE;
            const designUpdateStatus = DesignUpdateStatus.UPDATE_NEW;
            const userRole = RoleType.MANAGER;
            const userContext = {designVersionId: 'ABC', designUpdateId: 'DEF'};
            const openWpItems = [];

            const item = shallow(
                <WorkPackagesList
                    wpType={wpType}
                    workPackages={workPackages}
                    designVersionStatus={designVersionStatus}
                    designUpdateStatus={designUpdateStatus}
                    userRole={userRole}
                    userContext={userContext}
                    openWpItems={openWpItems}
                />
            );

            chai.assert(item.find('#addWorkPackage').length === 0, 'Add option found!');
        });
    });

    describe('A Work Package cannot be added to a Complete Design Update', () => {

        it('is not available for a merged design update', () => {

            const wpType = WorkPackageType.WP_UPDATE;
            const workPackages = [];
            const designVersionStatus = DesignVersionStatus.VERSION_UPDATABLE;
            const designUpdateStatus = DesignUpdateStatus.UPDATE_MERGED;
            const userRole = RoleType.MANAGER;
            const userContext = {designVersionId: 'ABC', designUpdateId: 'DEF'};
            const openWpItems = [];

            const item = shallow(
                <WorkPackagesList
                    wpType={wpType}
                    workPackages={workPackages}
                    designVersionStatus={designVersionStatus}
                    designUpdateStatus={designUpdateStatus}
                    userRole={userRole}
                    userContext={userContext}
                    openWpItems={openWpItems}
                />
            );

            chai.assert(item.find('#addWorkPackage').length === 0, 'Add option found!');
        });
    });

});
