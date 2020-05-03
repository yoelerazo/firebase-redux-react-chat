import React from 'react';
import { connect } from 'react-redux';
import  { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane, faPaperclip } from '@fortawesome/free-solid-svg-icons';

class Footer extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            message: '',
            fileName: '',
            fileData: '',
            idUploadedFile: null,
        };
    
        this.handleChangeMessageInput = this.handleChangeMessageInput.bind(this);
        this.sendMessage = this.sendMessage.bind(this);
        this.uploadFile = this.uploadFile.bind(this);

        this.messageFileInput = React.createRef();
    }

    handleChangeMessageInput(e) {
        this.setState({
            message: e.target.value
        });
    }

    async uploadFile() {
        await window.db.collection("files")
        .add({
            name: this.state.fileName,
            data: this.state.fileData
        })
        .then(function(docRef) {
            console.log("Document written with ID FILE: ", docRef);
            this.setState({idUploadedFile: docRef.id});
        })
        .catch(function(error) {
            console.error("Error adding document: ", error);
        });
    }

    sendMessage(e) {
        e.preventDefault();

        if(this.state.fileData) {
            this.uploadFile();
        }
    
        const new_message = {
            type: 1,
            status: 1,
            from: this.props.currentUser.id,
            content: this.state.message,
            createdAt: new Date().getTime(),
            fileId: this.state.idUploadedFile
        };
    
        window.db.collection("chats").doc(this.props.currentChatId).collection("messages").add(new_message)
        .then(function(docRef) {
            console.log("Document written with ID: ", docRef);
        })
        .catch(function(error) {
            console.error("Error adding document: ", error);
        });
    
        this.resetMessageForm();

    }

    processFile = (file) => {
        // we define fr as a new instance of FileReader
        const fr = new FileReader();
    
        fr.readAsDataURL(file);
        // Handle progress, success, and errors
        // fr.onprogress = updateProgress;
        fr.onerror = this.errorHandler;
        fr.onabort = () => this.changeStatus('Start Loading');
        fr.onloadstart =   () => this.changeStatus('Start Loading');
        fr.onload = this.loaded;
        // Here you can perform some operations on the data asynchronously
        fr.onprogress = this.setProgress;
    }

    setProgress = (e) => {
        // The target is the file reader
        //const fr = e.target;
        const loadingPercentage =  100 * e.loaded / e.total;
        if(loadingPercentage === 100){
            console.log("LOADED!");
        }
    }
    
    changeStatus = (status) => {
        console.log(status);
    }
    
    loaded = (e) => {
        this.changeStatus('Load ended!');
        const fr = e.target
        var result = fr.result.split('base64,')[1];
        this.setState({fileData: result});
        // Here we can send the result to a server for example
    }
    
    errorHandler = (e) => {
        this.changeStatus("Error: " + e.target.error.name)
    }

    handleChangeMessageFileInput = () => {
        let file = this.messageFileInput.current.files[0];
        this.setState({fileName: file.name});
        this.processFile(file);
    }

    resetMessageFileInput = () => {
        this.setState({fileName: '', fileData:''});
        this.messageFileInput.current.value = null;
    }

    resetMessageForm = () => {
        this.setState({fileName: '', fileData:'', message: '', idUploadedFile: null});
        this.messageFileInput.current.value = null;
    }

    componentDidUpdate(prevProps, prevState, snapshot) { 
        if(prevProps.currentChatId !== this.props.currentChatId) {
            this.resetMessageForm();
        }
    }

    render() {
        return (
            <div className="border-top p-3 position-absolute" style={{bottom: 0, width: "100%", padding: "1rem"}}>
                {this.state.fileName ?
                    <div className="alert alert-info alert-dismissible fade show" role="alert">
                        {this.state.fileName}
                        <button type="button" onClick={this.resetMessageFileInput} className="close" data-dismiss="alert" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                : ""
                }
                <form onSubmit={this.sendMessage} >
                    <div className="input-group">
                        <textarea onChange={this.handleChangeMessageInput} value={this.state.message} className="form-control" style={{backgroundColor: "rgba(0, 0, 0, 0.03)", borderColor: "rgba(0, 0, 0, 0.03)"}} ></textarea>
                        <div className="input-group-append pl-2">
                            <label >
                                <input onChange={this.handleChangeMessageFileInput} ref={this.messageFileInput} type='file' id='addFile' className="d-none" />
                                <FontAwesomeIcon icon={faPaperclip} className="text-black-50" size="lg" style={{cursor: "pointer"}} />
                            </label>
                        </div>
                        <div className="input-group-append rounded-right pl-2" style={{ marginLeft: "0"}}>
                            <button className="btn rounded-circle bg-primary" style={{ width: "48px", height:"48px"}}>
                                <FontAwesomeIcon icon={faPaperPlane} className="text-white" />
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    currentUser: state.session.get('currentUser'),
    currentChatId: state.chats.getIn(['currentChatId'])
})
  
export default connect(mapStateToProps, {} )(Footer)