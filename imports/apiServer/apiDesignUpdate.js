
import { Meteor } from 'meteor/meteor';

import {ComponentType} from '../constants/constants.js'

import  DesignUpdateServices  from '../servicers/design_update/design_update_services.js';
import  DesignUpdateComponentServices  from '../servicers/design_update/design_update_component_services.js';
import  ScenarioServices        from '../servicers/design/scenario_services.js';

import DesignComponentModules               from '../service_modules/design/design_component_service_modules.js';
import { DefaultComponentNames, DefaultDetailsText } from '../constants/default_names.js';

import { ValidatedMethod } from 'meteor/mdg:validated-method';

import { addDesignUpdate, updateDesignUpdateName, updateDesignUpdateVersion, publishDesignUpdate, removeDesignUpdate } from '../apiValidatedMethods/design_update_methods.js'


class ServerDesignUpdateApi {

    addDesignUpdate(userRole, designVersionId, callback){

        addDesignUpdate.call(
            {
                userRole:           userRole,
                designVersionId:    designVersionId
            },
            (err, result) => {
                callback(err, result);
            }
        );
    };

    updateDesignUpdateName(userRole, designUpdateId, newName, callback){

        updateDesignUpdateName.call(
            {
                userRole:       userRole,
                designUpdateId: designUpdateId,
                newName:        newName
            },
            (err, result) => {
                callback(err, result);
            }
        );
    };

    updateDesignUpdateVersion(userRole, designUpdateId, newVersion, callback){

        updateDesignUpdateVersion.call(
            {
                userRole:       userRole,
                designUpdateId: designUpdateId,
                newVersion:     newVersion
            },
            (err, result) => {
                callback(err, result);
            }
        );
    };

    publishDesignUpdate(userRole, designUpdateId, callback){

        publishDesignUpdate.call(
            {
                userRole:       userRole,
                designUpdateId: designUpdateId
            },
            (err, result) => {
                callback(err, result);
            }
        );
    };

    removeDesignUpdate(userRole, designUpdateId, callback){

        removeDesignUpdate.call(
            {
                userRole:       userRole,
                designUpdateId: designUpdateId
            },
            (err, result) => {
                callback(err, result);
            }
        );
    };

}

export default new ServerDesignUpdateApi();

