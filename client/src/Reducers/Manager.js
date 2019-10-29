const initialState = {
  data: undefined,
  acquired: false,
  loading: false,

  loadingSelectionPhase: false,
  selectionPhase: false,
}

const prefix = 'MANAGER_'

export default function managerReducer (state = initialState, action) {
  switch (action.type) {
    case prefix + 'UPDATE':
      return {
        ...state,
        data: action.payload.data
      }
    case prefix + 'ACQUIRED':
      return {
        ...state,
        acquired: action.payload.acquired
      }
    case prefix + 'LOADING':
      return {
        ...state,
        loading: action.payload.loading
      }
    case prefix + 'LOADING_SELECTION_PHASE':
      return {
        ...state,
        loadingSelectionPhase: action.payload.loadingSelectionPhase
      }
    case prefix + 'SET_SELECTION_PHASE':
      return {
        ...state,
        selectionPhase: action.payload.selectionPhase
      }
    default:
      return state
  }
}
