// == IMPORTS ==========================================================================================================

// Meteor / React Services
import React, { Component, PropTypes } from 'react';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';

// Ultrawide Collections

// Ultrawide GUI Components
import DesignSummary                    from '../../components/edit/DesignSummary.jsx';

// Ultrawide Services
import {RoleType} from '../../../constants/constants.js';
import ClientContainerServices from '../../../apiClient/apiClientContainerServices.js';
import ClientDesignServices from  '../../../apiClient/apiClientDesign.js';

// Bootstrap
import {Grid, Col, Row} from 'react-bootstrap';
import {Panel} from 'react-bootstrap';

// REDUX services
import {connect} from 'react-redux';

// =====================================================================================================================

// -- CLASS ------------------------------------------------------------------------------------------------------------
//
// Design Editor Footer
//
// ---------------------------------------------------------------------------------------------------------------------

export default class DesignEditorFooter extends Component {
    constructor(props) {
        super(props);

    }

    render() {

        const {view, mode, userContext, designSummaryData} = this.props;

        if(designSummaryData) {
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
                    <div className="details-footer-note">Show Test Summary to see Design Summary</div>
                </div>
            );
        }
    }
}

DesignEditorFooter.propTypes = {
    view:               PropTypes.string.isRequired,
    mode:               PropTypes.string.isRequired,
    userContext:        PropTypes.object.isRequired,
    designSummaryData:  PropTypes.object
};