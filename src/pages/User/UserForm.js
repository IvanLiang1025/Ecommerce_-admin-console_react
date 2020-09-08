

import React from 'react';

import {
  Modal,
  Form,
  Input,
  Select,
  
} from 'antd';

import styles from '@/global.less';
import {userRoleOptions} from '@/services/options';

const FormItem = Form.Item;

@Form.create()
class UserForm extends React.PureComponent {


  handleSubmit = () => {
    const { form, handleAdd, data } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const {_id: userId} = data;
      let postData;
      if(userId){
        postData = {...fieldsValue, userId};
      }else{
        postData = {...fieldsValue, password: '111111'};
      }
      console.log(postData);
     
      handleAdd(postData, () => {
        form.resetFields()
      } )
      // console.log(fieldsValue);
    })
  }

  render() {
    const { modalVisible, handleAdd, form, onClose, data } = this.props;
    const { getFieldDecorator } = form;

    // let visible;

    console.log(data)
    return (
      <Modal
        destroyOnClose
        title={data.name ? 'Update user' : 'Add a new user'}
        visible={modalVisible}
        onOk={this.handleSubmit}
        onCancel={onClose}
        className={styles.ivanFormItem}
        okButtonProps={{ className: styles.blueButton }}
        cancelButtonProps={{ className: styles.whiteButton }}
        width={600}
      >
        <Form>
          <FormItem label="Name">
            {
              getFieldDecorator('name', {
                initialValue: data.name,
                rules: [
                  { required: true, message: 'Please input the name' }
                ]
              })(
                <Input></Input>
              )
            }
          </FormItem>
          <FormItem label="Email">
            {
              getFieldDecorator('email', {
                initialValue: data.email,
                rules: [
                  { required: true, message: 'Please input the email' }
                ]
              })(
                <Input></Input>
              )
            }
          </FormItem>
          <FormItem label="Role">
            {
              getFieldDecorator('role', {
                initialValue: data.role,
                rules: [
                  { required: true, message: 'Please select the role of this user' }
                ]
              })(
                <Select>
                  {userRoleOptions()}
                </Select>
              )
            }
          </FormItem>
        </Form>
      </Modal>
    )
  }
}

// const CustomizedForm = Form.create({})(CategoryForm);

export default UserForm;