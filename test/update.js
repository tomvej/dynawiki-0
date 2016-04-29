import { should } from 'chai'

import update from '../src/reducers/utils/update'

should();

describe('Update Routine', function () {
    describe('$set command', function () {
        it('should work without parent', function () {
            const target = {};
            update({}, {$set: target}).state
                .should.equal(target);
        });
    });
});