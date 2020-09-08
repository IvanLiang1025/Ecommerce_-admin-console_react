

import React from 'react';

import {
  Modal,
  Form,
  Input,
  Select,
} from 'antd';

import styles from '@/global.less';

const {Option} = Select;
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

  getStatusOptions = () => {
    const {statusList} = this.props;
    return statusList.map((item, index) => {
      return (
        <Option key={item} value={item}>
          {item}
        </Option>
      )
    })
  }

  render() {
    const { visible, handleAdd, form, onClose, data, statusList } = this.props;
    const { getFieldDecorator } = form;

    // let visible;

    console.log(data)
    return (
      <Modal
        destroyOnClose
        title='Update order status'
        visible={visible}
        onOk={this.handleSubmit}
        onCancel={onClose}
        className={styles.ivanFormItem}
        okButtonProps={{ className: styles.blueButton }}
        cancelButtonProps={{ className: styles.whiteButton }}
        width={600}
      >
        <Form>
          <FormItem label="Status">
            {
              getFieldDecorator('status', {
                initialValue: data.status,
                rules: [
                  { required: true, message: 'Please input the name of new category' }
                ]
              })(
                <Select>
                  {this.getStatusOptions()}
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

export default CategoryForm;