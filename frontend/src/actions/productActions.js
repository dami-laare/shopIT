import axios from "axios";

export const getProducts = (keyword = null, currentPage = 1, price) => async (dispatch) => {
    try {
        dispatch({
            type: "ALL_PRODUCTS_REQUEST"
        })
        const url = `http://127.0.0.1:4000/api/v1/products?${keyword ? `keyword=${keyword}&` : ''}page=${currentPage}&price[lte]=${price[1]}&price[gte]=${price[0]}`
        const { data } = await axios.get(url);


        dispatch({
            type: 'ALL_PRODUCTS_LOADED',
            payload: data
        })
        
    } catch (error) {
        dispatch({
            type: 'ALL_PRODUCTS_FAIL',
            payload: error.response.data.message
        })
    }
}

export const getProductDetails = (id) => async (dispatch) => {
    try {
        dispatch({
            type: "PRODUCT_DETAIL_REQUEST"
        })

        const { data } = await axios.get(`http://127.0.0.1:4000/api/v1/product/${id}`);


        dispatch({
            type: 'PRODUCT_DETAIL_LOADED',
            payload: data
        })
        
    } catch (error) {
        dispatch({
            type: 'PRODUCT_DETAIL_FAIL',
            payload: error.response.data.message
        })
    }
}

export const clearErrors = () => async (dispatch) => {
    dispatch({
        type: 'CLEAR_ERROR'
    })
}