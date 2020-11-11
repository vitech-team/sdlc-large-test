import Page from "./page";

class LoginPage extends Page {

    get usernameInp() {
        return $('input[name=username]');
    }

    get passwordInp() {
        return $('input[name=password]');
    }

    get loginBtn() {
        return $('input[name=login]');
    }

    open() {
        super.open('login')
    }

    login(username: string, password: string) {
        this.usernameInp.setValue(username);
        this.passwordInp.setValue(password);
        this.loginBtn.click();
    }

}

export default new LoginPage();
