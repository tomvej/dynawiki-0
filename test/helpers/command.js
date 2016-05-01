const commands = {
    $set: true,
    $merge: true,
    $splice: true
};

export default function(chai, utils) {
    const expect = object => new chai.Assertion(object);
    const isMergeCommand = object => {
        expect(object).to.be.an('object');
    };
    const isSpliceCommand = object => {
        expect(object).to.be.an('array');
        object.forEach(elem => {
            expect(elem).to.be.an('array');
            expect(elem).to.have.length.above(1);
        });
    };
    const isCommand = object => {
        expect(object).to.be.an('object');

        if (object.hasOwnProperty('$merge')) {
            isMergeCommand(object['$merge']);
        }
        if (object.hasOwnProperty('$splice')) {
            isSpliceCommand(object['$splice']);
        }

        const localCommands = [];
        Object.getOwnPropertyNames(object).forEach(property => {
            if (commands[property]) {
                localCommands.push(property);
            } else {
                isCommand(object[property]);
            }
        });
        expect(localCommands).to.have.length.below(2);
    };


    chai.Assertion.addProperty('command', function () {
        if (utils.flag(this, 'negate')) {
            new expect(() => isCommand(this._obj)).to.throw(chai.AssertionError);
        } else {
            isCommand(this._obj);
        }
    });
}