import {
    DesignVersionStatus, RoleType,
    WorkPackageType
} from "../constants/constants";

import { WorkPackageContainerUiModules } from '../ui_modules/work_packages_container';

import { chai } from 'meteor/practicalmeteor:chai';

describe('UI Mods: Work Packages Container', () => {

    describe('The Work Package list for an Initial Design Version has an option to add a new Work Package', () => {

        it('has an add option for a manager on a published design version', () => {

            const designVersionName = 'Design Version 1';
            const designVersionStatus = DesignVersionStatus.VERSION_DRAFT;
            const userRole = RoleType.MANAGER;
            const userContext = {designVersionId: 'DV1', designUpdateId: 'NONE'};
            const wpType = WorkPackageType.WP_BASE;
            const openWpItems = [];

            const footerData = WorkPackageContainerUiModules.getFooterDetails(
                designVersionName,
                designVersionStatus,
                userRole,
                userContext,
                wpType,
                openWpItems
            );

            chai.assert.isTrue(footerData.hasFooterAction, 'Expecting a footer action');
            chai.assert.equal(footerData.footerAction, 'Add Work Package to Design Version: Design Version 1');
        });
    });

    describe('Only a Manager can add new Initial Design Version Work Packages', () => {

        it('is not available for Designer', () => {

            const designVersionName = 'Design Version 1';
            const designVersionStatus = DesignVersionStatus.VERSION_DRAFT;
            const userRole = RoleType.DESIGNER;
            const userContext = {designVersionId: 'DV1', designUpdateId: 'NONE'};
            const wpType = WorkPackageType.WP_BASE;
            const openWpItems = [];

            const footerData = WorkPackageContainerUiModules.getFooterDetails(
                designVersionName,
                designVersionStatus,
                userRole,
                userContext,
                wpType,
                openWpItems
            );

            chai.assert.isFalse(footerData.hasFooterAction, 'Expecting no footer action');
        });

        it('is not available for Developer', () => {

            const designVersionName = 'Design Version 1';
            const designVersionStatus = DesignVersionStatus.VERSION_DRAFT;
            const userRole = RoleType.DEVELOPER;
            const userContext = {designVersionId: 'DV1', designUpdateId: 'NONE'};
            const wpType = WorkPackageType.WP_BASE;
            const openWpItems = [];

            const footerData = WorkPackageContainerUiModules.getFooterDetails(
                designVersionName,
                designVersionStatus,
                userRole,
                userContext,
                wpType,
                openWpItems
            );

            chai.assert.isFalse(footerData.hasFooterAction, 'Expecting no footer action');
        });
    });

    describe('A Work Package cannot be added to a New Design Version', () => {

        it('is not available for new design version', () => {

            const designVersionName = 'Design Version 1';
            const designVersionStatus = DesignVersionStatus.VERSION_NEW;
            const userRole = RoleType.MANAGER;
            const userContext = {designVersionId: 'DV1', designUpdateId: 'NONE'};
            const wpType = WorkPackageType.WP_BASE;
            const openWpItems = [];

            const footerData = WorkPackageContainerUiModules.getFooterDetails(
                designVersionName,
                designVersionStatus,
                userRole,
                userContext,
                wpType,
                openWpItems
            );

            chai.assert.isFalse(footerData.hasFooterAction, 'Expecting no footer action');
        });
    });

    describe('A Work Package cannot be added to a Complete Design Version', () => {

        it('is not available for initial complete design version', () => {

            const designVersionName = 'Design Version 1';
            const designVersionStatus = DesignVersionStatus.VERSION_DRAFT_COMPLETE;
            const userRole = RoleType.MANAGER;
            const userContext = {designVersionId: 'DV1', designUpdateId: 'NONE'};
            const wpType = WorkPackageType.WP_BASE;
            const openWpItems = [];

            const footerData = WorkPackageContainerUiModules.getFooterDetails(
                designVersionName,
                designVersionStatus,
                userRole,
                userContext,
                wpType,
                openWpItems
            );

            chai.assert.isFalse(footerData.hasFooterAction, 'Expecting no footer action');
        });

        it('is not available for updatable complete design version', () => {

            const designVersionName = 'Design Version 1';
            const designVersionStatus = DesignVersionStatus.VERSION_UPDATABLE_COMPLETE;
            const userRole = RoleType.MANAGER;
            const userContext = {designVersionId: 'DV1', designUpdateId: 'NONE'};
            const wpType = WorkPackageType.WP_BASE;
            const openWpItems = [];

            const footerData = WorkPackageContainerUiModules.getFooterDetails(
                designVersionName,
                designVersionStatus,
                userRole,
                userContext,
                wpType,
                openWpItems
            );

            chai.assert.isFalse(footerData.hasFooterAction, 'Expecting no footer action');
        });
    });

    describe('A Work Package cannot be added to an Updatable Design Version', () => {

        it('is not available for updatable design version', () => {

            const designVersionName = 'Design Version 1';
            const designVersionStatus = DesignVersionStatus.VERSION_UPDATABLE;
            const userRole = RoleType.MANAGER;
            const userContext = {designVersionId: 'DV1', designUpdateId: 'NONE'};
            const wpType = WorkPackageType.WP_BASE;
            const openWpItems = [];

            const footerData = WorkPackageContainerUiModules.getFooterDetails(
                designVersionName,
                designVersionStatus,
                userRole,
                userContext,
                wpType,
                openWpItems
            );

            chai.assert.isFalse(footerData.hasFooterAction, 'Expecting no footer action');
        });
    });

});