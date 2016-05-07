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
});