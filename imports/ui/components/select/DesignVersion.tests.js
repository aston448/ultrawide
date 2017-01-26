
import React from 'react';

import { shallow } from 'enzyme';
import { chai } from 'meteor/practicalmeteor:chai';

import { DesignVersion } from './DesignVersion.jsx';  // Non Redux wrapped

import { DesignVersionStatus, RoleType } from '../../../constants/constants.js'
import { getBootstrapText } from '../../../common/utils.js';

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
            chai.expect(getBootstrapText(item.find('#butPublish').html())).to.equal('Publish');

        });

    });

    describe('A Design Version in a Draft state has a Withdraw option on it', () => {

        it('has a Withdraw option for a Designer', () => {

            const userRole = RoleType.DESIGNER;
            const viewOptions = {};
            const userContext = {designVersionId: designVersionNew._id};

            const item = shallow(
                <DesignVersion designVersion={designVersionDraft} userContext={userContext} userRole={userRole} viewOptions={viewOptions}/>
            );

            //
            chai.expect(item.find('#butWithdraw')).to.have.length(1);
            chai.expect(getBootstrapText(item.find('#butWithdraw').html())).to.equal('Withdraw');

        });

    });

    describe('A Design Version in a Draft or Updatable state has an option to create a new Design Version', () => {

        it('has a Create New option for a Designer when Draft', () => {

            const userRole = RoleType.DESIGNER;
            const viewOptions = {};
            const userContext = {designVersionId: designVersionNew._id};

            const item = shallow(
                <DesignVersion designVersion={designVersionDraft} userContext={userContext} userRole={userRole} viewOptions={viewOptions}/>
            );

            //
            chai.expect(item.find('#butCreateNext')).to.have.length(1);
            chai.expect(getBootstrapText(item.find('#butCreateNext').html())).to.equal('Create Next Design Version');

        });

        it('has a Create New option for a Designer when Updatable', () => {

            const userRole = RoleType.DESIGNER;
            const viewOptions = {};
            const userContext = {designVersionId: designVersionNew._id};

            const item = shallow(
                <DesignVersion designVersion={designVersionUpdatable} userContext={userContext} userRole={userRole} viewOptions={viewOptions}/>
            );

            //
            chai.expect(item.find('#butCreateNext')).to.have.length(1);
            chai.expect(getBootstrapText(item.find('#butCreateNext').html())).to.equal('Create Next Design Version');

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
            const userContext = {designVersionId: designVersionNew._id};

            const item = shallow(
                <DesignVersion designVersion={designVersionDraftComplete} userContext={userContext} userRole={userRole} viewOptions={viewOptions}/>
            );

            //
            chai.expect(item.find('#butCreateNext')).to.have.length(0);

        });

        it('has no Create New option for a Designer when Updatable Complete', () => {

            const userRole = RoleType.DESIGNER;
            const viewOptions = {};
            const userContext = {designVersionId: designVersionNew._id};

            const item = shallow(
                <DesignVersion designVersion={designVersionUpdatableComplete} userContext={userContext} userRole={userRole} viewOptions={viewOptions}/>
            );

            //
            chai.expect(item.find('#butCreateNext')).to.have.length(0);

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

});