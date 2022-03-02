import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import Footer from './components/layouts/Footer';
import Header from './components/layouts/Header';
import './App.css';
import ProductDetails from './components/product/ProductDetails';

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Header />
        <div className='container container-fluid'>
          <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/search/:keyword' element={<Home/>} />
            <Route path='/product/:id' element={<ProductDetails />} />
          </Routes>
        </div>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
