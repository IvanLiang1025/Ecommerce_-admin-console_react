

import React from "react";
import {
  List,
  Button,
  Table,
  message
} from 'antd';


import TableRow from '@/pages/Common/TableRow';
import styles from './index.less';
import ProductForm from './ProductForm';
import { isAuthenticated } from '@/services/authorize';

import { fetchProductList, addUpdateProduct, fetchCategoryList, deleteProduct } from '@/pages/api';
import { parseResList, parseResSubmit, parseResDetail } from '../../services/requestApi';

// const TABLELIMIT = 5;

class Product extends React.Component {


  state = {
    // productList: [],
    productList: {
      list: [],
      pagination: { current: 1, pageSize: 6 },
    },
    modalProductVisible: false,
    productData: {},
    categoryList: [],
    pagination: {page: 1, pageSize: 6}
  }

  fetchCategory = async () => {
    const { categoryList: { pagination } } = this.state;
    // const postData = {
    //   limit: pagination.pageSize,
    //   page: pagination.current,
    // }
    // console.log('request data', postData);
    const response = await fetchCategoryList();
    const result = parseResList(response, pagination);
    if (result) {
      this.setState({
        categoryList: result.list
      })
    }
  }

  componentDidMount() {
    this.fetchProducts();
    this.fetchCategory()
  }

  fetchProducts = async () => {
    const { productList: { pagination } } = this.state;
    const postData = {
      limit: pagination.pageSize,
      page: pagination.current,
    }
    // console.log('request data', postData);
    const response = await fetchProductList(postData);
    const result = parseResList(response, pagination);
    if (result) {
      this.setState({
        productList: result
      })
    }
  }

  columns = [
    {
      dataIndex: '_id',
      key: '_id',
      render: (text, record, index) =>
        <TableRow
          data={record}
          handleDelete={this.handleDelete}
          handleUpdate={(data) => this.handleModalProductVisible(true, data)}
        />,
    },
  ];

  handleModalProductVisible = (flag, data) => {
    this.setState({
      modalProductVisible: !!flag,
      productData: data || {}
    })
  }

  handleDelete = async (record) => {
    const response = await deleteProduct(record._id);
    const result = parseResSubmit(response);
    if(result){
      message.success("Delete successfully");
      this.fetchProducts();
    }
  }

  handleAdd = async (value, callback) => {
    
    let response = await addUpdateProduct(value)
    
    // console.log(response);
    const result = parseResSubmit(response);
    if(result){
      message.success("update successfully")
      if (callback) callback()
      this.fetchProducts()
      this.handleModalProductVisible()
    }
  }

  handlePageChange = (curPage) => {
    console.log(curPage);
    const { productList } = this.state;
    const copyProductList = JSON.parse(JSON.stringify(productList));
    copyProductList.pagination.current = curPage;

    this.setState({
      productList: copyProductList
    }, () => {
      this.fetchProducts();
    })
  }


  render() {
    const { productList, productData, modalProductVisible, categoryList } = this.state;
    // console.log(productList);

    const { list, pagination } = productList;
    const paginationProp = {
      onChange: page => this.handlePageChange(page),
      showTotal: total => `Found ${total} products`,
      ...pagination
    }
   
    return (
      <div className={styles.pageLayout}>
        <div className={styles.titleContainer}>
          <div className={styles.title}>
            Product
          </div>
          <div>
            <Button className={styles.blueButton} onClick={() => this.handleModalProductVisible(true)}>Add</Button>
          </div>
        </div>
        <Table
          rowKey={record => record._id}
          dataSource={list}
          pagination={paginationProp}
          columns={this.columns}
          bordered
          showHeader={false}
        >
        </Table>
        {modalProductVisible && <ProductForm
          data={productData}
          categoryList={categoryList}
          visible={modalProductVisible}
          onClose={() => this.handleModalProductVisible()}
          handleAdd={this.handleAdd}
        ></ProductForm>}
      </div>
    )
  }
}

export default Product;