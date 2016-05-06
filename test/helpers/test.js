import chai, { expect, should } from 'chai'

import command from './command'
import applicable from './applicable'
import model from './model'
import isomorphic from './isomorphic'

should();
chai.use(command);
chai.use(applicable);
chai.use(model);
chai.use(isomorphic);

describe('Update Helpers', function() {
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
    describe('is applicable predicate', function () {
        describe('$set', function () {
            it('should apply on undefined', function () {
                ({$set: {}}).should.applyOn(undefined);
            });
            it('should apply on simple object', function () {
                ({$set: {}}).should.applyOn({test: 214});
            });
            it('should apply on array', function () {
                ({$set: {}}).should.applyOn([1,2,3]);
            });
        });
        describe('$merge', function () {
            it('should not apply to undefined', function () {
                ({$merge: {1: {id: 1, heading: 'Section 1'}}}).should.not.applyOn(null);
            });
            it('should apply to empty object', function () {
                ({$merge: {1: {id: 1, heading: 'Section 1'}}}).should.applyOn({});
            });
            it('should not apply to array', function () {
                ({$merge: {1: {id: 1, heading: 'Section 1'}}}).should.not.applyOn([1, 2, 3]);
            });
        });
        describe('$splice', function () {
            it('should not apply to undefined', function () {
                ({$splice: [[0]]}).should.not.applyOn(null);
            });
            it('should not apply to an object', function () {
                ({$splice: [[0]]}).should.not.applyOn({});
                ({$splice: [[0]]}).should.not.applyOn({sections: {
                    1: {id: 1, heading: 'Section One'},
                    2: {id: 2, heading: 'Section Two'}
                }});
            });
            it('should apply on an array', function () {
                ({$splice: [[0]]}).should.applyOn([]);
            });
            it('should not overflow', function () {
                ({$splice: [[2]]}).should.not.applyOn([1]);
                ({$splice: [[3,1]]}).should.not.applyOn([2,1]);
            });
            it('should take array size', function () {
                ({$splice: [[2]]}).should.applyOn([2,3]);
            });
            it('should take negative start', function () {
                ({$splice: [[-1]]}).should.applyOn([1, 2]);
            });
            it('should take negative size', function () {
                ({$splice: [[-1]]}).should.applyOn([1]);
            });
            it('should not underflow', function () {
                ({$splice: [[-2]]}).should.not.applyOn([1]);
            });
            it('should delete', function() {
                ({$splice: [[0, 2]]}).should.applyOn([1,2,3]);
            });
            it('should delete to the end', function () {
                ({$splice: [[1, 2]]}).should.applyOn([2,3,5]);
            });
            it('should not delete over end', function () {
                ({$splice: [[1,3]]}).should.not.applyOn([2,3,1]);
            });
            it('should delete from negative start', function () {
                ({$splice: [[-1, 1]]}).should.applyOn([4, 5, 6]);
            });
            it('should not overdelete from negative start', function () {
                ({$splice: [[-1, 2]]}).should.not.applyOn([4,2]);
            });
            it('should allow adding', function () {
                ({$splice: [[1, 0, 2, 5, 6, 3, 1]]}).should.applyOn([2,3]);
            });
            it('should allow various type adding', function () {
                ({$splice: [[1, 0, 'asta', {}, []]]}).should.applyOn([2, 3]);
            });
            it('should allow adding while deleting', function () {
                ({$splice: [[1, 3, 5, 3]]}).should.applyOn([2,3,4,5]);
            });
            it('should work with multiple adds and deletes', function () {
                ({$splice: [[-2, 1], [0, 1, 2, 3, 4], [1, 1]]}).should.applyOn([4, 3, 2]);
            });
            it('should not accept multiple adds and deletes which do not add up', function () {
                ({$splice: [[1, 1], [2, 1, 1], [1, 2], [1, 1]]}).should.not.applyOn([3, 4, 5, 6]);
            });
        });
        it('should apply on substructure', function () {
            ({sections: {
                1: {$set: {id: 2, heading: 'What do you know'}},
                5: {children: {$splice: [[1, 0, 4, 3]]}},
                $merge: {
                    3: {id: 3, heading: 'Third section'},
                    4: {id: 4, heading: 'Fourth section'}
                }
            }}).should.applyOn({sections: {
                1: {id: 1, heading: 'First section'},
                2: {id: 2, heading: 'Second section'},
                5: {id: 5, children: [4, 5]},
                6: {id: 6, children: [10, 12]}
            }});
        });
        it('should not apply on missing links', function () {
            ({
                1: {id: {$set: 2}},
                2: {$set: {id: 3}}
            }).should.not.applyOn({
                1: {heading: 'First section'},
                2: {id: 5, heading: 'Second section'}
            });
        });
    })
    describe('model property', function () {
       it('should accept a simple model', function () {
           ({
               sections: {
                   0: {
                       id: 0,
                       heading: 'H1',
                       children: [],
                       contents: []
                   }
               },
               selection: null,
               editor: null,
           }).should.be.model;
       });
    });
});

