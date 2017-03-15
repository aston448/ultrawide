// == IMPORTS ==========================================================================================================

// Meteor / React Services
import React, { Component, PropTypes } from 'react';
import { createContainer } from 'meteor/react-meteor-data';

// Ultrawide GUI Components

// Ultrawide Services

import {DesignUpdateMergeAction} from '../../../constants/constants.js';

// Bootstrap

// REDUX services


// =====================================================================================================================

// -- CLASS ------------------------------------------------------------------------------------------------------------
//
// Update Merge Item - Represents a Design Update to be Included, Carried Forward or Ignored in a new Design Version
//
// ---------------------------------------------------------------------------------------------------------------------

class UpdateMergeItem extends Component {

    constructor(props) {
        super(props);
    }

    render(){
        const {updateItem} = this.props;

        let itemClass = '';

        switch(updateItem.updateMergeAction){
            case DesignUpdateMergeAction.MERGE_INCLUDE:
                itemClass = 'merge-include';
                break;
            case DesignUpdateMergeAction.MERGE_ROLL:
                itemClass = 'merge-roll';
                break;
            case DesignUpdateMergeAction.MERGE_IGNORE:
                itemClass = 'merge-ignore';
                break;
        }

        return(
            <div className={itemClass}>{updateItem.updateName}</div>
        )

    }
}

UpdateMergeItem.propTypes = {
    updateItem: PropTypes.object.isRequired
};

export default UpdateMergeItem;