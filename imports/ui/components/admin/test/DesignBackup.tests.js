import React from 'react';

import { shallow } from 'enzyme';
import { chai } from 'meteor/practicalmeteor:chai';

import { DesignBackup } from '../DesignBackup.jsx';  // Non Redux wrapped
import { hashID } from "../../../../common/utils";
import { UI } from '../../../../constants/ui_context_ids.js'

function testDesignBackup(backup, userContext){

    return shallow(
        <DesignBackup
            backup={backup}
            userContext={userContext}
        />
    );
}


describe('JSX: UserDetails', () => {

    // DESIGNS ---------------------------------------------------------------------------------------------------------

    describe('Interface', () => {

        describe('A Design backup in the administration backups list has an option to restore it', () => {

            it('has a restore button', () => {

                const backup = {
                    backupName:         'BACKUP_DESIGN1',
                    backupDataVersion:  1,
                    backupDesignName:   'DESIGN1'
                };

                const userContext = {

                };

                let item = testDesignBackup(backup, userContext);

                const expectedItem = hashID(UI.BUTTON_RESTORE, backup.backupDesignName);

                chai.assert.equal(item.find(expectedItem).length, 1, expectedItem + ' not found');
            });
        });
    });
});