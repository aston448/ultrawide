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

export default class UltrawideMenuDropdownItem extends Component {

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
        //event.preventDefault();
        this.props.clickAction();
        this.props.actionFunction();
    }

    render() {

        const {itemName, actionFunction} = this.props;

        const className = this.state.isHighlighted ? 'dropdown-menu-item menu-highlight' : 'dropdown-menu-item';

        console.log("Render " + className);

        return(
            <li id={itemName}>
                <div className={className} onMouseEnter={() => this.highlightMe()} onMouseLeave={() => this.unhighlightMe()} onMouseUp={() => this.action()}>
                    {itemName}
                </div>
            </li>
        )
    }
}

UltrawideMenuDropdownItem.propTypes = {
    itemName: PropTypes.string.isRequired,
    actionFunction: PropTypes.func.isRequired,
    hasCheckbox: PropTypes.bool.isRequired,
    clickAction: PropTypes.func.isRequired,
};