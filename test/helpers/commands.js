export default function(chai, utils) {
    const expect = object => new chai.Assertion(object);
    const isObject = object => {
        expect(object).to.be.an('object');
    };


    chai.Assertion.addProperty('command', function () {
        if (utils.flag(this, 'negate')) {
            new chai.Assertion(() => isObject(this._obj)).to.throw(chai.AssertionError);
        } else {
            isObject(this._obj);
        }
    });
}