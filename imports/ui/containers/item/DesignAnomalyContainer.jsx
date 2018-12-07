// == IMPORTS ==========================================================================================================

// Meteor / React Services
import React, { Component } from 'react';
import PropTypes            from 'prop-types';
import { createContainer }  from 'meteor/react-meteor-data';

// Ultrawide Collections

// Ultrawide GUI Components
import DesignAnomaly        from '../../components/item/DesignAnomaly.jsx';
import ItemList             from '../../components/item/ItemList.jsx';

// Ultrawide Services
import {log} from "../../../common/utils";
import {ItemType, ItemListType, RoleType, LogLevel}           from '../../../constants/constants.js';
import {AddActionIds}       from "../../../constants/ui_context_ids.js";

import { ClientDataServices }   from '../../../apiClient/apiClientDataServices.js';
import { ClientDesignAnomalyServices } from '../../../apiClient/apiClientDesignAnomaly.js';


// REDUX services
import {connect} from 'react-redux';
import {ComponentType} from "../../../constants/constants";


// =====================================================================================================================

// -- CLASS ------------------------------------------------------------------------------------------------------------
//
// Design Anomalies Container - Contains list of Anomalies posted for a Feature or Scenario
//
// ---------------------------------------------------------------------------------------------------------------------

export class DesignAnomalyList extends Component {
    constructor(props) {
        super(props);

    }

    addNewDesignAnomaly(role, userContext) {
        ClientDesignAnomalyServices.addNewDesignAnomaly(role, userContext.designVersionId, userContext.featureReferenceId, userContext.scenarioReferenceId);
    }

    renderDesignAnomalyList(designAnomalies){
        return designAnomalies.map((anomaly) => {
            return (
                <DesignAnomaly
                    key={anomaly._id}
                    designAnomaly={anomaly}
                />
            );
        });
    }

    noDesignAnomalies(userContext){

        let returnText = 'Select a Feature or Scenario to see Design Anomalies';

        if(userContext.designComponentType === ComponentType.FEATURE || userContext.designComponentType === ComponentType.SCENARIO){

            returnText = 'No Design Anomalies'
        }

        return (
            <div className="design-item-note">{returnText}</div>
        );
    }

    render() {

        const {designAnomalies, userRole, userContext} = this.props;

        log((msg) => console.log(msg), LogLevel.PERF, 'Render CONTAINER Design Anomalies');

        let hasFooterAction = false;
        let footerActionFunction = null;
        let bodyDataFunction = null;

        if((userContext.designComponentType === ComponentType.FEATURE || userContext.designComponentType === ComponentType.SCENARIO) && userRole !== RoleType.GUEST_VIEWER){
            hasFooterAction = true;
            footerActionFunction = () => this.addNewDesignAnomaly(userRole, userContext)
        }

        if(designAnomalies && designAnomalies.length > 0) {
            bodyDataFunction = () => this.renderDesignAnomalyList(designAnomalies)
        } else {
            bodyDataFunction = () => this.noDesignAnomalies(userContext)
        }

        return(
            <div >
                <ItemList
                    headerText={'Design Anomalies'}
                    bodyDataFunction={bodyDataFunction}
                    hasFooterAction={hasFooterAction}
                    footerAction={'Add Design Anomaly'}
                    footerActionUiContext={AddActionIds.UI_CONTEXT_ADD_DESIGN_ANOMALY}
                    footerActionFunction={footerActionFunction}
                    listType={ItemListType.DESIGN_ANOMALY}
                />
            </div>
        )

    }
}

DesignAnomalyList.propTypes = {
    designAnomalies: PropTypes.array.isRequired
};


// Redux function which maps state from the store to specific props this component is interested in.
function mapStateToProps(state) {

    return {
        userRole: state.currentUserRole,
        userContext: state.currentUserItemContext
    }
}

// Connect the Redux store to this component ensuring that its required state is mapped to props
export default DesignAnomalyContainer = createContainer(({params}) => {

    // Gets the currently saved user context and a list of known Designs
    const designAnomalies = ClientDataServices.getDesignAnomalies(params.userContext);

    return{
        designAnomalies: designAnomalies
    }

}, connect(mapStateToProps)(DesignAnomalyList));