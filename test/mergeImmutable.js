import { should } from 'chai'
import 'babel-polyfill'

import merge from  '../src/reducers/utils/mergeImmutable'

should();

describe('Immutable Merge Helper', function () {
    it('should merge objects', function () {
        const target = {
            1: {id: 1}
        };
        const object = {
            2: {id: 2}
        };
        merge(target, object).should.deep.equal({
            1: {id: 1},
            2: {id: 2}
        });
        target.should.deep.equal({1: {id: 1}});
        object.should.deep.equal({2: {id: 2}});
    });
    it('should merge arrays', function () {
        const target = [1, 2, 3];
        const object = [4, 5, 6];
        merge(target, object).should.deep.equal([1, 2, 3, 4, 5, 6]);
        target.should.deep.equal([1, 2, 3]);
        object.should.deep.equal([4, 5, 6]);
    });
    it('should not merge array to object', function () {
        const target = {};
        const object = [1, 3];
        (() => merge(target, object)).should.throw();
        target.should.deep.equal({});
        object.should.deep.equal([1, 3]);
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
        const object = {};
        (() => merge(target, object)).should.throw();
        target.should.deep.equal([1]);
        object.should.deep.equal({});
    });
    it('should not merge string to array', function () {
        const target = [1];
        (() => merge(target, 'string')).should.throw();
        target.should.deep.equal([1]);
    });
    it('should not merge number to array', function () {
        const target = [1];
        (() => merge(target, 12)).should.throw();
        target.should.deep.equal([1]);
    });
    it('should not merge undefined to array', function () {
        const target = [1];
        (() => merge(target, undefined)).should.throw();
        target.should.deep.equal([1]);
    });
    it('should not merge strings', function () {
        (() => merge('string', 'asfafa')).should.throw();
    });
    it('should not merge strings to number', function () {
        (() => merge(15, 'sfafa')).should.throw();
    });
    it('should allow deep object merging', function () {
        const target = {sections: {1: {id: {$set: 12}}}};
        const object = {sections: {1: {heading: {$set: 'Next'}}}};
        merge(target, object).should.deep.equal({
            sections: {
                1: {
                    id: {$set: 12},
                    heading: {$set: 'Next'}
                }
            }
        });
        target.should.deep.equal({sections: {1: {id: {$set: 12}}}});
        object.should.deep.equal({sections: {1: {heading: {$set: 'Next'}}}});
    });
    it('should allow deep array merging', function () {
        const target = {sections: {1: {children: {$splice: [[2, 3]]}}}};
        const object = {sections: {1: {children: {$splice: [[1, 0, 2]]}}}};
        merge(target, object).should.deep.equal({sections: {1: {children: {$splice: [[2, 3], [1, 0, 2]]}}}});
        target.should.deep.equal({sections: {1: {children: {$splice: [[2, 3]]}}}});
        object.should.deep.equal({sections: {1: {children: {$splice: [[1, 0, 2]]}}}});
    });
    it('should not allow deep mismatch', function () {
        const target = {sections: {1: {heading: {$set: 'String'}}}};
        const object = {sections: {1: {heading: {$set: 'Not a string'}}}};
        (() => merge(target, object)).should.throw();
        target.should.deep.equal({sections: {1: {heading: {$set: 'String'}}}});
        object.should.deep.equal({sections: {1: {heading: {$set: 'Not a string'}}}});
    });

});