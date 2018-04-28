
import { TestFixtures }                 from '../../../test_framework/test_wrappers/test_fixtures.js';
import { DesignActions }                from '../../../test_framework/test_wrappers/design_actions.js';
import { DesignVersionActions }         from '../../../test_framework/test_wrappers/design_version_actions.js';
import { DomainDictionaryActions }      from '../../../test_framework/test_wrappers/domain_dictionary_actions.js';
import { DomainDictionaryVerifications } from '../../../test_framework/test_wrappers/domain_dictionary_verifications.js';

import {DefaultComponentNames} from '../../../imports/constants/default_names.js';

describe('UC 703 - Edit Domain Dictionary Term Definition', function(){

    before(function(){
        TestFixtures.logTestSuite('UC 703 - Edit Domain Dictionary Term Definition');
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
    it('A Designer may edit the definition of a Domain Dictionary term', function(){

        // Setup
        DomainDictionaryActions.designerAddsNewTerm();
        DomainDictionaryActions.designerEditsTermNameFrom_To_(DefaultComponentNames.NEW_DICTIONARY_ENTRY_NAME, 'Term1');

        // Execute
        DomainDictionaryActions.designerEditsTerm_DefinitionTo_('Term1', 'Term1 Definition');

        // Verify
        DomainDictionaryVerifications.termExistsForDesignerCalled('Term1');
        DomainDictionaryVerifications.termDefinitionForTerm_ForDesignerIs('Term1', 'Term1 Definition');
    });


});
