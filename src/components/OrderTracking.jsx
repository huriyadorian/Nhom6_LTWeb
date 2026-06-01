import React, { useState, useEffect } from 'react';
import { Container, Badge, Card, Row, Col, Form, InputGroup, Button, Spinner } from 'react-bootstrap';
import { FiSearch, FiPackage, FiTruck, FiCheckCircle, FiClock, FiXCircle, FiCalendar, FiUser, FiMapPin, FiPhone } from 'react-icons/fi';
import axios from 'axios';

const OrderTracking = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const res = await axios.get('http://localhost:9999/orders');
            // Sắp xếp đơn mới nhất lên đầu
            setOrders(res.data.reverse());
        } catch (error) {
            console.error("Error fetching orders:", error);
        } finally {
            setLoading(false);
        }
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case 'pending': return <Badge bg="warning" className="rounded-pill px-3"><FiClock className="me-1" /> Chờ xử lý</Badge>;
            case 'paid': return <Badge bg="info" className="rounded-pill px-3"><FiCheckCircle className="me-1" /> Đã thanh toán</Badge>;
            case 'shipping': return <Badge bg="primary" className="rounded-pill px-3"><FiTruck className="me-1" /> Đang giao hàng</Badge>;
            case 'completed': return <Badge bg="success" className="rounded-pill px-3"><FiPackage className="me-1" /> Hoàn thành</Badge>;
            case 'cancelled': return <Badge bg="danger" className="rounded-pill px-3"><FiXCircle className="me-1" /> Đã hủy</Badge>;
            default: return <Badge bg="secondary">{status}</Badge>;
        }
    };

    const filteredOrders = orders.filter(order => {
        const matchesSearch = 
            order.id.toString().includes(searchTerm) || 
            order.customerName.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = filterStatus === 'all' || order.status === filterStatus;
        return matchesSearch && matchesStatus;
    });

    return (
        <Container className="py-5">
            <div className="mb-5">
                <h2 className="fw-bold d-flex align-items-center gap-3">
                    <div className="bg-primary text-white p-2 rounded-3 d-flex align-items-center justify-content-center">
                        <FiPackage size={24} />
                    </div>
                    Tra Cứu Đơn Hàng
                </h2>
                <p className="text-muted">Theo dõi trạng thái vận chuyển và thanh toán của các đơn hàng bạn đã đặt.</p>
            </div>

            <Card className="border-0 shadow-sm rounded-4 mb-4">
                <Card.Body className="p-4">
                    <Row className="g-3">
                        <Col md={8}>
                            <InputGroup className="bg-light rounded-pill px-3 py-1">
                                <InputGroup.Text className="bg-transparent border-0 text-muted">
                                    <FiSearch />
                                </InputGroup.Text>
                                <Form.Control 
                                    className="bg-transparent border-0 shadow-none" 
                                    placeholder="Tìm theo Mã đơn hàng hoặc Tên khách hàng..." 
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </InputGroup>
                        </Col>
                        <Col md={4}>
                            <Form.Select 
                                className="rounded-pill bg-light border-0 px-4 py-2 shadow-none"
                                value={filterStatus}
                                onChange={(e) => setFilterStatus(e.target.value)}
                            >
                                <option value="all">Tất cả trạng thái</option>
                                <option value="pending">Chờ xử lý</option>
                                <option value="paid">Đã thanh toán</option>
                                <option value="shipping">Đang giao hàng</option>
                                <option value="completed">Hoàn thành</option>
                                <option value="cancelled">Đã hủy</option>
                            </Form.Select>
                        </Col>
                    </Row>
                </Card.Body>
            </Card>

            {loading ? (
                <div className="text-center py-5">
                    <Spinner animation="border" variant="primary" />
                    <p className="mt-3 text-muted">Đang tải danh sách đơn hàng...</p>
                </div>
            ) : filteredOrders.length === 0 ? (
                <div className="text-center py-5 bg-white rounded-4 shadow-sm border">
                    <FiSearch size={64} className="text-muted mb-3" />
                    <h4 className="fw-bold">Không tìm thấy đơn hàng</h4>
                    <p className="text-muted">Vui lòng kiểm tra lại mã đơn hàng hoặc thay đổi bộ lọc.</p>
                </div>
            ) : (
                <div className="order-list">
                    {filteredOrders.map(order => (
                        <Card key={order.id} className="border-0 shadow-sm rounded-4 mb-4 overflow-hidden order-item-card">
                            <Card.Header className="bg-white py-3 border-bottom-0 d-flex justify-content-between align-items-center">
                                <div>
                                    <span className="text-muted small">Mã đơn hàng:</span>
                                    <span className="fw-bold ms-2 text-primary">#{order.id}</span>
                                    <span className="ms-3 text-muted small"><FiCalendar className="me-1" /> {order.date}</span>
                                </div>
                                {getStatusBadge(order.status)}
                            </Card.Header>
                            <Card.Body className="p-4 bg-light-subtle">
                                <Row className="g-4">
                                    <Col lg={4}>
                                        <div className="mb-4">
                                            <h6 className="fw-bold text-uppercase small text-muted mb-3">Thông tin khách hàng</h6>
                                            <div className="d-flex align-items-center gap-2 mb-2">
                                                <FiUser className="text-primary" /> <strong>{order.customerName}</strong>
                                            </div>
                                            <div className="d-flex align-items-center gap-2 mb-2 small">
                                                <FiMapPin className="text-muted" /> {order.address}
                                            </div>
                                            <div className="d-flex align-items-center gap-2 small">
                                                <FiPhone className="text-muted" /> {order.phone}
                                            </div>
                                        </div>
                                    </Col>
                                    <Col lg={8}>
                                        <h6 className="fw-bold text-uppercase small text-muted mb-3">Sản phẩm đã mua</h6>
                                        <div className="bg-white rounded-3 p-3 border">
                                            {order.items.map((item, idx) => (
                                                <div key={idx} className={`d-flex justify-content-between align-items-center ${idx !== order.items.length - 1 ? 'mb-3 pb-3 border-bottom' : ''}`}>
                                                    <div className="d-flex align-items-center gap-3">
                                                        <img src={item.image} alt="" className="rounded" style={{ width: '40px', height: '55px', objectFit: 'cover' }} />
                                                        <div>
                                                            <div className="fw-bold small">{item.name}</div>
                                                            <div className="text-muted small">x{item.cartQuantity}</div>
                                                        </div>
                                                    </div>
                                                    <div className="fw-bold small">{(item.price * item.cartQuantity).toLocaleString()}đ</div>
                                                </div>
                                            ))}
                                            <div className="mt-3 pt-3 border-top d-flex justify-content-between align-items-center">
                                                <span className="fw-bold text-dark">Tổng tiền thanh toán:</span>
                                                <span className="h5 fw-bold text-primary mb-0">{order.total.toLocaleString()}đ</span>
                                            </div>
                                        </div>
                                    </Col>
                                </Row>
                            </Card.Body>
                            <Card.Footer className="bg-white py-3 border-top-0 d-flex justify-content-end gap-2">
                                <Button variant="outline-secondary" size="sm" className="rounded-pill px-3">Chi tiết</Button>
                                {order.status === 'pending' && <Button variant="danger" size="sm" className="rounded-pill px-3">Hủy đơn</Button>}
                                {order.status === 'completed' && <Button variant="primary" size="sm" className="rounded-pill px-3">Mua lại</Button>}
                            </Card.Footer>
                        </Card>
                    ))}
                </div>
            )}
        </Container>
    );
};

export default OrderTracking;