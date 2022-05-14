export enum ToastType {
  SUCCESS,
  ERROR,
  WARNING,
}

export enum ToastActionType {
  ADD,
  REMOVE,
  HIDE,
}

export interface ToastPayload {
  id?: number,
  type?: ToastType,
  message?: string,
}

export interface ToastAction {
  type: ToastActionType,
  payload: ToastPayload,
}

export interface Toast extends ToastPayload {
  id: number,
  removed?: boolean,
}
