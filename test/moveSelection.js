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
        it('should preserve whole page selection', function () {
            void expect(move(state({
                0: {id: 0, parent: null},
                section: 0,
                index: null
            }), Direction.PARENT)).to.be.null;
        });
        it('should move from paragraph to parent section', function () {
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
        it('should move from section to parent section', function () {
            move(state({
                0: {id: 0, parent: null, contents: [1]},
                1: {id: 1, parent: 0},
                section: 1,
                index: null
            }), Direction.PARENT).should.deep.equal({selection: {section: {$set: 0}}});
        });
        it('should move from section to parent section even with preceding paragraphs and sections', function () {
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
        it('should not move from first section', function () {
            void expect(move(state({
                0: {id: 0, parent: null},
                section: 0,
                index: null
            }), Direction.UP)).to.be.null;
        });
        it('should move to previous paragraph in a seciton');
        it('should move from first paragraph to parent section');
        it('should move from first subsection to first paragraph of parent section');
        it('should move from first subsection to paragraph-less parent section');
        it('should move from section to previous empty section');
        it('should move from section to last paragraph of previous section');
        it('should move from section to last empty subsection of previous section');
        it('should move from section to last paragraph of previous subsection');
        it('should move from section to last paragraph of previous subsubsection');
    });
    describe('move down', function () {
        it('should move to next paragraph in a section', function () {
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
        it('should move from section to its first paragraph', function () {
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
        it('should move from last paragraph to first child section', function () {
            move(state({
                0: {id: 0, parent: null, contents: [{id: 1}], children: [2]},
                2: {id: 2, parent: 0},
                section: 0,
                index: 1
            }), Direction.DOWN).should.deep.equal({selection: {$set: {section: 2, index: null}}});
        });
        it('should move from paragraph-less section to to first child section', function () {
            move(state({
                0: {id: 0, parent: null, children: [1]},
                1: {id: 1, parent: 0},
                section: 0,
                index: null
            }), Direction.DOWN).should.deep.equal({selection: {section: {$set: 1}}});
        });
        it('should move from last paragraph to next section', function () {
            move(state({
                0: {id: 0, parent: null, children: [1, 3]},
                1: {id: 1, parent: 0, contents: [{id: 2}]},
                3: {id: 3, parent: 0},
                section: 1,
                index: 0
            }), Direction.DOWN).should.deep.equal({selection: {$set: {section: 3, index: null}}});
        });
        it('should move from last subsubsection to next section', function () {
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
        it('should move from last subsubsection paragraph to next section', function () {
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
        it('should not move from last paragraph without subsection', function () {
            void expect(move(state({
                0: {
                    id: 0, parent: null, contents: [
                        {id: 1},
                        {id: 2},
                        {id: 3}
                    ]
                },
                section: 0,
                index: 2
            }), Direction.DOWN)).to.be.null;
        });
        it('should not move from last subsection', function () {
            void expect(move(state({
                0: {id: 0, parent: null, children: [1]},
                1: {id: 1, parent: 0},
                section: 1,
                index: null
            }), Direction.DOWN)).to.be.null;
        });
        it('should not move from last paragraph of subsection', function () {
            void expect(move(state({
                0: {id: 0, parent: null, children: [1]},
                1: {id: 1, parent: 0, contents: [{id: 2}]},
                section: 1,
                index: 1
            }), Direction.DOWN)).to.be.null;
        });
    });
});