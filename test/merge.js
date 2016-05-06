import {should} from 'chai'
import 'babel-polyfill'

import merge from '../src/reducers/utils/merge'

should();

describe('Merge Helper', function () {
    it('should merge objects', function () {
        const target = {
            1: {id: 1}
        };
        merge(target, {
            2: {id: 2}
        });
        target.should.deep.equal({
            1: {id: 1},
            2: {id: 2}
        });
    });
    it('should merge arrays', function () {
        const target = [1, 2, 3];
        merge(target, [4, 5, 6]);
        target.should.deep.equal([1, 2, 3, 4, 5, 6]);
    });
    it('should not merge array to object', function () {
        const target = {};
        (() => merge(target, [1, 3])).should.throw();
        target.should.deep.equal({});
    });
    it('should not merge string to object', function () {
        const target = {};
        (() => merge(target, 'merge')).should.throw();
        target.should.deep.equal({});
    });
    it('should not merge number to object', function () {
        const target = {};
        (() => merge(target, 25)).should.throw();
        target.should.deep.equal({});
    });
    it('should not merge undefined to object', function () {
        const target = {};
        (() => merge(target, undefined)).should.throw();
        target.should.deep.equal({});
    });
    it('should not merge object to array', function () {
        const target = [1];
        (() => merge(target, {})).should.throw();
        target.should.deep.equal([1]);
    });
    it('should not merge string to array', function () {
        const target = [1];
        (() => merge(target, 'string')).should.throw();
        target.should.deep.equal([1]);
    });
    it('should not merge number to array', function () {
        const target = [1];
        (() => merge(target, 12)).should.throw();
    });
    it('should not merge undefined to array', function () {
        const target = [1];
        (() => merge(target, undefined)).should.throw();
        target.should.deep.equal([1]);
    });
    it('should not merge strings', function () {
        const target = 'string';
        (() => merge(target, 'asfafa')).should.throw();
        target.should.deep.equal('string');
    });
    it('should not merge strings to number', function () {
        const target = 15;
        (() => merge(target, 'sfafa')).should.throw();
        target.should.deep.equal(15);
    });
    it('should allow deep object merging', function () {
        const target = {sections: {1: {id: {$set: 12}}}};
        merge(target, {sections: {1: {heading: {$set: 'Next'}}}});
        target.should.deep.equal({
            sections: {
                1: {
                    id: {$set: 12},
                    heading: {$set: 'Next'}
                }
            }
        });
    });
    it('should allow deep array merging', function () {
        const target = {sections: {1: {children: {$splice: [[2, 3]]}}}};
        merge(target, {sections: {1: {children: {$splice: [[1, 0, 2]]}}}});
        target.should.deep.equal({sections: {1: {children: {$splice: [[2, 3], [1, 0, 2]]}}}});
    });
    it('should not allow deep mismatch', function () {
        const target = {sections: {1: {heading: {$set: 'String'}}}};
        (() => merge(target, {sections: {1: {heading: {$set: 'Not a string'}}}})).should.throw();
        target.should.deep.equal({sections: {1: {heading: {$set: 'String'}}}});
    });
});