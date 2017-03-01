
import TestFixtures                 from '../../test_framework/test_wrappers/test_fixtures.js';
import DesignActions                from '../../test_framework/test_wrappers/design_actions.js';
import DesignVersionActions         from '../../test_framework/test_wrappers/design_version_actions.js';
import DesignUpdateActions          from '../../test_framework/test_wrappers/design_update_actions.js';
import DesignComponentActions       from '../../test_framework/test_wrappers/design_component_actions.js';
import UpdateComponentActions       from '../../test_framework/test_wrappers/design_update_component_actions.js';
import DesignVerifications          from '../../test_framework/test_wrappers/design_verifications.js';
import DesignUpdateVerifications    from '../../test_framework/test_wrappers/design_update_verifications.js';
import DesignVersionVerifications   from '../../test_framework/test_wrappers/design_version_verifications.js';
import DesignComponentVerifications from '../../test_framework/test_wrappers/design_component_verifications.js';
import UserContextVerifications     from '../../test_framework/test_wrappers/user_context_verifications.js';
import WorkPackageActions           from '../../test_framework/test_wrappers/work_package_actions.js';
import WorkPackageVerifications     from '../../test_framework/test_wrappers/work_package_verifications.js';
import WpComponentActions           from '../../test_framework/test_wrappers/work_package_component_actions.js';
import WpComponentVerifications     from '../../test_framework/test_wrappers/work_package_component_verifications.js';
import UpdateComponentVerifications from '../../test_framework/test_wrappers/design_update_component_verifications.js';
import DomainDictionaryActions      from '../../test_framework/test_wrappers/domain_dictionary_actions.js';
import DomainDictionaryVerifications from '../../test_framework/test_wrappers/domain_dictionary_verifications.js';

import {RoleType, ViewMode, DesignVersionStatus, DesignUpdateStatus, ComponentType, DesignUpdateMergeAction, WorkPackageStatus} from '../../imports/constants/constants.js'
import {DefaultItemNames, DefaultComponentNames} from '../../imports/constants/default_names.js';
import {DomainDictionaryValidationErrors} from '../../imports/constants/validation_errors.js';

describe('UC 702 - Edit Domain Dictionary Term Name', function(){

    before(function(){
        TestFixtures.logTestSuite('UC 702 - Edit Domain Dictionary Term Name');
    });

    after(function(){

    });

    beforeEach(function(){

        TestFixtures.clearAllData();
        TestFixtures.addDesignWithDefaultData();
        DesignActions.designerWorksOnDesign('Design1');
        DesignVersionActions.designerEditsDesignVersion('DesignVersion1');
    });

    afterEach(function(){

    });

    // Actions
    it('A Designer may edit the name of a Domain Dictionary term', function(){

        // Setup
        DomainDictionaryActions.designerAddsNewTerm();

        // Execute
        DomainDictionaryActions.designerEditsTermNameFrom_To_(DefaultComponentNames.NEW_DICTIONARY_ENTRY_NAME, 'Term1');

        // Verify
        DomainDictionaryVerifications.termExistsForDesignerCalled('Term1');
        DomainDictionaryVerifications.termDoesNotExistForDesignerCalled(DefaultComponentNames.NEW_DICTIONARY_ENTRY_NAME);

    });


    // Conditions
    it('A term name cannot be edited to the same value as another term in the Design', function(){

        // Setup
        DomainDictionaryActions.designerAddsNewTerm();
        DomainDictionaryActions.designerEditsTermNameFrom_To_(DefaultComponentNames.NEW_DICTIONARY_ENTRY_NAME, 'Term1');
        DomainDictionaryActions.designerAddsNewTerm();
        DomainDictionaryVerifications.termExistsForDesignerCalled('Term1');
        DomainDictionaryVerifications.termExistsForDesignerCalled(DefaultComponentNames.NEW_DICTIONARY_ENTRY_NAME);

        // Execute - expect rejection
        const expectation = {success: false, message: DomainDictionaryValidationErrors.DICTIONARY_INVALID_TERM_DUPLICATE};
        DomainDictionaryActions.designerEditsTermNameFrom_To_(DefaultComponentNames.NEW_DICTIONARY_ENTRY_NAME, 'Term1', expectation);

        // Verify - no change
        DomainDictionaryVerifications.termExistsForDesignerCalled('Term1');
        DomainDictionaryVerifications.termExistsForDesignerCalled(DefaultComponentNames.NEW_DICTIONARY_ENTRY_NAME);
    });


});
