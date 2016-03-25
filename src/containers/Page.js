import React from 'react';
import { connect } from 'react-redux';

const Page = ({ heading }) => (<h1>{heading}</h1>);

export default connect(
    state => ({ heading: state.heading }),
    dispatch => ({})
)(Page);