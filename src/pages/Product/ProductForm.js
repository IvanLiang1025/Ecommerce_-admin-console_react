

import React from 'react';

import {
  Modal,
  Form,
  Input,
  Upload,
  Button,
  Select,
  InputNumber,
  Row,
  Col,
  message,
} from 'antd';
import CountableTextArea from '@/Components/CountableTextArea';
import styles from './ProductForm.less';

import { MAX_SHORT, MAX_LONG_1, MAX_LONG_2 } from '@/services/textLengthConstant.js'

const FormItem = Form.Item;
const { Option } = Select;

/**
 * ivan 
 * This product form component is used to add new product or update existing product
 */

@Form.create()
class ProductForm extends React.PureComponent {

  state = {
    fileList: [],
  }



  handleFileChange = (info) => {
    console.log(info);
    let myList = [...info.fileList];
    myList = myList.slice(-1);
    if (myList && myList.length > 0) {
      myList[0].status = 'done';
      this.setState({
        fileList: myList
      })
    }

  }

  handleFileRemove = () => {
    this.setState({
      fileList: []
    })
  }

  getCategoryOption = () => {
    const { categoryList } = this.props;
    return (
      categoryList.map((category, index) => {
        return <option key={category._id} value={category._id}>{category.name}</option>
      })
    )
  }

  selectFilterOption = (inputValue, option) => {
    return option.children.toLowerCase().indexOf(inputValue.toLowerCase()) >= 0
  }


  handleSubmit = () => {
    const { form, handleAdd, data } = this.props;
    const {fileList} = this.state;
    form.validateFields((err, fieldsValue) => {
      if (err) return;

      if(!fileList || fileList && fileList.length ===0 ) {
        message.error("Please upload the photo of product");
        return;
      }
      console.log(form);
      const postData = {
        ...fieldsValue
      }

      postData.photo = fileList[0].originFileObj;

      const formData = new FormData();
      Object.keys(postData).forEach(item => {
        // console.log(item, postData[item]);
        formData.append(item, postData[item]);
      })

      if(data._id){
        formData.append('productId', data._id)
      }

      
      handleAdd(formData, () => {
        form.resetFields();
        this.setState({
          fileList: []
        })
      })
      // console.log(fieldsValue);
    })
  }

 handleChange = (name, event) => {
   console.log(event.target.files[0]);
    // const value = (name === "photo" ? event.target.files[0] : event.target.value);
    // formData.set(name, value);
    // setValues({...values, [name]: value});
  }

  render() {
    const { visible, handleAdd, form, onClose, data, categoryList } = this.props;
    const { getFieldDecorator } = form;
    const { fileList } = this.state;
    // let visible;
    console.log(data)
    console.log(categoryList);


    return (
      <Modal
        destroyOnClose
        title={data && data.name ? 'Update product' : 'Add new product'}
        visible={visible}
        // visible={true}
        onOk={this.handleSubmit}
        onCancel={onClose}
        className={styles.ivanFormItem}
        okButtonProps={{ className: styles.blueButton }}
        cancelButtonProps={{ className: styles.whiteButton }}
        width={600}
      >

        <Form>
        {/* <input onChange={(event => this.handleChange("photo", event))} id="photo-input" type="file" name="photo" accept="image/*" className="form-control" /> */}
          <FormItem label="* Photo">
            <Upload
              accept={'image/*'}
              fileList={fileList}
              onChange={this.handleFileChange}
              onRemove={this.handleFileRemove}
            >
              <Button className={styles.greyUploadButton} icon="upload">
                Upload
              </Button>
            </Upload>
          </FormItem>
          <FormItem label="Category">
            {
              getFieldDecorator('category', {
                initialValue: data.category && data.category._id,
                rules: [
                  { required: true, message: 'Please select the category' }
                ]
              })(
                <Select
                  filterOption={this.selectFilterOption}
                >
                  {this.getCategoryOption()}
                </Select>
              )
            }
          </FormItem>
          <FormItem label="Name">
            {
              getFieldDecorator('name', {
                initialValue: data.name,
                rules: [
                  { required: true, message: 'Please input the name of product' },
                  { max: MAX_SHORT, message: `the max length of name is ${MAX_SHORT} characters` }
                ]
              })(
                <Input></Input>
              )
            }
          </FormItem>
          <FormItem label="Description">
            {
              getFieldDecorator('description', {
                initialValue: data.description,
                rules: [
                  { required: true, message: 'Please input the description' },
                  // { max: MAX_SHORT, message: `the max length of name is ${MAX_SHORT} characters`}
                ]
              })(
                <CountableTextArea
                  rows={4}
                  maxLength={MAX_LONG_1}
                >
                </CountableTextArea>
              )
            }
          </FormItem>
          <Row gutter={24}>
            <Col span={12}>
              <FormItem label="Price">
                {
                  getFieldDecorator('price', {
                    initialValue: data.price,
                    rules: [
                      { required: true, message: 'Please input the price' }
                    ]
                  })(
                    <InputNumber
                      style={{width: '100%'}}
                      min={1}
                      max={1000000}
                    ></InputNumber>
                  )
                }
              </FormItem>
            </Col>

            <Col span={12}>
              <FormItem label="Quantity">
                {
                  getFieldDecorator('quantity', {
                    initialValue: data.quantity,
                    rules: [
                      { required: true, message: 'Please input the quantity' }
                    ]
                  })(
                    <InputNumber
                    style={{width: '100%'}}
                      min={1}
                      max={1000000}
                    ></InputNumber>
                  )
                }
              </FormItem>
            </Col>
          </Row>

        </Form>
      </Modal>
    )
  }
}

// const CustomizedForm = Form.create({})(CategoryForm);

export default ProductForm;