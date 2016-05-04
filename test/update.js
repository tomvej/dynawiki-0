import { should } from 'chai'
import 'babel-polyfill'

import update from '../src/reducers/utils/update'

should();

describe('Update Routine', function () {
    describe('$set command', function () {
        it('should work without parent', function () {
            const target = {};
            update({}, {$set: target}).state
                .should.equal(target);
        });
        it('should work when nested', function () {
            update({
                    sections: {
                        1: {id: 1, heading: 'Section 1'},
                        2: {id: 2, heading: 'Section 2'},
                        3: {id: 3, heading: 'Section 3'}
                    }
                }, {sections: {3: {heading: {$set: 'Third Section'}}}}
            ).state.should.deep.equal({
                sections: {
                    1: {id: 1, heading: 'Section 1'},
                    2: {id: 2, heading: 'Section 2'},
                    3: {id: 3, heading: 'Third Section'}
                }
            });
        });
    });
    describe('merge command', function() {
        it('should work without parent', function () {
            update({}, {$merge: {1: {id: 1, heading: 'Section One'}}}).state
                .should.deep.equal({1: {id: 1, heading: 'Section One'}});
        });
        it('should work when nested', function () {
            update({
                sections: {
                    1: {id: 1, heading: 'Section 1'},
                    2: {id: 2, heading: 'Section 2'}
                }
            }, {sections: {2: {$merge: {children: [1,2,3]}}}}).state
                .should.deep.equal({
                sections: {
                    1: {id: 1, heading: 'Section 1'},
                    2: {id: 2, heading: 'Section 2', children: [1,2,3]}
                }
            });
        });
        it('should overwrite existing elements', function () {
            update({
                1: {id: 1, heading: 'Section One'},
                2: {id: 2, heading: 'Section Two'}
            }, {$merge: {2: {id: 3, heading: 'Section Three'}}}).state
                .should.deep.equal({
                1: {id: 1, heading: 'Section One'},
                2: {id: 3, heading: 'Section Three'}
            });
        });
    });
    describe('$splice command', function () {
        it('should delete the rest when without second argument', function () {
            update([1, 2, 3], {$splice: [[2]]}).state.should.deep.equal([1, 2]);
        });
        it('should accept negative start', function () {
            update([1, 2, 3], {$splice: [[-1]]}).state.should.deep.equal([1, 2]);
        });
        it('should delete none when zero specified', function () {
            update([1, 2, 3], {$splice: [[1, 0]]}).state.should.deep.equal([1, 2, 3]);
        });
        it('should delete precise number', function () {
            update([1, 2, 3, 4], {$splice: [[1, 1]]}).state.should.deep.equal([1, 3, 4]);
        });
        it('should append elements', function () {
            update([1, 2, 3], {$splice: [[1, 0, 4, 5]]}).state.should.deep.equal([1, 4, 5, 2, 3]);
        });
        it('should delete and append', function () {
            update([1, 2, 3], {$splice: [[1, 2, 4, 5]]}).state.should.deep.equal([1, 4, 5]);
        });
        it('should delete and append with multiple arguments', function () {
            update([1, 2, 3], {$splice: [[2, 1, 4, 5], [1, 2, 6, 7], [3, 1]]}).state.should.deep.equal([1, 6, 7]);
        });
        it('should work nested', function () {
            update({
                sections: {
                    1: {id: 1, heading: 'First Section', children: [1, 2, 3]},
                    2: {id: 2, heading: 'Second Section', children: [1, 2, 3]}
                }
            }, {sections: {2: {children: {$splice: [[2, 1, 4]]}}}}).state.should.deep.equal({
                sections: {
                    1: {id: 1, heading: 'First Section', children: [1, 2, 3]},
                    2: {id: 2, heading: 'Second Section', children: [1, 2, 4]}
                }
            });
        });
    });
    it('should change several subtrees at once', function () {
        update({
            sections: {
                1: {id: 1, heading: 'First Section', children: [1, 2, 3]},
                2: {id: 2, heading: 'Second Section', children: [4, 5, 6]},
                3: {id: 3, heading: 'Third Section', children: [7, 8, 9]}
            },
            editor: {
                section: 2,
                index: 1,
                text: ''
            }
        }, {
            sections: {
                $merge: {
                    4: {id: 4, heading: 'Now it gets weird'}
                },
                1: {$set: {id: 5, heading: 'WTF?'}},
                2: {
                    id: {$set: 4},
                    children: {$splice: [[1, 1]]}
                },
                3: {
                    $merge: {content: ['Nothing', 'Something']},
                    children: {$splice: [[-1, 0, 12, 13]]}
                }
            },
            editor: {
                index: {$set: 12}
            }

        }).state.should.deep.equal({
            sections: {
                1: {id: 5, heading: 'WTF?'},
                2: {id: 4, heading: 'Second Section', children: [4, 6]},
                3: {id: 3, heading: 'Third Section', children: [7, 8, 12, 13, 9], content: ['Nothing', 'Something']},
                4: {id: 4, heading: 'Now it gets weird'}
            },
            editor: {
                section: 2,
                index: 12,
                text: ''
            }
        });
    });
});