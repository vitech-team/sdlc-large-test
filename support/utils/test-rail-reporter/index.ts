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

    cleanDir(dir = process.env.JSON_RESULTS_DIR) {
        fs.rmdirSync(dir, {recursive: true}, () => {
            console.log("Folder Deleted!");
        })
    }

    private static readResults(path = process.env.JSON_RESULTS_DIR, file = process.env.JSON_RESULTS_FILE) {
        return JSON.parse(fs.readFileSync(`${path}${file}`))
    }

    private static getTestCaseDuration(elapsed) {
        if (elapsed == undefined) {
            elapsed = 1;
        }
        return Math.ceil(elapsed / 1000) + 's'
    }

    private static getComment(status, message){
        if (status == 'passed') {
            return "This test was marked as 'Passed'"
        } else {
            return message
        }
}

    processResult() {
        let results = TestRailReporter.readResults().suites
        let cases = [];
        let testRailResult = [];

        for (let i = 0; i < results.length; i++) {
            for (let j = 0; j < results[i]['tests'].length; j++) {
                let suiteName = results[i]['name']
                let testCase = results[i]['tests'][j]
                let sectionID = this.testRail.getSectionIdByTitle(suiteName, testCase['name'])
                let testCaseId = this.testRail.getTestCaseIdByTitle(testCase['name'], sectionID);
                let testCaseStatus = testCase['state'];
                let testCaseComment = TestRailReporter.getComment(testCaseStatus,testCase['error'])
                cases.push(testCaseId)
                testRailResult.push(
                    {
                        "case_id": testCaseId,
                        "status_id": this.status[testCaseStatus],
                        "elapsed": TestRailReporter.getTestCaseDuration(testCase.duration),
                        "comment": testCaseComment
                    })

            }
        }
        this.testRail.publishResults(cases, testRailResult)
    }

}
