import chai, { expect, should } from 'chai'

import command from './command'

should();
chai.use(command);

describe('Commands Helpers', function() {
    describe('command property', function() {
        it('should accept empty object', function () {
            ({}).should.be.a.command;
        });
        it('should not accept an array', function() {
            ([]).should.not.be.a.command;
        });
        it('should not accept a primitive', function () {
            expect('').to.not.be.a.command;
            expect(5).to.not.be.a.command;
        });
        describe('$set', function() {
            it('should accept simple object', function () {
                ({$set: {}}).should.be.a.command;
            });
            it('should accept null', function () {
                ({$set: null}).should.be.a.command;
            });
            it('should accept complex object', function () {
                ({$set: {
                    section: 5,
                    index: 3,
                    text: 'Example'
                }}).should.be.a.command;
            });
        });
        describe('$merge', function() {
            it('should accept simple object', function () {
                ({$merge: {}}).should.be.a.command;
            });
            it('should not accept null', function () {
                ({$merge: null}).should.not.be.a.command;
            });
            it('should not accept array', function () {
                ({$merge: [1, 2]}).should.not.be.a.command;
            });
            it('should accept compound object', function () {
                ({$merge: {
                    1: {id: 1, heading: 'First section'},
                    2: {id: 2, heading: 'Second section', children: [1,3,5]}
                }}).should.be.a.command;
            })
        });
        describe('$splice', function () {
            it('should not accept simple object', function() {
                ({$splice: {}}).should.not.be.a.command;
            });
            it('should accept empty array', function () {
                ({$splice: []}).should.be.a.command;
            });
            it('should not accept 1D array', function() {
                ({$splice: [1, 2, 3]}).should.not.be.a.command;
            });
            it('should accept 2D array', function () {
                ({$splice: [[1,2]]}).should.be.a.command;
            });
            it('should not be accept too few parameters', function () {
                ({$splice: [[]]}).should.not.be.a.command;
            });
            it('should accept many parameters', function () {
                ({$splice: [[1,2,5,1,6,12]]}).should.be.a.splice;
            });
            it('should accept multiple arrays', function () {
                ({$splice: [[1,5], [5,1,2,3], [5,6,1]]});
            });
            it('should not accept non-numbers', function () {
                ({$splice: [['test', 1]]}).should.not.be.a.command;
                ({$splice: [[1, 'test']]}).should.not.be.a.command;
            });
            it('should not accept NaN', function () {
                ({$splice: [[NaN, 1]]}).should.not.be.a.command;
                ({$splice: [[1, NaN]]}).should.not.be.a.command;
            });
            it('should accept negative, zero or positive first $splice argument', function() {
                ({$splice: [[-4]]}).should.be.a.command;
                ({$splice: [[0]]}).should.be.a.command;
                ({$splice: [[5]]}).should.be.a.command;
            });
            it('should accept only non-negative second $splice argument', function () {
                ({$splice: [[2, -3]]}).should.not.be.a.command;
                ({$splice: [[3, 0]]}).should.be.a.command;
                ({$splice: [[3, 2]]}).should.be.a.command;
            });
        });
        it('should be accept compound command', function() {
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
        it('should not accept compound command with a string property', function () {
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
        it('should not accept multiple commands on one property', function() {
            ({
                $set: {},
                $merge: {}
            }).should.not.be.a.command;
        });
    });
});

