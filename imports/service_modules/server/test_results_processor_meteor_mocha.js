import fs from 'fs';

import {DesignComponents}               from '../../collections/design/design_components.js';
import {DesignUpdateComponents}         from '../../collections/design_update/design_update_components.js';

import {UserModTestMashData}            from '../../collections/dev/user_mod_test_mash_data.js';

import {ComponentType, MashStatus, MashTestStatus, LogLevel} from '../../constants/constants.js';
import {log} from '../../common/utils.js';

// Plugin class to read test results from a screen scraped meteor -test mocha JSON reported file
class MeteorMochaTestServices{

    processTestResults(resultsFile){

        if(Meteor.isServer) {

            // Read ----------------------------------------------------------------------------------------------------
            let resultsText = '';

            try {
                resultsText = fs.readFileSync(resultsFile);
            } catch (e) {
                log((msg) => console.log(msg), LogLevel.ERROR, "Failed to open meteor mocha tests file: {}", e);
                return [];
            }

            // Clean ---------------------------------------------------------------------------------------------------
            let cleanText = '';
            try {
                cleanText = this.cleanResults(resultsText.toString());
            } catch (e) {
                log((msg) => console.log(msg), LogLevel.ERROR, "Failed to clean meteor mocha tests file: {}", e);
                return [];
            }

            log((msg) => console.log(msg), LogLevel.TRACE, "Cleaned file text is:\n {}", cleanText);


            // Parse ---------------------------------------------------------------------------------------------------
            let resultsJson = [];

            try{
                resultsJson = JSON.parse(cleanText);
            } catch (e) {
                log((msg) => console.log(msg), LogLevel.ERROR, "Failed to parse meteor mocha tests file: {}", e);
                return [];
            }


            // Return Standard Data ------------------------------------------------------------------------------------

            let returnData = [];

            resultsJson.passes.forEach((test) => {
                returnData.push(
                    {
                        testName:           test.title,
                        testFullName:       test.fullTitle,
                        testResult:         MashTestStatus.MASH_PASS,
                        testError:          '',
                        testErrorReason:    '',
                        testDuration:       test.duration,
                        stackTrace:         ''
                    }
                );
            });

            resultsJson.failures.forEach((test) => {
                returnData.push(
                    {
                        testName:           test.title,
                        testFullName:       test.fullTitle,
                        testResult:         MashTestStatus.MASH_FAIL,
                        testError:          test.err.error,
                        testErrorReason:    test.err.reason,
                        testDuration:       test.duration,
                        stackTrace:         test.err.stack
                    }
                );
            });

            resultsJson.pending.forEach((test) => {
                returnData.push(
                    {
                        testName:           test.title,
                        testFullName:       test.fullTitle,
                        testResult:         MashTestStatus.MASH_PENDING,
                        testError:          '',
                        testErrorReason:    '',
                        testDuration:       0,
                        stackTrace:         ''
                    }
                );
            });

            return returnData;

        }
    };

    cleanResults(inputText){

        let outputText = '';

        let outputLines = inputText.split('\n');

        outputLines.forEach((line) => {

            if(line.startsWith('[34m')){

                let actualTextStart = line.indexOf('[39m');
                let finalLine = line.substring(actualTextStart + 5);
                outputText += finalLine + '\n';
            }
        });

        return outputText;

    };

}

export default new MeteorMochaTestServices();
