import React from 'react'
import { connect } from 'react-redux'

const mapStateToProps = state => ({
    x: state.popup.x,
    y: state.popup.y
});

const Menu = ({x, y}) =>
    <div id="node-popup" style={{left: x, top: y}}>
        Technical Difficulty
    </div>;

export default connect(
    mapStateToProps,
    dispatch => ({})
)(Menu);