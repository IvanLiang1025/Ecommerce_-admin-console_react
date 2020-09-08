

import React from 'react';

import {
  Modal,
  Form,
  Input,
} from 'antd';

import styles from '@/global.less'

const FormItem = Form.Item;

@Form.create()
class CategoryForm extends React.PureComponent {


  handleSubmit = () => {
    const { form, handleAdd } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      handleAdd(fieldsValue, () => {
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
        title={data && data.name ? 'Update category' : 'Add new category'}
        visible={modalVisible}
        onOk={this.handleSubmit}
        onCancel={onClose}
        className={styles.ivanFormItem}
        okButtonProps={{ className: styles.blueButton }}
        cancelButtonProps={{ className: styles.whiteButton }}
        width={600}
      >
        <Form>
          <FormItem label="Category name">
            {
              getFieldDecorator('name', {
                initialValue: data.name,
                rules: [
                  { required: true, message: 'Please input the name of new category' }
                ]
              })(
                <Input></Input>
              )
            }
          </FormItem>
        </Form>
      </Modal>
    )
  }
}

// const CustomizedForm = Form.create({})(CategoryForm);

export default CategoryForm;