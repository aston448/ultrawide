import React from 'react';
import { Meteor } from 'meteor/meteor';
import { render } from 'react-dom';

import '../imports/startup/client/accounts-config.js';
import App from '../imports/ui/components/app/App.jsx';

Meteor.startup(() => {

    //const designsHandle = Meteor.subscribe('designs');
    //const daHandle = Meteor.subscribe('designAspects');

    if (App) {
        render(<App />, document.getElementById('render-target'));
    }
});
