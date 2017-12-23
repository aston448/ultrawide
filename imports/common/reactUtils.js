// Required for createSelectionList
import React from 'react';

export function createSelectionList(typesArray){

    // NOTE: This implicitly requires an import of React

    let items = [];

    typesArray.forEach((item) => {
        items.push(<option key={item} value={item}>{item}</option>);
    });

    return items;
}