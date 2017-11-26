// == IMPORTS ==========================================================================================================

// Meteor / React Services
import React, { Component } from 'react';
import PropTypes            from 'prop-types';
import { createContainer }  from 'meteor/react-meteor-data';

// Ultrawide Collections

// Ultrawide GUI Components
import DefaultFeatureAspect from '../../components/edit/DefaultFeatureAspect.jsx';

// Ultrawide Services
import { ViewType, DisplayContext, ComponentType } from '../../../constants/constants.js';
import ClientDataServices              from '../../../apiClient/apiClientDataServices.js';
import ClientWorkPackageComponentServices   from '../../../apiClient/apiClientWorkPackageComponent.js';
import ClientDesignVersionServices          from '../../../apiClient/apiClientDesignVersion.js'

// Bootstrap

// REDUX services
import {connect} from 'react-redux';

// =====================================================================================================================

// -- CLASS ------------------------------------------------------------------------------------------------------------
//
// Default Feature Aspects Data Container - selects the current list of default Feature Aspects for config screen
//
// ---------------------------------------------------------------------------------------------------------------------

// Scenarios List for a Feature or Feature Aspect
class DefaultAspectsList extends Component {
    constructor(props) {
        super(props);

    };

    // A list of Default Feature Aspects
    renderAspects() {
        const {items} = this.props;

        if(items) {

            return items.map((aspect) => {

                return (
                    <DefaultFeatureAspect
                        key={aspect._id}
                        currentItem={aspect}
                    />
                );
            });
        } else {
            return (
                <div>No default aspects!</div>
            )
        }
    }

    render() {
        return (
            <div>
                {this.renderAspects()}
            </div>
        );
    }
}

DefaultAspectsList.propTypes = {
    items: PropTypes.array.isRequired
};

// Redux function which maps state from the store to specific props this component is interested in.
function mapStateToProps(state) {
    return {
        view:           state.currentAppView,
        mode:           state.currentViewMode,
        userContext:    state.currentUserItemContext,
        viewOptions:    state.currentUserViewOptions
    }
}

// Connect the Redux store to this component ensuring that its required state is mapped to props
DefaultAspectsList = connect(mapStateToProps)(DefaultAspectsList);

export default DefaultAspectsListContainer = createContainer(({params}) => {

    const items =  ClientDataServices.getDefaultFeatureAspects(
        params.designId
    );

    return{
        items: items
    }


}, DefaultAspectsList);