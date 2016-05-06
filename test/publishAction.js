import { should } from 'chai'
import 'babel-polyfill'

import publish from '../src/actions/publish'
import Actions from '../src/actions/constants'

const PUBLISH = Actions.PUBLISH;
const PAR = 'paragraph';
const SEC = 'section';

should();

describe('Publish Action Creator', function () {
    it('should recognize paragraph', function() {
        const text = 'Paragraph text';
        publish(text).should.deep.equal({
            type: PUBLISH,
            payload: [{
                type: PAR,
                text: text
            }]
        });
    });
    it('should recognize multiple paragraphs', function () {
        const pars = ['Paragraph One', 'Paragraph 2', 'Paragraph 3'];
        publish(pars.join('\n\n')).should.deep.equal({
            type: PUBLISH,
            payload: pars.map(p => ({
                type: PAR,
                text: p
            }))
        });
    });
    it('should recognize paragraphs with line breaks', function () {
        const text = 'First line\nSecond line\nThird line';
        publish(text).should.deep.equal({
            type: PUBLISH,
            payload: [{
                type: PAR,
                text: text}]
        });
    });
    it('should not allow empty heading', function () {
        (() => publish('==')).should.throw();
        (() => publish('=<   ')).should.throw();
        (() => publish('====== ')).should.throw();
    });
    it('should recognize H-1', function () {
        publish('= Heading').should.deep.equal({
            type: PUBLISH,
            payload: [{
                type: SEC,
                heading: 'Heading',
                level: 1
            }]
        });
    });
    it('should recognize H0', function () {
        publish('== Text').should.deep.equal({
            type: PUBLISH,
            payload: [{
                type: SEC,
                heading: 'Text',
                level: 0
            }]
        });
    });
    it('should recognize H+', function () {
        publish('=== Something').should.deep.equal({
            type: PUBLISH,
            payload: [{
                type: SEC,
                heading: 'Something',
                level: -1
            }]
        });
    });
    it('should recognize H-', function () {
        publish('=< Nothing     ').should.deep.equal({
            type: PUBLISH,
            payload: [{
                type: SEC,
                heading: 'Nothing',
                level: 2
            }]
        });
        publish('=<<< Nothing').should.deep.equal({
            type: PUBLISH,
            payload: [{
                type: SEC,
                heading: 'Nothing',
                level: 4
            }]
        });
    });
    it('should recognize sections without empty line', function () {
        publish('==H1\n==H2').should.deep.equal({
            type: PUBLISH,
            payload: [
                { type: SEC, heading: 'H1', level: 0},
                { type: SEC, heading: 'H2', level: 0}
            ]
        });
    });
    it('should recognize paragraphs and sections without empty line', function () {
        publish('First paragraph\n==Section\nSecond paragraph').should.deep.equal({
            type: PUBLISH,
            payload: [
                { type: PAR, text: 'First paragraph'},
                { type: SEC, heading: 'Section', level: 0},
                { type: PAR, text: 'Second paragraph'}
            ]
        });
    });
    it('should not allow subsubsections without subsections', function () {
        (() => publish('==== Heading')).should.throw();
        (() => publish('=== Heading\n===== Heading')).should.throw();
        (() => publish('=<< Heading\n==Heading')).should.throw();
        (() => publish('=Heading\n===Heading')).should.throw();
    });
    it('should recognize complicated texts', function () {
        publish("P1\n=S1\nP2L1\nP2L2\n\nP3\n==S2\nP4\n===S3\nP5\n=<<S4\nP6\n=<S5").should.deep.equal({
            type: PUBLISH,
            payload: [
                {type: PAR, text: 'P1'},
                {type: SEC, heading: 'S1', level: 1},
                {type: PAR, text: 'P2L1\nP2L2'},
                {type: PAR, text: 'P3'},
                {type: SEC, heading: 'S2', level: 0},
                {type: PAR, text: 'P4'},
                {type: SEC, heading: 'S3', level: -1},
                {type: PAR, text: 'P5'},
                {type: SEC, heading: 'S4', level: 3},
                {type: PAR, text: 'P6'},
                {type: SEC, heading: 'S5', level: 2}
            ]
        })
    });
});