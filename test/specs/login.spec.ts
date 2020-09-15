import LoginPage, {LoginType} from '../pages/login.page';
import FeedPage from '../pages/feed.page';

describe('MoodFeed login page', () => {

    it('should have the right title', () => {
        LoginPage.open();
        expect(browser).toHaveTitle(LoginPage.title);
        browser.takeScreenshot();
    })

    it('should perform login with Google', () => {
        LoginPage.open();
        LoginPage.login(LoginType.GOOGLE);

        browser.pause(500);

        expect(FeedPage.logo).toExist();
        browser.takeScreenshot();
    })

    it('should perform login with Facebook', () => {
        LoginPage.open();
        LoginPage.login(LoginType.FACEBOOK);

        browser.pause(500);

        expect(FeedPage.logo).toExist();
        browser.takeScreenshot();
    })

})
