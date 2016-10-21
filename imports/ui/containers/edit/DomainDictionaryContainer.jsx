// == IMPORTS ==========================================================================================================

// Meteor / React Services
import React, { Component, PropTypes } from 'react';
import { createContainer } from 'meteor/react-meteor-data';

// Ultrawide Collections


// Ultrawide GUI Components
import DesignComponentAdd from '../../components/common/DesignComponentAdd.jsx';
import DomainDictionaryTerm from '../../components/edit/DomainDictionaryTerm.jsx';

// Ultrawide Services
import { DisplayContext, ViewMode} from '../../../constants/constants.js';
import ClientContainerServices from '../../../apiClient/apiClientContainerServices.js';
import ClientDomainDictionaryServices from '../../../apiClient/apiClientDomainDictionary.js';

// Bootstrap
import { Panel } from 'react-bootstrap';

// REDUX services
import {connect} from 'react-redux';

// React DnD


// =====================================================================================================================

// -- CLASS ------------------------------------------------------------------------------------------------------------
//
// Scenario Steps Data Container - selects data for Steps in a Scenario
//
// ---------------------------------------------------------------------------------------------------------------------

// Scenarios List for a Feature or Feature Aspect
class DomainDictionary extends Component {
    constructor(props) {
        super(props);

    }

    addDictionaryTerm(view, mode, designId, designVersionId){
        ClientDomainDictionaryServices.addNewDictionaryTerm(view, mode, designId, designVersionId);
    }

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
        const {dictionaryTerms, view, mode, userItemContext} = this.props;

        let addDictionaryTerm = <div></div>;

        if( mode === ViewMode.MODE_EDIT){
            // Adding new terms is allowed
            addDictionaryTerm =
                <table>
                    <tbody>
                    <tr>
                        <td className="control-table-data">
                            <DesignComponentAdd
                                addText="Add new Domain Term"
                                onClick={ () => this.addDictionaryTerm(view, mode, userItemContext.designId, userItemContext.designVersionId)}
                            />
                        </td>
                    </tr>
                    </tbody>
                </table>
        }

        return (
            <div>
                <Panel className="panel-steps panel-steps-body" header="Domain Dictionary">
                    <div className="scroll-col">
                        {this.renderDictionaryTerms(dictionaryTerms)}
                        {addDictionaryTerm}
                    </div>
                </Panel>
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
        view: state.currentAppView,
        mode: state.currentViewMode,
        userItemContext: state.currentUserItemContext
    }
}

// Connect the Redux store to this component ensuring that its required state is mapped to props
DomainDictionary = connect(mapStateToProps)(DomainDictionary);

export default ScenarioStepsContainer = createContainer(({params}) => {

    return ClientContainerServices.getDomainDictionaryTerms(
        params.designId,
        params.designVersionId
    );

}, DomainDictionary);