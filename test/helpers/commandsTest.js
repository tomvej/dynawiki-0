import chai, { should } from 'chai'

import reducers from './commands'

should();
chai.use(reducers);

describe('Commands Utils', function() {
    describe('command property', function() {
        it('should not be satisfied by an array', function() {
            ([]).should.not.be.a.command;
        });
        it('should be satisfied by simple $set', function () {
            ({$set: {}}).should.be.a.command;
        });
        it('should be satisfied by null $set', function () {
            ({$set: null}).should.be.a.command;
        });
        it('should be satisfied by simple $merge', function () {
            ({$merge: {}}).should.be.a.command;
        });
        it('should not be satisfied by null $merge', function () {
            ({$merge: null}).should.not.be.a.command;
        });
        it('should not be satisfied by simple $splice', function() {
            ({$splice: {}}).should.not.be.a.command;
        });
        it('should be satisfied by empty $splice', function () {
            ({$splice: []}).should.be.a.command;
        })
    });
});

