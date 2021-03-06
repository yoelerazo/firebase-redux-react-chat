import React from "react";
import { connect } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane, faPaperclip } from "@fortawesome/free-solid-svg-icons";

class Footer extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      message: "",
      files: []
    };

    this.handleChangeMessageInput = this.handleChangeMessageInput.bind(this);
    this.sendMessage = this.sendMessage.bind(this);
    this.uploadFiles = this.uploadFiles.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);

    this.messageTextarea = React.createRef();
    this.messageFileInput = React.createRef();
  }

  async getTimezoneTimestamp() {
    const timezone = await fetch("http://worldtimeapi.org/api/timezone/Europe/Berlin").then((response) => response.json())
    return new Date(timezone.datetime).getTime();
  }

  handleChangeMessageInput(e) {
    this.setState({
      message: e.target.value,
    });
  }

  uploadFiles() {
    return Promise.all(this.state.files.map( (file) => 
        window.db
        .collection("files")
        .add(file)
        .then((docRef) => {
          console.log("Document written with ID FILE: ", docRef);
          return docRef.id;
        })
        .catch(function (error) {
          console.error("Error adding document: ", error);
          return null;
        })
      )
    )
  }

  async addMessage(filesId) {
    const new_message = {
      type: 1,
      status: 1,
      from: this.props.currentUser.id,
      content: this.state.message.replace(/\n/gi, "<br>"),
      createdAt: await this.getTimezoneTimestamp(),
      filesId: filesId.length === 0 ? null : filesId,
    };

    await window.db
      .collection("chats")
      .doc(this.props.currentChatId)
      .collection("messages")
      .add(new_message)
      .then(function (docRef) {
        console.log("Document written with ID: ", docRef);
      })
      .catch(function (error) {
        console.error("Error adding document: ", error);
      });

    this.resetMessageForm();
  }

  async sendMessage(e) {
    e.preventDefault();
    
    this.messageTextarea.current.setAttribute("disabled", true);

    try {
      const filesId = await this.uploadFiles().then(data => data);
      await this.addMessage(filesId);
    } catch (error) {
      console.log("error by sending msg", error);      
    }
    
    this.messageTextarea.current.removeAttribute("disabled");
    this.messageTextarea.current.focus();
  }

  handleKeyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      this.sendMessage(e);
    }
  }

  processFile = (files) => {

    for (var i = 0, file; file = files[i]; i++){
      // we define fr as a new instance of FileReader
      const fr = new FileReader();

      fr.fileName = file.name;
      fr.readAsDataURL(file);
      // Handle progress, success, and errors
      // fr.onprogress = updateProgress;
      fr.onerror = this.errorHandler;
      fr.onabort = () => this.changeStatus("Start Loading");
      fr.onloadstart = () => this.changeStatus("Start Loading");
      fr.onload = this.loaded;
      // Here you can perform some operations on the data asynchronously
      fr.onprogress = this.setProgress;
    };
  };

  setProgress = (e) => {
    // The target is the file reader
    //const fr = e.target;
    const loadingPercentage = (100 * e.loaded) / e.total;
    if (loadingPercentage === 100) {
      console.log("LOADED!");
    }
  };

  changeStatus = (status) => {
    console.log(status);
  };

  loaded = (e) => {
    this.changeStatus("Load ended!");
    const fr = e.target;
    this.setState((state, props) => ({
      files: state.files.concat({name: fr.fileName, data: fr.result})
    }));
  };

  errorHandler = (e) => {
    this.changeStatus("Error: " + e.target.error.name);
  };

  handleChangeMessageFileInput = () => {
    let files = this.messageFileInput.current.files;
    console.log(files)
    this.processFile(files);
  };

  deleteLocalFileInput = (e) => {
    const target = e.target;
    console.log(target)
    let files = this.messageFileInput.current.files;

    this.setState((state, props) => ({
      files: state.files.filter(file => file.name !== target.id)
    }));
  };

  resetMessageForm = () => {
    this.setState({ message: "", files: [] });
    this.messageFileInput.current.value = null;
  };

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (prevProps.currentChatId !== this.props.currentChatId) {
      this.resetMessageForm();
    }
  }

  render() {
    return (
      <div
        className="border-top p-3 position-absolute"
        style={{ bottom: 0, width: "100%", padding: "1rem" }}
      >
        {this.state.files.length !== 0 ? 
          <div>
            {this.state.files.map( (file) => 
              <div 
                key={file.name}
                className="alert alert-info alert-dismissible fade show"
                role="alert"
              >
                {file.name}
                <button
                  id={file.name}
                  type="button"
                  onClick={this.deleteLocalFileInput}
                  className="close"
                  data-dismiss="alert"
                  aria-label="Close"
                >
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
            )} 
          </div>
         :  ""
        }
        <form onSubmit={this.sendMessage}>
          <div className="input-group">
            <textarea
              onChange={this.handleChangeMessageInput}
              onKeyDown={this.handleKeyDown}
              value={this.state.message}
              ref={this.messageTextarea}
              className="form-control scroll"
              style={{
                backgroundColor: "rgba(0, 0, 0, 0.03)",
                borderColor: "rgba(0, 0, 0, 0.03)",
              }}
            ></textarea>
            <div className="input-group-append pl-2">
              <label>
                <input
                  onChange={this.handleChangeMessageFileInput}
                  ref={this.messageFileInput}
                  type="file"
                  id="addFile"
                  className="d-none"
                  multiple
                />
                <FontAwesomeIcon
                  icon={faPaperclip}
                  className="text-black-50"
                  size="lg"
                  style={{ cursor: "pointer" }}
                />
              </label>
            </div>
            <div
              className="input-group-append rounded-right pl-2"
              style={{ marginLeft: "0" }}
            >
              <button
                className="btn square-6 rounded-circle bg-primary"
              >
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
  currentUser: state.session.get("currentUser"),
  currentChatId: state.chats.getIn(["currentChatId"]),
});

export default connect(mapStateToProps, {})(Footer);
