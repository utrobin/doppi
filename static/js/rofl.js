"use strict";
/*
 * типы действий
 */

const ADD_TODO = 'ADD_TODO'
const TOGGLE_TODO = 'TOGGLE_TODO'
const SET_VISIBILITY_FILTER = 'SET_VISIBILITY_FILTER'

/*
 * другие константы
 */

const VisibilityFilters = {
  SHOW_ALL: 'SHOW_ALL',
  SHOW_COMPLETED: 'SHOW_COMPLETED',
  SHOW_ACTIVE: 'SHOW_ACTIVE'
}

/*
 * генераторы действий
 */

 function addTodo(text) {
  return { type: ADD_TODO, text }
}

 function toggleTodo(index) {
  return { type: TOGGLE_TODO, index }
}

 function setVisibilityFilter(filter) {
  return { type: SET_VISIBILITY_FILTER, filter }
}

const { SHOW_ALL } = VisibilityFilters

function visibilityFilter(state, action) {
  if (typeof state === 'undefined') {
    return SHOW_ALL
  }
  switch (action.type) {
    case SET_VISIBILITY_FILTER:
      return action.filter
    default:
      return state
  }
}


function todos(state, action) {
  if (typeof state === 'undefined') {
    return []
  }
  switch (action.type) {
    case ADD_TODO:
      return [
        ...state,
        {
          text: action.text,
          completed: false
        }
      ]
    case TOGGLE_TODO:
      return state.map((todo, index) =>
      {
        if (index === action.index) {
          return Object.assign({}, todo, {
            completed: !todo.completed
          })
        }
        return todo
      })
    default:
      return state
  }
}

const todoApp = Redux.combineReducers({
  visibilityFilter,
  todos
})

let store = Redux.createStore(todoApp)

console.log(store.getState())

let unsubscribe = store.subscribe(() =>
  console.log(store.getState())
)

// Отправим несколько действий
store.dispatch(addTodo('Learn about actions'))
store.dispatch(addTodo('Learn about reducers'))
store.dispatch(addTodo('Learn about store'))
store.dispatch(toggleTodo(0))
store.dispatch(toggleTodo(1))
store.dispatch(setVisibilityFilter(VisibilityFilters.SHOW_COMPLETED))

// Прекратим слушать обновление состояния
unsubscribe()