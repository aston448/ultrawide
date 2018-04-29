// == IMPORTS ==========================================================================================================

// Meteor / React Services

// Ultrawide Collections

// Ultrawide Services


// =====================================================================================================================

// -- CLASS ------------------------------------------------------------------------------------------------------------
//
// Client Domain Dictionary Services - Unit testable services for the client API
//
// ---------------------------------------------------------------------------------------------------------------------

class ClientDomainDictionaryServiceModulesClass {


    getDomainTermDecoratorFunction(domainTerms) {

        // NOTE: This is a very intense function: Adding debug log statements MASSIVELY slows it down.  So don't go looking for other causes!

        // Get a regex that is a list of all domain terms

        let domainTermsRegexArr = this.getDomainTermsRegex(domainTerms);
        let domainTermsRegex = '';

        // This function is complex because the decorator can't cope with a term that is a subset of another term.
        // So if we have 'Design' and 'Design Version' as terms it won't decorate 'Design Version', just the 'Design' bit.

        // To overcome this we put all the decorations in an array and then remove the unwanted subset decorator where two clash at the same place

        // Return a function that can be used by draft-js as a decorator.
        // NOTE: draft-js recommend 3 params but 1st one does not seem to be being passed back by current code... WTF?
        return (contentBlock, callback) => {

            let actionsArr = [];

            if (contentBlock) {
                const text = contentBlock.getText();
                //log((msg) => console.log(msg), LogLevel.TRACE, "Search Text is {}", text);
                let i = 1;
                domainTermsRegexArr.forEach((regex) => {
                    //log((msg) => console.log(msg), LogLevel.TRACE, "Searching for {}", regex);
                    domainTermsRegex = new RegExp(regex, 'g');

                    let matchArr, start;
                    let action = {};

                    while ((matchArr = domainTermsRegex.exec(text)) !== null) {
                        start = matchArr.index;
                        //log((msg) => console.log(msg), LogLevel.TRACE, "Found at {} with length {}", matchArr.index, matchArr[0].length);
                        action = {
                            index: i,
                            search: regex,
                            start: start,
                            end: start + matchArr[0].length
                        };
                        actionsArr.push(action);
                        i++;
                    }
                });

                // Cleanse the actions for conflicts: if two actions are in the same position, remove the subset one.
                let removeArr = [];
                let subsetAction = null;
                actionsArr.forEach((action1) => {
                    actionsArr.forEach((action2) => {
                        if(action2.index !== action1.index){
                            // Two different actions
                            subsetAction = this.isSubsetCase(action1, action2);
                            if(subsetAction){
                                // The subset action is not required - so add its index to the remove array
                                removeArr.push(subsetAction.index);
                            }
                        }
                    });
                });

                actionsArr.forEach((action) => {
                    // Don't decorate if in remove list
                    if(!removeArr.includes(action.index)){
                        callback(action.start, action.end);
                    }
                })
            }
        }

    }

    // Return a REGEX based on the contents of the Domain Dictionary
    getDomainTermsRegex(domainTerms){

        let regex = '';
        let regexArr = [];

        let termText = '';

        // Must return something if no domain dictionary yet or Draft JS goes into meltdown...
        if(domainTerms.length == 0){
            return ['\\bUltrawide\\b'];
        }

        // Add each term plus its plural to the regex
        domainTerms.forEach((term) => {
            termText = term.domainTermNew.trim();

            regex = '\\b' + termText + '\\b';
            regexArr.push(regex);
            regex = '\\b' + this.getPluralForm(termText) + '\\b';
            regexArr.push(regex);

        });

        return regexArr;
    };

    getPluralForm(termText){

        let length = termText.length;

        // Words ending in y change to ies
        if(termText.substring(length-1, length) === 'y' || termText.substring(length-1, length) === 'Y'){
            return termText.substring(0, length-1) + 'ies';
        }

        // Words ending in h add es
        if(termText.substring(length-1, length) === 'h' || termText.substring(length-1, length) === 'H'){
            return termText + 'es';
        }

        // Anything else add s
        return termText + 's';
    };

    isSubsetCase(action1, action2){

        if(action1.start >= action2.start && action1.end <= action2.end){
            // Action 1 is a subset of action 2
            return action1;
        }

        if(action2.start >= action1.start && action2.end <= action1.end){
            // Action 2 is a subset of action 1
            return action2;
        }

        // Otherwise no subset:
        return null;
    };

    getNarrativeDecoratorFunction(){
        // Get a regex that is the Narrative headers

        let narrativeRegex = new RegExp(this.getNarrativeRegex(), 'g');

        // Return a function that can be used by draft-js as a decorator.
        // NOTE: draft-js recommend 3 params but 1st one does not seem to be being passed back by current code... WTF?
        return (contentBlock, callback) => {

            if (contentBlock) {
                const text = contentBlock.getText();

                let matchArr, start;
                while ((matchArr = narrativeRegex.exec(text)) !== null) {
                    start = matchArr.index;
                    callback(start, start + matchArr[0].length);
                }
            }
        }
    };

    getNarrativeRegex() {

        return '\\bAs a\\b|\\bI want to\\b|\\bSo that I can\\b';

    }

}

export const ClientDomainDictionaryServiceModules = new ClientDomainDictionaryServiceModulesClass();
