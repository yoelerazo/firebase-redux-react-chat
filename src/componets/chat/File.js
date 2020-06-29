import React from 'react';
import { connect } from 'react-redux';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileAlt } from "@fortawesome/free-regular-svg-icons";

class File extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            fileData: '#',
            fileDataBase64: '',
            fileName: '',
            loadingFile: true
        };
    }

    convertBase64ToFile = (file) => {
        const byteString = atob(file.split(',')[1]);
        let mimeString = file.split(',')[0].split(':')[1].split(';')[0];

        const ab = new ArrayBuffer(byteString.length);
        const ia = new Uint8Array(ab);

        for (let i = 0; i < byteString.length; i += 1) {
          ia[i] = byteString.charCodeAt(i);
        }
        const newBlob = new Blob([ab], {type: mimeString});

        return newBlob;
      };

    getFile = () => {
        const fileId = this.props.fileId;
        this.setState({loadingFile: true});

        window.db.collection("files").doc(fileId)
        .get().then((doc) => {
            let blob = this.convertBase64ToFile(doc.data().data);

            this.setState({
                fileData: URL.createObjectURL(blob),
                fileDataBase64: doc.data().data.split(';')[1],
                fileName: doc.data().name,
                loadingFile: false
            })
        }).catch(function(error) {
            console.log("Error getting document:", error);
        });
    }

    componentDidMount() {
        this.getFile();
    }
    
    render() {
        return (
            <div>
                {this.state.loadingFile 
                ? <span>Loading...</span>
                : <div>
                    <a download={this.state.fileName} href={this.state.fileData}>
                        <FontAwesomeIcon icon={faFileAlt} className="text-secondary mr-2" size="lg"/>
                        {this.state.fileName}
                    </a>
                </div>
                
                
                }
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    currentUser: state.session.get('currentUser'),
    currentChatId: state.chats.getIn(['currentChatId'])
})
  
export default connect(mapStateToProps, {} )(File)
