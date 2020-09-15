import Page from "./page";

export enum LoginType {
    GOOGLE,
    FACEBOOK,
}

class LoginPage extends Page {

    get googleLoginBtn() {
        return $('.login-method-container > div:nth-child(1)')
    }

    get facebookLoginBtn() {
        return $('.login-method-container > div:nth-child(2)')
    }

    open() {
        super.open('login')
    }

    login(type: LoginType) {
        switch (type) {
            case LoginType.GOOGLE:
                this.googleLoginBtn.click();
                break;
            case LoginType.FACEBOOK:
                this.facebookLoginBtn.click();
                break;
            default:
                break;
        }
    }

}

export default new LoginPage();
