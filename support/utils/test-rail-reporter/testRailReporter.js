const request = require("sync-request");

/**
 * Test Rail basic API wrapper
 */
class TestRail {

    /**
     * Test Rail constructor
     *
     * @param options
     */
    constructor(options) {
        this._validate(options, 'domain');
        this._validate(options, 'username');
        this._validate(options, 'apiToken');
        this._validate(options, 'projectKey');

        // compute base url
        this.options = options;
        this.base = `https://${this.options.domain}/index.php?/api/v2/`;
    }


    /**
     * Validate config values
     *
     * @param options
     * @param name
     * @private
     */
    _validate(options, name) {
        if (options == null) {
            throw new Error("Missing Test Rail options in wdio.conf");
        }
        if (options[name] == null) {
            throw new Error(`Missing ${name} value. Please update Test Rail option in wdio.conf`);
        }
    }

    /**
     * Form the url for api
     *
     * @param path
     * @returns {string}
     * @private
     */
    _url(path) {
        return `${this.base}${path}`;
    }

    /**
     * Post request formation
     *
     * @param api
     * @param body
     * @param error
     * @returns {*}
     * @private
     */
    _post(api, body, error = undefined) {
        return this._request("POST", api, body, error);
    }

    /**
     * get request formation
     *
     * @param api
     * @param error
     * @returns {*}
     * @private
     */
    _get(api, error = undefined) {
        return this._request("GET", api);
    }

    /**
     * Patch request formation
     *
     * @param api
     * @param error
     * @returns {*}
     * @private
     */
    _patch(api, error = undefined) {
        return this._request("PATCH", api);
    }

    /**
     * Api request sending to the corresponding url
     *
     * @param method
     * @param api
     * @param body
     * @param error
     * @returns {*}
     * @private
     */
    _request(method, api, body = undefined, error = undefined) {
        const token = "Basic " + (Buffer.from(this.options.username + ":" + this.options.apiToken).toString('base64'));
        const option = {
            headers: {
                "Authorization": token,
                "Content-Type": "application/json; charset=utf-8",
            }
        };
        if (body !== undefined) {
            option["json"] = body
        }
        let result = request(method, this._url(api), option);
        result = JSON.parse(result.getBody('utf8'));
        if (result.error) {
            if (error) {
                error(result.error);
            } else {
                throw new Error(result.error);
            }
        }
        return result;
    }

    getDateNow() {
        let now = new Date(Date.now())
        return now.toDateString()
    }

    addTestRun(cases, testRunName = `Test run ${this.getDateNow()}`) {
        let requestBody = {
            "name": testRunName,
            "include_all": false,
            "case_ids": cases
        }
        let response = this._post(`add_run/${this.options.projectKey}`, requestBody)
        return response['id'];
    }


    addTestCase(fullTitle, sectionId) {
        let requestBody = {
            "title": fullTitle,
            // "custom_test_case_unique_name": this.getTestCaseUniqueName(fullTitle)
        }
        let response = this._post(`add_case/${sectionId}`, requestBody)
        return response['id']
    }

    addSectionId(name) {
        let requestBody = {
            "name": name
        }
        let response = this._post(`add_section/${this.options.projectKey}`, requestBody)
        return response['id']
    }

    getDataDictFromApiByParams(api, key, value) {
        let data = this._get(api)
        let dict = {};
        for (let i = 0; i < data.length; i++) {
            dict[data[i][key]] = data[i][value];
        }
        return dict
    }


    getTestCaseIdByTitle(fullTitle, sectionId) {
        let data = this.getDataDictFromApiByParams(`get_cases/${this.options.projectKey}&section_id=${sectionId}`, 'title', 'id')
        // let testCaseUniqueName = this.getTestCaseUniqueName(fullTitle);
        let cases = [];
        for (let name in data) {
            if (name === fullTitle) {
                cases.push(data[name])
            }
        }
        if (cases.length > 1) {
            return new Error(`In section ${sectionId} were found ${cases.length} cases with the same method name - ${testCaseUniqueName}`)
        } else if (cases.length === 0) {
            return this.addTestCase(fullTitle, sectionId)
        } else {
            return cases[0]
        }
    }

    getSectionIdByTitle(section_name, title) {
        if (section_name === undefined) {
            return new Error(`TestCase "${title}" does not have suite name, please add it`)
        }
        let data = this.getDataDictFromApiByParams(`get_sections/${this.options.projectKey}`, 'name', 'id')
        let sections = [];
        for (let name in data) {
            if (name === section_name) {
                sections.push(data[name])
            }
        }
        if (sections.length > 1) {
            return new Error(`In project ${this.options.projectKey} were found ${sections.length} cases with the same method name - ${name}`)
        } else if (sections.length === 0) {
            return this.addSectionId(section_name)
        } else {
            return sections[0]
        }
    }

    publishResults(cases, results) {
        let testRunId = this.addTestRun(cases);
        let requestBody = {
            "results": results
        }
        this._post(`add_results_for_cases/${testRunId}`, requestBody)
    }

}

module.exports = TestRail;
