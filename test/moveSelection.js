import chai from 'chai'
import 'babel-polyfill'

import move from '../src/reducers/moveSelection'
import update from '../src/reducers/utils/update'
import { Direction } from '../src/actions/moveSelection'

chai.should();

chai.use(function (chai, utils) {
    const expect = object => new chai.Assertion(object);
    chai.Assertion.addMethod('in', function (sections) {
        const state = {
            sections,
            selection: utils.flag(this, 'fromSelection')
        };
        const command = move(state, this._obj);
        if (utils.flag(this, 'negate')) {
            void expect(command).to.be.null;
        } else {
            expect(command).to.have.keys('selection');
            const result = update(state.selection, command.selection).state;
            expect(result).to.deep.equal(utils.flag(this, 'toSelection'));
        }
    });
    chai.Assertion.addChainableMethod('change', function(section, index) {
        utils.flag(this, 'fromSelection', {section, index});
    }, function(){});
    chai.Assertion.addMethod('into', function (section, index) {
        utils.flag(this, 'toSelection', {section, index});
    });
});

describe('Move Selection Reducer', function () {
    describe('move to parent', function () {
        it('should preserve whole page selection', function () {
            Direction.PARENT.should.not.change(0, null).in({
                0: {id: 0, parent: null}
            });
        });
        it('should move from paragraph to parent section', function () {
            Direction.PARENT.should.change(0, 1).into(0, null).in({
                0: {
                    id: 0, parent: null, children: [
                        {id: 1},
                        {id: 2}
                    ]
                }
            });
        });
        it('should move from section to parent section', function () {
            Direction.PARENT.should.change(1, null).into(0, null).in({
                0: {id: 0, parent: null, contents: [1]},
                1: {id: 1, parent: 0}
            });
        });
        it('should move from section to parent section even with preceding paragraphs and sections', function () {
            Direction.PARENT.should.change(2, null).into(0, null).in({
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
                2: {id: 2, parent: 0}
            });
        });
    });
    describe('move up', function () {
        it('should not move from first section', function () {
            Direction.UP.should.not.change(0, null).in({
                0: {id: 0, parent: null},
            });
        });
        it('should move to previous paragraph in a section', function () {
            Direction.UP.should.change(0, 2).into(0, 1).in({
               0: {
                   id: 0, parent: null, contents: [
                       {id: 1},
                       {id: 2},
                       {id: 3},
                       {id: 4}
                   ]
               }
            });
        });
        it('should move from first paragraph to parent section', function () {
            Direction.UP.should.change(0, 0).into(0, null).in({
                0: {
                    id: 0, parent: null, contents: [
                        {id: 1},
                        {id: 2}
                    ]
                }
            });
        });
        it('should move from first subsection to last paragraph of parent section', function () {
            Direction.UP.should.change(1, null).into(0, 2).in({
                0: {
                    id: 0, parent: null, children: [1, 2], contents: [
                        {id: 3},
                        {id: 4},
                        {id: 5}
                    ]
                },
                1: {
                    id: 1, parent: 0, contents: [
                        {id: 6},
                        {id: 7}
                    ]
                },
                2: {
                    id: 2, parent: 0, contents: [
                        {id: 8}
                    ]
                }
            });
        });
        it('should move from first subsection to paragraph-less parent section', function () {
            Direction.UP.should.change(1, null).into(0, null).in({
                0: {id: 0, parent: null, children: [1, 2]},
                1: {id: 1, parent: 0, contents: [{id: 3}, {id: 4}]},
                2: {id: 2, parent: 0, contents: [{id: 5}]}
            });
        });
        it('should move from section to previous empty section', function () {
            Direction.UP.should.change(3, null).into(2, null).in({
                0: {id: 0, parent: null, children: [1, 2, 3]},
                1: {id: 1, parent: 0, children: [4], contents: [{id: 5}]},
                2: {id: 2, parent: 0},
                3: {id: 3, parent: 0, children: [6], contents: [{id: 7}]},
                4: {id: 4, parent: 1},
                6: {id: 6, parent: 3}
            })
        });
        it('should move from section to last paragraph of previous section', function () {
            Direction.UP.should.change(2, null).into(1, 1).in({
                0: {id: 0, parent: null, children: [1, 2]},
                1: {
                    id: 1, parent: 0, contents: [
                        {id: 3},
                        {id: 4}
                    ]
                },
                2: {id: 2, parent: 0, children: [6], contents: [{id: 5}]},
                6: {id: 6, parent: 2}
            });
        });
        it('should move from section to last empty subsection of previous section', function () {
            Direction.UP.should.change(2, null).into(4, null).in({
                0: {id: 0, parent: null, children: [1, 2]},
                1: {id: 1, parent: 0, children: [3, 4], contents: [{id: 5}]},
                2: {id: 2, parent: 0, contents: [{id: 6}, {id: 7}]},
                3: {id: 3, parent: 1, contents: [{id: 8}]},
                4: {id: 4, parent: 1}
            });
        });
        it('should move from section to last paragraph of previous subsection', function () {
            Direction.UP.should.change(2, null).into(4, 1).in({
                0: {id: 0, parent: null, children: [1, 2]},
                1: {id: 1, parent: 0, children: [3, 4], contents: [{id: 5}]},
                2: {id: 2, parent: 0, contents: [{id: 6}, {id: 7}]},
                3: {id: 3, parent: 1, contents: [{id: 8}]},
                4: {id: 4, parent: 1, contents: [{id: 9}, {id: 10}]}
            });
        });
        it('should move from section to last paragraph of previous subsubsection', function () {
            Direction.UP.should.change(2, null).into(6, 2).in({
                0: {id: 0, parent: null, children: [1, 2]},
                1: {id: 1, parent: 0, children: [3, 4]},
                2: {id: 2, parent: 0, contents: [{id: 13}], children: [14]},
                3: {id: 3, parent: 1, contents: [{id: 11}, {id: 12}]},
                4: {id: 4, parent: 1, children: [5, 6]},
                5: {id: 5, parent: 4, contents: [{id: 10}]},
                6: {id: 6, parent: 4, contents: [{id: 7}, {id: 8}, {id: 9}]},
                14: {id: 14, parent: 2, contents: [{id: 15}]}
            });
        });
    });
    describe('move down', function () {
        it('should move to next paragraph in a section', function () {
            Direction.DOWN.should.change(0, 1).into(0, 2).in({
                0: {
                    id: 0, parent: null, contents: [
                        {id: 1},
                        {id: 2},
                        {id: 3}
                    ]
                }
            });
        });
        it('should move from section to its first paragraph', function () {
            Direction.DOWN.should.change(0, null).into(0, 0).in({
                0: {
                    id: 0, parent: null, contents: [
                        {id: 1},
                        {id: 2}
                    ]
                }
            });
        });
        it('should move from last paragraph to first child section', function () {
            Direction.DOWN.should.change(0, 1).into(2, null).in({
                0: {id: 0, parent: null, contents: [{id: 1}], children: [2]},
                2: {id: 2, parent: 0}
            });
        });
        it('should move from paragraph-less section to to first child section', function () {
            Direction.DOWN.should.change(0, null).into(1, null).in({
                0: {id: 0, parent: null, children: [1]},
                1: {id: 1, parent: 0}
            });
        });
        it('should move from last paragraph to next section', function () {
            Direction.DOWN.should.change(1, 0).into(3, null).in({
                0: {id: 0, parent: null, children: [1, 3]},
                1: {id: 1, parent: 0, contents: [{id: 2}]},
                3: {id: 3, parent: 0}
            });
        });
        it('should move from last subsubsection to next section', function () {
            Direction.DOWN.should.change(4, null).into(2, null).in({
                0: {id: 0, parent: null, children: [1, 2]},
                1: {id: 1, parent: 0, children: [3]},
                2: {id: 2, parent: 0},
                3: {id: 3, parent: 1, children: [4]},
                4: {id: 4, parent: 3}
            });
        });
        it('should move from last subsubsection paragraph to next section', function () {
            Direction.DOWN.should.change(4, 0).into(2, null).in({
                0: {id: 0, parent: null, children: [1, 2]},
                1: {id: 1, parent: 0, children: [3]},
                2: {id: 2, parent: 0},
                3: {id: 3, parent: 1, children: [4]},
                4: {id: 4, parent: 3, contents: [{id: 5}]}
            });
        });
        it('should not move from last paragraph without subsection', function () {
            Direction.DOWN.should.not.change(0, 2).in({
                0: {
                    id: 0, parent: null, contents: [
                        {id: 1},
                        {id: 2},
                        {id: 3}
                    ]
                }
            });
        });
        it('should not move from last subsection', function () {
            Direction.DOWN.should.not.change(1, null).in({
                0: {id: 0, parent: null, children: [1]},
                1: {id: 1, parent: 0},
                section: 1,
                index: null
            });
        });
        it('should not move from last paragraph of subsection', function () {
            Direction.DOWN.should.not.change(1, 1).in({
                0: {id: 0, parent: null, children: [1]},
                1: {id: 1, parent: 0, contents: [{id: 2}]}
            });
        });
    });
});