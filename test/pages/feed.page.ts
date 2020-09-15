import Page from "./page";

class FeedPage extends Page {

    get logo() {
        return $('.logo')
    }

}

export default new FeedPage();
