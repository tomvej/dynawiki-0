import React from 'react'


class OutsideClickWrapper extends React.Component {
    constructor() {
        super();
        this.insideClick = false;
        this.windowClick = this.windowClick.bind(this);
        this.mouseDown = this.mouseDown.bind(this);
        this.mouseUp = this.mouseUp.bind(this);
    }
    windowClick(event) {
        if (!this.insideClick) {
            this.props.onOutsideClick(event);
        }
    }
    componentDidMount() {
        window.addEventListener('mousedown', this.windowClick);
    }
    componentWillUnmount() {
        window.removeEventListener('mousedown', this.windowClick);
    }
    mouseDown() {
        this.insideClick = true;
    }
    mouseUp() {
        this.insideClick = false;
    }

    render() {
        return <div onMouseDown={this.mouseDown} onMouseUp={this.mouseUp}>
            {this.props.children}
        </div>
    }
}

OutsideClickWrapper.propTypes = {
    onOutsideClick: React.PropTypes.func
};

export default OutsideClickWrapper;