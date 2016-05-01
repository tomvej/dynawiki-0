import chai, { expect, should } from 'chai'

import command from './command'

should();
chai.use(command);

describe('Commands Helpers', function() {
    describe('command property', function() {
        it('should be satisfied by an empty object', function () {
            ({}).should.be.a.command;
        });
        it('should not be satisfied by an array', function() {
            ([]).should.not.be.a.command;
        });
        it('should not be satisfied by a primitive', function () {
            expect('').to.not.be.a.command;
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
        it('should not be satisfied by array $merge', function () {
            ({$merge: [1,2]}).should.not.be.a.command;
        });


        it('should not be satisfied by simple $splice', function() {
            ({$splice: {}}).should.not.be.a.command;
        });
        it('should be satisfied by empty $splice', function () {
            ({$splice: []}).should.be.a.command;
        });
        it('should not be satisfied by 1D $splice', function() {
            ({$splice: [1, 2, 3]}).should.not.be.a.command;
        });
        it('should be satisfied by 2D $splice', function () {
            ({$splice: [[1,2]]}).should.be.a.command;
        });
        it('should not be satisfied by too short $splice', function () {
            ({$splice: [[1]]}).should.not.be.a.command;
        });
        it('should be satisfied by long $splice', function () {
            ({$splice: [[1,2,5,1,6,12]]}).should.be.a.splice;
        });
        it('should be satisfied by multiple $splices', function () {
            ({$splice: [[1,5], [5,1,2,3], [5,6,1]]});
        });

        it('should be satisfied by a compound command', function() {
            ({
                sections: {
                    1: {$set: {id:1, heading: 'Something'}},
                    2: {children: {$splice: [[2,3]]}}
                },
                editor: { $merge: {
                    text: 'Whatever'
                }}
            }).should.be.a.command;
        });
        it('should not be satisfied by a compound command with a string property', function () {
            ({
                sections: {
                    1: {$set: {id:1, heading: 'Something'}},
                    2: {children: {$splice: [[2,3]]}},
                    3: 'String'
                },
                editor: { $merge: {
                    text: 'Whatever'
                }}
            }).should.not.be.a.command;
        });
        it('should not by satisfied by multiple command on one property', function() {
            ({
                $set: {},
                $merge: {}
            }).should.not.be.a.command;
        });
    });
});

