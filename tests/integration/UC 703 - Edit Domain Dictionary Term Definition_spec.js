
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

describe('UC 703 - Edit Domain Dictionary Term Definition', function(){

    before(function(){

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
