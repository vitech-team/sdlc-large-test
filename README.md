# Large test example for SDLC from VITech team
This repository contains example of large test using Webdriver.IO and reporting results into TestRail Testcase Management System

## Adding TestRail setting as a Reporter
To apply posting execution result into TestRail please add following environment variables:

```aidl
TESTRAIL_DOMAIN=<domain_of_your_testrail_instance>;
TESTRAIL_username=<testrail_username>;
TESTRAIL_apiToken=<api_key_genereated_in_testrail_user_settings>;
TESTRAIL_projectKey=<test_rail_project_key_id_in_integer>
```
Suite name ('describe section in the test') should have ticket id suffix - matched to 'TMS_ISSUE_PLACEHOLDER' environment variable

Environment variable:
```aidl
TMS_ISSUE_PLACEHOLDER=AA-
```
Test Suite:
```aidl
describe('AA-1 MoodFeed login page', () => {

    it('should have the right title', () => {
        // test
    })
})

```
