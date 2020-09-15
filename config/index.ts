import {capabilitiesChromeConfig} from './chrome.config';
import {capabilitiesFirefoxConfig} from './firefox.config';
import {serverConfig} from './server.config';
import {testsConfig} from './tests.config';
import {reporterConf} from "./reporter.config";

export const config = {
    runner: 'local',
    baseUrl: 'http://localhost',
    path: '/wd/hub',

    framework: 'jasmine',

    maxInstances: process.env.DEBUG_TESTS === 'true' ? 1 : 2,
    capabilities: [
        capabilitiesChromeConfig,
        capabilitiesFirefoxConfig,
    ],

    services: [],

    ...serverConfig,
    ...testsConfig,
    ...reporterConf

};
