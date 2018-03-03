// == IMPORTS ==========================================================================================================

// Meteor / React Services
import React, { Component } from 'react';
import PropTypes from 'prop-types';

// Ultrawide Collections

// Ultrawide GUI Components

// Ultrawide Services
import {log} from "../../../common/utils";
import {LogLevel} from "../../../constants/constants";

import ClientWorkPackageServices    from "../../../apiClient/apiClientWorkPackage";
import ItemStatusUiModules          from '../../../ui_modules/item_status.js';

// Bootstrap
import {}                 from 'react-bootstrap';


// REDUX services
import {connect} from 'react-redux';



// React DnD


// =====================================================================================================================

// -- CLASS ------------------------------------------------------------------------------------------------------------
//
// Design Item Status Component - Status for design items, e.g. Design, Design Version, Design Update
//
// ---------------------------------------------------------------------------------------------------------------------

export class ItemStatus extends Component{

    constructor(...args){
        super(...args);

    }

    getAdopterName(userId){
        return ClientWorkPackageServices.getAdopterName(userId)
    }

    render(){
        const {currentItemStatus, currentItemType, itemStatusClass, adoptingUserId, wpTestStatus, userRole} = this.props;

        log((msg) => console.log(msg), LogLevel.PERF, 'Render Item Status {}', currentItemStatus);

        const statusString = ItemStatusUiModules.getStatusString(currentItemType, currentItemStatus, wpTestStatus, this.getAdopterName(adoptingUserId));

        return (
            <div className={'design-item-status ' + itemStatusClass}>
                {statusString}
            </div>
        );

    }
}

ItemStatus.propTypes = {
    currentItemType: PropTypes.string.isRequired,
    currentItemStatus: PropTypes.string.isRequired,
    itemStatusClass: PropTypes.string.isRequired,
    adoptingUserId: PropTypes.string,
    wpTestStatus: PropTypes.string
};

// Redux function which maps state from the store to specific props this component is interested in.
function mapStateToProps(state) {
    return {
        userRole: state.currentUserRole
    }
}

// Connect the Redux store to this component ensuring that its required state is mapped to props
export default connect(mapStateToProps)(ItemStatus);



