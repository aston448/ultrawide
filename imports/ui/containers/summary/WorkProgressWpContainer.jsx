// == IMPORTS ==========================================================================================================

// Meteor / React Services
import React, { Component } from 'react';
import PropTypes            from 'prop-types';
import { createContainer }  from 'meteor/react-meteor-data';

// Ultrawide Collections

// Ultrawide GUI Components
import WorkProgressItem             from '../../components/summary/WorkProgressItem.jsx';

// Ultrawide Services
import {log} from "../../../common/utils";
import {LogLevel} from "../../../constants/constants";

import ClientDataServices           from '../../../apiClient/apiClientDataServices.js';

// Bootstrap

// REDUX services
import {connect} from 'react-redux';


// =====================================================================================================================

// -- CLASS ------------------------------------------------------------------------------------------------------------
//
// Work Progress WP Container
//
// ---------------------------------------------------------------------------------------------------------------------


// Export for unit tests
export class WorkProgressWpList extends Component {

    constructor(props) {
        super(props);

    }


    // A list of Feature Aspects in a Feature
    renderProgress(progressData, userRoles) {

        if(progressData) {

            return progressData.map((progressItem) => {
                return(
                    <WorkProgressItem
                        key={progressItem._id}
                        item={progressItem}
                        userRoles={userRoles}
                    />
                )
            });
        } else {
            return(<div>No progress data</div>);
        }
    }

    render() {

        const {duWorkPackages, userRoles, userContext} = this.props;

        log((msg) => console.log(msg), LogLevel.PERF, 'Render CONTAINER Work Progress WP');

        let progressItems = <div></div>;
        if(duWorkPackages.length > 0){
            progressItems =
                <div>
                    {this.renderProgress(duWorkPackages, userRoles)}
                </div>

        }

        return progressItems;
    }

}

WorkProgressWpList.propTypes = {
    duWorkPackages:     PropTypes.array.isRequired,
    userRoles:          PropTypes.object.isRequired

};

// Redux function which maps state from the store to specific props this component is interested in.
function mapStateToProps(state) {
    return {
        userContext: state.currentUserItemContext
    }
}

// Default export including REDUX
export default WorkProgressWpContainer = createContainer(({params}) => {

    return ClientDataServices.getWorkProgressDuWorkPackages(params.userContext, params.designUpdateId);

}, connect(mapStateToProps)(WorkProgressWpList));