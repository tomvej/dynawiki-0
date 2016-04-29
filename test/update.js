import { expect } from 'chai'

import update from '../src/reducers/utils/update'

describe('Update Routine', function () {
    describe('$set command', function () {
        it('should work without parent', function () {
            const target = {};
            expect(
                update({}, {$set: target}).state
            ).to.equal(
                target
            );
        });
    });
});