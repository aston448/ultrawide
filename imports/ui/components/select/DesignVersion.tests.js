
import React from 'react';

import { shallow } from 'enzyme';
import { chai } from 'meteor/practicalmeteor:chai';

import { DesignVersion } from './DesignVersion.jsx';  // Non Redux wrapped

import { DesignVersionStatus, RoleType } from '../../../constants/constants.js'
import TextLookups from '../../../common/lookups.js';

import { DesignVersions } from '../../../collections/design/design_versions.js'

describe('JSX: DesignVersion', () => {

    Factory.define('designVersionNew', DesignVersions, {
        designId: 'AAA',
        designVersionName: 'New',
        designVersionNumber: '1.0',
        designVersionStatus: DesignVersionStatus.VERSION_NEW
    });
    const designVersionNew = Factory.create('designVersionNew');

    Factory.define('designVersionDraft', DesignVersions, {
        designId: 'AAA',
        designVersionName: 'Draft',
        designVersionNumber: '1.0',
        designVersionStatus: DesignVersionStatus.VERSION_DRAFT
    });
    const designVersionDraft = Factory.create('designVersionDraft');

    Factory.define('designVersionUpdatable', DesignVersions, {
        designId: 'AAA',
        designVersionName: 'Updatable',
        designVersionNumber: '1.0',
        designVersionStatus: DesignVersionStatus.VERSION_UPDATABLE
    });
    const designVersionUpdatable = Factory.create('designVersionUpdatable');

    Factory.define('designVersionDraftComplete', DesignVersions, {
        designId: 'AAA',
        designVersionName: 'Draft Complete',
        designVersionNumber: '1.0',
        designVersionStatus: DesignVersionStatus.VERSION_DRAFT_COMPLETE
    });
    const designVersionDraftComplete = Factory.create('designVersionDraftComplete');

    Factory.define('designVersionUpdatableComplete', DesignVersions, {
        designId: 'AAA',
        designVersionName: 'Draft Complete',
        designVersionNumber: '1.0',
        designVersionStatus: DesignVersionStatus.VERSION_UPDATABLE_COMPLETE
    });
    const designVersionUpdatableComplete = Factory.create('designVersionUpdatableComplete');

    // State -----------------------------------------------------------------------------------------------------------
    describe('The state of each Design Version is shown', () => {

        it('status visible for New', () => {

            const userRole = RoleType.DESIGNER;
            const viewOptions = {};
            const userContext = {designVersionId: designVersionNew._id};

            const item = shallow(
                <DesignVersion designVersion={designVersionNew} userContext={userContext} userRole={userRole} viewOptions={viewOptions}/>
            );

            chai.assert.equal(item.find('#designVersionStatus').length, 1, 'Status not found');
            chai.assert.equal(item.find('#designVersionStatus').text(), TextLookups.designVersionStatus(DesignVersionStatus.VERSION_NEW), 'Unexpected status');
        });

        it('status visible for Published', () => {

            const userRole = RoleType.DESIGNER;
            const viewOptions = {};
            const userContext = {designVersionId: designVersionDraft._id};

            const item = shallow(
                <DesignVersion designVersion={designVersionDraft} userContext={userContext} userRole={userRole} viewOptions={viewOptions}/>
            );

            chai.assert.equal(item.find('#designVersionStatus').length, 1, 'Status not found');
            chai.assert.equal(item.find('#designVersionStatus').text(), TextLookups.designVersionStatus(DesignVersionStatus.VERSION_DRAFT), 'Unexpected status');
        });

        it('status visible for Initial Complete', () => {

            const userRole = RoleType.DESIGNER;
            const viewOptions = {};
            const userContext = {designVersionId: designVersionDraftComplete._id};

            const item = shallow(
                <DesignVersion designVersion={designVersionDraftComplete} userContext={userContext} userRole={userRole} viewOptions={viewOptions}/>
            );

            chai.assert.equal(item.find('#designVersionStatus').length, 1, 'Status not found');
            chai.assert.equal(item.find('#designVersionStatus').text(), TextLookups.designVersionStatus(DesignVersionStatus.VERSION_DRAFT_COMPLETE), 'Unexpected status');
        });

        it('status visible for Updatable', () => {

            const userRole = RoleType.DESIGNER;
            const viewOptions = {};
            const userContext = {designVersionId: designVersionUpdatable._id};

            const item = shallow(
                <DesignVersion designVersion={designVersionUpdatable} userContext={userContext} userRole={userRole} viewOptions={viewOptions}/>
            );

            chai.assert.equal(item.find('#designVersionStatus').length, 1, 'Status not found');
            chai.assert.equal(item.find('#designVersionStatus').text(), TextLookups.designVersionStatus(DesignVersionStatus.VERSION_UPDATABLE), 'Unexpected status');
        });

        it('status visible for Updatable Complete', () => {

            const userRole = RoleType.DESIGNER;
            const viewOptions = {};
            const userContext = {designVersionId: designVersionUpdatableComplete._id};

            const item = shallow(
                <DesignVersion designVersion={designVersionUpdatableComplete} userContext={userContext} userRole={userRole} viewOptions={viewOptions}/>
            );

            chai.assert.equal(item.find('#designVersionStatus').length, 1, 'Status not found');
            chai.assert.equal(item.find('#designVersionStatus').text(), TextLookups.designVersionStatus(DesignVersionStatus.VERSION_UPDATABLE_COMPLETE), 'Unexpected status');
        });
    });

    // Create Next Design Version --------------------------------------------------------------------------------------

    describe('A Design Version in a Draft or Updatable state has an option to create a new Design Version', () => {

        it('has a Create New option for a Designer when Draft', () => {

            const userRole = RoleType.DESIGNER;
            const viewOptions = {};
            const userContext = {designVersionId: designVersionDraft._id};

            const item = shallow(
                <DesignVersion designVersion={designVersionDraft} userContext={userContext} userRole={userRole} viewOptions={viewOptions}/>
            );

            //
            chai.expect(item.find('#butCreateNext')).to.have.length(1);
            chai.assert.equal(item.find('#butCreateNext').children().text(), 'Create Next');

        });

        it('has a Create New option for a Designer when Updatable', () => {

            const userRole = RoleType.DESIGNER;
            const viewOptions = {};
            const userContext = {designVersionId: designVersionUpdatable._id};

            const item = shallow(
                <DesignVersion designVersion={designVersionUpdatable} userContext={userContext} userRole={userRole} viewOptions={viewOptions}/>
            );

            //
            chai.expect(item.find('#butCreateNext')).to.have.length(1);
            chai.assert.equal(item.find('#butCreateNext').children().text(), 'Create Next');

        });

        it('has no Create New option for a Designer when New', () => {

            const userRole = RoleType.DESIGNER;
            const viewOptions = {};
            const userContext = {designVersionId: designVersionNew._id};

            const item = shallow(
                <DesignVersion designVersion={designVersionNew} userContext={userContext} userRole={userRole} viewOptions={viewOptions}/>
            );

            //
            chai.expect(item.find('#butCreateNext')).to.have.length(0);

        });

        it('has no Create New option for a Designer when Draft Complete', () => {

            const userRole = RoleType.DESIGNER;
            const viewOptions = {};
            const userContext = {designVersionId: designVersionDraftComplete._id};

            const item = shallow(
                <DesignVersion designVersion={designVersionDraftComplete} userContext={userContext} userRole={userRole} viewOptions={viewOptions}/>
            );

            //
            chai.expect(item.find('#butCreateNext')).to.have.length(0);

        });

        it('has no Create New option for a Designer when Updatable Complete', () => {

            const userRole = RoleType.DESIGNER;
            const viewOptions = {};
            const userContext = {designVersionId: designVersionUpdatableComplete._id};

            const item = shallow(
                <DesignVersion designVersion={designVersionUpdatableComplete} userContext={userContext} userRole={userRole} viewOptions={viewOptions}/>
            );

            //
            chai.expect(item.find('#butCreateNext')).to.have.length(0);

        });

    });

    // Publish / Withdraw Design Version -------------------------------------------------------------------------------

    describe('A Design Version in a New state has a Publish option on it', () => {

        it('has a Publish option for a Designer', () => {

            const userRole = RoleType.DESIGNER;
            const viewOptions = {};
            const userContext = {designVersionId: designVersionNew._id};

            const item = shallow(
                <DesignVersion designVersion={designVersionNew} userContext={userContext} userRole={userRole} viewOptions={viewOptions}/>
            );

            //
            chai.expect(item.find('#butPublish')).to.have.length(1);
            chai.assert.equal(item.find('#butPublish').children().text(), 'Publish');

        });

    });

    describe('A Design Version in a Draft state has a Withdraw option on it', () => {

        it('has a Withdraw option for a Designer', () => {

            const userRole = RoleType.DESIGNER;
            const viewOptions = {};
            const userContext = {designVersionId: designVersionDraft._id};

            const item = shallow(
                <DesignVersion designVersion={designVersionDraft} userContext={userContext} userRole={userRole} viewOptions={viewOptions}/>
            );

            //
            chai.expect(item.find('#butWithdraw')).to.have.length(1);
            chai.assert.equal(item.find('#butWithdraw').children().text(), 'Withdraw');

        });

    });

    describe('The Publish option is only visible to Designers', () => {

        it('has no Publish option for a Developer', () => {

            const userRole = RoleType.DEVELOPER;
            const viewOptions = {};
            const userContext = {designVersionId: designVersionNew._id};

            const item = shallow(
                <DesignVersion designVersion={designVersionNew} userContext={userContext} userRole={userRole} viewOptions={viewOptions}/>
            );

            //
            chai.expect(item.find('#butPublish')).to.have.length(0);

        });

        it('has no Publish option for a Manager', () => {

            const userRole = RoleType.MANAGER;
            const viewOptions = {};
            const userContext = {designVersionId: designVersionNew._id};

            const item = shallow(
                <DesignVersion designVersion={designVersionNew} userContext={userContext} userRole={userRole} viewOptions={viewOptions}/>
            );

            //
            chai.expect(item.find('#butPublish')).to.have.length(0);

        });
    });

    describe('The Withdraw option is only visible to Designers', () => {

        it('has no Withdraw option for a Developer', () => {

            const userRole = RoleType.DEVELOPER;
            const viewOptions = {};
            const userContext = {designVersionId: designVersionNew._id};

            const item = shallow(
                <DesignVersion designVersion={designVersionDraft} userContext={userContext} userRole={userRole} viewOptions={viewOptions}/>
            );

            //
            chai.expect(item.find('#butWithdraw')).to.have.length(0);

        });

        it('has no Withdraw option for a Manager', () => {

            const userRole = RoleType.MANAGER;
            const viewOptions = {};
            const userContext = {designVersionId: designVersionNew._id};

            const item = shallow(
                <DesignVersion designVersion={designVersionDraft} userContext={userContext} userRole={userRole} viewOptions={viewOptions}/>
            );

            //
            chai.expect(item.find('#butWithdraw')).to.have.length(0);

        });
    });

    describe('The create new Design Version option is only visible to Designers', () => {

        it('has no Create New option for a Developer', () => {

            const userRole = RoleType.DEVELOPER;
            const viewOptions = {};
            const userContext = {designVersionId: designVersionNew._id};

            const item = shallow(
                <DesignVersion designVersion={designVersionDraft} userContext={userContext} userRole={userRole} viewOptions={viewOptions}/>
            );

            //
            chai.expect(item.find('#butCreateNext')).to.have.length(0);

        });

        it('has no Create New option for a Manager', () => {

            const userRole = RoleType.MANAGER;
            const viewOptions = {};
            const userContext = {designVersionId: designVersionNew._id};

            const item = shallow(
                <DesignVersion designVersion={designVersionDraft} userContext={userContext} userRole={userRole} viewOptions={viewOptions}/>
            );

            //
            chai.expect(item.find('#butCreateNext')).to.have.length(0);

        });
    });

    describe('The Publish option is only visible on a New Design Version', () => {

        it('has no Publish option for a Draft Design', () => {

            const userRole = RoleType.DESIGNER;
            const viewOptions = {};
            const userContext = {designVersionId: designVersionNew._id};


            const item = shallow(
                <DesignVersion designVersion={designVersionDraft} userContext={userContext} userRole={userRole} viewOptions={viewOptions}/>
            );

            //
            chai.expect(item.find('#butPublish')).to.have.length(0);

        });

        it('has no Publish option for an Updatable Design Version', () => {

            const userRole = RoleType.DESIGNER;
            const viewOptions = {};
            const userContext = {designVersionId: designVersionNew._id};


            const item = shallow(
                <DesignVersion designVersion={designVersionUpdatable} userContext={userContext} userRole={userRole} viewOptions={viewOptions}/>
            );

            //
            chai.expect(item.find('#butPublish')).to.have.length(0);

        });

        it('has no Publish option for a Draft Complete Design Version', () => {

            const userRole = RoleType.DESIGNER;
            const viewOptions = {};
            const userContext = {designVersionId: designVersionNew._id};


            const item = shallow(
                <DesignVersion designVersion={designVersionDraftComplete} userContext={userContext} userRole={userRole} viewOptions={viewOptions}/>
            );

            //
            chai.expect(item.find('#butPublish')).to.have.length(0);

        });

        it('has no Publish option for a Updatable Complete Design Version', () => {

            const userRole = RoleType.DESIGNER;
            const viewOptions = {};
            const userContext = {designVersionId: designVersionNew._id};


            const item = shallow(
                <DesignVersion designVersion={designVersionUpdatableComplete} userContext={userContext} userRole={userRole} viewOptions={viewOptions}/>
            );

            //
            chai.expect(item.find('#butPublish')).to.have.length(0);

        });

    });

    describe('The Withdraw option is only visible on a Draft Design Version', () => {

        it('has no Withdraw option for a New Design', () => {

            const userRole = RoleType.DESIGNER;
            const viewOptions = {};
            const userContext = {designVersionId: designVersionNew._id};


            const item = shallow(
                <DesignVersion designVersion={designVersionNew} userContext={userContext} userRole={userRole} viewOptions={viewOptions}/>
            );

            //
            chai.expect(item.find('#butWithdraw')).to.have.length(0);

        });

        it('has no Withdraw option for an Updatable Design Version', () => {

            const userRole = RoleType.DESIGNER;
            const viewOptions = {};
            const userContext = {designVersionId: designVersionNew._id};


            const item = shallow(
                <DesignVersion designVersion={designVersionUpdatable} userContext={userContext} userRole={userRole} viewOptions={viewOptions}/>
            );

            //
            chai.expect(item.find('#butWithdraw')).to.have.length(0);

        });

        it('has no Withdraw option for a Draft Complete Design Version', () => {

            const userRole = RoleType.DESIGNER;
            const viewOptions = {};
            const userContext = {designVersionId: designVersionNew._id};


            const item = shallow(
                <DesignVersion designVersion={designVersionDraftComplete} userContext={userContext} userRole={userRole} viewOptions={viewOptions}/>
            );

            //
            chai.expect(item.find('#butWithdraw')).to.have.length(0);

        });

        it('has no Withdraw option for a Updatable Complete Design Version', () => {

            const userRole = RoleType.DESIGNER;
            const viewOptions = {};
            const userContext = {designVersionId: designVersionNew._id};


            const item = shallow(
                <DesignVersion designVersion={designVersionUpdatableComplete} userContext={userContext} userRole={userRole} viewOptions={viewOptions}/>
            );

            //
            chai.expect(item.find('#butWithdraw')).to.have.length(0);

        });

    });

    // Select Design Version -------------------------------------------------------------------------------------------

    describe('The currently selected Design Version is highlighted', () => {

        it('is highlighted if is the User Context Design Version', () => {

            const userContext = {designVersionId: designVersionDraft._id};
            const viewOptions = {};
            const userRole = RoleType.DESIGNER;

            const item = shallow(
                <DesignVersion designVersion={designVersionDraft} userContext={userContext} userRole={userRole} viewOptions={viewOptions}/>
            );

            // Should find the active design class
            chai.expect(item.find('.di-active')).to.have.length(1);

        });

        it('is not highlighted if is not the User Context Design Version', () => {

            const userContext = {designVersionId: designVersionDraft._id};
            const viewOptions = {};
            const userRole = RoleType.DESIGNER;

            const item = shallow(
                <DesignVersion designVersion={designVersionNew} userContext={userContext} userRole={userRole} viewOptions={viewOptions}/>
            );

            // Should NOT find the active design class
            chai.expect(item.find('.di-active')).to.have.length(0);

        });

    });

    // Edit Design Version ---------------------------------------------------------------------------------------------

    describe('An editable Design Version contains an Edit option', () => {

        it('visible for a New Design Version', () => {

            const userContext = {designVersionId: designVersionNew._id};
            const viewOptions = {};
            const userRole = RoleType.DESIGNER;

            const item = shallow(
                <DesignVersion designVersion={designVersionNew} userContext={userContext} userRole={userRole} viewOptions={viewOptions}/>
            );

            chai.expect(item.find('#butEdit')).to.have.length(1);
        });

        it('visible for a Draft Design Version', () => {

            const userContext = {designVersionId: designVersionDraft._id};
            const viewOptions = {};
            const userRole = RoleType.DESIGNER;

            const item = shallow(
                <DesignVersion designVersion={designVersionDraft} userContext={userContext} userRole={userRole} viewOptions={viewOptions}/>
            );

            chai.expect(item.find('#butEdit')).to.have.length(1);
        });

        it('NOT visible for a Draft Complete Design Version', () => {

            const userContext = {designVersionId: designVersionDraftComplete._id};
            const viewOptions = {};
            const userRole = RoleType.DESIGNER;

            const item = shallow(
                <DesignVersion designVersion={designVersionDraftComplete} userContext={userContext} userRole={userRole} viewOptions={viewOptions}/>
            );

            chai.expect(item.find('#butEdit')).to.have.length(0);
        });

        it('NOT visible for an Updatable Complete Design Version', () => {

            const userContext = {designVersionId: designVersionUpdatableComplete._id};
            const viewOptions = {};
            const userRole = RoleType.DESIGNER;

            const item = shallow(
                <DesignVersion designVersion={designVersionUpdatableComplete} userContext={userContext} userRole={userRole} viewOptions={viewOptions}/>
            );

            chai.expect(item.find('#butEdit')).to.have.length(0);
        });

        it('NOT visible for an Updatable Design Version', () => {

            const userContext = {designVersionId: designVersionUpdatable._id};
            const viewOptions = {};
            const userRole = RoleType.DESIGNER;

            const item = shallow(
                <DesignVersion designVersion={designVersionUpdatable} userContext={userContext} userRole={userRole} viewOptions={viewOptions}/>
            );

            chai.expect(item.find('#butEdit')).to.have.length(0);
        });
    });

    describe('The Edit option is only visible to Designers', () => {

        it('visible for a Designer', () => {

            const userContext = {designVersionId: designVersionNew._id};
            const viewOptions = {};
            const userRole = RoleType.DESIGNER;

            const item = shallow(
                <DesignVersion designVersion={designVersionNew} userContext={userContext} userRole={userRole} viewOptions={viewOptions}/>
            );

            chai.expect(item.find('#butEdit')).to.have.length(1);
        });

        it('NOT visible for a Developer', () => {

            const userContext = {designVersionId: designVersionNew._id};
            const viewOptions = {};
            const userRole = RoleType.DEVELOPER;

            const item = shallow(
                <DesignVersion designVersion={designVersionNew} userContext={userContext} userRole={userRole} viewOptions={viewOptions}/>
            );

            chai.expect(item.find('#butEdit')).to.have.length(0);
        });

        it('NOT visible for a Manager', () => {

            const userContext = {designVersionId: designVersionNew._id};
            const viewOptions = {};
            const userRole = RoleType.MANAGER;

            const item = shallow(
                <DesignVersion designVersion={designVersionNew} userContext={userContext} userRole={userRole} viewOptions={viewOptions}/>
            );

            chai.expect(item.find('#butEdit')).to.have.length(0);
        });

    });

    // View Design Version ---------------------------------------------------------------------------------------------

    describe('A Design Version contains a View option', () => {

        it('visible for a New Design Version for Designer', () => {

            const userContext = {designVersionId: designVersionNew._id};
            const viewOptions = {};
            const userRole = RoleType.DESIGNER;

            const item = shallow(
                <DesignVersion designVersion={designVersionNew} userContext={userContext} userRole={userRole} viewOptions={viewOptions}/>
            );

            chai.expect(item.find('#butView')).to.have.length(1);
        });

        it('visible for a Draft Design Version for Designer', () => {

            const userContext = {designVersionId: designVersionDraft._id};
            const viewOptions = {};
            const userRole = RoleType.DESIGNER;

            const item = shallow(
                <DesignVersion designVersion={designVersionDraft} userContext={userContext} userRole={userRole} viewOptions={viewOptions}/>
            );

            chai.expect(item.find('#butView')).to.have.length(1);
        });

        it('visible for a Draft Design Version for Developer', () => {

            const userContext = {designVersionId: designVersionDraft._id};
            const viewOptions = {};
            const userRole = RoleType.DEVELOPER;

            const item = shallow(
                <DesignVersion designVersion={designVersionDraft} userContext={userContext} userRole={userRole} viewOptions={viewOptions}/>
            );

            chai.expect(item.find('#butView')).to.have.length(1);
        });

        it('visible for a Draft Design Version for Manager', () => {

            const userContext = {designVersionId: designVersionDraft._id};
            const viewOptions = {};
            const userRole = RoleType.MANAGER;

            const item = shallow(
                <DesignVersion designVersion={designVersionDraft} userContext={userContext} userRole={userRole} viewOptions={viewOptions}/>
            );

            chai.expect(item.find('#butView')).to.have.length(1);
        });

        it('visible for a Draft Complete Design Version for Designer', () => {

            const userContext = {designVersionId: designVersionDraftComplete._id};
            const viewOptions = {};
            const userRole = RoleType.DESIGNER;

            const item = shallow(
                <DesignVersion designVersion={designVersionDraftComplete} userContext={userContext} userRole={userRole} viewOptions={viewOptions}/>
            );

            chai.expect(item.find('#butView')).to.have.length(1);
        });

        it('visible for a Draft Complete Design Version for Developer', () => {

            const userContext = {designVersionId: designVersionDraftComplete._id};
            const viewOptions = {};
            const userRole = RoleType.DEVELOPER;

            const item = shallow(
                <DesignVersion designVersion={designVersionDraftComplete} userContext={userContext} userRole={userRole} viewOptions={viewOptions}/>
            );

            chai.expect(item.find('#butView')).to.have.length(1);
        });

        it('visible for a Draft Complete Design Version for Manager', () => {

            const userContext = {designVersionId: designVersionDraftComplete._id};
            const viewOptions = {};
            const userRole = RoleType.MANAGER;

            const item = shallow(
                <DesignVersion designVersion={designVersionDraftComplete} userContext={userContext} userRole={userRole} viewOptions={viewOptions}/>
            );

            chai.expect(item.find('#butView')).to.have.length(1);
        });

        it('visible for an Updatable Complete Design Version for Designer', () => {

            const userContext = {designVersionId: designVersionUpdatableComplete._id};
            const viewOptions = {};
            const userRole = RoleType.DESIGNER;

            const item = shallow(
                <DesignVersion designVersion={designVersionUpdatableComplete} userContext={userContext} userRole={userRole} viewOptions={viewOptions}/>
            );

            chai.expect(item.find('#butView')).to.have.length(1);
        });

        it('visible for an Updatable Complete Design Version for Developer', () => {

            const userContext = {designVersionId: designVersionUpdatableComplete._id};
            const viewOptions = {};
            const userRole = RoleType.DEVELOPER;

            const item = shallow(
                <DesignVersion designVersion={designVersionUpdatableComplete} userContext={userContext} userRole={userRole} viewOptions={viewOptions}/>
            );

            chai.expect(item.find('#butView')).to.have.length(1);
        });

        it('visible for an Updatable Complete Design Version for Manager', () => {

            const userContext = {designVersionId: designVersionUpdatableComplete._id};
            const viewOptions = {};
            const userRole = RoleType.MANAGER;

            const item = shallow(
                <DesignVersion designVersion={designVersionUpdatableComplete} userContext={userContext} userRole={userRole} viewOptions={viewOptions}/>
            );

            chai.expect(item.find('#butView')).to.have.length(1);
        });

        it('visible for an Updatable Design Version for Designer', () => {

            const userContext = {designVersionId: designVersionUpdatable._id};
            const viewOptions = {};
            const userRole = RoleType.DESIGNER;

            const item = shallow(
                <DesignVersion designVersion={designVersionUpdatable} userContext={userContext} userRole={userRole} viewOptions={viewOptions}/>
            );

            chai.expect(item.find('#butView')).to.have.length(1);
        });

        it('visible for an Updatable Design Version for Developer', () => {

            const userContext = {designVersionId: designVersionUpdatable._id};
            const viewOptions = {};
            const userRole = RoleType.DEVELOPER;

            const item = shallow(
                <DesignVersion designVersion={designVersionUpdatable} userContext={userContext} userRole={userRole} viewOptions={viewOptions}/>
            );

            chai.expect(item.find('#butView')).to.have.length(1);
        });

        it('visible for an Updatable Design Version for Manager', () => {

            const userContext = {designVersionId: designVersionUpdatable._id};
            const viewOptions = {};
            const userRole = RoleType.MANAGER;

            const item = shallow(
                <DesignVersion designVersion={designVersionUpdatable} userContext={userContext} userRole={userRole} viewOptions={viewOptions}/>
            );

            chai.expect(item.find('#butView')).to.have.length(1);
        });
    });

    describe('The View option is only visible to Designers for New Design Versions', () => {

        it('NOT visible for a New Design Version for Developer', () => {

            const userContext = {designVersionId: designVersionNew._id};
            const viewOptions = {};
            const userRole = RoleType.DEVELOPER;

            const item = shallow(
                <DesignVersion designVersion={designVersionNew} userContext={userContext} userRole={userRole} viewOptions={viewOptions}/>
            );

            chai.expect(item.find('#butView')).to.have.length(0);
        });

        it('NOT visible for a New Design Version for Manager', () => {

            const userContext = {designVersionId: designVersionNew._id};
            const viewOptions = {};
            const userRole = RoleType.MANAGER;

            const item = shallow(
                <DesignVersion designVersion={designVersionNew} userContext={userContext} userRole={userRole} viewOptions={viewOptions}/>
            );

            chai.expect(item.find('#butView')).to.have.length(0);
        });

    });


});
