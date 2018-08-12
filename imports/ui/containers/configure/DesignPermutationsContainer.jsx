
// == IMPORTS ==========================================================================================================

// Meteor / React Services
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { createContainer } from 'meteor/react-meteor-data';

// Ultrawide GUI Components
import DesignPermutation                    from '../../components/configure/DesignPermutation.jsx';
import DesignPermutationValuesContainer     from '../../containers/configure/DesignPermutationValuesContainer.jsx';
import ItemList                             from '../../components/select/ItemList.jsx';

// Ultrawide Services
import {log} from "../../../common/utils";
import {LogLevel} from "../../../constants/constants";
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
// Design Permutations Container - List of defined permutations for this Design
//
// ---------------------------------------------------------------------------------------------------------------------

export class DesignPermutationsScreen extends Component {
    constructor(props) {
        super(props);

    };

    addNewPermutation(role, userContext) {
        ClientDesignPermutationServices.addDesignPermutation(role, userContext);
    };

    renderPermutationsList(permutations){
        return permutations.map((permutation) => {
            return (
                <DesignPermutation
                    key={permutation._id}
                    permutation={permutation}
                />
            );
        });
    };

    noPermutations(){
        return(
            <div className="design-item-note">No Permutations Set</div>
        )
    }

    render() {

        const {permutationData, userRole, userContext, permutationId} = this.props;

        log((msg) => console.log(msg), LogLevel.PERF, 'Render CONTAINER Design Permutations');

        let bodyDataFunction = null;

        if(permutationData && permutationData.length > 0) {
            bodyDataFunction = () => this.renderPermutationsList(permutationData);
        } else {
            bodyDataFunction = () => this.noPermutations();
        }

        return (
            <Grid>
                <Row>
                    <Col md={6} className="close-col">
                        <ItemList
                            headerText={'Design Permutations'}
                            bodyDataFunction={bodyDataFunction}
                            hasFooterAction={true}
                            footerAction={'Add Permutation'}
                            footerActionUiContext={AddActionIds.UI_CONTEXT_ADD_DESIGN_PERMUTATION}
                            footerActionFunction={() => this.addNewPermutation(userRole, userContext)}
                        />
                    </Col>
                    <Col md={6} className="col">
                        <DesignPermutationValuesContainer params={{
                            permutationId: permutationId,
                            designVersionId: userContext.designVersionId
                        }}/>
                    </Col>
                </Row>
            </Grid>
        );


    };
}

DesignPermutationsScreen.propTypes = {
    permutationData:       PropTypes.array.isRequired
};

// Redux function which maps state from the store to specific props this component is interested in.
function mapStateToProps(state) {
    return {
        userRole:       state.currentUserRole,
        userContext:    state.currentUserItemContext,
        permutationId:  state.currentUserDesignPermutationId
    }
}

// Connect the Redux store to this component ensuring that its required state is mapped to props
export default DesignPermutationsContainer = createContainer(({params}) => {

    const permutationData =  ClientDataServices.getDesignPermutationsData(params.userContext.designId);

    return {permutationData: permutationData};

}, connect(mapStateToProps)(DesignPermutationsScreen));