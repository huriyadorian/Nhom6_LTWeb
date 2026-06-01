import React, { useState, useEffect, useCallback } from 'react';
import { Container, Table, Button, Form, Modal, Row, Col, Alert, Tabs, Tab, Card, Badge } from 'react-bootstrap';
import axios from 'axios';
import { 
    FiPlus, 
    FiEdit2, 
    FiTrash2, 
    FiBox, 
    FiGrid, 
    FiBarChart2, 
    FiShoppingCart, 
    FiUser, 
    FiCalendar, 
    FiDollarSign, 
    FiLayers,
    FiBriefcase,
    FiHeart,
    FiStar,
    FiCheckCircle,
    FiInfo
} from 'react-icons/fi';

const Admin = () => {
    // Phân hệ quản trị chính: 'books' (Sách), 'orders' (Đơn hàng), 'users' (Người dùng), 'stats' (Thống kê)
    const [adminView, setAdminView] = useState('books');

    // --- STATES PHÂN HỆ SÁCH (EXISTING) ---
    const [categories, setCategories] = useState({});
    const [showModal, setShowModal] = useState(false);
    const [currentBook, setCurrentBook] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        author: '',
        publisher: '',
        year: '',
        original_price: '',
        discount: '',
        quantity: '',
        image: '',
        description: ''
    });
    const [msg, setMsg] = useState('');
    const [imgError, setImgError] = useState('');
    const [activeTab, setActiveTab] = useState('');
    const [targetCategories, setTargetCategories] = useState([]); // Lưu mảng các danh mục được chọn

    // --- STATES PHÂN HỆ ĐƠN HÀNG (NEW) ---
    const [orders, setOrders] = useState([]);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [showOrderModal, setShowOrderModal] = useState(false);
    const [orderStatusFilter, setOrderStatusFilter] = useState('All'); // 'All', 'pending', 'confirmed', 'shipping', 'completed', 'cancelled'

    // --- STATES PHÂN HỆ NGƯỜI DÙNG (NEW) ---
    const [users, setUsers] = useState([]);
    const [showUserModal, setShowUserModal] = useState(false);
    const [currentUserForm, setCurrentUserForm] = useState({
        username: '',
        password: '',
        fullName: '',
        role: 'user'
    });
    const [userMsg, setUserMsg] = useState('');

    // --- STATES PHÂN HỆ THỐNG KÊ (NEW) ---
    const [filterYear, setFilterYear] = useState('2026');
    const [filterMonth, setFilterMonth] = useState('All'); // 'All', '1' ... '12'

    // --- DATA FETCHERS ---
    const fetchBooks = useCallback(async () => {
        try {
            const res = await axios.get('http://localhost:9999/category');
            setCategories(res.data);
            if (!activeTab) {
                const firstCat = Object.keys(res.data)[0];
                if (firstCat) setActiveTab(firstCat);
            }
        } catch (error) {
            console.error("Error fetching categories:", error);
        }
    }, [activeTab]);

    const fetchOrders = async () => {
        try {
            const res = await axios.get('http://localhost:9999/orders');
            setOrders(res.data);
        } catch (error) {
            console.error("Error fetching orders:", error);
        }
    };

    const fetchUsers = async () => {
        try {
            const res = await axios.get('http://localhost:9999/users');
            setUsers(res.data);
        } catch (error) {
            console.error("Error fetching users:", error);
        }
    };

    useEffect(() => {
        fetchBooks();
        fetchOrders();
        fetchUsers();
    }, [fetchBooks]);

    // --- LOGIC PHÂN HỆ SÁCH ---
    const handleShow = (book = null, cat = activeTab) => {
        if (book) {
            setCurrentBook(book);
            const belongsTo = Object.keys(categories).filter(key => 
                categories[key].some(b => b.id === book.id)
            );
            setTargetCategories(belongsTo);
            
            setFormData({ 
                name: book.name || '',
                author: book.author || '',
                publisher: book.publisher || '',
                year: book.year || '',
                original_price: book.original_price || book.price || '',
                discount: book.discount || 0,
                quantity: book.quantity || 0,
                image: book.image || '',
                description: book.description || ''
            });
        } else {
            setCurrentBook(null);
            setTargetCategories([cat]);
            setFormData({ name: '', author: '', publisher: '', year: '', original_price: '', discount: 0, quantity: 0, image: '', description: '' });
        }
        setShowModal(true);
    };

    const handleSave = async () => {
        if (targetCategories.length === 0) {
            alert("Vui lòng chọn ít nhất một danh mục!");
            return;
        }

        if (formData.image && formData.image.startsWith('data:')) {
            setImgError('⚠️ Vui lòng nhập link URL ảnh, không dùng base64!');
            return;
        }
        setImgError('');

        try {
            const updatedCategories = { ...categories };
            const origPrice = Number(formData.original_price);
            const disc = Number(formData.discount);
            const sellingPrice = Math.round(origPrice * (1 - disc / 100));

            const bookId = currentBook ? currentBook.id : Date.now();
            const bookData = {
                ...formData,
                id: bookId,
                original_price: origPrice,
                discount: disc,
                price: sellingPrice,
                quantity: Number(formData.quantity),
                year: formData.year ? Number(formData.year) : ''
            };

            Object.keys(updatedCategories).forEach(catKey => {
                const isInTarget = targetCategories.includes(catKey);
                const existsAtIndex = updatedCategories[catKey].findIndex(b => b.id === bookId);

                if (isInTarget) {
                    if (existsAtIndex > -1) {
                        updatedCategories[catKey][existsAtIndex] = bookData;
                    } else {
                        updatedCategories[catKey] = [...updatedCategories[catKey], bookData];
                    }
                } else {
                    if (existsAtIndex > -1) {
                        updatedCategories[catKey] = updatedCategories[catKey].filter(b => b.id !== bookId);
                    }
                }
            });

            await axios.put('http://localhost:9999/category', updatedCategories);
            setMsg('Cập nhật sách thành công!');
            setShowModal(false);
            fetchBooks();
            setTimeout(() => setMsg(''), 3000);
        } catch (error) {
            alert("Có lỗi xảy ra khi lưu sách!");
        }
    };

    const handleDelete = async (bookId, cat) => {
        if (window.confirm('Xóa sản phẩm này?')) {
            try {
                const updatedCategories = { ...categories };
                updatedCategories[cat] = updatedCategories[cat].filter(b => b.id !== bookId);
                await axios.put('http://localhost:9999/category', updatedCategories);
                fetchBooks();
                setMsg('Đã xóa sách thành công!');
                setTimeout(() => setMsg(''), 3000);
            } catch (error) {
                console.error(error);
            }
        }
    };

    // --- LOGIC PHÂN HỆ ĐƠN HÀNG ---
    const handleShowOrderDetail = (order) => {
        setSelectedOrder(order);
        setShowOrderModal(true);
    };

    const handleUpdateOrderStatus = async (orderId, newStatus) => {
        try {
            const orderToUpdate = orders.find(o => o.id === orderId);
            if (!orderToUpdate) return;

            const updatedOrder = { ...orderToUpdate, status: newStatus };
            await axios.put(`http://localhost:9999/orders/${orderId}`, updatedOrder);
            
            // Cập nhật state & giao diện
            if (selectedOrder && selectedOrder.id === orderId) {
                setSelectedOrder(updatedOrder);
            }
            fetchOrders();
            setMsg('Đã cập nhật trạng thái đơn hàng thành công!');
            setTimeout(() => setMsg(''), 3000);
        } catch (error) {
            console.error("Error updating order status:", error);
            alert("Có lỗi xảy ra khi cập nhật trạng thái!");
        }
    };

    // --- LOGIC PHÂN HỆ NGƯỜI DÙNG ---
    const handleRegisterUser = async (e) => {
        e.preventDefault();
        const { username, password, fullName, role } = currentUserForm;
        if (!username.trim() || !password.trim() || !fullName.trim()) {
            alert("Vui lòng điền đầy đủ thông tin!");
            return;
        }

        try {
            // Kiểm tra xem username đã tồn tại chưa
            const userExists = users.some(u => u.username.toLowerCase() === username.toLowerCase());
            if (userExists) {
                alert("Tên đăng nhập đã tồn tại! Vui lòng chọn tên khác.");
                return;
            }

            const newUser = {
                username,
                password,
                fullName,
                role
            };

            await axios.post('http://localhost:9999/users', newUser);
            setShowUserModal(false);
            setCurrentUserForm({ username: '', password: '', fullName: '', role: 'user' });
            fetchUsers();
            setUserMsg('Đăng ký tài khoản người dùng thành công!');
            setTimeout(() => setUserMsg(''), 3000);
        } catch (error) {
            console.error("Error creating user:", error);
            alert("Có lỗi xảy ra khi tạo người dùng!");
        }
    };

    const handleDeleteUser = async (userId) => {
        if (userId === "1" || userId === 1) {
            alert("Không thể xóa tài khoản Administrator mặc định!");
            return;
        }
        if (window.confirm("Bạn có chắc chắn muốn xóa tài khoản người dùng này?")) {
            try {
                await axios.delete(`http://localhost:9999/users/${userId}`);
                fetchUsers();
                setUserMsg('Đã xóa người dùng thành công!');
                setTimeout(() => setUserMsg(''), 3000);
            } catch (error) {
                console.error("Error deleting user:", error);
            }
        }
    };

    const handleUpdateUserRole = async (userId, newRole) => {
        if (userId === "1" || userId === 1) {
            alert("Không thể thay đổi quyền hạn của tài khoản Administrator mặc định!");
            return;
        }

        try {
            const userToUpdate = users.find(u => u.id === userId);
            if (!userToUpdate) return;

            const updatedUser = { ...userToUpdate, role: newRole };
            await axios.put(`http://localhost:9999/users/${userId}`, updatedUser);
            
            fetchUsers();
            setUserMsg('Cập nhật vai trò người dùng thành công!');
            setTimeout(() => setUserMsg(''), 3000);
        } catch (error) {
            console.error("Error updating user role:", error);
            alert("Có lỗi xảy ra khi cập nhật vai trò!");
        }
    };

    // --- LOGIC BỘ PHÂN TÍCH DATE & THỐNG KÊ ---
    const parseOrderDate = (dateStr) => {
        // Cấu trúc dateStr: "14:56:40 12/5/2026"
        if (!dateStr) return { day: 1, month: 1, year: 2026 };
        const parts = dateStr.split(' ');
        if (parts.length < 2) return { day: 1, month: 1, year: 2026 };
        const dateParts = parts[1].split('/'); // ["12", "5", "2026"]
        return {
            day: Number(dateParts[0]),
            month: Number(dateParts[1]),
            year: Number(dateParts[2])
        };
    };

    // Lọc đơn hàng theo Thời gian
    const filteredStatsOrders = orders.filter(order => {
        const parsed = parseOrderDate(order.date);
        const matchesYear = parsed.year.toString() === filterYear;
        const matchesMonth = filterMonth === 'All' || parsed.month.toString() === filterMonth;
        return matchesYear && matchesMonth;
    });

    // Chỉ tính doanh thu dựa trên đơn hàng ĐÃ HOÀN THÀNH (completed) hoặc tất cả trừ đã hủy (tùy định nghĩa)
    // Ở đây ta tính doanh thu trên các đơn hàng "completed" (Đã giao hàng) để chính xác nhất
    const completedOrders = filteredStatsOrders.filter(o => o.status === 'completed');

    const totalRevenue = completedOrders.reduce((sum, o) => sum + (o.total || 0), 0);
    const totalOrdersCount = filteredStatsOrders.length;
    const completedOrdersCount = completedOrders.length;
    
    // Tính tổng số lượng sách bán ra từ các đơn hàng thành công
    const totalItemsSold = completedOrders.reduce((sum, o) => {
        const itemsCount = o.items ? o.items.reduce((s, item) => s + (item.cartQuantity || 1), 0) : 0;
        return sum + itemsCount;
    }, 0);

    // Tính sách bán chạy nhất (Top Sellers)
    const bookSalesMap = {};
    completedOrders.forEach(o => {
        if (o.items) {
            o.items.forEach(item => {
                const bookKey = item.name;
                const qty = item.cartQuantity || 1;
                if (bookSalesMap[bookKey]) {
                    bookSalesMap[bookKey].quantity += qty;
                    bookSalesMap[bookKey].revenue += (item.price * qty);
                } else {
                    bookSalesMap[bookKey] = {
                        name: item.name,
                        author: item.author || 'N/A',
                        image: item.image,
                        quantity: qty,
                        revenue: (item.price * qty)
                    };
                }
            });
        }
    });

    const topSellers = Object.values(bookSalesMap)
        .sort((a, b) => b.quantity - a.quantity)
        .slice(0, 5); // Lấy top 5 sản phẩm bán chạy nhất

    // --- DATA MAPPERS ---
    const totalBooks = Object.values(categories).reduce((acc, curr) => acc + curr.length, 0);

    const categoryMap = {
        sach_mam_non: "Sách Mầm Non",
        sach_thieu_nhi: "Sách Thiếu Nhi",
        sach_ki_nang: "Sách Kĩ Năng",
        sach_kinh_doanh: "Sách Kinh Doanh",
        sach_me_va_be: "Sách Mẹ và Bé",
        sach_van_hoc: "Sách Văn Học",
        sach_tham_khao: "Sách Tham Khảo",
        notebook: "Note Book",
        top_best_seller: "Bán Chạy Nhất",
        sach_moi: "Sách Mới",
        sach_sap_phat_hanh: "Sắp Phát Hành"
    };

    const statusBadgeMap = {
        pending: { text: "Chờ xử lý", bg: "warning" },
        confirmed: { text: "Đã xác nhận", bg: "info" },
        shipping: { text: "Đang giao", bg: "primary" },
        completed: { text: "Đã hoàn thành", bg: "success" },
        cancelled: { text: "Đã hủy", bg: "danger" }
    };

    const calculatedPrice = Math.round(Number(formData.original_price) * (1 - Number(formData.discount) / 100));

    // Lọc đơn hàng ở tab Quản lý đơn hàng
    const filteredOrders = orders.filter(o => orderStatusFilter === 'All' || o.status === orderStatusFilter);

    return (
        <Container className="py-4 admin-dashboard">
            {/* GLOBAL OVERVIEW STATS CARDS */}
            <Row className="mb-4 g-3">
                <Col md={4}>
                    <Card className="border-0 shadow-sm rounded-4 stats-card stats-primary bg-white p-3">
                        <Card.Body className="d-flex align-items-center gap-3 p-0">
                            <div className="stats-icon bg-primary-light text-primary" style={{ padding: '14px', borderRadius: '12px', backgroundColor: '#eff6ff' }}><FiBox size={24} /></div>
                            <div>
                                <div className="text-muted small">Tổng số đầu sách</div>
                                <div className="h4 fw-bold m-0 text-dark">{totalBooks}</div>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={4}>
                    <Card className="border-0 shadow-sm rounded-4 stats-card stats-success bg-white p-3">
                        <Card.Body className="d-flex align-items-center gap-3 p-0">
                            <div className="stats-icon bg-success-light text-success" style={{ padding: '14px', borderRadius: '12px', backgroundColor: '#f0fdf4' }}><FiGrid size={24} /></div>
                            <div>
                                <div className="text-muted small">Danh mục hiển thị</div>
                                <div className="h4 fw-bold m-0 text-dark">{Object.keys(categories).length}</div>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={4}>
                    <Card className="border-0 shadow-sm rounded-4 stats-card stats-warning bg-white p-3">
                        <Card.Body className="d-flex align-items-center gap-3 p-0">
                            <div className="stats-icon bg-warning-light text-warning" style={{ padding: '14px', borderRadius: '12px', backgroundColor: '#fffbeb' }}><FiCheckCircle size={24} /></div>
                            <div>
                                <div className="text-muted small">Hệ thống sách</div>
                                <div className="h4 fw-bold m-0 text-success">Hoạt động tốt</div>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* MAIN NAVIGATION TAB BAR */}
            <div className="admin-nav-container">
                <div className="admin-nav-tabs">
                    <button 
                        className={`admin-nav-btn ${adminView === 'books' ? 'active' : ''}`}
                        onClick={() => setAdminView('books')}
                    >
                        <FiBox size={18} /> Quản lý Sách
                    </button>
                    <button 
                        className={`admin-nav-btn ${adminView === 'orders' ? 'active' : ''}`}
                        onClick={() => setAdminView('orders')}
                    >
                        <FiShoppingCart size={18} /> Quản lý Đơn hàng
                    </button>
                    <button 
                        className={`admin-nav-btn ${adminView === 'users' ? 'active' : ''}`}
                        onClick={() => setAdminView('users')}
                    >
                        <FiUser size={18} /> Quản lý Người dùng
                    </button>
                    <button 
                        className={`admin-nav-btn ${adminView === 'stats' ? 'active' : ''}`}
                        onClick={() => setAdminView('stats')}
                    >
                        <FiBarChart2 size={18} /> Thống kê chi tiết
                    </button>
                </div>
            </div>

            {msg && <Alert variant="success" className="border-0 shadow-sm rounded-3 py-2.5 mb-4">{msg}</Alert>}

            {/* =========================================================================
                1. PHÂN HỆ QUẢN LÝ SÁCH (EXISTING)
                ========================================================================= */}
            {adminView === 'books' && (
                <>
                    <div className="admin-header mb-4 d-flex justify-content-between align-items-center flex-wrap gap-3">
                        <div>
                            <h3 className="fw-bold m-0 text-dark">Quản Lý Danh Mục Sách</h3>
                            <p className="text-muted small mb-0">Cập nhật và chỉnh sửa kho sách của cửa hàng</p>
                        </div>
                        <Button variant="primary" onClick={() => handleShow()} className="rounded-pill px-4 py-2.5 shadow-sm fw-bold">
                            <FiPlus className="me-2" /> Thêm Sách Mới
                        </Button>
                    </div>



                    <Card className="border-0 shadow-sm rounded-4 overflow-hidden bg-white">
                        <Card.Header className="bg-white border-0 pt-3 px-3">
                            <Tabs
                                activeKey={activeTab}
                                onSelect={(k) => setActiveTab(k)}
                                className="admin-tabs border-0 overflow-auto flex-nowrap"
                            >
                                {Object.keys(categories).map(catKey => (
                                    <Tab 
                                        key={catKey} 
                                        eventKey={catKey} 
                                        title={categoryMap[catKey] || catKey}
                                    />
                                ))}
                            </Tabs>
                        </Card.Header>
                        <Card.Body className="p-0">
                            <div className="table-responsive">
                                <Table hover className="admin-table m-0 align-middle">
                                    <thead>
                                        <tr className="bg-light">
                                            <th className="ps-4 py-3">Sản phẩm</th>
                                            <th>Tác giả</th>
                                            <th>Tồn kho</th>
                                            <th>Giá gốc</th>
                                            <th>Giảm giá</th>
                                            <th>Giá bán</th>
                                            <th className="text-end pe-4">Thao tác</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {categories[activeTab]?.map(book => (
                                            <tr key={book.id}>
                                                <td className="ps-4">
                                                    <div className="d-flex align-items-center gap-3 py-1">
                                                        <img src={book.image} alt="" className="rounded shadow-sm" style={{ width: '45px', height: '60px', objectFit: 'cover' }} />
                                                        <div className="fw-bold text-dark">{book.name}</div>
                                                    </div>
                                                </td>
                                                <td className="text-secondary">{book.author}</td>
                                                <td>
                                                    <span className={`badge px-2 py-1.5 ${book.quantity > 0 ? 'bg-light text-dark border' : 'bg-danger-subtle text-danger'}`}>
                                                        {book.quantity > 0 ? `Còn hàng (${book.quantity})` : 'Hết hàng'}
                                                    </span>
                                                </td>
                                                <td className="text-muted small text-decoration-line-through">{Number(book.original_price || book.price).toLocaleString()}đ</td>
                                                <td><span className="text-danger fw-bold">-{book.discount || 0}%</span></td>
                                                <td className="fw-bold text-primary">{Number(book.price).toLocaleString()}đ</td>
                                                <td className="text-end pe-4">
                                                    <div className="d-flex justify-content-end gap-2">
                                                        <Button variant="light" size="sm" className="rounded-circle btn-icon border" onClick={() => handleShow(book, activeTab)} title="Chỉnh sửa">
                                                            <FiEdit2 size={14} className="text-primary" />
                                                        </Button>
                                                        <Button variant="light" size="sm" className="rounded-circle btn-icon border" onClick={() => handleDelete(book.id, activeTab)} title="Xóa sách">
                                                            <FiTrash2 size={14} className="text-danger" />
                                                        </Button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </Table>
                            </div>
                        </Card.Body>
                    </Card>
                </>
            )}

            {/* =========================================================================
                2. PHÂN HỆ QUẢN LÝ ĐƠN HÀNG (NEW)
                ========================================================================= */}
            {adminView === 'orders' && (
                <>
                    <div className="admin-header mb-4">
                        <h3 className="fw-bold m-0 text-dark">Quản Lý Đơn Hàng Khách Hàng</h3>
                        <p className="text-muted small mb-0">Theo dõi, duyệt đơn hàng và cập nhật tiến trình giao hàng</p>
                    </div>

                    {/* Bộ lọc trạng thái đơn hàng */}
                    <div className="admin-filter-container mb-4">
                        {['All', 'pending', 'confirmed', 'shipping', 'completed', 'cancelled'].map(status => (
                            <button 
                                key={status}
                                className={`admin-filter-btn ${orderStatusFilter === status ? 'active' : ''}`}
                                onClick={() => setOrderStatusFilter(status)}
                            >
                                {status === 'All' ? 'Tất cả đơn' : statusBadgeMap[status]?.text} 
                                <span className="admin-filter-count">
                                    {status === 'All' ? orders.length : orders.filter(o => o.status === status).length}
                                </span>
                            </button>
                        ))}
                    </div>

                    <Card className="premium-table-card border-0 bg-white">
                        <Card.Body className="p-0">
                            <div className="table-responsive">
                                <table className="admin-table m-0 align-middle">
                                    <thead>
                                        <tr className="bg-light">
                                            <th className="ps-4 py-3">Mã đơn hàng</th>
                                            <th>Khách hàng</th>
                                            <th>Ngày đặt</th>
                                            <th>Số điện thoại</th>
                                            <th>Tổng tiền</th>
                                            <th>Trạng thái</th>
                                            <th className="text-end pe-4">Thao tác</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredOrders.length === 0 ? (
                                            <tr>
                                                <td colSpan="7" className="text-center py-5 text-muted">Không tìm thấy đơn hàng nào phù hợp.</td>
                                            </tr>
                                        ) : (
                                            filteredOrders.map(order => (
                                                <tr key={order.id}>
                                                    <td className="ps-4">
                                                        <span className="order-id-badge">{order.id}</span>
                                                    </td>
                                                    <td>
                                                        <div className="fw-bold text-dark">{order.customerName}</div>
                                                        <div className="text-muted small text-truncate" style={{ maxWidth: '200px' }}>{order.address}</div>
                                                    </td>
                                                    <td className="text-muted small">{order.date}</td>
                                                    <td className="text-secondary">{order.phone}</td>
                                                    <td className="fw-bold text-dark fs-6">{Number(order.total).toLocaleString()}đ</td>
                                                    <td>
                                                        <span className={`badge-premium badge-premium-${order.status}`}>
                                                            <span className="pulsing-dot"></span>
                                                            {statusBadgeMap[order.status]?.text || order.status}
                                                        </span>
                                                    </td>
                                                    <td className="text-end pe-4">
                                                        <button 
                                                            className="btn-action-view"
                                                            onClick={() => handleShowOrderDetail(order)}
                                                        >
                                                            Xem Chi Tiết
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </Card.Body>
                    </Card>
                </>
            )}

            {/* =========================================================================
                3. PHÂN HỆ QUẢN LÝ NGƯỜI DÙNG (NEW)
                ========================================================================= */}
            {adminView === 'users' && (
                <>
                    <div className="admin-header mb-4 d-flex justify-content-between align-items-center flex-wrap gap-3">
                        <div>
                            <h3 className="fw-bold m-0 text-dark">Quản Lý Người Dùng & Thành Viên</h3>
                            <p className="text-muted small mb-0">Quản lý phân quyền tài khoản thành viên trong hệ thống</p>
                        </div>
                        <Button variant="primary" onClick={() => setShowUserModal(true)} className="rounded-pill px-4 py-2.5 shadow-sm fw-bold">
                            <FiPlus className="me-2" /> Đăng Ký Người Dùng Mới
                        </Button>
                    </div>

                    {userMsg && <Alert variant="success" className="border-0 shadow-sm rounded-3 py-2.5 mb-4">{userMsg}</Alert>}

                    <Card className="premium-table-card border-0 bg-white">
                        <Card.Body className="p-0">
                            <div className="table-responsive">
                                <table className="admin-table m-0 align-middle">
                                    <thead>
                                        <tr className="bg-light">
                                            <th className="ps-4 py-3">Tài khoản (Username)</th>
                                            <th>Họ và tên (Full Name)</th>
                                            <th>Mật khẩu hiển thị</th>
                                            <th>Vai trò (Role)</th>
                                            <th className="text-end pe-4">Thao tác</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {users.map(user => (
                                            <tr key={user.id}>
                                                <td className="ps-4">
                                                    <div className="d-flex align-items-center gap-2.5">
                                                        <div className="bg-light rounded-circle p-2 text-primary border"><FiUser size={16} /></div>
                                                        <div className="fw-bold text-dark">{user.username}</div>
                                                    </div>
                                                </td>
                                                <td className="fw-semibold">{user.fullName || 'Chưa cập nhật'}</td>
                                                <td className="text-muted small">{user.password}</td>
                                                <td>
                                                    <select 
                                                        value={user.role}
                                                        onChange={(e) => handleUpdateUserRole(user.id, e.target.value)}
                                                        className={`user-role-select ${user.role === 'admin' ? 'role-admin' : 'role-user'}`}
                                                        disabled={user.id === "1" || user.id === 1}
                                                        title={user.id === "1" || user.id === 1 ? "Không thể chỉnh sửa tài khoản Administrator mặc định" : "Thay đổi vai trò"}
                                                    >
                                                        <option value="user">Khách hàng (user)</option>
                                                        <option value="admin">Quản trị viên (admin)</option>
                                                    </select>
                                                </td>
                                                <td className="text-end pe-4">
                                                    <Button 
                                                        variant="light" 
                                                        size="sm" 
                                                        className="rounded-circle btn-icon border"
                                                        onClick={() => handleDeleteUser(user.id)}
                                                        disabled={user.id === "1" || user.id === 1}
                                                        title="Xóa người dùng"
                                                    >
                                                        <FiTrash2 size={14} className="text-danger" />
                                                    </Button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </Card.Body>
                    </Card>
                </>
            )}

            {/* =========================================================================
                4. PHÂN HỆ THỐNG KÊ CHI TIẾT (NEW)
                ========================================================================= */}
            {adminView === 'stats' && (
                <>
                    <div className="admin-header mb-4 d-flex justify-content-between align-items-center flex-wrap gap-3">
                        <div>
                            <h3 className="fw-bold m-0 text-dark">Báo Cáo & Thống Kê Doanh Thu</h3>
                            <p className="text-muted small mb-0">Thống kê doanh số bán hàng theo khoảng thời gian tùy chọn</p>
                        </div>
                        {/* Bộ lọc Năm / Tháng */}
                        <div className="premium-filter-picker">
                            <Form.Group className="mb-0">
                                <Form.Select 
                                    className="filter-select-custom"
                                    value={filterYear}
                                    onChange={(e) => setFilterYear(e.target.value)}
                                >
                                    <option value="2025">Năm 2025</option>
                                    <option value="2026">Năm 2026</option>
                                    <option value="2027">Năm 2027</option>
                                </Form.Select>
                            </Form.Group>
                            <span className="text-muted">|</span>
                            <Form.Group className="mb-0">
                                <Form.Select 
                                    className="filter-select-custom"
                                    value={filterMonth}
                                    onChange={(e) => setFilterMonth(e.target.value)}
                                >
                                    <option value="All">Tất cả các tháng</option>
                                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(m => (
                                        <option key={m} value={m.toString()}>Tháng {m}</option>
                                    ))}
                                </Form.Select>
                            </Form.Group>
                        </div>
                    </div>

                    {/* Stats Overview */}
                    <Row className="mb-4 g-3">
                        <Col md={3}>
                            <Card className="stats-card-premium border-0">
                                <Card.Body className="d-flex align-items-center gap-3.5 p-0">
                                    <div className="stats-icon-wrapper stats-success-gradient"><FiDollarSign size={24} /></div>
                                    <div>
                                        <div className="metric-label">Tổng doanh thu thực tế</div>
                                        <div className="metric-value-success">{totalRevenue.toLocaleString()}đ</div>
                                    </div>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col md={3}>
                            <Card className="stats-card-premium border-0">
                                <Card.Body className="d-flex align-items-center gap-3.5 p-0">
                                    <div className="stats-icon-wrapper stats-primary-gradient"><FiShoppingCart size={24} /></div>
                                    <div>
                                        <div className="metric-label">Tổng số đơn đặt mua</div>
                                        <div className="metric-value-dark">{totalOrdersCount} đơn</div>
                                    </div>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col md={3}>
                            <Card className="stats-card-premium border-0">
                                <Card.Body className="d-flex align-items-center gap-3.5 p-0">
                                    <div className="stats-icon-wrapper stats-info-gradient"><FiCheckCircle size={24} /></div>
                                    <div>
                                        <div className="metric-label">Số đơn hoàn thành</div>
                                        <div className="metric-value-dark">{completedOrdersCount} đơn</div>
                                    </div>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col md={3}>
                            <Card className="stats-card-premium border-0">
                                <Card.Body className="d-flex align-items-center gap-3.5 p-0">
                                    <div className="stats-icon-wrapper stats-warning-gradient"><FiBox size={24} /></div>
                                    <div>
                                        <div className="metric-label">Sách đã bán thành công</div>
                                        <div className="metric-value-dark">{totalItemsSold} cuốn</div>
                                    </div>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>

                    <Row className="g-4">
                        {/* Biểu đồ / Danh sách Top sản phẩm bán chạy nhất */}
                        <Col lg={7}>
                            <Card className="border-0 shadow-sm rounded-4 bg-white">
                                <Card.Header className="bg-white border-0 pt-4 px-4 pb-0">
                                    <h5 className="fw-bold m-0 text-dark d-flex align-items-center gap-2">
                                        <FiStar className="text-warning" fill="currentColor" /> Top 5 Sách Bán Chạy Nhất
                                    </h5>
                                    <p className="text-muted small mb-0">Xếp hạng dựa trên tổng số lượng cuốn sách được giao thành công</p>
                                </Card.Header>
                                <Card.Body className="px-4 pb-4">
                                    {topSellers.length === 0 ? (
                                        <div className="text-center py-5 text-muted">Chưa có dữ liệu bán chạy trong thời gian này.</div>
                                    ) : (
                                        <div className="d-flex flex-column gap-3 mt-3">
                                            {topSellers.map((item, idx) => (
                                                <div key={idx} className="d-flex align-items-center justify-content-between p-3 rounded-4 bg-light border border-light">
                                                    <div className="d-flex align-items-center gap-3">
                                                        <div className="fw-bold text-primary fs-5" style={{ minWidth: '25px' }}>#{idx + 1}</div>
                                                        {item.image && <img src={item.image} alt="" className="rounded shadow-sm" style={{ width: '40px', height: '52px', objectFit: 'cover' }} />}
                                                        <div>
                                                            <div className="fw-bold text-dark">{item.name}</div>
                                                            <div className="text-muted small">{item.author}</div>
                                                        </div>
                                                    </div>
                                                    <div className="text-end">
                                                        <div className="fw-bold text-success">{item.quantity} cuốn</div>
                                                        <div className="text-muted small">{Number(item.revenue).toLocaleString()}đ</div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </Card.Body>
                            </Card>
                        </Col>

                        {/* Thống kê đơn hàng nhanh */}
                        <Col lg={5}>
                            <Card className="border-0 shadow-sm rounded-4 bg-white h-100">
                                <Card.Header className="bg-white border-0 pt-4 px-4 pb-0">
                                    <h5 className="fw-bold m-0 text-dark d-flex align-items-center gap-2">
                                        <FiInfo className="text-primary" /> Tổng quan trạng thái đơn hàng
                                    </h5>
                                </Card.Header>
                                <Card.Body className="px-4 pb-4 d-flex flex-column justify-content-center">
                                    <div className="d-flex flex-column gap-3 mt-3">
                                        {['pending', 'confirmed', 'shipping', 'completed', 'cancelled'].map(status => {
                                            const count = filteredStatsOrders.filter(o => o.status === status).length;
                                            const pct = filteredStatsOrders.length > 0 ? Math.round((count / filteredStatsOrders.length) * 100) : 0;
                                            return (
                                                <div key={status} className="d-flex align-items-center justify-content-between">
                                                    <span className="fw-semibold text-secondary" style={{ width: '130px' }}>{statusBadgeMap[status]?.text}</span>
                                                    <div className="progress flex-grow-1 mx-3" style={{ height: '8px', borderRadius: '4px' }}>
                                                        <div className={`progress-bar bg-${statusBadgeMap[status]?.bg}`} role="progressbar" style={{ width: `${pct}%`, borderRadius: '4px' }} aria-valuenow={pct} aria-valuemin="0" aria-valuemax="100"></div>
                                                    </div>
                                                    <span className="fw-bold text-dark" style={{ width: '45px', textAlign: 'right' }}>{count} đơn</span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                </>
            )}

            {/* =========================================================================
                MODALS QUẢN TRỊ
                ========================================================================= */}

            {/* MODAL THÊM / SỬA SÁCH (EXISTING) */}
            <Modal show={showModal} onHide={() => setShowModal(false)} size="lg" centered className="admin-modal">
                <Modal.Header closeButton className="border-0">
                    <Modal.Title className="fw-bold">{currentBook ? 'Cập Nhật Sách' : 'Thêm Sách Mới'}</Modal.Title>
                </Modal.Header>
                <Modal.Body className="px-4 pb-4">
                    <Form>
                        <Row className="g-3">
                            <Col md={12}>
                                <Form.Group className="mb-3">
                                    <Form.Label className="small fw-bold">Tên Sản Phẩm</Form.Label>
                                    <Form.Control type="text" className="bg-light border-0 py-2" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required />
                                </Form.Group>
                            </Col>
                            <Col md={12}>
                                <Form.Group className="mb-3">
                                    <Form.Label className="small fw-bold">Danh Mục (Chọn nhiều)</Form.Label>
                                    <div className="d-flex flex-wrap gap-2 p-3 bg-light rounded-3">
                                        {Object.keys(categoryMap).map(key => (
                                            <Form.Check 
                                                key={key}
                                                type="checkbox"
                                                id={`check-${key}`}
                                                label={categoryMap[key]}
                                                className="me-3 mb-2"
                                                checked={targetCategories.includes(key)}
                                                onChange={(e) => {
                                                    if (e.target.checked) {
                                                        setTargetCategories([...targetCategories, key]);
                                                    } else {
                                                        setTargetCategories(targetCategories.filter(item => item !== key));
                                                    }
                                                }}
                                            />
                                        ))}
                                    </div>
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label className="small fw-bold">Tác Giả</Form.Label>
                                    <Form.Control type="text" className="bg-light border-0 py-2" value={formData.author} onChange={(e) => setFormData({...formData, author: e.target.value})} />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label className="small fw-bold">Số Lượng Trong Kho</Form.Label>
                                    <Form.Control type="number" className="bg-light border-0 py-2" value={formData.quantity} onChange={(e) => setFormData({...formData, quantity: e.target.value})} />
                                </Form.Group>
                            </Col>
                            <Col md={8}>
                                <Form.Group className="mb-3">
                                    <Form.Label className="small fw-bold">Nhà Xuất Bản</Form.Label>
                                    <Form.Control type="text" className="bg-light border-0 py-2" placeholder="VD: NXB Kim Đồng" value={formData.publisher} onChange={(e) => setFormData({...formData, publisher: e.target.value})} />
                                </Form.Group>
                            </Col>
                            <Col md={4}>
                                <Form.Group className="mb-3">
                                    <Form.Label className="small fw-bold">Năm Xuất Bản</Form.Label>
                                    <Form.Control type="number" className="bg-light border-0 py-2" placeholder="VD: 2024" value={formData.year} onChange={(e) => setFormData({...formData, year: e.target.value})} />
                                </Form.Group>
                            </Col>
                            <Col md={4}>
                                <Form.Group className="mb-3">
                                    <Form.Label className="small fw-bold">Giá Gốc (VNĐ)</Form.Label>
                                    <Form.Control type="number" className="bg-light border-0 py-2" value={formData.original_price} onChange={(e) => setFormData({...formData, original_price: e.target.value})} />
                                </Form.Group>
                            </Col>
                            <Col md={4}>
                                <Form.Group className="mb-3">
                                    <Form.Label className="small fw-bold">Giảm Giá (%)</Form.Label>
                                    <Form.Control type="number" className="bg-light border-0 py-2" value={formData.discount} onChange={(e) => setFormData({...formData, discount: e.target.value})} />
                                </Form.Group>
                            </Col>
                            <Col md={4}>
                                <Form.Group className="mb-3">
                                    <Form.Label className="small fw-bold">Giá Bán Sau Giảm (Dự kiến)</Form.Label>
                                    <div className="h5 fw-bold text-primary mt-1">{calculatedPrice.toLocaleString()}đ</div>
                                </Form.Group>
                            </Col>
                            <Col md={12}>
                                <Form.Group className="mb-3">
                                    <Form.Label className="small fw-bold">Mô Tả Sản Phẩm</Form.Label>
                                    <Form.Control 
                                        as="textarea" 
                                        rows={4} 
                                        className="bg-light border-0" 
                                        placeholder="Nhập nội dung giới thiệu sách..." 
                                        value={formData.description} 
                                        onChange={(e) => setFormData({...formData, description: e.target.value})} 
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={12}>
                                <Form.Group className="mb-3">
                                    <Form.Label className="small fw-bold">Link Ảnh (URL)</Form.Label>
                                    <Form.Control 
                                        type="text" 
                                        className={`bg-light border-0 py-2 ${imgError ? 'is-invalid' : ''}`}
                                        placeholder="VD: https://images.unsplash.com/photo-xxx"
                                        value={formData.image} 
                                        onChange={(e) => { setImgError(''); setFormData({...formData, image: e.target.value}); }} 
                                    />
                                    {imgError && <div className="text-danger small mt-1">{imgError}</div>}
                                    {formData.image && formData.image.startsWith('http') && (
                                        <img src={formData.image} alt="preview" className="mt-2 rounded-2 border shadow-sm" style={{ height: '70px', objectFit: 'cover' }} />
                                    )}
                                </Form.Group>
                            </Col>
                        </Row>
                    </Form>
                </Modal.Body>
                <Modal.Footer className="border-0">
                    <Button variant="light" onClick={() => setShowModal(false)} className="rounded-pill px-4 py-2">Hủy</Button>
                    <Button variant="primary" onClick={handleSave} className="rounded-pill px-4 py-2">Lưu Dữ Liệu</Button>
                </Modal.Footer>
            </Modal>

            {/* MODAL XEM CHI TIẾT VÀ CẬP NHẬT ĐƠN HÀNG (NEW) */}
            <Modal show={showOrderModal} onHide={() => setShowOrderModal(false)} size="lg" centered className="admin-order-modal">
                <Modal.Header closeButton className="border-0">
                    <Modal.Title className="fw-bold">Chi Tiết Đơn Hàng #{selectedOrder?.id}</Modal.Title>
                </Modal.Header>
                {selectedOrder && (
                    <Modal.Body className="px-4 pb-4">
                        <Row className="gy-4 mb-4">
                            <Col md={6}>
                                <h6 className="fw-bold text-dark border-bottom pb-2">Thông tin khách hàng</h6>
                                <div className="mb-1"><strong>Họ tên:</strong> {selectedOrder.customerName}</div>
                                <div className="mb-1"><strong>Số điện thoại:</strong> {selectedOrder.phone}</div>
                                <div className="mb-1"><strong>Địa chỉ nhận:</strong> {selectedOrder.address}</div>
                                <div><strong>Ngày đặt:</strong> {selectedOrder.date}</div>
                            </Col>
                            <Col md={6} className="bg-light p-3 rounded-4 border">
                                <h6 className="fw-bold text-dark border-bottom pb-2">Trạng thái đơn hàng</h6>
                                <Form.Group className="mb-3 mt-2">
                                    <Form.Label className="small fw-semibold text-secondary">Cập nhật tiến độ đơn</Form.Label>
                                    <Form.Select 
                                        value={selectedOrder.status}
                                        onChange={(e) => handleUpdateOrderStatus(selectedOrder.id, e.target.value)}
                                        className="rounded-3 py-2 fw-bold"
                                    >
                                        <option value="pending">Chờ xử lý (pending)</option>
                                        <option value="confirmed">Đã xác nhận (confirmed)</option>
                                        <option value="shipping">Đang giao hàng (shipping)</option>
                                        <option value="completed">Đã hoàn thành (completed)</option>
                                        <option value="cancelled">Đã hủy bỏ (cancelled)</option>
                                    </Form.Select>
                                </Form.Group>
                                <div><strong>Thanh toán:</strong> COD (Thanh toán khi nhận hàng)</div>
                            </Col>
                        </Row>

                        <h6 className="fw-bold text-dark border-bottom pb-2 mb-3">Danh sách sản phẩm đã đặt</h6>
                        <Table hover className="align-middle border rounded-4 overflow-hidden">
                            <thead className="bg-light">
                                <tr>
                                    <th className="ps-3 py-2.5">Sách</th>
                                    <th>Giá</th>
                                    <th className="text-center">Số lượng</th>
                                    <th className="text-end pe-3">Thành tiền</th>
                                </tr>
                            </thead>
                            <tbody>
                                {selectedOrder.items?.map((item, idx) => (
                                    <tr key={idx}>
                                        <td className="ps-3">
                                            <div className="d-flex align-items-center gap-2">
                                                {item.image && <img src={item.image} alt="" className="rounded shadow-sm" style={{ width: '35px', height: '48px', objectFit: 'cover' }} />}
                                                <div className="fw-bold small text-dark">{item.name}</div>
                                            </div>
                                        </td>
                                        <td className="small text-muted">{Number(item.price).toLocaleString()}đ</td>
                                        <td className="text-center fw-semibold">{item.cartQuantity || 1}</td>
                                        <td className="text-end pe-3 fw-bold text-primary">{(item.price * (item.cartQuantity || 1)).toLocaleString()}đ</td>
                                    </tr>
                                ))}
                                <tr className="bg-light fw-bold">
                                    <td colSpan="3" className="text-end ps-3 py-3">TỔNG GIÁ TRỊ ĐƠN HÀNG:</td>
                                    <td className="text-end pe-3 py-3 text-danger fs-5">{Number(selectedOrder.total).toLocaleString()}đ</td>
                                </tr>
                            </tbody>
                        </Table>
                    </Modal.Body>
                )}
                <Modal.Footer className="border-0">
                    <Button variant="primary" onClick={() => setShowOrderModal(false)} className="rounded-pill px-4 py-2 fw-bold">Đóng</Button>
                </Modal.Footer>
            </Modal>

            {/* MODAL ĐĂNG KÝ TÀI KHOẢN NGƯỜI DÙNG MỚI (NEW) */}
            <Modal show={showUserModal} onHide={() => setShowUserModal(false)} centered className="admin-user-modal">
                <Modal.Header closeButton className="border-0">
                    <Modal.Title className="fw-bold">Đăng Ký Thành Viên Mới</Modal.Title>
                </Modal.Header>
                <Modal.Body className="px-4 pb-4">
                    <Form onSubmit={handleRegisterUser}>
                        <Form.Group className="mb-3">
                            <Form.Label className="small fw-bold">Tên đăng nhập (Username)</Form.Label>
                            <Form.Control 
                                type="text" 
                                placeholder="Nhập tên đăng nhập..."
                                className="bg-light border-0 py-2.5" 
                                value={currentUserForm.username} 
                                onChange={(e) => setCurrentUserForm({...currentUserForm, username: e.target.value})} 
                                required 
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label className="small fw-bold">Mật khẩu</Form.Label>
                            <Form.Control 
                                type="text" 
                                placeholder="Nhập mật khẩu..."
                                className="bg-light border-0 py-2.5" 
                                value={currentUserForm.password} 
                                onChange={(e) => setCurrentUserForm({...currentUserForm, password: e.target.value})} 
                                required 
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label className="small fw-bold">Họ và tên thành viên</Form.Label>
                            <Form.Control 
                                type="text" 
                                placeholder="Nhập họ và tên đầy đủ..."
                                className="bg-light border-0 py-2.5" 
                                value={currentUserForm.fullName} 
                                onChange={(e) => setCurrentUserForm({...currentUserForm, fullName: e.target.value})} 
                                required 
                            />
                        </Form.Group>
                        <Form.Group className="mb-4">
                            <Form.Label className="small fw-bold">Vai trò / Quyền hạn</Form.Label>
                            <Form.Select 
                                className="bg-light border-0 py-2.5"
                                value={currentUserForm.role}
                                onChange={(e) => setCurrentUserForm({...currentUserForm, role: e.target.value})}
                            >
                                <option value="user">Khách hàng thông thường (user)</option>
                                <option value="admin">Quản trị viên hệ thống (admin)</option>
                            </Form.Select>
                        </Form.Group>

                        <div className="d-flex justify-content-end gap-2">
                            <Button variant="light" onClick={() => setShowUserModal(false)} className="rounded-pill px-4">Hủy</Button>
                            <Button variant="primary" type="submit" className="rounded-pill px-4">Đăng Ký Người Dùng</Button>
                        </div>
                    </Form>
                </Modal.Body>
            </Modal>
        </Container>
    );
};

export default Admin;
