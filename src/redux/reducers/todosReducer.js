import * as types from '../constants';
import { produce } from 'immer'

const initialState = {
  items: [],
  isLoading: false,
  error: null,
  pagination: {
    _page: 1,
    _limit: 5,
    _totalRows: 0
  },
};

export default function todosReducer(state = initialState, action) {
  switch (action.type) {
    case types.FETCH_TODOS_REQUEST:
      return {
        ...state,
        isLoading: true,
        error: null
      }
    case types.FETCH_TODOS_SUCCESS:
      return {
        ...state,//state ở mỗi nhánh reducer chỉ là 1 phần do reducer đó quản lí, kp cả state trong store
        isLoading: false,
        items: action.payload.data,
        pagination: {
          ...state.pagination,
          ...action.payload.pagination
        }
      }
    case types.FETCH_TODOS_FAILURE:
      return {
        ...state,
        isLoading: false,
        error: action.payload ?? 'Không thể tải dữ liệu'
      };

    case types.SET_PAGE:
      return {
        ...state,
        pagination: {
          ...state.pagination,
          _page: action.payload
        }
      }

    case types.SET_FILTER:
      return {
        ...state,
        pagination: {
          ...state.pagination,
          _page: 1
        }
      }

    case types.DELETE_TODO_SUCCESS:
      return {
        ...state,
        items: state.items.filter(todo => todo.id !== action.payload)
      };

    case types.TOGGLE_TODO_SUCCESS:
      return produce(state, draft => {
        const todo = draft.items.find(t => t.id === action.payload);
        if (todo) {
          todo.completed = !todo.completed;
        }
      });

    case types.SAVE_EDITING_SUCCESS:
      return {
        ...state,
        items: state.items.map(todo => todo.id === action.payload.id ? { ...todo, text: action.payload.text } : todo)
      }

    case types.CLEAR_COMPLETED_SUCCESS:
      return {
        ...state,
        items: state.items.filter(todo => !todo.completed)
      };

    default:
      return state;
  }
}