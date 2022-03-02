import React, { Fragment, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useAlert } from 'react-alert'
import Pagination from 'react-js-pagination'
import { useParams } from 'react-router-dom'
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import Loader from './layouts/Loader';
import MetaData from './layouts/MetaData'
import Product from './product/Product';
import { getProducts } from '../actions/productActions';

const Range = Slider.createSliderWithTooltip(Slider.Range)

const Home = () => {

  const [currentPage, setCurrentPage] = useState(1);
  const [price, setPrice] = useState([1, 1000000])
 
  const dispatch = useDispatch();
  const alert = useAlert();
  const { keyword } = useParams()

  const { loading, products, productCount, resPerPage, productFilterCount, error} = useSelector(state => state.products);

  useEffect(() => {
      
      if(error) {
          return alert.error(error);
        }
      
      dispatch(getProducts(keyword, currentPage, price));

  }, [alert, dispatch, error, currentPage, keyword, price]);

  const setCurrentPageNo = (pageNumber) => {
      setCurrentPage(pageNumber)
  }

  
  
  return (
    <Fragment>
        <MetaData title='Buy Best Products Online' />
        {loading ? <Loader /> : (
            <Fragment>
                <h1 id="products_heading">Latest Products</h1>
                <section id="products" className="container mt-5">
                    <div className="row">
                        {keyword ? (
                            <Fragment>
                                <div className='col-6 col-md-3 mt-5 mb-5'>
                                    <div className='px-5'>
                                        <Range
                                            marks={{
                                                1: `$1`,
                                                1000: `$1000`
                                            }}
                                            min={1}
                                            max={1000}
                                            defaultValue={[1, 1000]}
                                            tipFormatter={value => `$${value}`}
                                            tipProps={{
                                                placement: "top",
                                                visible: true
                                            }}
                                            value={price}
                                            onChange={price => setPrice(price)}
                                        />

                                        <hr className="my-5" />
                                    </div>
                                </div>
                                <div className='col-6 col-md-9 mt-5 mb-5'>
                                    <div className='row'>
                                        {products && products.map(product => {
                                            return (
                                                <Product key={product._id} product={product} col={4}/>
                                            )})
                                        }
                                    </div>
                                </div>
                                
                            
                            </Fragment>
                            
                        ) : (
                            products && products.map(product => {
                                return (
                                    <Product key={product._id} product={product} col={3}/>
                                )
                            })   
                        )}                       
                    </div>
                </section>
                {resPerPage <= productCount && (
                    <div className='Page navigation d-flex justify-content-center mt-5'>
                    <Pagination 
                        activePage={keyword ? 1 : currentPage}
                        itemsCountPerPage={resPerPage}
                        totalItemsCount={keyword ? productFilterCount : productCount}
                        onChange={setCurrentPageNo}
                        itemClass='page-item'
                        linkClass='page-link'
                    />
                </div>
                )}
                
            </Fragment>
            
        )}
        
    </Fragment>
  )
}

export default Home