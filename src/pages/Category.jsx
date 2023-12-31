import React, { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import queryString from 'query-string'

import productApi from '../api/productApi'
import Search from '../components/search/Search'
import Table from '../components/table/Table'
import Dropdown from '../components/dropdown/Dropdown'
import ConfirmDialog from '../components/confirmdialog/ConfirmDialog'
import Paginate from '../components/paginate/paginate'
import { useToast } from '../context/toast'

const categoryHead = [
    'ID',
    'Tên danh mục',
    'Nhóm danh mục',
    '',
    ''
]

const roomHead = [
    'ID',
    'Tên loại phòng',
    '',
    ''
]

const groupCategoriesHead = [
    'ID',
    'Tên nhóm',
    '',
    ''
]

const renderCategoryHead = (item, index) => (
    <th key={index}>{item}</th>
)

const renderDataHead = (item, index) => (
    <th key={index}>{item}</th>
)

const actionsAdd = [
    {
        content: 'Thêm mới danh mục sản phẩm',
        path: '/categories/addCategory',
    },
    {
        content: 'Thêm mới loại phòng',
        path: '/categories/addTypeRoom',
    },
    {
        content: 'Thêm mới nhóm danh mục',
        path: '/categories/addParentCategory',
    },
]

const renderAddMenu = (item, index) => (
    <Link to={item.path} key={index}>
        <div>
            <span style={{ display: 'flex', alignItems: 'center', padding: '20px' }}>{item.content}</span>
        </div>
    </Link>
)

const renderAddButton = () => (
    <div className="btn-design">
        Thêm mới
    </div>
)

const Category = () => {

    const [listCategory, setListCategory] = useState([]);
    const [filterCategory, setFilterCategory] = useState({
        page: 1,
        limit: 6,
        search: ''
    });
    const [isHidden, setIsHidden] = useState(false);
    const [totalPageCategory, setTotalPageCategory] = useState(1);

    const [listtypeRoom, setlisttypeRoom] = useState([]);
    const [filterTypeRoom, setFilterTypeRoom,] = useState({
        page: 1,
        limit: 6,
    });
    const [totalPageTypeRoom, setTotalPageTypeRoom] = useState(1);

    const [listcatParent, setlistcatParent] = useState([]);
    const [filterParentCategory, setFilterParentCategory] = useState({
        page: 1,
        limit: 6,
    });
    const [totalPageParentCategory, setTotalPageParentCategory] = useState(1);

    const [open, setopen] = useState(false);
    const [titleDialog, setTitleDialog] = useState('');
    const [contentDialog, setContentDialog] = useState('');
    const [id, setID] = useState('');
    const [actionDelete, setActionDelete] = useState('');
    const { error, success } = useToast();

    const typingTimeoutRef = useRef(null);

    useEffect(() => {
        const getListCategory = async () => {
            try {
                const paramsString = queryString.stringify(filterCategory);
                const response = await productApi.getListCategoryByPage(paramsString);
                console.log(response.data);
                if (response.data.results.errCode === 0) {
                    console.log(response.data.results);
                    setListCategory(response.data.results.data);
                    setTotalPageCategory(response.data.results.total_page);
                } else {
                    console.log(response.data.results.errMessage)
                    setListCategory([])
                    setIsHidden(true)
                }

            } catch (error) {
                console.error('Call API failed', error);
            }
        }
        getListCategory();
    }, [filterCategory])

    const handlePageCategoryChange = (event) => {
        console.log('page-category', event.selected + 1)
        setFilterCategory({
            ...filterCategory,
            page: event.selected + 1
        })
    }

    const handlePageTypeRoomChange = (event) => {
        console.log('page-typeroom', event.selected + 1)
        setFilterTypeRoom({
            ...filterTypeRoom,
            page: event.selected + 1
        })
    }

    const handlePageParentCategoryChange = (event) => {
        console.log('page-parent-category', event.selected + 1)
        setFilterParentCategory({
            ...filterParentCategory,
            page: event.selected + 1
        })
    }

    const handleSearchCategory = (e) => {
        const value = e.target.value;

        if (value === '') {
            typingTimeoutRef.current = setTimeout(() => {
                setFilterCategory({
                    ...filterCategory,
                    page: 1,
                    search: ''
                })
                setIsHidden(false);
            }, 300);
        }

        if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current);
        }

        typingTimeoutRef.current = setTimeout(() => {
            setFilterCategory({
                ...filterCategory,
                page: 1,
                search: value
            })
            setIsHidden(false);
        }, 300);
    }

    useEffect(() => {
        const getListtypeRoom = async () => {
            try {
                const paramsString = queryString.stringify(filterTypeRoom);
                const response = await productApi.getListTyperoomByPage(paramsString);
                console.log(response.data);
                if (response.data.results.errCode === 0) {
                    console.log(response.data.results.data);
                    setlisttypeRoom(response.data.results.data);
                    setTotalPageTypeRoom(response.data.results.total_page);
                } else {
                    console.log(response.data.results.errMessage)
                }

            } catch (error) {
                console.error('Call API failed', error);
            }
        }
        getListtypeRoom();
    }, [filterTypeRoom])

    useEffect(() => {
        const getListcatParnet = async () => {
            try {
                const paramsString = queryString.stringify(filterParentCategory);
                const response = await productApi.getListcatParentByPage(paramsString);
                console.log(response.data);
                if (response.data.results.errCode === 0) {
                    console.log(response.data.results.data);
                    setlistcatParent(response.data.results.data);
                    setTotalPageParentCategory(response.data.results.total_page)
                } else {
                    console.log(response.data.results.errMessage)
                }

            } catch (error) {
                console.error('Call API failed', error);
            }
        }
        getListcatParnet();
    }, [filterParentCategory])

    const renderCategoryBody = (item, index) => (
        <tr key={index}>
            <td>{item.idCat}</td>
            <td>{item.nameCat}</td>
            <td>{item.name}</td>
            <td><Link to={{
                pathname: `/categories/edit/${item.idCat}`,
                state: { nameCat: item.nameCat, idCatParent: item.idcatParent, idCat: item.idCat }
            }}
                className='customLink'>
                <i className='bx bx-edit-alt' style={{ fontSize: '1.7rem' }}></i></Link></td>
            <td onClick={() => openDialogConfirm(
                'Xóa danh mục',
                `Bạn chắc chắn muốn xóa danh mục ${item.nameCat}`,
                item.idCat,
                'delete category'
            )}><i className='bx bx-trash' style={{ fontSize: '1.7rem' }}></i></td>
        </tr>
    )

    const renderTypeRoomBody = (item, index) => (
        <tr key={index}>
            <td>{item.idRoom}</td>
            <td>{item.nameRoom}</td>
            <td><Link to={{
                pathname: `/categories/TypeRoom/edit/${item.idCat}`,
                state: { nameRoom: item.nameRoom, idRoom: item.idRoom }
            }}
                className='customLink'>
                <i className='bx bx-edit-alt' style={{ fontSize: '1.7rem' }}></i></Link></td>
            <td onClick={() => openDialogConfirm(
                'Xóa loại phòng',
                `Bạn chắc chắn muốn xóa ${item.nameRoom}`,
                item.idRoom,
                'delete typeroom'
            )}><i className='bx bx-trash' style={{ fontSize: '1.7rem' }}></i></td>
        </tr>
    )

    const rendercatParentBody = (item, index) => (
        <tr key={index}>
            <td>{item.idcatParent}</td>
            <td>{item.name}</td>
            <td><Link to={{
                pathname: `/categories/ParentCategory/edit/${item.idcatParent}`,
                state: { name: item.name, idCatParent: item.idcatParent }
            }}
                className='customLink'>
                <i className='bx bx-edit-alt' style={{ fontSize: '1.7rem' }}></i></Link></td>
            <td onClick={() => openDialogConfirm(
                'Xóa nhóm danh mục',
                `Bạn chắc chắn muốn nhóm danh mục ${item.name}`,
                item.idcatParent,
                'delete parent category'
            )}><i className='bx bx-trash' style={{ fontSize: '1.7rem' }}></i></td>
        </tr>
    )

    const openDialogConfirm = (title, content, idDelete, action) => {
        setTitleDialog(title);
        setContentDialog(content);
        setID(idDelete);
        setActionDelete(action);
        setopen(!open);
    }

    const closeDialogConfirm = () => {
        console.log('Closed dialog');
        setopen(!open);
    }

    const handleDelete = async () => {
        try {
            if (actionDelete === 'delete category') {
                console.log('idCategory', id);
                const reponse = await productApi.deleteCategory(id);
                if (reponse.data.results.errCode !== 0) {
                    error(reponse.data.results.errMessage)
                } else {
                    success(reponse.data.results.errMessage)
                    window.location.reload();
                }
            } else if (actionDelete === 'delete typeroom') {
                console.log('idtyperoom', id);
                const reponse = await productApi.deletetyperoom(id);
                if (reponse.data.results.errCode !== 0) {
                    error(reponse.data.results.errMessage)
                } else {
                    success(reponse.data.results.errMessage)
                    window.location.reload();
                }
            } else if (actionDelete === 'delete parent category') {
                console.log('id parent category', id);
                const reponse = await productApi.deleteCatParent(id);
                if (reponse.data.results.errCode !== 0) {
                    error(reponse.data.results.errMessage)
                } else {
                    success(reponse.data.results.errMessage)
                    window.location.reload();
                }
            }

            setopen(!open);
        } catch (error) {
            console.error('call api fail', error);
        }
    }

    return (
        <div>
            <div className="top-page">
                <h2 className='page-header'>Quản lý danh mục</h2>
                <div className='page-actions'>
                    <div style={{ zIndex: '1' }}>
                        <Dropdown
                            customToggle={() => renderAddButton()}
                            contentData={actionsAdd}
                            renderItems={(item, index) => renderAddMenu(item, index)}
                        />
                    </div>
                    <Search
                        onchange={handleSearchCategory}
                    />
                </div>
            </div>
            <div className="row">
                <div className="col-10 full-height">
                    <div className="card">
                        <div className="card__header">
                            <h3>Danh sách danh mục sản phẩm</h3>
                        </div>
                        <div className="card__body">
                            <Table
                                headData={categoryHead}
                                renderHead={(item, index) => renderCategoryHead(item, index)}
                                bodyData={listCategory}
                                renderBody={(item, index) => renderCategoryBody(item, index)}
                            />
                        </div>
                        <div className="card__footer">
                            {
                                !isHidden ? <Paginate
                                    totalPage={totalPageCategory}
                                    handlePageChange={handlePageCategoryChange}
                                /> : <div></div>
                            }
                        </div>
                    </div>
                </div>
            </div>
            <div className='row'>
                <div className="col-10 full-height">
                    <div className="card">
                        <div className="card__header">
                            <h3>Danh sách nhóm sản phẩm</h3>
                        </div>
                        <div className="card__body">
                            <Table
                                headData={groupCategoriesHead}
                                renderHead={(item, index) => renderDataHead(item, index)}
                                bodyData={listcatParent}
                                renderBody={(item, index) => rendercatParentBody(item, index)}
                            />
                        </div>
                        <div className="card__footer">
                            <Paginate
                                totalPage={totalPageParentCategory}
                                handlePageChange={handlePageParentCategoryChange}
                            />
                        </div>
                    </div>
                </div>
            </div>
            <div className="row">
                <div className="col-10 full-height">
                    <div className="card">
                        <div className="card__header">
                            <h3>Danh sách loại phòng</h3>
                        </div>
                        <div className="card__body">
                            <Table
                                headData={roomHead}
                                renderHead={(item, index) => renderDataHead(item, index)}
                                bodyData={listtypeRoom}
                                renderBody={(item, index) => renderTypeRoomBody(item, index)}
                            />
                        </div>
                        <div className="card__footer">
                            <Paginate
                                totalPage={totalPageTypeRoom}
                                handlePageChange={handlePageTypeRoomChange}
                            />
                        </div>
                    </div>
                </div>
            </div>
            {open && <ConfirmDialog
                clickConfirm={handleDelete}
                clickClose={closeDialogConfirm}
                title={titleDialog}
                content={contentDialog}
            />}
        </div>
    )
}

export default Category
