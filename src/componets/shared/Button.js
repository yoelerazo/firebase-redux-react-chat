import React from 'react';

class Button extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const {type, className, style, handleClick, children} = this.props;
    return (
      <button type={type} className={className} onClick={handleClick} style={style}>
        {children}
      </button>
    )
  }
}

export default Button;