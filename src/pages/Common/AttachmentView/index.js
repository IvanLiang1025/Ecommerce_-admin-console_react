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

// let leaveComponent = false;
let leaveComponentTime = undefined;
// ivan 20200616
let fileCounter = 0;
let continueUpload = true;

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
    // console.log(nextProps, preState)
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
    const { dispatch, tag, fileupload: { fileList }, multiple } = this.props;
    const { single } = this.state;
    // ivan 20200505
    // console.log('file change');
    console.log(info)
    //  ivan 20200616
    fileCounter = 0;
    if (!continueUpload) {
      return false;
    }
    // const newFileList = info.fileList.map((item) => {return {...item, timeStamp: new Date().getTime()}});
    // console.log(newFileList);
    // console.log(info.fileList);

    // sunny 20200325 TS250
    // let fileList = [...info.fileList];

    // ivan 20200615 
    const myFileList = info.fileList.filter((item, index) => index < 10);
    let tagFileList = [...myFileList];


    // let tagFileList = [...info.fileList];

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

  // ivan 20200616
  allowUpload = (files) => {

    const { fileupload, multiple } = this.props;
    if (!multiple) return;
    const uploadedList = fileupload.fileList;
    continueUpload = true;
    fileCounter++;
    // console.log('file counter',fileCounter);
    // console.log('uploaded', uploadedList&&uploadedList.length)
    const uploadedCounter = (uploadedList && uploadedList.length) || 0;
    // console.log(uploadedCounter)
    const curTotal = uploadedCounter + fileCounter;
    // console.log(curTotal);
    if (files.length + uploadedCounter > 10) {
      continueUpload = false;
    }
    if (curTotal === 11) {
      message.error('You can upload up to 10 files');
      return false;
    }
    if (curTotal >= 11) {
      return false;
    }

    return true;
  }

  handleBeforeUpload = (file, fileList) => {
    // const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    // if (!isJpgOrPng) {
    //   message.error('You can only upload JPG/PNG file!');
    // }
    // ivan 20200616
    if (this.allowUpload(fileList) === false) {
      return false;
    }

    // console.log(fileList.length);
    // console.log('before upload')

    // ivan 2020 0303, is pdf ?
    // ivan 2020 0312, only pdf and word are acceptable
    const { pdfWordOnly } = this.props;
    if (pdfWordOnly) {

      // ivan 20200529 
      const fileName = file.name.toLowerCase();
      const isWord = fileName.endsWith('.docx') || fileName.endsWith('.doc');
      // sunny 20200406 TS268
      const isPdf = fileName.endsWith('.pdf');
      // ivan 20200316, only check if word file
      // const isWord = file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      // sunny 20200406 TS268
      // if (!isWord) {
      if (!isWord && (pdfWordOnly.startsWith('.docx') || pdfWordOnly.startsWith('.doc'))) {
        message.error('Only .doc and .docx file can be uploaded');
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

    // ivan20200704 ts442 10mb -> 25mb
    // ivan 20200704 ts442 10-> 30

    const isBeyond = file.size / 1024 / 1024 >= 30;
    if (isBeyond) {
      message.error('File must be smaller than 30MB!');
      return false;
    }
    return true;
  };

  handleFileUpload = ({ file, onSuccess, onProgress, onError }) => {
    const { dispatch, checkNoFile, fileupload: { fileList }, multiple } = this.props;

    // console.log('file upload')
    if (!file) {
      return false;
    }

    // ivan 20200616
    if (!continueUpload) {
      return false;
    }


    // ivan 20200505 add a timestamp for checking if needs to add the file 
    file.timeStamp = new Date().getTime();
    console.log(file)

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



          // ivan 20200505
          // console.log(this.props.fileupload.fileList);
          if (file.timeStamp < leaveComponentTime) {
            return;
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



  // ivan 20200505 clear upload data and get the time of leaving component
  componentWillUnmount() {
    const { dispatch } = this.props;

    leaveComponentTime = new Date().getTime();
    dispatch({
      type: 'fileupload/clearUploadResult'
    })
    dispatch({
      type: 'fileupload/clearFileList'
    })
  }

  // ivan 20200706
  handleRemove = (file) => {
    const { fileupload: { fileList }, dispatch } = this.props;
    if (fileList && Array.isArray(fileList) && fileList.length > 0) {
      const newList = fileList.filter((item, index) => {
        // console.log(item);
        return file.uid !== item.uid
      })
      dispatch({
        type: 'fileupload/saveFileList',
        payload: newList,
      });
    }
  }

  render() {
    const {
      fileupload: { uploadresult },

      dispatch,
      pickImg,
      text,
      style,
      // ivan 2020 0224
      // acceptType

      // ivan 2020 0303
      pdfWordOnly,

      // sunny 20200325 TS250
      tag,
      className,
      ifEdit,
      index,
      last,
      // sunny 20200421 TS310
      noFile,
      // ivan 20200505
      multiple,
      // ivan 20200602
      uploadIcon,
      // sunny 20200710 TS420
      contractStyle

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
            // ivan 2020 0224 
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
            multiple={multiple ? true : false}
            // ivan 20200706
            onRemove={this.handleRemove}
          >

            {/* sunny 20200709 TS420 
            add left and right style */}
            <div className={contractStyle && styles.uploadBlock}>
              {/* ivan 20200602 linkIcon */}
              <span className={contractStyle && styles.leftSide}>
                {
                  uploadIcon ? (
                    <span>Attach file: &nbsp;<Button style={{ border: 'none', color: '#005ca8', fontSize: 25, backgroundColor: 'inherit' }} icon="upload"></Button></span>
                  ) : (
                      <Button className={styles.greyUploadButton} icon="upload" disabled={isUploading}>
                        Upload
                      </Button>
                    )
                }
              </span>
              <span className={contractStyle && styles.rightSide}>
                {/* <Button className={styles.greyUploadButton} icon="upload" disabled={isUploading}>
                Upload
              </Button> */}
                {text || (
                  <span style={{ marginLeft: 5, color: '#737577' }}>(Max. file size 30MB)</span>
                )}
              </span>
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


{/* <td style="font-size:6px; line-height:10px; padding:0px 0px 0px 0px;" valign="top" align="center"><img class="max-width" src="https://images.unsplash.com/photo-1542044896530-05d85be9b11a?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&w=1000&q=80" border="0" style="display:block; color:#000000; text-decoration:none; font-family:Helvetica, arial, sans-serif; font-size:16px; max-width:100% !important; width:100%; height:30px" width="600" alt="" data-proportionally-constrained="true" data-responsive="true"></td> */ }