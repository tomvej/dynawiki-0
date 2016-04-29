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
});