const commands = {
    $set: true,
    $merge: true,
    $splice: true
};

export default function(chai, utils) {
    const expect = object => new chai.Assertion(object);
    const assertMergeCommand = object => {
        expect(object).to.be.an('object');
    };
    const assertSpliceCommand = object => {
        expect(object).to.be.an('array');
        object.forEach(elem => {
            expect(elem).to.be.an('array');
            expect(elem).to.have.length.above(1);
        });
    };
    const assertCommand = object => {
        expect(object).to.be.an('object');

        if (object.hasOwnProperty('$merge')) {
            assertMergeCommand(object['$merge']);
        }
        if (object.hasOwnProperty('$splice')) {
            assertSpliceCommand(object['$splice']);
        }

        const localCommands = [];
        Object.getOwnPropertyNames(object).forEach(property => {
            if (commands[property]) {
                localCommands.push(property);
            } else {
                assertCommand(object[property]);
            }
        });
        expect(localCommands).to.have.length.below(2);
    };


    chai.Assertion.addProperty('command', function () {
        if (utils.flag(this, 'negate')) {
            expect(() => assertCommand(this._obj)).to.throw(chai.AssertionError);
        } else {
            assertCommand(this._obj);
        }
    });
}