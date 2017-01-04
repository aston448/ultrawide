// == IMPORTS ==========================================================================================================

// Meteor / React Services
import React, { Component, PropTypes } from 'react';
import { createContainer } from 'meteor/react-meteor-data';

// Ultrawide GUI Components
import IntegrationTestScenarioMashContainer         from '../../containers/dev/WorkPackageScenarioMashContainer.jsx'

// Ultrawide Services
import {DisplayContext} from '../../../constants/constants.js';

// Bootstrap
import {Grid, Row, Col} from 'react-bootstrap';
import {InputGroup, Label} from 'react-bootstrap';

// REDUX services
import {connect} from 'react-redux';

// React DnD - Component is draggable


// Draft JS


// =====================================================================================================================

// -- CLASS ------------------------------------------------------------------------------------------------------------
//
// WP Mash Feature Aspect Component - One Feature Aspect containing its Scenarios
//
// ---------------------------------------------------------------------------------------------------------------------

class WorkPackageFeatureAspectMashItem extends Component {

    constructor(props) {
        super(props);

        this.state = {

        };

    }

    shouldComponentUpdate(nextProps, nextState){
        return true;
    }

    render(){
        const { mashItem, displayContext, userContext } = this.props;

        if(mashItem.hasChildren){
            return (
                <div>
                    <InputGroup>
                        <div className={"mash-aspect"}>
                            {mashItem.designComponentName}
                        </div>
                    </InputGroup>
                    <IntegrationTestScenarioMashContainer params={{
                        userContext: userContext,
                        parentMash: mashItem,
                        displayContext: displayContext
                    }}/>
                </div>
            )
        } else {
            return(<div></div>);
        }
    }

}

WorkPackageFeatureAspectMashItem.propTypes = {
    mashItem: PropTypes.object.isRequired,
    displayContext: PropTypes.string.isRequired
};

// Redux function which maps state from the store to specific props this component is interested in.
function mapStateToProps(state) {
    return {
        userContext: state.currentUserItemContext
    }
}

// Connect the Redux store to this component ensuring that its required state is mapped to props
WorkPackageFeatureAspectMashItem = connect(mapStateToProps)(WorkPackageFeatureAspectMashItem);

export default WorkPackageFeatureAspectMashItem;