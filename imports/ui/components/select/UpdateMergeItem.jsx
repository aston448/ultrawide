// == IMPORTS ==========================================================================================================

// Meteor / React Services
import React, { Component } from 'react';
import PropTypes from 'prop-types';

// Ultrawide GUI Components

// Ultrawide Services
import {DesignUpdateMergeAction, LogLevel}    from '../../../constants/constants.js';
import {log} from "../../../common/utils";

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

        log((msg) => console.log(msg), LogLevel.PERF, 'Render Update Merge Item {}', updateItem.updateName);

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