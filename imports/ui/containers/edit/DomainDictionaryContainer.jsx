// == IMPORTS ==========================================================================================================

// Meteor / React Services
import React, { Component, PropTypes } from 'react';
import { createContainer } from 'meteor/react-meteor-data';

// Ultrawide Collections


// Ultrawide GUI Components
import DesignComponentAdd from '../../components/common/DesignComponentAdd.jsx';
import DomainDictionaryTerm from '../../components/edit/DomainDictionaryTerm.jsx';
import DetailsViewHeader    from '../../components/common/DetailsViewHeader.jsx';
import DetailsViewFooter    from '../../components/common/DetailsViewFooter.jsx';

// Ultrawide Services
import { DetailsViewType, ViewMode} from '../../../constants/constants.js';
import ClientContainerServices from '../../../apiClient/apiClientContainerServices.js';
import ClientDomainDictionaryServices from '../../../apiClient/apiClientDomainDictionary.js';

// Bootstrap

// REDUX services
import {connect} from 'react-redux';

// React DnD


// =====================================================================================================================

// -- CLASS ------------------------------------------------------------------------------------------------------------
//
// Domain Dictionary Data Container
//
// ---------------------------------------------------------------------------------------------------------------------

// Scenarios List for a Feature or Feature Aspect
class DomainDictionary extends Component {
    constructor(props) {
        super(props);

    }

    // onAddDictionaryTerm(userRole, view, mode, designId, designVersionId){
    //     ClientDomainDictionaryServices.addNewDictionaryTerm(userRole, view, mode, designId, designVersionId);
    // }

    // A list of Scenarios in a Feature or Feature Aspect
    renderDictionaryTerms(dictionaryTerms) {

        return dictionaryTerms.map((term) => {
            return(
                <DomainDictionaryTerm
                    key={term._id}
                    dictionaryTerm={term}
                />
            )
        });
    }

    render() {
        const {dictionaryTerms, userRole, view, mode, userContext, userViewOptions, viewDataValue} = this.props;

        let addDictionaryTerm = <div></div>;

        return (
            <div className="design-editor-container">
                <DetailsViewHeader
                    detailsType={DetailsViewType.VIEW_DOM_DICT}
                    actionsVisible={false}
                    titleText={'Domain Dictionary'}
                    view={view}
                    mode={mode}
                    userContext={userContext}
                    userRole={userRole}
                    userViewOptions={userViewOptions}
                    currentViewDataValue={viewDataValue}
                />
                <div className="design-editor">
                    {this.renderDictionaryTerms(dictionaryTerms)}
                </div>
                <DetailsViewFooter
                    detailsType={DetailsViewType.VIEW_DOM_DICT}
                    view={view}
                    mode={mode}
                    userRole={userRole}
                    userContext={userContext}
                />
            </div>
        );
    }
}

DomainDictionary.propTypes = {
    dictionaryTerms: PropTypes.array.isRequired
};

// Redux function which maps state from the store to specific props this component is interested in.
function mapStateToProps(state) {
    return {
        userRole: state.currentUserRole,
        view: state.currentAppView,
        mode: state.currentViewMode,
        userContext: state.currentUserItemContext,
        userViewOptions: state.currentUserViewOptions,
        viewDataValue: state.currentViewOptionsDataValue
    }
}

// Connect the Redux store to this component ensuring that its required state is mapped to props
DomainDictionary = connect(mapStateToProps)(DomainDictionary);

export default DomainDictionaryContainer = createContainer(({params}) => {

    return ClientContainerServices.getDomainDictionaryTerms(
        params.designId,
        params.designVersionId
    );

}, DomainDictionary);