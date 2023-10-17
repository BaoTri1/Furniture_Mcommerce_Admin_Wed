import React from 'react';
import ReactDOM from 'react-dom';
import reportWebVitals from './reportWebVitals';

import { applyMiddleware, createStore } from 'redux';
import { Provider } from 'react-redux';
import rootReducer from './redux/reducers';
import thunk from 'redux-thunk'

import './assets/boxicons-2.0.7/css/boxicons.min.css';
import './assets/css/theme.css';
import './assets/css/grid.css';
import './assets/css/index.css';
import Layout from './components/layout/Layout';
import { ToastProvider } from './context/ToastProvider';

const store = createStore(
    rootReducer,
    applyMiddleware(thunk)
)

document.title = 'Furniture Shop Admin';

ReactDOM.render(
    <Provider store={store}>
        <ToastProvider>
            <React.StrictMode>
                <Layout />
            </React.StrictMode>
        </ToastProvider>

    </Provider>,
    document.getElementById('root')
)



//ReactDOM.render(<Layout />, document.getElementById('root'))

// const root = ReactDOM.createRoot(document.getElementById('root'));
// root.render(
//   <React.StrictMode>
//     <Layout  />
//   </React.StrictMode>
// );

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
