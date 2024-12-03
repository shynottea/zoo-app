import React from 'react';
import { Layout, Form, Input, Button, Row, Col, Card, message } from 'antd';

const { Content } = Layout;

const Contacts = () => {
    const [form] = Form.useForm(); // Create a form instance to control the form

    const handleSubmit = (values) => {
        console.log('Form submission:', values);

        // Show success message
        message.success('Your message has been sent!');

        // Clear the form fields
        form.resetFields();
    };

    return (
        <Layout>
            <Content style={{ padding: '50px' }}>
                <Row gutter={[16, 16]}>
                    <Col xs={24} md={12}>
                        <Card title="Contact Us" bordered={false}>
                            <Form
                                form={form} // Bind the form instance to the Form component
                                name="contact_form"
                                layout="vertical"
                                onFinish={handleSubmit}
                            >
                                <Form.Item
                                    name="name"
                                    label="Your Name"
                                    rules={[{ required: true, message: 'Please enter your name' }]}
                                >
                                    <Input placeholder="Enter your name" />
                                </Form.Item>

                                <Form.Item
                                    name="email"
                                    label="Your Email"
                                    rules={[
                                        {
                                            type: 'email',
                                            message: 'Please enter a valid email address',
                                        },
                                        { required: true, message: 'Please enter your email' },
                                    ]}
                                >
                                    <Input placeholder="Enter your email" />
                                </Form.Item>

                                <Form.Item
                                    name="message"
                                    label="Your Message"
                                    rules={[
                                        { required: true, message: 'Please enter your message' },
                                    ]}
                                >
                                    <Input.TextArea rows={4} placeholder="Enter your message" />
                                </Form.Item>

                                <Form.Item>
                                    <Button type="primary" htmlType="submit">
                                        Send Message
                                    </Button>
                                </Form.Item>
                            </Form>
                        </Card>
                    </Col>

                    <Col xs={24} md={12}>
                        <Card title="Our Location" bordered={false}>
                            {/* Google Maps Embed */}
                            <div style={{ width: '100%', height: '400px' }}>
                                <iframe
                                    title="Google Map"
                                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d23253.299287527283!2d76.92973211563668!3d43.237537157790285!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3883698889abc753%3A0xfa8dd7fa954fc653!2z0JfQvtC-0LzQsNCz0LDQt9C40L0gWm9vRHVrZW4uINCR0L7Qu9C10LUgNzAg0LHRgNC10L3QtNC-0LIg0LfQvtC-0YLQvtCy0LDRgNC-0LIg0YEg0LTQvtGB0YLQsNCy0LrQvtC5INC_0L4g0JDQu9C80LDRgtGL!5e0!3m2!1sen!2skz!4v1733166515035!5m2!1sen!2skz"
                                    width="100%"
                                    height="400"
                                    style={{ border: 0 }}
                                    allowFullScreen=""
                                    loading="lazy"
                                ></iframe>
                            </div>
                        </Card>
                    </Col>
                </Row>
            </Content>
        </Layout>
    );
};

export default Contacts;