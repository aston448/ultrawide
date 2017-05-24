// == IMPORTS ==========================================================================================================

// Meteor / React Services
import React, { Component} from 'react';

// Ultrawide Collections

// Ultrawide GUI Components

// Ultrawide Services
import { MessageType } from '../../../constants/constants.js';
// Bootstrap

// REDUX services
import {connect} from 'react-redux';

// React DnD


// =====================================================================================================================

// -- CLASS ------------------------------------------------------------------------------------------------------------
//
// HeaderMessage
//
// ---------------------------------------------------------------------------------------------------------------------


// App Body component - represents all the design content
export class HeaderMessage extends Component {

    constructor(props) {
        super(props);

        this.state = {
            displayClass: props.message.messageType + '1'
        };
    }

    componentWillReceiveProps(newProps){

        // When message changes toggle between animations so the animation runs
        if(newProps.message.messageText !== this.props.message.messageText || (newProps.message.messageType === MessageType.ERROR)){

            if(this.state.displayClass.endsWith('1')){
                this.setState({displayClass: newProps.message.messageType + '2'});
            } else {
                this.setState({displayClass: newProps.message.messageType + '1'});
            }

        }
    }

    render() {
        const {message} = this.props;

        return(
            <div id="headerMessage" className={'header-message ' + this.state.displayClass}>
                {message.messageText}
            </div>
        )

    }
}

HeaderMessage.propTypes = {
};

// Redux function which maps state from the store to specific props this component is interested in.
function mapStateToProps(state) {
    return {
        message:        state.currentUserMessage,
    }
}

// Connect the Redux store to this component ensuring that its required state is mapped to props
export default connect(mapStateToProps)(HeaderMessage);