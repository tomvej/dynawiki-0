import chai, { expect } from 'chai'
import 'babel-polyfill'

import move from '../src/reducers/moveSelection'
import { Direction } from '../src/actions/moveSelection'

chai.should();

const state = object => {
    const selection = {
        section: object.section,
        index: object.index
    };
    delete object.section;
    delete object.index;
    return {
        sections: object,
        selection
    }
};

describe('Move Selection Reducer', function () {
    describe('move to parent', function () {
        it('preserves whole page selection', function () {
            void expect(move(state({
                0: {id: 0, parent: null},
                section: 0,
                index: null
            }), Direction.PARENT)).to.be.null;
        });
        it('moves from paragraph to parent section', function () {
            move(state({
                0: {
                    id: 0, parent: null, children: [
                        {id: 1},
                        {id: 2}
                    ]
                },
                section: 0,
                index: 1
            }), Direction.PARENT).should.deep.equal({selection: {index: {$set: null}}});
        });
        it('moves from section to parent section', function () {
            move(state({
                0: {id: 0, parent: null, contents: [1]},
                1: {id: 1, parent: 0},
                section: 1,
                index: null
            }), Direction.PARENT).should.deep.equal({selection: {section: {$set: 0}}});
        });
        it('moves from section to parent section even with preceding paragraphs and sections', function () {
            move(state({
                0: {
                    id: 0, parent: null, contents: [1, 2], children: [
                        {id: 3},
                        {id: 4}
                    ]
                },
                1: {
                    id: 1, parent: 0, contents: [
                        {id: 5},
                        {id: 6}
                    ]
                },
                2: {id: 2, parent: 0},
                section: 2,
                index: null
            }), Direction.PARENT).should.deep.equal({selection: {section: {$set: 0}}});
        });
    });
    describe('move up', function () {

    });
    describe('move down', function () {
        it('selects next paragraph in a section', function () {
            move(state({
                0: {
                    id: 0, parent: null, contents: [
                        {id: 1},
                        {id: 2},
                        {id: 3}
                    ]
                },
                section: 0,
                index: 1
            }), Direction.DOWN).should.deep.equal({selection: {index: {$set: 2}}});
        });
        it('selects first paragraph from section', function () {
            move(state({
                0: {
                    id: 0, parent: null, contents: [
                        {id: 1},
                        {id: 2}
                    ]
                },
                section: 0,
                index: null
            }), Direction.DOWN).should.deep.equal({selection: {index: {$set: 0}}});
        });
        it('selects first child section from last paragraph', function () {
            move(state({
                0: {id: 0, parent: null, contents: [{id: 1}], children: [2]},
                2: {id: 2, parent: 0},
                section: 0,
                index: 1
            }), Direction.DOWN).should.deep.equal({selection: {$set: {section: 2, index: null}}});
        });
        it('selects first child section from paragraph-less section', function () {
            move(state({
                0: {id: 0, parent: null, children: [1]},
                1: {id: 1, parent: 0},
                section: 0,
                index: null
            }), Direction.DOWN).should.deep.equal({selection: {section: {$set: 1}}});
        });
        it('selects next section from last paragraph', function () {
            move(state({
                0: {id: 0, parent: null, children: [1, 3]},
                1: {id: 1, parent: 0, contents: [{id: 2}]},
                3: {id: 3, parent: 0},
                section: 1,
                index: 0
            }), Direction.DOWN).should.deep.equal({selection: {$set: {section: 3, index: null}}});
        });
        it('selects next section from last subsubsection', function () {
            move(state({
                0: {id: 0, parent: null, children: [1, 2]},
                1: {id: 1, parent: 0, children: [3]},
                2: {id: 2, parent: 0},
                3: {id: 3, parent: 1, children: [4]},
                4: {id: 4, parent: 3},
                section: 4,
                index: null
            }), Direction.DOWN).should.deep.equal({selection: {section: {$set: 2}}});
        });
        it('selects next section from last subsubsection paragraph', function () {
            move(state({
                0: {id: 0, parent: null, children: [1, 2]},
                1: {id: 1, parent: 0, children: [3]},
                2: {id: 2, parent: 0},
                3: {id: 3, parent: 1, children: [4]},
                4: {id: 4, parent: 3, contents: [{id: 5}]},
                section: 4,
                index: 0
            }), Direction.DOWN).should.deep.equal({selection: {$set: {section: 2, index: null}}});
        });
    });
});