// == IMPORTS ==========================================================================================================

// Meteor / React Services
import React, { Component } from 'react';
import PropTypes from 'prop-types';

// Ultrawide Collections


// Ultrawide GUI Components


// Ultrawide Services


// Bootstrap
import {InputGroup} from 'react-bootstrap';
import {Glyphicon} from 'react-bootstrap';

// REDUX services


// React DnD


// =====================================================================================================================

// -- CLASS ------------------------------------------------------------------------------------------------------------
//
// Design Component Add Component - A generic component to add new things to Ultrawide
//
// Used to add new components to a design / design update.  Also to add new Designs and Design Updates
//
// ---------------------------------------------------------------------------------------------------------------------


export default class DesignComponentAdd extends Component {
    constructor(props) {
        super(props);

        this.state = {
            addActive: false
        };
    }

    // Passes back the click to the parent component
    clickHandler(){
        if (typeof this.props.onClick === 'function') {
            this.props.onClick();
        }
    }

    // Highlight the item and the parent component it will add stuff to when mouse over
    setAddActive(){
        this.setState({addActive: true});
        if(this.props.toggleHighlight) {
            this.props.toggleHighlight(true);
        }
    }

    // Switch off highlighting when mouse not over
    setAddInactive(){
        this.setState({addActive: false});
        if(this.props.toggleHighlight) {
            this.props.toggleHighlight(false);
        }
    }

    render() {
        return (
            <div>
                <InputGroup onClick={ () => this.clickHandler()}  onMouseEnter={ () => this.setAddActive()} onMouseLeave={ () => this.setAddInactive()}>
                    <InputGroup.Addon>
                        <div className={this.state.addActive ? 'add-icon-active' : 'add-icon'}><Glyphicon glyph='plus'/></div>
                    </InputGroup.Addon>
                    <div className={this.state.addActive ? 'add-label-active' : 'add-label'}>{this.props.addText}</div>
                </InputGroup>

            </div>
        );
    }
}

DesignComponentAdd.propTypes = {
    addText: PropTypes.string.isRequired,
    onClick: PropTypes.func.isRequired,
    toggleHighlight: PropTypes.func
};
