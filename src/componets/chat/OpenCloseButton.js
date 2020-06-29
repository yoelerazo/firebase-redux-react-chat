import React from 'react';
import  { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

class OpenCloseButton extends React.Component {
    render() {
        return (
            <button type="button" onClick={this.props.handleClick} className={`btn btn-primary square-6 rounded-circle position-absolute ${this.props.isToggleOn ? "bg-secondary" : ""}`} style={{bottom: "10px", right: "15px"}} data-toggle="button" aria-pressed="false">
                <FontAwesomeIcon icon={faPlus} color="white" className={`icon-rotate ${this.props.isToggleOn ? "icon-rotate--left" : "icon-rotate--right"}`} />
            </button>
        )
    }
}

export default OpenCloseButton;