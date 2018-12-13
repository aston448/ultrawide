// == IMPORTS ==========================================================================================================

// Meteor / React Services
import React, { Component } from 'react';
import PropTypes from 'prop-types';

// Ultrawide Services
import {LogLevel} from '../../../constants/constants.js';
import {log, getContextID} from "../../../common/utils";
import { UI } from '../../../constants/ui_context_ids';


// Bootstrap
import {Glyphicon, Badge}             from 'react-bootstrap';

// =====================================================================================================================

// -- CLASS ------------------------------------------------------------------------------------------------------------
//
// Tab Title
//
// ---------------------------------------------------------------------------------------------------------------------

export default class TabTitle  extends Component{

    constructor(...args){
        super(...args);

        this.state = {
        };

    }


    render(){
        const {tabText, glyphIconName, badgeClass} = this.props;

        log((msg) => console.log(msg), LogLevel.PERF, 'Render Tab Title {}', tabText);

        return(

            <div className="tab-title">
                <Badge className={badgeClass}>
                    <Glyphicon glyph={glyphIconName}/>
                    <div className="tab-text">
                        {tabText}
                    </div>
                </Badge>
            </div>
        );

    }
}


TabTitle.propTypes = {
    tabText: PropTypes.string.isRequired,
    glyphIconName: PropTypes.string.isRequired,
    badgeClass: PropTypes.string.isRequired
};



