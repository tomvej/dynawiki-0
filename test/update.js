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
});