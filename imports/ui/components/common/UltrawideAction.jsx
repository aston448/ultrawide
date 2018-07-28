// == IMPORTS ==========================================================================================================

// Meteor / React Services
import React, { Component } from 'react';
import PropTypes from 'prop-types';

// Ultrawide Services
import {LogLevel} from '../../../constants/constants.js';
import {log, getContextID} from "../../../common/utils";
import { UI } from '../../../constants/ui_context_ids';


// Bootstrap
import {InputGroup}                 from 'react-bootstrap';
import {Glyphicon}                  from 'react-bootstrap';
import {Tooltip, OverlayTrigger}    from 'react-bootstrap';


// =====================================================================================================================

// -- CLASS ------------------------------------------------------------------------------------------------------------
//
// Action Component - Edit, delete, move etc...
//
// ---------------------------------------------------------------------------------------------------------------------

export default class UltrawideAction  extends Component{

    constructor(...args){
        super(...args);

        this.state = {
            isSelectable: false
        };

    }

    setSelectable(){
        this.setState({isSelectable: true});
    }

    setUnselectable(){
        this.setState({isSelectable: false});
    }

    actionHandler(){

        if (typeof this.props.actionFunction === 'function') {
            this.props.actionFunction();
        }
    }


    render(){
        const {actionType, uiContextName, actionFunction, isDeleted} = this.props;

        log((msg) => console.log(msg), LogLevel.PERF, 'Render Action {}', actionType);

        let layout = '';
        let tooltipText = '';
        let tooltipDelay = 1000;
        let tooltipPlacement = 'left';
        let actionClass = '';
        let actionGlyph = '';

        switch(actionType){

            case UI.OPTION_EDIT:

                tooltipText = 'Edit...';
                actionClass = 'blue';
                if(this.state.isSelectable){
                    actionClass = 'blue-selectable';
                }
                actionGlyph = 'edit';

                break;

            case UI.OPTION_REMOVE:

                if(isDeleted){
                    tooltipText = 'Undo Delete';
                    actionGlyph = 'arrow-left';
                } else {
                    tooltipText = 'Delete';
                    actionGlyph = 'remove';
                }

                actionClass = 'red';
                if(this.state.isSelectable){
                    actionClass = 'red-selectable';
                }

                break;

            case UI.OPTION_MOVE:

                tooltipText = 'Move...';
                actionClass = 'lgrey';
                if(this.state.isSelectable){
                    actionClass = 'lgrey-selectable';
                }
                actionGlyph = 'move';

                break;

            case UI.OPTION_SAVE:

                tooltipText = 'Save Edit';
                actionClass = 'green';
                if(this.state.isSelectable){
                    actionClass = 'green-selectable';
                }
                actionGlyph = 'ok';

                break;


            case UI.OPTION_UNDO:

                tooltipText = 'Cancel Edit';
                actionClass = 'red';
                if(this.state.isSelectable){
                    actionClass = 'red-selectable';
                }
                actionGlyph = 'arrow-left';

                break;

        }

        const tooltip =
            <Tooltip id="modal-tooltip">
                {tooltipText}
            </Tooltip>;

        layout =
            <div>
                <OverlayTrigger delayShow={tooltipDelay} placement={tooltipPlacement} overlay={tooltip}>
                    <div id={getContextID(UI.OPTION_EDIT, uiContextName)} onClick={ () => this.actionHandler()}>
                        <div className={actionClass}><Glyphicon glyph={actionGlyph}/></div>
                    </div>
                </OverlayTrigger>
            </div>;


        return(
            <div onMouseEnter={ () => this.setSelectable()} onMouseLeave={ () => this.setUnselectable()}>
                {layout}
            </div>
        );

    }
}


UltrawideAction.propTypes = {
    actionType: PropTypes.string.isRequired,
    uiContextName: PropTypes.string.isRequired,
    actionFunction: PropTypes.func,
    isDeleted: PropTypes.bool
};



