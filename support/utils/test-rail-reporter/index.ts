const TestRail = require('./testRailReporter');
const fs = require('fs')

declare global {
    export namespace NodeJS {
        interface Global {
            testRailReporter: TestRailReporter;
        }
    }
}

export class TestRailReporter {
    private testRail: any;

    constructor(options) {
        this.testRail = new TestRail(options);
    };

    status = {
        'passed': 1,
        'blocked': 2,
        'untested': 3,
        'retest': 4,
        'failed': 5,
    };

    /**
     * Cleans directory where stored test execution results in json format
     *
     * @param dir {String} path to directory with files which should be cleaned
     * by default is taken value from {process.env.JSON_RESULTS_DIR}
     */
    cleanDir(dir = process.env.JSON_RESULTS_DIR) {
        fs.rmdirSync(dir, {recursive: true}, () => {
            console.log("Folder Deleted!");
        })
    }

    /**
     * Splits whole suiteName to issueId and title, based on ticket prefix
     * (by default is taken from process.env.TMS_ISSUE_PLACEHOLDER)
     * Example: issuePrefix='AR-'; suiteName='AR-3 Login flow suite'
     * as result will be returned array with issueID and title ['AR-3', 'Login flow suit']
     *
     * @param suiteName - whole suite name
     * @param issuePrefix - issue prefix pattern
     * @return [issueId, title]
     */
    private static getIssueIDAndTitleFromSuiteName(suiteName, issuePrefix=process.env.TMS_ISSUE_PLACEHOLDER){
        let pattern = new RegExp(issuePrefix + '[0-9]{0,10} ')
        if (suiteName.match(pattern) == null) {
            throw new Error(`'${suiteName}' suite does not contain suffix in '${issuePrefix}' format
            Please add ticket id suffix to suite name in the 'describe' section`)}
        let issueId = suiteName.match(pattern)[0].split(' ')[0]
        let title = suiteName.split(pattern)[1]
        return [issueId, title]
    }

    /**
     * Read results from json file (by default is taken from process.env.JSON_RESULTS_FILE)
     * from path (by default is taken from process.env.JSON_RESULTS_DIR) and returns json object
     *
     * @param path - path to folder where are stored json results
     * @param file - file name where are stored json results
     * @return JSON
     */
    private static readResults(path = process.env.JSON_RESULTS_DIR, file = process.env.JSON_RESULTS_FILE) {
        return JSON.parse(fs.readFileSync(`${path}${file}`))
    }

    /**
     * Converts elapsed time from milliseconds to seconds with 's' suffix as a String
     *
     * @param elapsed - time in milliseconds (e.g. 1000)
     * @return {string} - time in seconds with suffix (e.g. 1s)
     */
    private static getTestCaseDuration(elapsed) {
        if (elapsed == undefined) {
            elapsed = 1;
        }
        return Math.ceil(elapsed / 1000) + 's'
    }

    /**
     * Returns hard coded "This test was marked as 'Passed'" message in case status is 'passed'
     * in all other cases returns errorMessage
     *
     * @param status
     * @param errorMessage
     */
    private static getComment(status, errorMessage){
        if (status == 'passed') {
            return "This test was marked as 'Passed'"
        } else {
            return errorMessage
        }
}

    /**
     * Reads aggregated result from file
     * goes by each test cases in each test suite,
     * extracts results into TestRail format
     * publish results into TestRail
     */
    processResult() {
        let results = TestRailReporter.readResults().suites
        let cases = [];
        let testRailResult = [];

        for (let i = 0; i < results.length; i++) {
            for (let j = 0; j < results[i]['tests'].length; j++) {
                let suiteWholeName = results[i]['name']
                let testCase = results[i]['tests'][j]
                let issueId = TestRailReporter.getIssueIDAndTitleFromSuiteName(suiteWholeName)[0]
                let suiteName = TestRailReporter.getIssueIDAndTitleFromSuiteName(suiteWholeName)[1]
                let sectionId = this.testRail.getSectionIdByTitle(suiteName, testCase['name'])
                let testCaseId = this.testRail.getTestCaseIdByTitle(testCase['name'], sectionId, issueId);
                let testCaseStatus = testCase['state'];
                let testCaseComment = TestRailReporter.getComment(testCaseStatus,testCase['error'])
                cases.push(testCaseId)
                testRailResult.push(
                    {
                        "case_id": testCaseId,
                        "status_id": this.status[testCaseStatus],
                        "elapsed": TestRailReporter.getTestCaseDuration(testCase.duration),
                        "comment": testCaseComment,
                        "refs": issueId
                    })

            }
        }
        this.testRail.publishResults(cases, testRailResult)
    }

}
