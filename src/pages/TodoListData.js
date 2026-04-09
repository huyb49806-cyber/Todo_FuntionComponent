import { useCallback, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  fetchData, setPage, setFilter, clearCompleted
} from '../redux/actions';
import {Spin, Pagination} from 'antd';
import TodoItem from '../components/TodoItem';
import TodoFooter from '../components/Footer';
// import Pagination from '../components/Pagination';
import UserManagement from '../components/Admin';

export default function TodoListData() {
  const dispatch = useDispatch();
  const { items, pagination, isLoading } = useSelector(state => state.todos);
  const filter = useSelector(state => state.filter);
  const totalPages = pagination ? Math.ceil(pagination._totalRows / pagination._limit) : 0;
  const { user } = useSelector(state => state.auth);
  const loadData = useCallback(() => {
    dispatch(fetchData());
  }, [dispatch]);


  useEffect(() => {
    if (user) loadData();
  }, [pagination?._page, filter, loadData, user]);//khi data lớn thì lọc, sort, phân trang phải do bên server đảm nhận
  const activeCount = items.filter(t => !t.completed).length;
  const completedCount = items.length - activeCount;

  const handlePageChange = useCallback((f) => {
    dispatch(setPage(f));
  }, [dispatch]);
  const handleFilterChange = useCallback((f) => dispatch(setFilter(f)), [dispatch]);
  const handleClearCompleted = useCallback(() => dispatch(clearCompleted()), [dispatch]);
  // console.log(user);
  return (
    <div>
      {isLoading ? (
        <div style={{ textAlign: 'center', padding: '50px' }}>
          <Spin size="large" tip="Đang tải dữ liệu..." />
        </div>
      ) : (

        <section className="main" style={{ borderTop: 'none' }}>
          <ul className="todo-list">
            {items.map(todo => (
              <TodoItem
                key={todo.id}
                todo={todo}
                isEditingItem={false}
              />
            ))}
          </ul>
        </section>
      )}

      <div style={{ display: 'flex', justifyContent: 'center', margin: '20px 0', padding: '10px' }}>
        <Pagination
          current={pagination?._page}
          pageSize={pagination?._limit}
          total={pagination?._totalRows}
          onChange={handlePageChange}
          showSizeChanger={false}
        />
      </div>

      <TodoFooter
        completedCount={completedCount}
        filter={filter}
        onFilterChange={handleFilterChange}
        onClearCompleted={handleClearCompleted}
      />
      {user?.role === 'ADMIN' && (
        <UserManagement />
      )}
    </div>
  );
}