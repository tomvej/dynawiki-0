import chai from 'chai'
import 'babel-polyfill'

import publish from '../src/reducers/publish'
import update from '../src/reducers/utils/update'

chai.should();

const state = object => {
    const nextId = object.nextId;
    const editor = {
        section: object.section,
        index: object.index,
        text: ''
    };
    delete object.nextId;
    delete object.section;
    delete object.index;
    return {
        sections: object,
        nextId: nextId,
        editor: editor
    };
};

chai.use(function (chai, utils) {
    chai.Assertion.addMethod('update', function (object) {
        utils.flag(this, 'source', object);
    });
    chai.Assertion.addChainableMethod('to', function (object) {
        new chai.Assertion(this._obj).to.be.an('array');
        const source = state(utils.flag(this, 'source'));
        update(source, publish(source, this._obj)).state.should.deep.equal(state(object));
    }, function () {});
});

const paragraph = text => ({
    type: 'paragraph',
    text: text
});
const section = (level, heading) => ({
    type: 'section',
    heading: heading,
    level: level
});

describe('Publish Reducer', function () {
    it('should append paragraph', function () {
        [
            paragraph('Paragraph')
        ].should.update({
            nextId: 1,
            section: 0,
            index: 0,
            0: {
                id: 0,
                heading: 'H1',
                contents: [],
                children: []
            }
        }).to({
            nextId: 2,
            section: 0,
            index: 1,
            0: {
                id: 0,
                heading: 'H1',
                contents: [{
                    id: 1,
                    text: 'Paragraph'
                }],
                children: []
            }
        });
    });
    it('should insert paragraph', function() {
        [
            paragraph('Paragraph')
        ].should.update({
            nextId: 3,
            section: 0,
            index: 1,
            0: {
                id: 0,
                heading: 'H1',
                contents: [
                    { id: 1, text: 'First paragraph'},
                    { id: 2, text: 'Second paragraph'}
                ],
                children: []
            }
        }).to({
            nextId: 4,
            section: 0,
            index: 2,
            0: {
                id: 0,
                heading: 'H1',
                contents: [
                    { id: 1, text: 'First paragraph'},
                    { id: 3, text: 'Paragraph'},
                    { id: 2, text: 'Second paragraph'}
                ],
                children: []
            }
        });
    });
    it('should append lower-level section', function () {
        [
            section(0, 'Subsection')
        ].should.update({
            nextId: 1,
            section: 0,
            index: 0,
            0: {
                id: 0,
                heading: 'Section',
                children: [],
                contents: []
            }
        }).to({
            nextId: 2,
            section: 1,
            index: 0,
            0: {
                id: 0,
                heading: 'Section',
                children: [1],
                contents: []
            },
            1: {
                id: 1,
                parent: 0,
                heading: 'Subsection',
                children: [],
                contents: []
            }
        });
    });
    it('should append lower-level section with paragraph', function () {
        [
            section(0, 'Subsection'),
            paragraph('Subsection paragraph')
        ].should.update({
            nextId: 2,
            section: 0,
            index: 1,
            0: {
                id: 0,
                heading: 'Section',
                children: [],
                contents: [{
                    id: 1,
                    text: 'Paragraph'
                }]
            }
        }).to({
            nextId: 4,
            section: 2,
            index: 1,
            0: {
                id: 0,
                heading: 'Section',
                children: [2],
                contents: [{
                    id: 1,
                    text: 'Paragraph'
                }]
            },
            2: {
                id: 2,
                parent: 0,
                heading: 'Subsection',
                children: [],
                contents: [{
                    id: 3,
                    text: 'Subsection paragraph'
                }]
            }
        });
    });
    it('should insert lower-level section', function() {
        [
            section(0, 'Another subsection')
        ].should.update({
            0: {
                id: 0,
                heading: 'Main section',
                children: [],
                contents: [
                    {id: 1, text: 'First paragraph'},
                    {id: 2, text: 'Second paragraph'}
                ]
            },
            nextId: 3,
            section: 0,
            index: 1
        }).to({
            0: {
                id: 0,
                heading: 'Main section',
                children: [3],
                contents: [{id: 1, text: 'First paragraph'}]
            },
            3: {
                id: 3,
                parent: 0,
                heading: 'Another subsection',
                children: [],
                contents: [{id: 2, text: 'Second paragraph'}]
            },
            nextId: 4,
            section: 3,
            index: 0
        });
    });
    it('should insert lower-level section with paragraph', function () {
        [
            section(0, 'Just a Section'),
            paragraph('Some kind of a paragraph')
        ].should.update({
            0: {
                id: 0,
                heading: 'New page',
                children: [],
                contents: [
                    {id: 1, text: 'First paragraph'},
                    {id: 2, text: 'Second paragraph'}
                ]
            },
            nextId: 3,
            section: 0,
            index: 1
        }).to({
            0: {
                id: 0,
                heading: 'New page',
                children: [3],
                contents: [{id: 1, text: 'First paragraph'}]
            },
            3: {
                id: 3,
                parent: 0,
                heading: 'Just a Section',
                children: [],
                contents: [
                    {id: 4, text: 'Some kind of a paragraph'},
                    {id: 2, text: 'Second paragraph'}
                ]

            },
            nextId: 5,
            section: 3,
            index: 1
        });
    });
    it('should insert lower-level section before another lower-level section', function () {
        [
            section(0, 'Subsection'),
            paragraph('Subparagraph')
        ].should.update({
            0: {
                id: 0,
                heading: 'Main Section',
                children: [1],
                contents: [{id: 2, text: 'I am a paragraph'}]
            },
            1: {
                id: 1,
                parent: 0,
                heading: 'Another Subsection',
                children: [],
                contents: [{id: 3, text: 'Subsection paragraph'}]
            },
            nextId: 4,
            section: 0,
            index: 1
        }).to({
            0: {
                id: 0,
                heading: 'Main Section',
                children: [4, 1],
                contents: [{id: 2, text: 'I am a paragraph'}],
            },
            1: {
                id: 1,
                parent: 0,
                heading: 'Another Subsection',
                children: [],
                contents: [{id: 3, text: 'Subsection paragraph'}]
            },
            4: {
                id: 4,
                parent: 0,
                heading: 'Subsection',
                children: [],
                contents: [{id: 5, text: 'Subparagraph'}]
            },
            nextId: 6,
            section: 4,
            index: 1
        });
    });
    it('should insert same-level section with paragraph', function () {
        [
            section(1, 'IS1'),
            paragraph('IP1')
        ].should.update({
            0: {
                id: 0,
                heading: 'S1',
                children: [1],
                contents: []
            },
            1: {
                id: 1,
                parent: 0,
                children: [],
                contents: [
                    {id: 2, text: 'P1'},
                    {id: 3, text: 'P2'}
                ]
            },
            nextId: 4,
            section: 1,
            index: 1
        }).to({
            0: {
                id: 0,
                heading: 'S1',
                children: [1, 4],
                contents: []
            },
            1: {
                id: 1,
                parent: 0,
                children: [],
                contents: [{id:2, text: 'P1'}]
            },
            4: {
                id: 4,
                parent: 0,
                heading: 'IS1',
                children: [],
                contents: [
                    {id: 5, text: 'IP1'},
                    {id: 3, text: 'P2'}
                ]
            },
            nextId: 6,
            section: 4,
            index: 1
        });
    });
    it('should append lower-level section structure', function () {
        [
            section(0, 'S1'),
            paragraph('P1'),
            section(-1, 'S2'),
            paragraph('P2'),
            section(-1, 'S3'),
            section(-2, 'S4'),
            section(-3, 'S5'),
            section(-2, 'S6'),
            paragraph('P3'),
            section(0, 'S7')
        ].should.update({
            0: {
                id: 0,
                heading: 'S0',
                children: [],
                contents: []
            },
            nextId: 1,
            section: 0,
            index: 0
        }).to({
            0: {
                id: 0,
                heading: 'S0',
                children: [1, 10],
                contents: []
            },
            1: {
                id: 1,
                parent: 0,
                heading: 'S1',
                children: [3, 5],
                contents: [{id: 2, text: 'P1'}]
            },
            3: {
                id: 3,
                parent: 1,
                heading: 'S2',
                children: [],
                contents: [{id: 4, text: 'P2'}]
            },
            5: {
                id: 5,
                parent: 1,
                heading: 'S3',
                children: [6, 8],
                contents: []
            },
            6: {
                id: 6,
                parent: 5,
                heading: 'S4',
                children: [7],
                contents: []
            },
            7: {
                id: 7,
                parent: 6,
                heading: 'S5',
                children: [],
                contents: []
            },
            8: {
                id: 8,
                parent: 5,
                heading: 'S6',
                children: [],
                contents: [{id: 9, text: 'P3'}]
            },
            10: {
                id: 10,
                parent: 0,
                heading: 'S7',
                children: [],
                contents: []
            },
            nextId: 11,
            section: 10,
            index: 0
        });
    });
    it('should append higher-level section', function () {
        [
            section(2, 'IS')
        ].should.update({
            0: {
                id: 0,
                heading: 'S0',
                children: [1],
                contents: []
            },
            1: {
                id: 1,
                parent: 0,
                heading: 'S1',
                children: [2],
                contents: []
            },
            2: {
                id: 2,
                parent: 1,
                heading: 'S2',
                children: [],
                contents: []
            },
            nextId: 3,
            section: 2,
            index: 0
        }).to({
            0: {
                id: 0,
                heading: 'S0',
                children: [1, 3],
                contents: []
            },
            1: {
                id: 1,
                parent: 0,
                heading: 'S1',
                children: [2],
                contents: []
            },
            2: {
                id: 2,
                parent: 1,
                heading: 'S2',
                children: [],
                contents: []
            },
            3: {
                id: 3,
                parent: 0,
                heading: 'IS',
                children: [],
                contents: []
            },
            nextId: 4,
            section: 3,
            index: 0
        });
    });
    it('should insert higher-level section', function () {
        [
            section(2, 'IS')
        ].should.update({
            0: {
                id: 0,
                heading: 'S0',
                children: [1],
                contents: []
            },
            1: {
                id: 1,
                parent: 0,
                heading: 'S1',
                children: [2],
                contents: []
            },
            2: {
                id: 2,
                parent: 1,
                heading: 'S2',
                children: [],
                contents: [{id: 3, text: 'paragraph'}]
            },
            nextId: 4,
            section: 2,
            index: 0
        }).to({
            0: {
                id: 0,
                heading: 'S0',
                children: [1, 4],
                contents: []
            },
            1: {
                id: 1,
                parent: 0,
                heading: 'S1',
                children: [2],
                contents: []
            },
            2: {
                id: 2,
                parent: 1,
                heading: 'S2',
                children: [],
                contents: []
            },
            4: {
                id: 4,
                parent: 0,
                heading: 'IS',
                children: [],
                contents: [{id: 3, text: 'paragraph'}]
            },
            nextId: 5,
            section: 4,
            index: 0
        });
    });
    it('should append section when inserting higher-level section before it', function () {
        [
            section(2, 'IS')
        ].should.update({
            0: {
                id: 0,
                heading: 'S0',
                children: [1],
                contents: []
            },
            1: {
                id: 1,
                parent: 0,
                heading: 'S1',
                children: [2],
                contents: []
            },
            2: {
                id: 2,
                parent: 1,
                heading: 'S2',
                children: [3],
                contents: []
            },
            3: {
                id: 3,
                parent: 2,
                heading: 'S3',
                children: [],
                contents: []
            },
            nextId: 4,
            section: 2,
            index: 0
        }).to({
            0: {
                id: 0,
                heading: 'S0',
                children: [1, 4, 3],
                contents: []
            },
            1: {
                id: 1,
                parent: 0,
                heading: 'S1',
                children: [2],
                contents: []
            },
            2: {
                id: 2,
                parent: 1,
                heading: 'S2',
                children: [],
                contents: []
            },
            3: {
                id: 3,
                parent: 0,
                heading: 'S3',
                children: [],
                contents: []
            },
            4: {
                id: 4,
                parent: 0,
                heading: 'IS',
                children: [],
                contents: []
            },
            nextId: 5,
            section: 4,
            index: 0
        });
    });
    it('should append section (with paragraph) when inserting higher-level section before it', function () {
        [
            section(2, 'IS')
        ].should.update({
            0: {
                id: 0,
                heading: 'S0',
                children: [1],
                contents: []
            },
            1: {
                id: 1,
                parent: 0,
                heading: 'S1',
                children: [2],
                contents: []
            },
            2: {
                id: 2,
                parent: 1,
                heading: 'S2',
                children: [3],
                contents: []
            },
            3: {
                id: 3,
                parent: 2,
                heading: 'S3',
                children: [],
                contents: [{id: 4, text: 'Look at me! I am a paragraph!'}]
            },
            nextId: 5,
            section: 2,
            index: 0
        }).to({
            0: {
                id: 0,
                heading: 'S0',
                children: [1, 5, 3],
                contents: []
            },
            1: {
                id: 1,
                parent: 0,
                heading: 'S1',
                children: [2],
                contents: []
            },
            2: {
                id: 2,
                parent: 1,
                heading: 'S2',
                children: [],
                contents: []
            },
            3: {
                id: 3,
                parent: 0,
                heading: 'S3',
                children: [],
                contents: [{id: 4, text: 'Look at me! I am a paragraph!'}]
            },
            5: {
                id: 5,
                parent: 0,
                heading: 'IS',
                children: [],
                contents: []
            },
            nextId: 6,
            section: 5,
            index: 0
        });
    });
    it('should append section (with subsection) when inserting higher-level section before it', function () {
        [
            section(2, 'IS')
        ].should.update({
            0: {
                id: 0,
                heading: 'S0',
                children: [1],
                contents: []
            },
            1: {
                id: 1,
                parent: 0,
                heading: 'S1',
                children: [2],
                contents: []
            },
            2: {
                id: 2,
                parent: 1,
                heading: 'S2',
                children: [3],
                contents: []
            },
            3: {
                id: 3,
                parent: 2,
                heading: 'S3',
                children: [4],
                contents: []
            },
            4: {
                id: 4,
                parent: 3,
                heading: 'S4',
                children: [],
                contents: []
            },
            nextId: 5,
            section: 2,
            index: 0
        }).to({
            0: {
                id: 0,
                heading: 'S0',
                children: [1, 5, 3],
                contents: []
            },
            1: {
                id: 1,
                parent: 0,
                heading: 'S1',
                children: [2],
                contents: []
            },
            2: {
                id: 2,
                parent: 1,
                heading: 'S2',
                children: [],
                contents: []
            },
            3: {
                id: 3,
                parent: 0,
                heading: 'S3',
                children: [4],
                contents: []
            },
            4: {
                id: 4,
                parent: 3,
                heading: 'S4',
                children: [],
                contents: []
            },
            5: {
                id: 5,
                parent: 0,
                heading: 'IS',
                children: [],
                contents: []
            },
            nextId: 6,
            section: 5,
            index: 0
        });
    });
    it('should collapse following sections on higher-level section insertion', function () {
       [
           section(2, 'IS')
       ].should.update({
           0: {
               id: 0,
               heading: 'S0',
               children: [1, 2],
               contents: []
           },
           1: {
               id: 1,
               parent: 0,
               heading: 'S1',
               children: [3, 4],
               contents: []
           },
           2: {
               id: 2,
               parent: 1,
               heading: 'S2',
               children: [],
               contents: []
           },
           3: {
               id: 3,
               parent: 1,
               heading: 'S3',
               children: [5],
               contents: []
           },
           4: {
               id: 4,
               parent: 1,
               heading: 'S4',
               children: [],
               contents: []
           },
           5: {
               id: 5,
               parent: 3,
               heading: 'S5',
               children: [],
               contents: []
           },
           nextId: 6,
           section: 3,
           index: 0
       }).to({
           0: {
               id: 0,
               heading: 'S0',
               children: [1, 2, 6, 5, 4],
               contents: []
           },
           1: {
               id: 1,
               parent: 0,
               heading: 'S1',
               children: [3],
               contents: []
           },
           2: {
               id: 2,
               parent: 0,
               heading: 'S2',
               children: [],
               contents: []
           },
           3: {
               id: 3,
               parent: 1,
               heading: 'S3',
               children: [],
               contents: []
           },
           4: {
               id: 4,
               parent: 0,
               heading: 'S4',
               children: [],
               contents: []
           },
           5: {
               id: 5,
               parent: 0,
               heading: 'S5',
               children: [],
               contents: []
           },
           6: {
               id: 6,
               parent: 0,
               heading: 'IS',
               children: [],
               contents: []
           },
           nextId: 7,
           section: 6,
           index: 0
       });
    });
    it('should collapse following sections with paragraphs on higher-level section insertion', function () {
        [
            section(2, 'IS')
        ].should.update({
            0: {
                id: 0,
                heading: 'S0',
                children: [1, 2],
                contents: []
            },
            1: {
                id: 1,
                parent: 0,
                heading: 'S0',
                children: [3, 4],
                contents: [{id: 6, text: 'P6'}]
            },
            2: {
                id: 2,
                parent: 0,
                heading: 'S2',
                children: [],
                contents: [{id: 7, text: 'P7'}]
            },
            3: {
                id: 3,
                parent: 1,
                heading: 'S3',
                children: [5],
                contents: [
                    {id: 8, text: 'P8'},
                    {id: 9, text: 'P9'}
                ]
            },
            4: {
                id: 4,
                parent: 1,
                heading: 'S4',
                children: [],
                contents: [{id: 10, text: 'P10'}]
            },
            5: {
                id: 5,
                parent: 3,
                heading: 'S5',
                children: [],
                contents: [{id: 11, text: 'P11'}]
            },
            nextId: 12,
            section: 3,
            index: 1
        }).to({
            0: {
                id: 0,
                heading: 'S0',
                children: [1, 2, 12, 5, 4],
                contents: []
            },
            1: {
                id: 1,
                parent: 0,
                heading: 'S1',
                children: [3],
                contents: [{id: 6, text: 'P6'}]
            },
            2: {
                id: 2,
                parent: 0,
                heading: 'S2',
                children: [],
                contents: [{id: 7, text: 'P7'}]
            },
            3: {
                id: 3,
                parent: 1,
                heading: 'S3',
                children: [],
                contents: [{id: 8, text: 'P8'}]
            },
            4: {
                id: 4,
                parent: 0,
                heading: 'S4',
                children: [],
                contents: [{id: 10, text: 'P10'}]
            },
            5: {
                id: 5,
                parent: 0,
                heading: 'S5',
                children: [],
                contents: [{id: 11, text: 'P11'}]
            },
            12: {
                id: 12,
                parent: 0,
                heading: 'IS',
                children: [],
                contents: [{id: 9, text: 'P9'}]
            },
            nextId: 13,
            section: 12,
            index: 0
        });
    });
    it('should collapse following sections with subsections and paragrpahs on higher-level section insertion', function () {
        [
            section(2, 'IS'),
            paragraph('IP')
        ].should.update({
            0: { id: 0, heading: 'S0', children: [1, 2], contents: [{id: 9, text: 'P9'}]},
            1: { id: 1, parent: 0, heading: 'S1', children: [3, 4], contents: [{id: 10, text: 'P10'}]},
            2: { id: 2, parent: 0, heading: 'S2', children: [5], contents: [{id: 17, text: 'P17'}]},
            3: { id: 3, parent: 1, heading: 'S3', children: [6], contents: [{id: 11, text: 'P11'}, {id: 12, text: 'P12'}]},
            4: { id: 4, parent: 1, heading: 'S4', children: [7], contents: [{id: 15, text: 'P15'}]},
            5: { id: 5, parent: 2, heading: 'S5', children: [], contents: [{id: 18, text: 'P18'}]},
            6: { id: 6, parent: 3, heading: 'S6', children: [8], contents: [{id: 13, text: 'P13'}]},
            7: { id: 7, parent: 3, heading: 'S7', children: [], contents: [{id: 16, text: 'P16'}]},
            8: { id: 8, parent: 6, heading: 'S8', children: [], contents: [{id: 14, text: 'P14'}]},
            nextId: 19,
            section: 3,
            index: 1
        }).to({
            0: { id: 0, heading: 'S0', children: [1, 19, 6, 4, 2], contents: [{id: 9, text: 'P9'}]},
            1: { id: 1, parent: 0, heading: 'S1', children: [3], contents: [{id: 10, text: 'P10'}]},
            2: { id: 2, parent: 0, heading: 'S2', children: [5], contents: [{id: 17, text: 'P17'}]},
            3: { id: 3, parent: 1, heading: 'S3', children: [], contents: [{id: 11, text: 'P11'}]},
            4: { id: 4, parent: 0, heading: 'S4', children: [7], contents: [{id: 15, text: 'P15'}]},
            5: { id: 5, parent: 2, heading: 'S5', children: [], contents: [{id: 18, text: 'P18'}]},
            6: { id: 6, parent: 0, heading: 'S6', children: [8], contents: [{id: 13, text: 'P13'}]},
            7: { id: 7, parent: 4, heading: 'S7', children: [], contents: [{id: 16, text: 'P16'}]},
            8: { id: 8, parent: 6, heading: 'S8', children: [], contents: [{id: 14, text: 'P14'}]},
            19: { id: 19, parent: 0, heading: 'IS', children: [], contents: [{id: 20, text: 'IP'}, {id: 12, text: 'P12'}]},
            nextId: 21,
            section: 19,
            index: 1
        });
    })
});