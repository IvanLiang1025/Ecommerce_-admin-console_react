

import React from "react";
import {
  List,
  Button,
  Table,
  message
} from 'antd';


import OrderRow from '@/pages/Common/TableRow/OrderRow';
import styles from './index.less';

import UpdateForm from './UpdateForm';

import { fetchOrderList, fechOrderStatusList, updateOrderStatus } from '@/pages/api';
import { parseResList, parseResSubmit, parseResDetail } from '../../services/requestApi';



class Orders extends React.Component {


  state = {
    // orderList: [],
    orderList: {
      list: [],
      pagination: { current: 1, pageSize: 5},
    },
    modalOrderVisible: false,
    orderData: {},
    statusList: [],
    loading: false,
  }

  setLoading = (flag) => {
    this.setState({
      loading: !!flag,
    })
  }

  fetchOrders = async () => {
    const { orderList: { pagination } } = this.state;
    const postData = {
      limit: pagination.pageSize,
      page: pagination.current,
    }
    // console.log('request data', postData);
    const response = await fetchOrderList(postData);
    const result = parseResList(response, pagination);
    if (result) {
      this.setState({
        orderList: result
      })
    }
  }

  fetchStatus = async () => {
    const response = await fechOrderStatusList();
    console.log(response);
    const result = parseResDetail(response);
    if (result) {
      this.setState({
        statusList: result
      })
    }
  }

  componentDidMount() {
    this.fetchOrders();
    this.fetchStatus()
  }



  columns = [
    {
      dataIndex: '_id',
      key: '_id',
      render: (text, record, index) =>
        <OrderRow
          data={record}
          // // handleDelete={this.handleDelete}
          handleUpdate={(data) => this.handleModalOrderVisible(true, data)}
        />,
    },
  ];

  handleModalOrderVisible = (flag, data) => {
    console.log(data);
    this.setState({
      modalOrderVisible: !!flag,
      orderData: data || {}
    })
  }


  /**
   * ivan 20200902 update order status
   * @param {*} value 
   * @param {*} callback 
   */
  handleAdd = async (value, callback) => {
    // const isAuthorized = isAuthenticated();
    const { orderData } = this.state;
    const { _id } = orderData;
    console.log(value);

    const response = await updateOrderStatus(_id, value.status);
    const result = parseResSubmit(response);
    if(result){
      message.success("update successfully")
      if (callback) callback()

      this.fetchOrders()
      this.handleModalOrderVisible()
    }
  }


  handlePageChange = (curPage) => {
    console.log(curPage);
    const { orderList } = this.state;
    const copyorderList = JSON.parse(JSON.stringify(orderList));
    copyorderList.pagination.current = curPage;

    this.setState({
      orderList: copyorderList
    }, () => {
      this.fetchOrders();
    })
  }

  render() {
    const { orderList, orderData, modalOrderVisible, statusList, loading } = this.state;
    const { list, pagination} = orderList;

    const paginationProp = {
      onChange: page => this.handlePageChange(page),
      showTotal: total => `Found ${total} orders`,
      ...pagination
    }

    return (
      <div className={styles.pageLayout}>
        <div className={styles.titleContainer}>
          <div className={styles.title}>
            Orders
          </div>
        </div>
        <Table
          rowKey={record => record._id}
          dataSource={list}
          pagination={paginationProp}
          columns={this.columns}
          bordered
          showHeader={false}
          loading={loading}
        >
        </Table>
        <UpdateForm
          visible={modalOrderVisible}
          onClose={() => this.handleModalOrderVisible()}
          data={orderData}
          statusList={statusList}
          handleAdd={this.handleAdd}
        >
        </UpdateForm>
        {/* {modalProductVisible && <ProductForm
          data={productData}
          categoryList={categoryList}
          visible={modalProductVisible}
          onClose={() => this.handleModalProductVisible()}
          handleAdd={this.handleAdd}
        ></ProductForm>} */}
      </div>
    )
  }
}

export default Orders;