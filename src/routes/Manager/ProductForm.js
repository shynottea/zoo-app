
import React, { useEffect } from 'react';
import { Form, Input, InputNumber, Button, Select, message } from 'antd';
import { useDispatch } from 'react-redux';
import { createProduct, updateProduct, fetchProducts } from '../../redux/slices/productsSlice';

const { Option } = Select;

const ProductForm = ({ product, onClose, onSubmit }) => {
    const [form] = Form.useForm();
    const dispatch = useDispatch();

    useEffect(() => {
        if (product) {
            form.setFieldsValue({
                title: product.title,
                image: product.image,
                description: product.description,
                category: product.category,
                price: product.price,
            });
        } else {
            form.resetFields();
        }
    }, [product, form]);

    const onFinish = (values) => {
        if (product) {
            dispatch(updateProduct({ id: product.id, updatedProduct: { ...product, ...values } }))
                .unwrap()
                .then(() => {
                    message.success('Product updated successfully');
                    onSubmit();
                    dispatch(fetchProducts());
                })
                .catch((err) => {
                    message.error(`Update failed: ${err}`);
                });
        } else {
            dispatch(createProduct(values))
                .unwrap()
                .then(() => {
                    message.success('Product created successfully');
                    onSubmit();
                    dispatch(fetchProducts());
                })
                .catch((err) => {
                    message.error(`Creation failed: ${err}`);
                });
        }
    };

    return (
        <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
            initialValues={{
                title: '',
                image: '',
                description: '',
                category: '',
                price: 0,
            }}
        >
            <Form.Item
                label="Title"
                name="title"
                rules={[{ required: true, message: 'Please input the product title!' }]}
            >
                <Input />
            </Form.Item>
            <Form.Item
                label="Image URL"
                name="image"
                rules={[{ required: true, message: 'Please input the image URL!' }]}
            >
                <Input />
            </Form.Item>
            <Form.Item
                label="Description"
                name="description"
                rules={[{ required: true, message: 'Please input the description!' }]}
            >
                <Input.TextArea rows={4} />
            </Form.Item>
            <Form.Item
                label="Category"
                name="category"
                rules={[{ required: true, message: 'Please select the category!' }]}
            >
                <Select placeholder="Select a category">
                    <Option value="Furniture">Furniture</Option>
                    <Option value="Toys">Toys</Option>
                    <Option value="Aquatic Supplies">Aquatic Supplies</Option>
                    <Option value="Cages">Cages</Option>
                    <Option value="Accessories">Accessories</Option>
                    <Option value="Food">Food</Option>

                </Select>
            </Form.Item>
            <Form.Item
                label="Price ($)"
                name="price"
                rules={[{ required: true, message: 'Please input the price!' }]}
            >
                <InputNumber min={0} style={{ width: '100%' }} />
            </Form.Item>
            <Form.Item>
                <Button type="primary" htmlType="submit" style={{ width: '100%' }}>
                    {product ? 'Update Product' : 'Create Product'}
                </Button>
            </Form.Item>
        </Form>
    );
};

export default ProductForm;
