import LoginPage from '../pages/login.page';
import FeedPage from '../pages/feed.page';

describe('AA-1 MoodFeed login page', () => {

    it('should have the right title', () => {
        LoginPage.open();
        expect(browser).toHaveTitle(LoginPage.title);
        browser.takeScreenshot();
    })

    it('should perform login', () => {
        LoginPage.open();
        browser.takeScreenshot();
        LoginPage.login('homer', '123QWEasd');

        browser.pause(500);

        expect(FeedPage.logo).toExist();
        browser.takeScreenshot();
    })

})
