// == IMPORTS ==========================================================================================================

// Meteor / React Services
import React, { Component } from 'react';
import PropTypes from 'prop-types';

// Ultrawide Collections

// Ultrawide GUI Components

// Ultrawide Services

// Bootstrap

// REDUX services
import {connect} from 'react-redux';

// React DnD


// =====================================================================================================================

// -- CLASS ------------------------------------------------------------------------------------------------------------
//
// Wait Message Component - Shown when loading data
//
// ---------------------------------------------------------------------------------------------------------------------

class Wait extends Component {

    constructor(props) {
        super(props);

        this.state = {
        };
    }

    render() {
        const {userMessage, userContext} = this.props;

        return(
            <div>
                <div className="wait-message">
                    <div className="wait-message-main">
                        {userMessage.messageText}
                    </div>
                </div>
                <div className="wait-bar">
                    <div className="wait-animation"></div>
                </div>
            </div>
        );
    }
}

Wait.propTypes = {
    userMessage:     PropTypes.object.isRequired
};

// Redux function which maps state from the store to specific props this component is interested in.
function mapStateToProps(state) {
    return {
        userContext:        state.currentUserItemContext,
    }
}

// Connect the Redux store to this component ensuring that its required state is mapped to props
export default connect(mapStateToProps)(Wait);
