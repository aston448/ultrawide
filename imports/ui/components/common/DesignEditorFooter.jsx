// == IMPORTS ==========================================================================================================

// Meteor / React Services
import React, { Component, PropTypes } from 'react';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';

// Ultrawide Collections

// Ultrawide GUI Components
import DesignSummary                    from '../../components/edit/DesignSummary.jsx';

// Ultrawide Services
import {} from '../../../constants/constants.js';
import ClientUserContextServices    from '../../../apiClient/apiClientUserContext.js';

// Bootstrap

// REDUX services
import {connect} from 'react-redux';

// =====================================================================================================================

// -- CLASS ------------------------------------------------------------------------------------------------------------
//
// Design Editor Footer
//
// ---------------------------------------------------------------------------------------------------------------------

export class DesignEditorFooter extends Component {
    constructor(props) {
        super(props);

    }

    getNameData(userContext){
        return ClientUserContextServices.getContextNameData(userContext);
    }

    getFooterText(userContext){

        const nameData = this.getNameData(userContext);

        if(userContext.workPackageId != 'NONE'){
            if(userContext.designUpdateId != 'NONE'){
                return nameData.design + ' - ' + nameData.designVersion + ' - ' + nameData.designUpdate;
            } else {
                return nameData.design + ' - ' + nameData.designVersion
            }
        } else {
            if(userContext.designUpdateId != 'NONE'){
                return nameData.design + ' - ' + nameData.designVersion;
            } else {
                return nameData.design
            }
        }

    }

    render() {

        const {hasDesignSummary, designSummaryData, userContext} = this.props;

        if(hasDesignSummary && designSummaryData) {
            return (
                <div className="design-editor-footer">
                    <DesignSummary
                        summaryData={designSummaryData}
                    />
                </div>
            );
        } else {
            return (
                <div className="design-editor-footer">
                    <div className="details-footer-note">{this.getFooterText(userContext)}</div>
                </div>
            );
        }
    }
}

DesignEditorFooter.propTypes = {
    hasDesignSummary: PropTypes.bool.isRequired,
    designSummaryData:  PropTypes.object
};

// Redux function which maps state from the store to specific props this component is interested in.
function mapStateToProps(state) {
    return {
        userContext:            state.currentUserItemContext,

    }
}

// Connect the Redux store to this component ensuring that its required state is mapped to props
export default connect(mapStateToProps)(DesignEditorFooter);