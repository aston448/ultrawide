// == IMPORTS ==========================================================================================================

// Meteor / React Services
import { Meteor } from 'meteor/meteor';

// Ultrawide Collections
import {DomainDictionary} from '../collections/design/domain_dictionary.js';

// Ultrawide Services
import { ViewType, ViewMode, DisplayContext, LogLevel} from '../constants/constants.js';
import {reorderDropAllowed, log} from '../common/utils.js';

import ClientDomainDictionaryServices from '../service_modules/client/client_domain_dictionary.js';


// =====================================================================================================================

// -- CLASS ------------------------------------------------------------------------------------------------------------
//
// Client Domain Dictionary API - Supports client calls for actions relating to Scenario Steps
//
// This class is the test entry point when not testing through the GUI.
// Most functions validate and return true / false according to business rules even if there is implicit validation in the GUI
// (E.g. buttons not being visible if action invalid)
//
// ---------------------------------------------------------------------------------------------------------------------

class ClientDomainDictionaryApi {

    addNewDictionaryTerm(view, mode, designId, designVersionId) {

        // Validate - can only add if design is editable
        if ((view === ViewType.DESIGN_NEW_EDIT || view === ViewType.DESIGN_UPDATE_EDIT) && mode === ViewMode.MODE_EDIT) {
            Meteor.call('domainDictionary.addNewTerm', designId, designVersionId);
            return true;
        } else {
            return false;
        }

    };

    updateDictionaryTerm(view, mode, termId, termTextNew) {

        // Validate - can only update if design is editable
        if ((view === ViewType.DESIGN_NEW_EDIT || view === ViewType.DESIGN_UPDATE_EDIT) && mode === ViewMode.MODE_EDIT) {
            Meteor.call('domainDictionary.updateTermName', termId, termTextNew);
            return true;
        } else {
            return false;
        }

    };

    updateDictionaryTermDefinition(view, mode, termId, termDefinitionTextRaw) {

        // Validate - can only update if design is editable
        if ((view === ViewType.DESIGN_NEW_EDIT || view === ViewType.DESIGN_UPDATE_EDIT) && mode === ViewMode.MODE_EDIT) {
            Meteor.call('domainDictionary.updateTermDefinition', termId, termDefinitionTextRaw);
            return true;
        } else {
            return false;
        }

    };

    removeDictionaryTerm(view, mode, termId) {

        // Validate - can only remove if design is editable
        if ((view === ViewType.DESIGN_NEW_EDIT || view === ViewType.DESIGN_UPDATE_EDIT) && mode === ViewMode.MODE_EDIT) {
            Meteor.call('domainDictionary.removeTerm', termId);
        } else {
            return false;
        }
    };

    // Get function to decorate Feature Narratives
    getNarrativeDecoratorFunction(){

        return ClientDomainDictionaryServices.getNarrativeDecoratorFunction();

    }

    // Get function to highlight Domain Terms in various test fields
    getDomainTermDecoratorFunction(designVersionId) {

        // Get the current list of Domain Terms
        const domainTerms = DomainDictionary.find({designVersionId: designVersionId}).fetch();

        return ClientDomainDictionaryServices.getDomainTermDecoratorFunction(domainTerms)

    };

}

export default new ClientDomainDictionaryApi();
