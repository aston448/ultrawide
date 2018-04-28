
import { TestFixtures }                 from '../../../test_framework/test_wrappers/test_fixtures.js';
import { DesignActions }                from '../../../test_framework/test_wrappers/design_actions.js';
import { DesignVersionActions }         from '../../../test_framework/test_wrappers/design_version_actions.js';
import { DomainDictionaryActions }      from '../../../test_framework/test_wrappers/domain_dictionary_actions.js';
import { DomainDictionaryVerifications } from '../../../test_framework/test_wrappers/domain_dictionary_verifications.js';

import {DefaultComponentNames} from '../../../imports/constants/default_names.js';

describe('UC 704 - Remove Domain Dictionary Term', function(){

    before(function(){
        TestFixtures.logTestSuite('UC 704 - Remove Domain Dictionary Term');
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
    it('A Designer may remove a Domain Dictionary term', function(){

        // Setup
        DomainDictionaryActions.designerAddsNewTerm();
        DomainDictionaryActions.designerEditsTermNameFrom_To_(DefaultComponentNames.NEW_DICTIONARY_ENTRY_NAME, 'Term1');
        DomainDictionaryVerifications.termExistsForDesignerCalled('Term1');

        // Execute
        DomainDictionaryActions.designerRemovesTerm('Term1');

        // Verify
        DomainDictionaryVerifications.termDoesNotExistForDesignerCalled('Term1');
    });


});
