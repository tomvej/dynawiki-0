import React from 'react';
import { connect } from 'react-redux';

const mapStateToProps = (state, ownProps) => ({
    section: state.sections[ownProps.id]
});

const Section = ({section}) =>
    (<section>
        <h1>{section.heading}</h1>
        {section.contents.map(({id, text}) => <p key={id}>{text}</p>)}
        {section.children.map(id => <SectionContainer key={id} id={id}/>)}
    </section>)

const SectionContainer = connect(
    mapStateToProps,
    dispatch => ({})
)(Section);

export default SectionContainer;
