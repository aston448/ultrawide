// == IMPORTS ==========================================================================================================

// Meteor / React Services
import React, { Component, PropTypes } from 'react';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';

// Ultrawide Collections

// Ultrawide GUI Components
import DesignComponentAdd                    from '../../components/common/DesignComponentAdd.jsx';

// Ultrawide Services
import {DetailsViewType} from '../../../constants/constants.js';

import ClientDomainDictionaryServices from '../../../apiClient/apiClientDomainDictionary.js';

// Bootstrap
import {Grid, Col, Row} from 'react-bootstrap';
import {Panel} from 'react-bootstrap';

// REDUX services
import {connect} from 'react-redux';

// =====================================================================================================================

// -- CLASS ------------------------------------------------------------------------------------------------------------
//
// Details View Footer
//
// ---------------------------------------------------------------------------------------------------------------------

export default class DetailsViewFooter extends Component {
    constructor(props) {
        super(props);

    }

    addDomainTerm(userRole, view, mode, designId, designVersionId){
        ClientDomainDictionaryServices.addNewDictionaryTerm(userRole, view, mode, designId, designVersionId);
    }

    render() {

        const {detailsType, view, mode, userRole, userContext} = this.props;

        let footerContent = <div></div>;
        let footerClass = 'design-editor-footer';
        
        switch(detailsType){
            case DetailsViewType.VIEW_INT_TESTS:
                break;
            case DetailsViewType.VIEW_DOM_DICT:

                footerContent =
                    <div id="addDomainTerm">
                        <DesignComponentAdd
                            addText="Add new Domain Term"
                            onClick={() => this.addDomainTerm(userRole, view, mode, userContext.designId, userContext.designVersionId)}
                        />
                    </div>;
                break;

            case DetailsViewType.VIEW_DETAILS_NEW:
            case DetailsViewType.VIEW_DETAILS_OLD:
                footerClass = 'details-editor-footer';
                break;

        }
        
        return(
            <div className={footerClass}>
                {footerContent}
            </div>
        );
    }
}

DetailsViewFooter.propTypes = {
    detailsType:        PropTypes.string.isRequired,
    view:               PropTypes.string.isRequired,
    mode:               PropTypes.string.isRequired,
    userRole:           PropTypes.string.isRequired,
    userContext:        PropTypes.object.isRequired
};