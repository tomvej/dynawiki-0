import React from 'react';
import { connect } from 'react-redux';

const mapStateToProps = (state, ownProps) => ({
    section: state.sections[ownProps.id]
});

const Section = ({section}) => 
    (<section id={section.id}>
        <h1>{section.heading}</h1>
    </section>)

export default connect(
    mapStateToProps,
    dispatch => ({})
)(Section)
