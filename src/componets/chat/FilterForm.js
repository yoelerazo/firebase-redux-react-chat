import React from 'react';
import  { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';

class FilterForm extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <form className="mb-2">
                <div className="input-group">
                    <input onChange={this.props.handleChangeInput} value={this.props.searchText} type="text" className="form-control form-control-lg" style={{backgroundColor: "rgba(0, 0, 0, 0.03)", borderColor: "rgba(0, 0, 0, 0.03)"}} placeholder="Search..." />
                    <div className="input-group-append rounded-right" style={{backgroundColor: "rgba(0, 0, 0, 0.03)", borderColor: "rgba(0, 0, 0, 0.03)", marginLeft: "0"}}>
                        <button className="btn">
                            <FontAwesomeIcon icon={faSearch} color="#a87de6" />
                        </button>
                    </div>
                </div>
            </form>
        );
    }
}

export default FilterForm;