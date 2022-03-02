export const productReducer = ((state = {products: []}, action) => {
    switch(action.type){
        case 'ALL_PRODUCTS_REQUEST':
            return {
                loading: true,
                products: []
            }
            
        case 'ALL_PRODUCTS_LOADED':
            return {
                loading:false,
                products: action.payload.products,
                productCount: action.payload.productCount,
                resPerPage: action.payload.resPerPage,
                productFilterCount: action.payload.productFilterCount
            }

        case 'ALL_PRODUCTS_FAIL':
            return {
                loading: false,
                error: action.payload
            }

        case 'CLEAR_ERROR': 
            return {
                ...state,
                error:null
            }

        default:
            return state;
    }
}) 

export const productDetailsReducer = (state = {product: {}, loading:true}, action) => {
    switch (action.type) {
        case 'PRODUCT_DETAIL_REQUEST':
            return {
                loading: true,
                ...state
            }
        case 'PRODUCT_DETAIL_LOADED':
            return {
                loading: false,
                product: action.payload.product
            }
        case 'PRODUCT_DETAIL_FAIL':
            return {
                loading: false,
                error: action.payload
            }
        case 'CLEAR_ERROR':
            return {
                ...state,
                error: null
            }

        default:
            return state
    }
}