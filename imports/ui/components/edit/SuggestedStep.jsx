// == IMPORTS ==========================================================================================================

// Meteor / React Services
import React, { Component, PropTypes } from 'react';
import { createContainer } from 'meteor/react-meteor-data';

// Ultrawide Collections


// Ultrawide GUI Components


// Ultrawide Services
import { ItemType } from '../../../constants/constants.js';
import ClientDesignServices from '../../../apiClient/apiClientDesign.js';

// Bootstrap
import {InputGroup, Glyphicon} from 'react-bootstrap';

// REDUX services
import {connect} from 'react-redux';

// React DnD


// =====================================================================================================================

// -- CLASS ------------------------------------------------------------------------------------------------------------
//
// Suggested Step Component - Represents one suggested step for the Scenario Steps editor
//
// ---------------------------------------------------------------------------------------------------------------------

class SuggestedStep extends Component {
    constructor(props) {
        super(props);

        this.state = {
            highlighted: false,
        };
    }

    // Highlight the item
    setActive(){
        this.setState({highlighted: true});
    }

    // Switch off highlighting when mouse not over
    setInactive(){
        this.setState({highlighted: false});
    }

    onAcceptStepText(){
        this.props.callback(this.props.stepText);
    }

    render() {
        const {stepText} = this.props;

        let suggestedStepClass = (this.state.highlighted ? 'suggested-step suggested-highlight' : 'suggested-step')

        return (
            <div className={suggestedStepClass} onMouseUp={ () => this.onAcceptStepText()} onMouseEnter={ () => this.setActive()} onMouseLeave={ () => this.setInactive()}>
                {stepText}
            </div>
        )
    }
}

SuggestedStep.propTypes = {
    stepText: PropTypes.string.isRequired,
    callback: PropTypes.func.isRequired
};

// Redux function which maps state from the store to specific props this component is interested in.
function mapStateToProps(state) {
    return {
        currentUserItemContext: state.currentUserItemContext
    }
}

// Connect the Redux store to this component ensuring that its required state is mapped to props
SuggestedStep = connect(mapStateToProps)(SuggestedStep);

export default SuggestedStep;