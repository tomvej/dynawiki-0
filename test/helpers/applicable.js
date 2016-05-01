const commands = {
    $set: true,
    $merge: true,
    $splice: true
};

export default function(chai, utils) {
    const expect = object => new chai.Assertion(object);
    const assertSpliceApplicable = (command, target) => {
        expect(target).to.be.an('array');
        let length = target.length;
        command.forEach(elem => {
            let start = elem[0] < 0 ? length + elem[0] : elem[0];
            expect(start).to.be.at.least(0).and.at.most(length);
            let count = elem.length > 1 ? elem[1] : length - start;
            expect(start + count).to.be.at.most(length);

            length -= count;
            if (elem.length > 1) {
                length += elem.length - 2;
            }
        });
    };
    const assertApplicable = (command, target) => {
        if (command.hasOwnProperty('$merge')) {
            expect(target).to.be.an('object');
        }
        if (command.hasOwnProperty('$splice')) {
            assertSpliceApplicable(command['$splice'], target);
        }

        Object.getOwnPropertyNames(command).forEach(property => {
            if (!commands[property]) {
                expect(target).to.have.property(property);
                assertApplicable(command[property], target[property]);
            }
        });
    };
    chai.Assertion.addMethod('applyOn', function(target) {
        if (utils.flag(this, 'negate')) {
            expect(() => assertApplicable(this._obj, target)).to.throw(chai.AssertionError);
        } else {
            assertApplicable(this._obj, target);
        }
    });
}