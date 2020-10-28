export default class Page {

    public title: string;

    constructor() {
        this.title = 'MoodFeed!';
    }

    open(path: string): void {
        browser.url(path)
    }

}
