import React from 'react'

import { Route, Switch } from 'react-router-dom';

import Dashboard from '../pages/Dashboard';
import Customers from '../pages/Customer';
import Products from '../pages/Products';
import Categorys from '../pages/Category';
import Discount from '../pages/Discount';
import FormCategory from './form/form_category/FormCategory';
import FormTypeRoom from './form/form_typeroom/FormTypeRoom';
import FormParentCategory from './form/form_parentcategory/FormParentCategory';
import FormProduct from './form/form_product/FormProduct';
import FormDiscount from './form/form_discount/FormDiscount';

const Routes = () => {
  return (
    <Switch>
        <Route path='/' exact component={Dashboard}/>
        <Route path='/users' component={Customers}/>
        <Route path='/products' exact component={Products}/>
        <Route path='/products/edit/:product' component={FormProduct}/>
        <Route path='/products/addProduct' component={FormProduct}/>
        <Route path='/categories' exact component={Categorys}/>
        <Route path='/categories/addCategory' component={FormCategory}/>
        <Route path='/categories/edit/:category' component={FormCategory}/>
        <Route path='/categories/addTypeRoom' component={FormTypeRoom}/>
        <Route path='/categories/TypeRoom/edit/:typeroom' component={FormTypeRoom}/>
        <Route path='/categories/addParentCategory' component={FormParentCategory}/>
        <Route path='/categories/ParentCategory/edit/:parentcategory' component={FormParentCategory}/>
        <Route path='/discount' exact component={Discount}/>
        <Route path='/discount/add' component={FormDiscount}/>
        <Route path='/discount/edit/:discount' component={FormDiscount}/>
    </Switch>
  )
}

export default Routes

