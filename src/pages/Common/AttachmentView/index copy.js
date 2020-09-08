import React, { PureComponent, Fragment } from 'react';
import { Upload, Button, message, Icon } from 'antd';
import { connect } from 'dva';
import styles from './index.less';
import globalData from '@/globalData';
// ivan 20200428
import FileViewer from "@/pages/Common/FileViewer";

function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}

@connect(({ fileupload }) => ({
  fileupload,
}))
class AttachementView extends PureComponent {
  state = {
    single: undefined,
    // ivan 20200428 
    modalFileViewVisible: false,
    previewFile: null,
  };

  static getDerivedStateFromProps(nextProps, preState) {
    // Should be a controlled component.
    console.log(nextProps, preState)
    if (nextProps.single) {
      const { single } = preState;
      if (!single) {
        return {
          ...preState,
          single: nextProps.single,
        };
      }
    }
    return null;
  }

  handleFileChange = info => {
    const { dispatch, tag, fileupload: { fileList } } = this.props;
    const { single } = this.state;
    // console.log(info);

    // sunny 20200325 TS250
    // let fileList = [...info.fileList];
    let tagFileList = [...info.fileList];

    if (single) {
      tagFileList = tagFileList.slice(-1);
    }

    tagFileList = tagFileList
      .filter(item => item.status && item.status !== 'error')
      .map(file => {
        if (file.response) {
          file.url = file.response.url;
        }
        return file;
      });

    // sunny 20200325 TS250
    // dispatch({
    //   type: 'fileupload/saveFileList',
    //   payload: tagFileList,
    // });

    if (tag) {
      const allFileList = JSON.parse(JSON.stringify(fileList || {}));
      allFileList[tag] = tagFileList;
      dispatch({
        type: 'fileupload/saveFileList',
        payload: allFileList,
      });

    } else {
      dispatch({
        type: 'fileupload/saveFileList',
        payload: tagFileList,
      });
    }


  };

  handleBeforeUpload = (file, fileList) => {
    // const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    // if (!isJpgOrPng) {
    //   message.error('You can only upload JPG/PNG file!');
    // }

    // ivan 2020 0303, is pdf ?
    // ivan 2020 0312, only pdf and word are acceptable
    const { pdfWordOnly } = this.props;
    if (pdfWordOnly) {
      // console.log(file);
      // ivan 20200403 ts260
      // console.log(file.name.endsWith('.docx'));
      const isWord = file.name.endsWith('.docx');
      // sunny 20200406 TS268
      const isPdf = file.name.endsWith('.pdf');
      // ivan 20200316, only check if word file
      // const isWord = file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      // sunny 20200406 TS268
      // if (!isWord) {
      if (!isWord && pdfWordOnly === '.docx') {
        message.error('Only .docx file can be uploaded');
        return false;
      }
      // sunny 20200406 TS268
      if (!isPdf && pdfWordOnly === '.pdf') {
        message.error('Only .pdf file can be uploaded');
        return false;
      }

      // const isPdf = file.type === 'application/pdf';
      // const isWord = file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      // if (!isPdf && !isWord) {
      //   message.error('Only .pdf and .docx file can be uploaded');
      //   return false;
      // }
    }


    const isBeyond = file.size / 1024 / 1024 >= 10;
    if (isBeyond) {
      message.error('File must be smaller than 10MB!');
      return false;
    }
    return true;
  };

  handleFileUpload = ({ file, onSuccess, onProgress, onError }) => {
    const { dispatch, checkNoFile } = this.props;

    // console.log('param',param)
    if (!file) {
      return false;
    }

    const formData = new FormData();
    formData.append('uploadFile', file);
    formData.append('type', 2);
    dispatch({
      type: 'fileupload/upload',
      payload: formData,
      callback: response => {
        if (response && response.status === 'done') {
          // ivan 2020 0228 check if no file upload 
          // since for contribution, we only upload one file, we can check it based on the status of file uploading
          if (checkNoFile) {
            checkNoFile(false)
          }

          message.success('Uploaded successfully.');
          onSuccess(response, file);
        } else {
          // ivan 2020 0228 check if no file upload
          if (checkNoFile) {
            checkNoFile(true)
          }
          message.error('Upload failed.');
          onError();
        }
      },
    });
    return true;
  };

  // ivan 20200428
  handlePrivew = (file) => {
    console.log(file)
    // window.open(`https://view.officeapps.live.com/op/view.aspx?src=${file.response.url}`);
    // return;
    this.setState({
      previewFile: file,
      modalFileViewVisible: true
    })
  }

