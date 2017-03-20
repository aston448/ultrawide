// == IMPORTS ==========================================================================================================

// Meteor / React Services
import React, { Component, PropTypes } from 'react';

// Ultrawide Collections

// Ultrawide GUI Components

// Ultrawide Services

// Bootstrap
import {InputGroup, Glyphicon} from 'react-bootstrap';

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
            isHighlighted: false,
            checkboxChecked: this.props.checkboxValue
        }

    }

    highlightMe(){
        this.setState({isHighlighted: true})
    }

    unhighlightMe(){
        this.setState({isHighlighted: false})
    }

    action(){
        event.preventDefault();
        if(this.props.hasCheckbox) {
            this.setState({checkboxChecked: !this.state.checkboxChecked})
        }
        this.props.clickAction();
        this.props.actionFunction();
    }

    render() {

        const {itemName, actionFunction, hasCheckbox, checkboxValue} = this.props;

        const className = this.state.isHighlighted ? 'dropdown-item-name menu-highlight' : 'dropdown-item-name';
        const checkedStatus = this.state.checkboxChecked ? 'in-scope' : 'out-scope';

        if(hasCheckbox) {
            return (
                <li id={itemName}>
                    <InputGroup onMouseEnter={() => this.highlightMe()} onMouseLeave={() => this.unhighlightMe()} onMouseUp={() => this.action()}>
                        <InputGroup.Addon>
                            <div className={checkedStatus}><Glyphicon glyph="ok"/></div>
                        </InputGroup.Addon>
                        <div className={className}>{itemName}</div>
                    </InputGroup>
                </li>
            )
        } else {
            return (
                <li id={itemName}>
                    <div className={className} onMouseEnter={() => this.highlightMe()}
                         onMouseLeave={() => this.unhighlightMe()} onMouseUp={() => this.action()}>
                        {itemName}
                    </div>
                </li>
            )
        }
    }
}

UltrawideMenuDropdownItem.propTypes = {
    itemName: PropTypes.string.isRequired,
    actionFunction: PropTypes.func.isRequired,
    hasCheckbox: PropTypes.bool.isRequired,
    checkboxValue: PropTypes.bool.isRequired,
    clickAction: PropTypes.func.isRequired,
};