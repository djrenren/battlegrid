export interface GridState {
  zoom: number
}

interface ZoomAction {
  type: 'ZOOM',
  zoom: number
}

export function zoom(zoom: number): ZoomAction {
  return {
    type: 'ZOOM',
    zoom 
  }
}



const initialState = {
  zoom: 1
}

export function gridReducer(state = initialState, action: ZoomAction): typeof initialState {
  switch (action.type) {
    case 'ZOOM':
      return { zoom: action.zoom }
    default:
      return state
  }
}
