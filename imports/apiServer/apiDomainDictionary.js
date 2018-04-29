
import { addNewTerm, updateTermName, updateTermDefinition, removeTerm } from '../apiValidatedMethods/domain_dictionary_methods.js'

// =====================================================================================================================
// Server API for Domain Dictionary
//
// Calls Meteor Validated Methods and returns asynchronous results to callback
// =====================================================================================================================
class ServerDomainDictionaryApiClass {

    addNewTerm(userRole, view, mode, designId, designVersionId, callback){
        addNewTerm.call(
            {
                userRole: userRole,
                view: view,
                mode: mode,
                designId: designId,
                designVersionId: designVersionId
            },
            (err, result) => {
                callback(err, result);
            }
        );
    };

    updateTermName(userRole, view, mode, termId, newName, callback){
        updateTermName.call(
            {
                userRole: userRole,
                view: view,
                mode: mode,
                termId: termId,
                newName: newName
            },
            (err, result) => {
                callback(err, result);
            }
        );
    };

    updateTermDefinition(userRole, view, mode, termId, newDefinitionRaw, callback){
        updateTermDefinition.call(
            {
                userRole: userRole,
                view: view,
                mode: mode,
                termId: termId,
                newDefinitionRaw: newDefinitionRaw
            },
            (err, result) => {
                callback(err, result);
            }
        );
    };

    removeTerm(userRole, view, mode, termId, callback){
        removeTerm.call(
            {
                userRole: userRole,
                view: view,
                mode: mode,
                termId: termId
            },
            (err, result) => {
                callback(err, result);
            }
        );
    };
}

export const ServerDomainDictionaryApi = new ServerDomainDictionaryApiClass();

