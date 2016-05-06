/**
 * Asserts that object is instance of application model.
 */
export default function(chai, utils) {
    const expect = object => new chai.Assertion(object);
    const assertParagraph = (object, ids) => {
        expect(object.text).not.to.be.empty;
        expect(object.id).to.be.a('number');
        expect(ids).not.to.contain(object.id);
        ids.push(object.id);
    };
    const assertSection = (object, id, ids) => {
        expect(object.id).to.equal(id);
        expect(object.heading).not.to.be.empty;
        expect(object.children).to.be.an('array');
        expect(object.contents).to.be.an('array');

        const idsShould = expect(ids);
        object.children.forEach(child => {
            idsShould.contain(child);
        });

        const parIds = [];
        object.contents.forEach(child => assertParagraph(child, parIds));
    };
    const assertSections = object => {
        const ids = Object.getOwnPropertyNames(object);
        expect(object).to.have.ownProperty(0);
        ids.forEach(id => {
            assertSection(object[id], parseInt(id), ids);
        });
    };
    const assertLink = (object, sections) => {
        expect(object).to.contain.all.keys('section', 'index');
        expect(object.section).to.exist;
        expect(sections).to.have.ownProperty(object.section);
        if (object.index) {
            expect(object.index).to.be.a('number');
            const contents = sections[object.section].contents;
            expect(contents).to.be.an('array');
            expect(object.index).to.be.at.least(0).and.at.most(contents.length);
        }
    };
    const assertSelection = (object, sections) => {
        assertLink(object, sections);
        if (object.index) {
            expect(object.index).to.be.below(sections[object.section].contents.length);
        }
    };
    const assertModel = object => {
        expect(object).to.contain.all.keys('sections', 'editor', 'selection');
        assertSections(object.sections);
        if (object.editor) {
            assertLink(object.editor, object.sections);
            expect(object.selection).to.be.null;
        } else if (object.selection) {
            assertSelection(object.selection, object.sections);
            expect(object.editor).to.be.null;
        }
    };

    chai.Assertion.addProperty('model', function() {
        if (utils.flag(this, 'negate')) {
            expect(() => assertModel(this._obj)).to.throw(chai.AssertionError);
        } else {
            assertModel(this._obj);
        }
    });
};