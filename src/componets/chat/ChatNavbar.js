import React from 'react';
import  { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import ChatList from '../chat/ChatList';
import UserList from './UserList';
import Button from '../shared/Button';
import FilterForm from './FilterForm';

class ChatNavbar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            filterText: '',
            isToggleOn: false
        }

        this.handleClickOpenCloseButton = this.handleClickOpenCloseButton.bind(this);
        this.handleChangeFilterUserInput = this.handleChangeFilterUserInput.bind(this);
    }

    handleChangeFilterUserInput(e) {
        let target = e.target

        this.setState({
            filterText: target.value
        })
    }

    handleClickOpenCloseButton() {
        this.setState(state => ({
            isToggleOn: !state.isToggleOn
        }));
    }

    render() {
        return (
            <>
                <div className="col position-relative pr-3 flexbasis-400--lg flex-lg-grow-0">
                    <div className="px-1">
                        <h4 className="text-secondary">{this.state.isToggleOn ? "Users" : "Chats"}</h4>
                    </div>
                    <FilterForm handleChangeInput={this.handleChangeFilterUserInput} filterText={this.state.filterText} />   
                    <UserList handleClickOpenCloseButton={this.handleClickOpenCloseButton} isToggleOn={this.state.isToggleOn} filterText={this.state.filterText} />
                    <ChatList isToggleOn={this.state.isToggleOn} filterText={this.state.filterText} />
                    <div className="position-absolute"  style={{width: "100%", bottom: "10px"}}>
                        <Button handleClick={this.handleClickOpenCloseButton} className={`btn btn-primary square-6 rounded-circle position-absolute ${this.props.isToggleOn ? "bg-secondary" : ""}`} style={{bottom: "10px", right: "15px"}}>
                          <FontAwesomeIcon icon={faPlus} color="white" className={`icon-rotate ${this.props.isToggleOn ? "icon-rotate--left" : "icon-rotate--right"}`} />
                        </Button>
                    </div>
                </div>
            </>
        )
    }
}

export default ChatNavbar;