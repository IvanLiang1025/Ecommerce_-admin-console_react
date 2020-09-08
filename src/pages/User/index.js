

import React from "react";
import { Card, Button, Icon, Table, Modal, Input, message, Popconfirm } from "antd";


import { dateStringToTime } from '@/utils/dateUtils.js';
import UserForm from './UserForm';
// import CategoryForm from './CategoryForm';
import { fetchUserList, addUpdateUser, deleteUser } from '@/pages/api';
import { parseResList, parseResSubmit } from '../../services/requestApi';


class User extends React.Component {

  state = {
    userList: {
      list: [],
      pagination: { current: 1, pageSize: 6 },
    },
    userData: {},
    modalUserFormVisible: false,

  }


  fetchUsers = async () => {
    const { userList: { pagination } } = this.state;
    const postData = {
      limit: pagination.pageSize,
      page: pagination.current,
    }
    // console.log('request data', postData);
    const response = await fetchUserList(postData);
    const result = parseResList(response, pagination);
    if (result) {
      this.setState({
        userList: result
      })
    }
  }

  componentDidMount() {
    this.fetchUsers()
  }


  showAddModal = (flag, data) => {
    this.setState({
      modalUserFormVisible: !!flag,
      userData: data || {}
    })
  }


  handleCancel = () => {
    this.setState({ modalUserFormVisible: false })
  }

  handleDelete = async (record) => {
    const { _id } = record;
    const response = await deleteUser(_id);
    const result = parseResSubmit(response);
    if (result) {
      message.success("Delete successfully");
      this.fetchUsers();
    }
  }

  handleAdd = async (value, callback) => {
    const response = await addUpdateUser(value);
    const result = parseResSubmit(response);
    if (result) {
      message.success("submit successfully")
      if (callback) callback()
      this.fetchUsers()
      this.showAddModal()
    }
  }

  renderButtons = (data) => {
    return (
      <span>
        <Popconfirm
          onConfirm={() => this.handleDelete(data)}
          title='Are you sure you want to delete this user?'
          okText='Confirm'
        >
          <Icon type='delete'></Icon>
        </Popconfirm>
        <Icon type='edit' style={{ marginLeft: 5 }} onClick={() => this.showAddModal(true, data)}></Icon>
      </span>
    )
  }

  handlePageChange = (curPage) => {
    console.log(curPage);
    const { userList } = this.state;
    const copyUserList = JSON.parse(JSON.stringify(userList));
    copyUserList.pagination.current = curPage;

    this.setState({
      userList: copyUserList
    }, () => {
      this.fetchUsers();
    })
  }

  render() {

    const { userList, modalUserFormVisible, userData } = this.state;

    const columns = [
      {
        title: 'Name',
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: 'Email',
        dataIndex: 'email',
        key: 'email',
      },
      {
        title: 'Role',
        dataIndex: 'role',
        key: 'role',
        render: text => {
          return text === 1 ? 'Admin' : 'Normal'
        }
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
        // title: 'Actions',
        dataIndex: '_id',
        width: 80,
        render: (text, record) => {
          return this.renderButtons(record)
        }
      },
    ];

    const title = "Categories Table";
    const extra = (
      <Button onClick={() => this.showAddModal(true)} type="primary">
        <Icon type="plus"></Icon>
        Add
      </Button>
    )

    const { list, pagination } = userList;

    const paginationProp = {
      onChange: page => this.handlePageChange(page),
      showTotal: total => `Found ${total} users`,
      ...pagination
    }
    // console.log(userList);

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
        <UserForm
          modalVisible={modalUserFormVisible}
          onClose={this.handleCancel}
          data={userData}
          handleAdd={this.handleAdd}
        ></UserForm>
      </Card>
    )
  }
}

export default User;