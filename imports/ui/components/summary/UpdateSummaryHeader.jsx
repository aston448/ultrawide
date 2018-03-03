// == IMPORTS ==========================================================================================================

// Meteor / React Services
import React, { Component } from 'react';
import PropTypes from 'prop-types';

// Ultrawide GUI Components
import UpdateSummaryActionContainer from '../../containers/summary/UpdateSummaryActionContainer.jsx';

// Ultrawide Services
import {log} from "../../../common/utils";
import {DesignUpdateSummaryType, ComponentType, LogLevel} from '../../../constants/constants.js';

// Bootstrap

// REDUX services
import {connect} from 'react-redux';


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
        const {headerItem, userContext} = this.props;

        log((msg) => console.log(msg), LogLevel.PERF, 'Render Update Summary Header');

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

        //console.log("Rendering header item: " + itemHeader);

        return(
            <div className="summary-header-group">
                {itemHeader}
                <UpdateSummaryActionContainer params={{
                    headerId: headerItem._id,
                    userContext: userContext
                }}/>
            </div>
        )

    }
}

UpdateSummaryHeader.propTypes = {
    headerItem: PropTypes.object.isRequired
};

// Redux function which maps state from the store to specific props this component is interested in.
function mapStateToProps(state) {
    return {
        userContext: state.currentUserItemContext
    }
}

export default connect(mapStateToProps)(UpdateSummaryHeader);