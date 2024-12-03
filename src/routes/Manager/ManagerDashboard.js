// src/routes/Manager/ManagerDashboard.jsx
import React, { useEffect, useState } from 'react';
import { Table, Button, Popconfirm, message, Modal, Typography } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts, deleteProduct } from '../../redux/slices/productsSlice';
import ProductForm from './ProductForm'; 

const { Title } = Typography;

const ManagerDashboard = () => {
    const dispatch = useDispatch();
    const products = useSelector((state) => state.products.items);
    const status = useSelector((state) => state.products.status);
    const error = useSelector((state) => state.products.error);

    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);

    useEffect(() => {
        if (status === 'idle') {
            dispatch(fetchProducts());
        }
    }, [status, dispatch]);

    const handleDelete = (id) => {
        dispatch(deleteProduct(id))
            .unwrap()
            .then(() => {
                message.success('Product deleted successfully');
            })
            .catch((err) => {
                message.error(`Delete failed: ${err}`);
            });
    };

    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
            width: '5%',
        },
        {
            title: 'Title',
            dataIndex: 'title',
            key: 'title',
            width: '20%',
        },
        {
            title: 'Category',
            dataIndex: 'category',
            key: 'category',
            width: '15%',
        },
        {
            title: 'Price',
            dataIndex: 'price',
            key: 'price',
            width: '10%',
            render: (price) => `$${price.toFixed(2)}`,
        },
        {
            title: 'Rating',
            dataIndex: 'rating',
            key: 'rating',
            width: '10%',
        },
        {
            title: 'Actions',
            key: 'actions',
            width: '20%',
            render: (_, record) => (
                <>
                    <Button
                        type="primary"
                        style={{ marginRight: 8 }}
                        onClick={() => {
                            setEditingProduct(record);
                            setIsModalVisible(true);
                        }}
                    >
                        Edit
                    </Button>
                    <Popconfirm
                        title="Are you sure to delete this product?"
                        onConfirm={() => handleDelete(record.id)}
                        okText="Yes"
                        cancelText="No"
                    >
                        <Button type="danger">Delete</Button>
                    </Popconfirm>
                </>
            ),
        },
    ];

    const handleAdd = () => {
        setEditingProduct(null);
        setIsModalVisible(true);
    };

    const handleModalClose = () => {
        setIsModalVisible(false);
    };

    const handleFormSubmit = () => {
        setIsModalVisible(false);
    };

    return (
        <div>
            <Title level={2}>Manager Dashboard</Title>
            <Button type="primary" onClick={handleAdd} style={{ marginBottom: 16 }}>
                Add New Product
            </Button>
            <Table
                columns={columns}
                dataSource={products}
                rowKey="id"
                loading={status === 'loading'}
            />
            <Modal
                title={editingProduct ? 'Edit Product' : 'Add New Product'}
                visible={isModalVisible}
                footer={null}
                onCancel={handleModalClose}
                destroyOnClose
            >
                <ProductForm
                    product={editingProduct}
                    onClose={handleModalClose}
                    onSubmit={handleFormSubmit}
                />
            </Modal>
        </div>
    );
};

export default ManagerDashboard;
