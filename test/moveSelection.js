import chai, { expect } from 'chai'
import 'babel-polyfill'

import move from '../src/reducers/moveSelection'
import { Direction } from '../src/actions/moveSelection'

chai.should();

describe('Move Selection Reducer', function () {
    describe('move to parent', function () {
        it('preserves whole page selection', function () {
            void expect(move({
                sections: {
                    0: {
                        id: 0,
                        parent: null
                    }
                },
                selection: {
                    section: 0,
                    index: null
                }
            }, Direction.PARENT)).to.be.null;
        });
        it('moves from paragraph to parent section', function () {
            move({
                sections: {
                    0: {
                        id: 0,
                        parent: null,
                        children: [
                            {id: 1},
                            {id: 2}
                        ]
                    }
                },
                selection: {
                    section: 0,
                    index: 1
                }
            }, Direction.PARENT).should.deep.equal({selection: {index: {$set: null}}});
        });
        it('moves from section to parent section', function () {
            move({
                sections: {
                    0: {
                        id: 0,
                        parent: null,
                        contents: [1]
                    },
                    1: {
                        id: 1,
                        parent: 0
                    }
                },
                selection: {
                    section: 1,
                    index: null
                }
            }, Direction.PARENT).should.deep.equal({selection: {section: {$set: 0}}});
        });
        it('moves from section to parent section even with preceding paragraphs and sections', function () {
            move({
                sections: {
                    0: {
                        id: 0,
                        parent: null,
                        contents: [1, 2],
                        children: [
                            {id: 3},
                            {id: 4}
                        ]
                    },
                    1: {
                        id: 1,
                        parent: 0,
                        contents: [
                            {id: 5},
                            {id: 6}
                        ]
                    },
                    2: {
                        id: 2,
                        parent: 0
                    }
                },
                selection: {
                    section: 2,
                    index: null
                }
            }, Direction.PARENT).should.deep.equal({selection: {section: {$set: 0}}});
        });
    });
    describe('move up', function () {

    });
    describe('move down', function () {

    });
});