  handlePriviewClose = () => {
    this.setState({
      previewFile: null,
      modalFileViewVisible: false,
    })
  }

  // handleStart = (file) => {
  //   console.log(file)
  // }


  // ivan 20200504
  // componentWillUnmount() {
  //   const {dispatch, fileList} = this.props;
  //   // const {fileList} 
  //   console.log(fileList)
  //   console.log('===============================')
  //   console.log(this.uploadNode)
  //   this.uploadNode.handleRemove()
   
  //   // dispatch({
  //   //   type: 'fileupload/clearUploadResult'
  //   // })
  //   // dispatch({
  //   //   type: 'fileupload/clearFileList'
  //   // })
  // }

  render() {
    const {
      fileupload: { uploadresult },

      dispatch,
      pickImg,
      text,
      style,
      //ivan 2020 0224
      // acceptType

      //ivan 2020 0303
      pdfWordOnly,

      //sunny 20200325 TS250
      tag,
      className,
      ifEdit,
      index,
      last,
      // sunny 20200421 TS310
      noFile,
    } = this.props;

    const { curFileList } = this.props;

    let { fileupload: { fileList } } = this.props;

    const isUploading = uploadresult.status === 'uploading';
    // sunny 20200325 TS250
    // let defFileList = fileList || [];
    fileList = ((fileList && Object.prototype.toString.call(fileList) === '[object Object]' && !tag) ? [] : fileList) || (tag ? {} : []);
    let defFileList = tag ? fileList[tag] : fileList;
    // console.log(defFileList, index, last)
    // if (tag === 'witness'&& index) {
    //   defFileList = defFileList? [defFileList[index]]: [];
    // } else if (defFileList && defFileList.length === last) {
    //   console.log('===========')
    //   defFileList = [defFileList[last - 1]];
    // } else if (!index) {
    //   defFileList = [];
    // }
    // console.log(defFileList, index)

    if (!tag && curFileList && curFileList.length > 0 && fileList.length === 0) {
      defFileList = curFileList.map((attach, index) => {
        return {
          uid: attach.fileId,
          name: attach.name || `Attach${index + 1}`,
          status: 'done',
          url: attach.url,
          response: {
            url: attach.url,
            fileId: attach.fileId,
          },
        };
      });
      dispatch({
        type: 'fileupload/saveFileList',
        payload: defFileList,
      });
      // sunny 20200331 handle curfilelist with tag
    }
    if (tag && curFileList && curFileList.length > 0 && (!fileList[tag] || fileList[tag].length === 0)) {
      defFileList = curFileList.map((attach, index) => {
        return {
          uid: attach.fileId || attach.uid,
          name: attach.name || `Attach${index + 1}`,
          status: 'done',
          url: attach.url,
          response: {
            url: attach.url,
            fileId: attach.fileId || attach.uid,
          },
        };
      });

      // if (tag !== 'verify2' && tag !== 'agreement2' && tag !== 'witness2' && tag !== 'courier2') {
      // sunny 20200420 
      fileList[tag] = defFileList;
      dispatch({
        type: 'fileupload/saveFileList',
        payload: JSON.parse(JSON.stringify(fileList)),
      });


      // }
    }


    return (
      <Fragment>
        <div style={style}>
          <Upload
            // accept={pickImg ? 'image/*' : undefined}
            //ivan 2020 0224 
            accept={pickImg ? 'image/*' : pdfWordOnly ? (pdfWordOnly) : undefined}
            listType={pickImg ? 'picture' : 'text'}
            defaultFileList={defFileList}
            fileList={defFileList}
            onChange={this.handleFileChange}
            beforeUpload={this.handleBeforeUpload}
            customRequest={this.handleFileUpload}
            action={`${globalData.serverUrl}/api/upload`}
            // ivan 20200428 
            // onPreview={this.handlePrivew}
            // ivan 20200504
            // onStart={this.handleStart}
            ref={node => this.uploadNode = node}
          >
            <div>
              <Button className={styles.greyUploadButton} icon="upload" disabled={isUploading}>
                Upload
            </Button>
              {text || (
                <span style={{ marginLeft: 5, color: '#737577' }}>(Max. file size 10MB)</span>
              )}
            </div>
          </Upload>
        </div>
        {/* ivan 20200428 */}
        
        {/* <FileViewer
          visible={this.state.modalFileViewVisible}
          file={this.state.previewFile}
          onClose={this.handlePriviewClose}
        ></FileViewer> */}
      </Fragment>
    );
  }
}

export default AttachementView;
