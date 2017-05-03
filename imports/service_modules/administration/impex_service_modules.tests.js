import {DesignVersions} from '../../collections/design/design_versions.js';
import {DesignUpdates} from '../../collections/design_update/design_updates.js';

import ImpexModules from '../../service_modules/administration/impex_service_modules.js';

import { RoleType, ViewType, ViewMode, ComponentType, DesignVersionStatus }     from '../../constants/constants.js';
import { Validation, DesignComponentValidationErrors }   from '../../constants/validation_errors.js';

import { chai } from 'meteor/practicalmeteor:chai';


describe('MOD: Impex', () => {

    describe('A Design name is read from a backup file name', () => {

        it('returns correct name if no underscores', () => {

            const fileName = 'ULTRAWIDE_Design1_201705011634.UBK';
            const expectation = 'Design1';

            const result = ImpexModules.getDesignFromFile(fileName);

            chai.assert.equal(result, expectation);
        });

        it('returns correct name if spaces', () => {

            const fileName = 'ULTRAWIDE_Design 1_201705011634.UBK';
            const expectation = 'Design 1';

            const result = ImpexModules.getDesignFromFile(fileName);

            chai.assert.equal(result, expectation);
        });

        it('returns correct name if internal underscores', () => {

            const fileName = 'ULTRAWIDE_Design_1_201705011634.UBK';
            const expectation = 'Design_1';

            const result = ImpexModules.getDesignFromFile(fileName);

            chai.assert.equal(result, expectation);
        });

        it('returns correct name if external underscores', () => {

            const fileName = 'ULTRAWIDE__Design1__201705011634.UBK';
            const expectation = '_Design1_';

            const result = ImpexModules.getDesignFromFile(fileName);

            chai.assert.equal(result, expectation);
        });
    })
});
