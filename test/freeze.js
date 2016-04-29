import { should } from 'chai'
import 'babel-polyfill'

import { deepFreeze } from '../src/middleware/freeze'

should();

describe('Deep Freeze Helper', function () {
    it('should freeze an object', function () {
        const target = {};
        deepFreeze(target);
        target.should.be.frozen;
    });
    it('should freeze a nested object', function() {
        const target = {
            sections:  {
                1: {id: '1', heading: 'First section', children: [4, 5, 6]},
                2: {id: '3', heading: 'Second section', children: [5, 3, 2]}
            },
            editor: {
                section: 1,
                index: 5,
                text: ''
            }
        };
        deepFreeze(target);
        target.sections['1'].should.be.frozen;
        target.sections['2'].children.should.be.frozen;
    });
    it('should not change an object', function () {
        const target = {
            sections: {
                1: {id: 1, heading: 'First Section'}
            },
            editor: {
                section: 1
            },
            array: [1,2,5]
        };
        deepFreeze(target);
        target.should.deep.equal({
            sections: {
                1: {id: 1, heading: 'First Section'}
            },
            editor: {
                section: 1
            },
            array: [1,2,5]
        });
    });
});