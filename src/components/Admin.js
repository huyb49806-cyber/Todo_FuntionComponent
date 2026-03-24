import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Table, Tag, Button, Popconfirm } from 'antd';
import { getallUsers, deleteUser } from '../redux/actions';

const UserManagement = () => {
    const dispatch = useDispatch();
    const { user } = useSelector(state => state.auth);
    const { listUsers } = useSelector(state => state.admin);

    useEffect(() => {
        if (user && user?.role === 'ADMIN') {
            dispatch(getallUsers());
        }
    }, [user, dispatch]);
    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: 'Tên',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
        },
        {
            title: 'Role',
            dataIndex: 'role',
            key: 'role',
            render: (role) => {
                const color = role === 'ADMIN' ? 'blue' : 'default';
                return <Tag color={color}>{role}</Tag>;
            }
        },
        {
            title: 'Hành động',
            key: 'action',
            align: 'center',
            render: (_, record) => (
                <Popconfirm
                    title="Xóa người dùng"
                    description="Bạn chắc chắn muốn xóa người dùng này?"
                    onConfirm={() => dispatch(deleteUser(record.id))}
                    okText="Xóa"
                    cancelText="Hủy"
                >
                    <Button type="primary" danger size="small">
                        Xóa
                    </Button>
                </Popconfirm>
            ),
        }
    ];

    return (
        <div className='user-management'>
            <h2>Quản lí user</h2>
            <Table 
                columns={columns} 
                dataSource={listUsers} 
                rowKey="id" 
                pagination={{ pageSize: 5 }} 
            />
        </div>
    );
}

export default UserManagement;