import React from 'react';
import ChatList from '../chat/ChatList';
import UserList from './UserList';
import OpenCloseButton from './OpenCloseButton';
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
                <div className="position-relative pr-3" style={{flexBasis: "400px", flexGrow: "0"}}>
                    <div className="px-1">
                        <h4 className="text-secondary">{this.state.isToggleOn ? "Users" : "Chats"}</h4>
                    </div>
                    <FilterForm handleChangeInput={this.handleChangeFilterUserInput} filterText={this.state.filterText} />   
                    <UserList handleClickOpenCloseButton={this.handleClickOpenCloseButton} isToggleOn={this.state.isToggleOn} filterText={this.state.filterText} />
                    <ChatList isToggleOn={this.state.isToggleOn} filterText={this.state.filterText} />
                    <div className="position-absolute"  style={{width: "100%", bottom: "10px"}}>
                        <OpenCloseButton handleClick={this.handleClickOpenCloseButton} isToggleOn={this.state.isToggleOn} />
                    </div>
                </div>
            </>
        )
    }
}

export default ChatNavbar;