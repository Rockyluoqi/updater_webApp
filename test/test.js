var Application = require('spectron').Application
var assert = require('chai').assert;

describe('Initial spec', function () {
    it('Should be easy to test.');
});


describe('application launch', function () {
    this.timeout(10000)

    beforeEach(function () {
        this.app = new Application({
            path: '../electron-v1.0.2-win32-x64/app.exe'
        })
        return this.app.start()
    })

    afterEach(function () {
        if (this.app && this.app.isRunning()) {
            return this.app.stop()
        }
    })

    it('shows an initial window', function () {
        return this.app.client.getWindowCount().then(function (count) {
            assert.equal(count, 1)
        })
    })
});