import React from 'react';
import  { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

class OpenCloseButton extends React.Component {
    render() {
        return (
            <button type="button" onClick={this.props.handleClick} className={`btn btn-primary rounded-circle position-absolute ${this.props.isToggleOn ? "bg-secondary" : ""}`} style={{width: "48px", height:"48px", bottom: "10px", right: "15px"}} data-toggle="button" aria-pressed="false">
                <FontAwesomeIcon icon={faPlus} color="white" className={`icon-rotate ${this.props.isToggleOn ? "icon-rotate--left" : "icon-rotate--right"}`} />
            </button>
        )
    }
}

export default OpenCloseButton;