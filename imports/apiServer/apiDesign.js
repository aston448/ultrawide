
import { ValidatedMethod } from 'meteor/mdg:validated-method';

import { addDesign, updateDesignName, removeDesign } from '../apiValidatedMethods/design_methods.js'


class ServerDesignApi {

    addDesign(userRole, callback){

        addDesign.call(
            {
                userRole: userRole
            },
            (err, result) => {
                callback(err, result);
            }
        );
    };

    updateDesignName(userRole, designId, newName, callback){

        updateDesignName.call(
            {
                userRole: userRole,
                designId: designId,
                newName:  newName
            },
            (err, result) => {
                callback(err, result);
            }
        );
    };

    removeDesign(userRole, designId, callback){

        removeDesign.call(
            {
                userRole: userRole,
                designId: designId
            },
            (err, result) => {
                callback(err, result);
            }
        );
    };

}

export default new ServerDesignApi();