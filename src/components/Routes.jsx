import React from 'react'

import { Route, Switch } from 'react-router-dom';

import Dashboard from '../pages/Dashboard';
import Customers from '../pages/Customer';
import Products from '../pages/Products';
import Categorys from '../pages/Category';
import FormCategory from './form/form_category/FormCategory';
import FormTypeRoom from './form/form_typeroom/FormTypeRoom';
import FormParentCategory from './form/form_parentcategory/FormParentCategory';

const Routes = () => {
  return (
    <Switch>
        <Route path='/' exact component={Dashboard}/>
        <Route path='/users' component={Customers}/>
        <Route path='/products' component={Products}/>
        <Route path='/categories' exact component={Categorys}/>
        <Route path='/categories/addCategory' component={FormCategory}/>
        <Route path='/categories/edit/:category' component={FormCategory}/>
        <Route path='/categories/addTypeRoom' component={FormTypeRoom}/>
        <Route path='/categories/TypeRoom/edit/:typeroom' component={FormTypeRoom}/>
        <Route path='/categories/addParentCategory' component={FormParentCategory}/>
        <Route path='/categories/ParentCategory/edit/:parentcategory' component={FormParentCategory}/>
    </Switch>
  )
}

export default Routes

