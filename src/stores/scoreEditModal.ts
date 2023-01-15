import create from 'zustand'
import type { BoxItem, ScoreItem } from '../types'

// モーダルの開閉時間
const MODAL_DURATION = 200

export type EditMode = 'new' | 'editStatus' | 'editDetail'

type LatestScoreItem = ScoreItem

type ScoreEditModalStore = {
  isOpen: boolean
  onOpen: (scoreItem: ScoreItem | LatestScoreItem | null, boxList: BoxItem[], editMode: EditMode) => void
  onClose: () => void
  scoreItem: ScoreItem | LatestScoreItem | null
  boxList: BoxItem[]
  editMode: EditMode | null
}

export const useScoreEditModalStore = create<ScoreEditModalStore>((set) => ({
  isOpen: false,
  onOpen: (scoreItem, boxList, editMode) => set((state) => ({ ...state, isOpen: true, scoreItem, boxList, editMode })),
  onClose: () => {
    set((state) => ({ ...state, isOpen: false }))
    setTimeout(() => set((state) => ({ ...state, scoreItem: null })), MODAL_DURATION)
  },
  id: null,
  scoreItem: null,
  boxList: [],
  editMode: null,
}))
