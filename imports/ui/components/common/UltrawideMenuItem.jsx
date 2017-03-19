// == IMPORTS ==========================================================================================================

// Meteor / React Services
import React, { Component, PropTypes } from 'react';

// Ultrawide Collections

// Ultrawide GUI Components

// Ultrawide Services

// Bootstrap

// REDUX services

// =====================================================================================================================

// -- CLASS ------------------------------------------------------------------------------------------------------------
//
// Menu Item - Direct Action item in App Header menu
//
// ---------------------------------------------------------------------------------------------------------------------

export default class UltrawideMenuItem extends Component {

    constructor(props) {
        super(props);

        this.state = {
            isHighlighted: false
        }

    }

    highlightMe(){
        this.setState({isHighlighted: true})
    }

    unhighlightMe(){
        this.setState({isHighlighted: false})
    }

    action(){
        this.props.actionFunction()
    }

    render() {

        const {itemName, actionFunction} = this.props;

        const className = this.state.isHighlighted ? 'top-menu-item menu-highlight' : 'top-menu-item';

        return(
            <div className={className} onMouseEnter={() => this.highlightMe()} onMouseLeave={() => this.unhighlightMe()} onClick={() => this.action()}>{itemName}</div>
        )
    }
}

UltrawideMenuItem.propTypes = {
    itemName: PropTypes.string.isRequired,
    actionFunction: PropTypes.func.isRequired,
};
