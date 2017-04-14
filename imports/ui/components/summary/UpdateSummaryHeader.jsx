// == IMPORTS ==========================================================================================================

// Meteor / React Services
import React, { Component, PropTypes } from 'react';
import { createContainer } from 'meteor/react-meteor-data';

// Ultrawide GUI Components
import UpdateSummaryActionContainer from '../../containers/summary/UpdateSummaryActionContainer.jsx';

// Ultrawide Services
import {DesignUpdateSummaryType, ComponentType} from '../../../constants/constants.js';

// Bootstrap

// REDUX services


// =====================================================================================================================

// -- CLASS ------------------------------------------------------------------------------------------------------------
//
// Design Update Summary Header Component - Graphically represents the modified parent to which actions happened
//
// ---------------------------------------------------------------------------------------------------------------------

class UpdateSummaryHeader extends Component {
    constructor(props) {
        super(props);
    }

    render(){
        const {headerItem} = this.props;

        let itemHeader = <div></div>;
        let item = <div></div>;
        let iconClassName = 'summary-icon';

        // Show Feature if header is a Feature Aspect
        let headerName = headerItem.itemName;

        if(headerItem.itemType === ComponentType.FEATURE_ASPECT){
            headerName = headerItem.itemFeatureName + ' - ' + headerItem.itemName;
        }

        switch(headerItem.summaryType){

            case DesignUpdateSummaryType.SUMMARY_ADD_TO:

                itemHeader =
                    <div className="summary-header">
                        <span className="summary-modify">MODIFY:</span>
                        <span className="summary-header-item">{headerName}</span>
                        <span className="summary-add">ADD:</span>
                    </div>;

                iconClassName += ' item-new';
                break;

            case DesignUpdateSummaryType.SUMMARY_REMOVE_FROM:

                itemHeader =
                    <div className="summary-header">
                        <span className="summary-modify">MODIFY:</span>
                        <span className="summary-header-item">{headerName}</span>
                        <span className="summary-remove">REMOVE:</span>
                    </div>;

                iconClassName += ' item-old';
                break;

            case DesignUpdateSummaryType.SUMMARY_CHANGE_IN:

                    itemHeader =
                        <div className="summary-header">
                            <span className="summary-modify">MODIFY:</span>
                            <span className="summary-header-item">{headerName}</span>
                            <span className="summary-modify">CHANGE:</span>
                        </div>;
                break;

            case DesignUpdateSummaryType.SUMMARY_QUERY_IN:

                itemHeader =
                    <div className="summary-header">
                        <span className="summary-modify">CHECK TESTS FOR:</span>
                        <span className="summary-header-item">{headerName}</span>
                    </div>;
                break;
        }

        return(
            <div className="summary-header-group">
                {itemHeader}
                <UpdateSummaryActionContainer params={{
                    headerId: headerItem._id
                }}/>
            </div>
        )

    }
}

UpdateSummaryHeader.propTypes = {
    headerItem: PropTypes.object.isRequired
};

export default UpdateSummaryHeader;