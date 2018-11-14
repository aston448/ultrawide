
// == IMPORTS ==========================================================================================================

// Meteor / React Services
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { createContainer } from 'meteor/react-meteor-data';

// Ultrawide GUI Components
import DesignPermutationValue               from '../../components/configure/DesignPermutationValue.jsx';
import ItemList                             from '../../components/item/ItemList.jsx';

// Ultrawide Services
import {log} from "../../../common/utils";
import {ItemListType, LogLevel} from "../../../constants/constants";
import {AddActionIds}                       from "../../../constants/ui_context_ids.js";

import { ClientDataServices }                   from '../../../apiClient/apiClientDataServices.js';
import { ClientDesignPermutationServices }     from '../../../apiClient/apiClientDesignPermutation.js'

// Bootstrap
import {Grid, Row, Col} from 'react-bootstrap';

// REDUX services
import {connect} from 'react-redux';




// =====================================================================================================================

// -- CLASS ------------------------------------------------------------------------------------------------------------
//
// Design Permutation Values Container - List of defined values for a Design Permutation
//
// ---------------------------------------------------------------------------------------------------------------------

export class DesignPermutationValuesScreen extends Component {
    constructor(props) {
        super(props);

    };

    addNewPermutationValue() {
        ClientDesignPermutationServices.addPermutationValue(this.props.userRole, this.props.permutationId, this.props.userContext.designVersionId);
    };

    renderPermutationValuesList(permutationValues){
        return permutationValues.map((permutationValue) => {
            return (
                <DesignPermutationValue
                    key={permutationValue._id}
                    permutationValue={permutationValue}
                />
            );
        });
    };

    noPermutationValues(){
        return(
            <div className="design-item-note">No Values Set</div>
        )
    }

    render() {

        const {permutationValuesData, permutationName, permutationId} = this.props;

        log((msg) => console.log(msg), LogLevel.PERF, 'Render CONTAINER Design Permutation Values');

        let bodyDataFunction = null;

        if(permutationValuesData && permutationValuesData.length > 0) {
            bodyDataFunction = () => this.renderPermutationValuesList(permutationValuesData);
        } else {
            bodyDataFunction = () => this.noPermutationValues();
        }

        let headerText = 'Select a permutation...';
        if(permutationId !== 'NONE'){
            headerText = 'Permutation Values for ' + permutationName;
        }

        return (
            <ItemList
                headerText={headerText}
                bodyDataFunction={bodyDataFunction}
                hasFooterAction={true}
                footerAction={'Add New Value'}
                footerActionUiContext={AddActionIds.UI_CONTEXT_ADD_PERMUTATION_VALUE}
                footerActionFunction={() => this.addNewPermutationValue()}
                listType={ItemListType.ULTRAWIDE_ITEM}
            />
        );
    };
}

DesignPermutationValuesScreen.propTypes = {
    permutationValuesData:      PropTypes.array.isRequired,
    permutationId:              PropTypes.string.isRequired,
    permutationName:            PropTypes.string.isRequired
};

// Redux function which maps state from the store to specific props this component is interested in.
function mapStateToProps(state) {
    return {
        userRole:       state.currentUserRole,
        userContext:    state.currentUserItemContext
    }
}

// Connect the Redux store to this component ensuring that its required state is mapped to props
export default DesignPermutationValuesContainer = createContainer(({params}) => {

    const permutationValuesData =  ClientDataServices.getPermutationValuesData(
        params.permutationId,
        params.designVersionId
    );

    return {
        permutationValuesData: permutationValuesData.data,
        permutationId: params.permutationId,
        permutationName: permutationValuesData.name,
    };

}, connect(mapStateToProps)(DesignPermutationValuesScreen));