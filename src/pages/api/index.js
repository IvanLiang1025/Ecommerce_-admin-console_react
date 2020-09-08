import { apiGet, apiDelete, apiPost, apiDelete2, parseResDetail, parseResList } from '@/services/requestApi';



/**
 * 
 * @param {*} data: {email: "", password: ""}
 */
export const signIn = (data) => apiPost(`/admin/signin`, data);
export const signOut = (data) => apiPost(`/admin/signout`, data);


//user-related api function
/**
 * fetch user list with pagination info
 * @param  data: {page: 1, pageSize: 10}
 */
export const fetchUserList = (data) => apiGet(`/admin/users`, data);

/**
 * add a user or update a user's info
 * @param  data: user data  
 */
export const addUpdateUser = (data) => apiPost('/admin/user', data);

/**
 * delete a user
 * @param userId 
 */
export const deleteUser = (userId) => apiDelete('/admin/user', { userId })

/**
 * ivan 20200506
 * order-related api functions
 */

/**
* fetch order list with pagination info
* @param  data: {page: 1, pageSize: 10}
*/
export const fetchOrderList = (data) => apiGet(`/admin/orders`, data);

export const fechOrderStatusList = () => apiGet('/admin/order/statuslist');

export const updateOrderStatus = (orderId, status) => apiPost('/admin/order/status', { orderId, status });


/**
 * ivan 20200507
 * category-related api functions
 */

/**
* fetch category list with pagination info
* @param  data: {page: 1, pageSize: 10}
*/
export const fetchCategoryList = (data) => apiGet('/admin/categories', data);

export const addUpdateCategory = (data) => apiPost('/admin/category', data);

export const deleteCategory = (categoryId) => apiDelete('/admin/category', { categoryId });


/**
 * ivan product-related api functions
 */

/**
* fetch product list with pagination info
* @param  data: {page: 1, pageSize: 10}
*/
export const fetchProductList = (data) => apiGet('/admin/products', data);

/**
 * 
 * @param {*} data: FormData: {
 *  photo: file data,
 *  category: string,
 *  name: string,
 *  description: string,
 *  price: number,
 *  quantity: number,
 * }
 */
export const addUpdateProduct = (data) => apiPost('/admin/product', data);

export const deleteProduct = (productId) => apiDelete('/admin/product', {productId});


// statistics-related
export const getOrderStatistics = () => apiGet('/admin/statistics/orders');