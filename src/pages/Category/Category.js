

import React from "react";
import { Card, Button, Icon, Table, Modal, Input, message, Popconfirm } from "antd";

import CategoryForm from './CategoryForm';
import { fetchCategoryList, addUpdateCategory, deleteCategory } from '@/pages/api';
import { parseResList, parseResSubmit, parseResDetail } from '../../services/requestApi';
import { dateStringToTime } from '@/utils/dateUtils.js';

import styles from '@/global.less'


class Category extends React.Component {

  constructor(props) {
    super(props);
    this.addInputRef = React.createRef();
    this.state = {
      showModal: false,    // 0: hide 1: show add modal 2: show update category modal 
      // categoryList: [],
      categoryList: {
        list: [],
        pagination: { current: 1, pageSize: 6 },
      },
      categoryData: {}
    }
  }

  fetchCategory = async () => {
    const { categoryList: { pagination } } = this.state;
    const postData = {
      limit: pagination.pageSize,
      page: pagination.current,
    }
    // console.log('request data', postData);
    const response = await fetchCategoryList(postData);
    const result = parseResList(response, pagination);
    if (result) {
      this.setState({
        categoryList: result
      })
    }
  }

  componentDidMount() {
    this.fetchCategory()
  }


  showAddModal = (flag, data) => {
    this.setState({
      showModal: !!flag,
      categoryData: data || {}
    })
  }


  handleCancel = () => {
    this.setState({ showModal: 0 })
  }

  handleDelete = async (record) => {
    const {_id} = record;
    const response = await deleteCategory(_id);
    const result = parseResSubmit(response);
    if(result) {
      message.success("Delete successfully");
      this.setState({
        showModal: false,
      })
      this.fetchCategory();
    }
  }

  handleAdd = async (value, callback) => {
    const { categoryData: { _id } } = this.state;
    let response;
    if (_id) {
      const postData = {
        ...value,
        categoryId: _id
      }
      response = await addUpdateCategory(postData)
    } else {
      response = await addUpdateCategory(value);
    }

    const result = parseResSubmit(response);
    if (result) {
      message.success("submit successfully")
      if (callback) callback()
      this.fetchCategory()
      this.showAddModal()
    }
  }

  handlePageChange = (curPage) => {
    console.log(curPage);
    const { categoryList } = this.state;
    const copyCategoryList = JSON.parse(JSON.stringify(categoryList));
    copyCategoryList.pagination.current = curPage;

    this.setState({
      categoryList: copyCategoryList
    }, () => {
      this.fetchCategory();
    })
  }

  renderButtons = (data) => {
    return (
      <span>
        <Popconfirm
          onConfirm={() => this.handleDelete(data)}
          title='Are you sure you want to delete this category?'
          okText='Confirm'
        >
          <Icon type='delete'></Icon>
        </Popconfirm>
        <Icon type='edit' style={{ marginLeft: 5 }} onClick={() => this.showAddModal(true, data)}></Icon>
      </span>
    )
  }

  render() {

    const { categoryList, showModal, categoryData } = this.state;

    const columns = [
      {
        title: 'Name',
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: 'Created at',
        dataIndex: 'createdAt',
        key: 'createdAt',
        render: text => {
          return dateStringToTime(text)
        }
      },
      {
        title: 'Actions',
        dataIndex: '_id',
        width: 100,
        render: (text, record) => {
          return this.renderButtons(record)
        }
      },

    ];

    const title = "Categories Table";
    const extra = (
      <Button onClick={() => this.showAddModal(true)} className={styles.blueButton}>
        <Icon type="plus"></Icon>
        Add
      </Button>
    )

    const { list, pagination } = categoryList;
    const paginationProp = {
      onChange: page => this.handlePageChange(page),
      showTotal: total => `Found ${total} orders`,
      ...pagination
    }


    return (
      <Card title={title} extra={extra} >
        <Table
          dataSource={list}
          columns={columns}
          bordered
          pagination={paginationProp}
          rowKey={(record) => (record._id)}
        >
        </Table>
        <CategoryForm
          modalVisible={showModal}
          onClose={this.handleCancel}
          data={categoryData}
          handleAdd={this.handleAdd}
        ></CategoryForm>

      </Card>
    )
  }
}

export default Category;