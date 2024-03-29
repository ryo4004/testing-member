import { useEffect, useState } from 'react'
import clsx from 'clsx'
import { useScoreEditModalStore } from '../../../stores/scoreEditModal'
import { useStyle } from '../../../utilities/useStyle'
import styles from './ScoreEditModal.module.scss'
import { ContentsBox, ContentsLoading, TitleFrame } from '../../../components/ContentsBox'
import { useMediaStore } from '../../../stores/media'
import { Input } from './Input'
import type { BoxItem, ScoreItem, EditMode, ScoreEdit } from '../../../types'
import { ReactComponent as PlusIcon } from '../../../assets/plus.svg'
import { ReactComponent as EditIcon } from '../../../assets/edit.svg'
import { ContentsButton } from '../../../components/Navigations/ContentsButton'
import { UpdateScoreData, useUpdateScore } from '../api/updateScore'
import { PreEditApi, usePreEdit } from '../api/getPreEdit'
import { UseQueryResult } from 'react-query'

const initialState: ScoreEdit = {
  number: 1,
  titleJa: '',
  titleEn: '',
  composer: [''],
  arranger: [''],
  publisher: '',
  genre: '',
  scoreType: '0',
  copyMemo: '',
  scoreStatus: '0',
  scoreLack: '0',
  lackList: [''],
  lendLocate: '',
  scoreBased: '0',
  label: '000001',
  boxLabel: '',
  status: '',
  createdAt: '',
  updatedAt: '',
}

type InputType = typeof initialState

type ArraysKey = 'composer' | 'arranger' | 'lackList'

function assertArraysKey(key: keyof typeof initialState): asserts key is ArraysKey {
  if (['composer', 'arranger', 'lackList'].includes(key)) {
    return undefined
  }
  throw Error('Not a arrays key')
}

type ScoreEditState = {
  input: ScoreEdit
  composedScoreItem: UpdateScoreData
  setValue: (value: string, key: keyof typeof initialState, arrayIndex?: number) => void
  addBlank: (key: ArraysKey) => void
}

const useScoreEdit = (
  editMode: EditMode | null,
  scoreItem: ScoreItem | null,
  latestScoreItem: ScoreItem | null,
  boxList: BoxItem[],
  scoreId: string | null
): ScoreEditState => {
  const [input, setInput] = useState<ScoreEdit>(initialState)

  useEffect(() => {
    if (scoreItem) {
      setInput(scoreItem)
    }
  }, [scoreItem])

  useEffect(() => {
    if (editMode === 'new' && !scoreItem) {
      if (boxList.length !== 0) {
        const editScore = {
          ...initialState,
          number: parseInt(latestScoreItem?.number || '0') + 1,
          label: String(parseInt(latestScoreItem?.number || '0') + 1).padStart(6, '0'),
          boxLabel: boxList[boxList.length - 1].label,
        }
        return setInput(editScore)
      } else {
        console.log('箱がありません')
      }
    }
  }, [editMode, scoreItem, latestScoreItem, boxList])

  const setValue = (value: string, key: keyof typeof initialState, arrayIndex?: number) => {
    if (['composer', 'arranger', 'lackList'].includes(key)) {
      assertArraysKey(key)
      const newArray = input[key].map((item, index) => (index === arrayIndex ? value : item))
      setInput((state) => ({ ...state, [key]: newArray }))
    } else {
      setInput((state) => ({ ...state, [key]: value }))
    }
  }

  const addBlank = (key: ArraysKey) => {
    setInput((state) => ({ ...state, [key]: [...input[key], ''] }))
  }

  const { createdAt, updatedAt, ...rest } = input
  const newScore = { ...rest, number: String(rest.number) }
  const editScore = { ...input, number: String(input.number) }
  const composedScoreItem: UpdateScoreData =
    editMode === 'new'
      ? { mode: 'new', scoreItem: newScore }
      : { mode: 'edit', id: scoreId || '', scoreItem: editScore }

  return { input, composedScoreItem, setValue, addBlank }
}

export const ScoreEditModal = () => {
  const pc = useStyle()
  const { isOpen, onClose, editMode, scoreId } = useScoreEditModalStore()
  const updateScoreMutation = useUpdateScore()

  const scorePreEditQuery = usePreEdit(editMode, scoreId || false)

  const inputState = useScoreEdit(
    editMode,
    scorePreEditQuery.data?.data || null,
    scorePreEditQuery.data?.latest || null,
    scorePreEditQuery.data?.boxList || [],
    scoreId
  )

  const updateScoreEdit = () => {
    updateScoreMutation.mutate(inputState.composedScoreItem)
  }

  return (
    <div className={styles['score-edit-modal']}>
      <div className={clsx(styles['score-edit-modal-contents'], { [styles.open]: isOpen }, styles[pc])}>
        <div className={clsx(styles.header, styles[pc])}>
          <div className={styles.cancel} onClick={onClose}>
            キャンセル
          </div>
          <div className={styles.title}>{editMode === 'new' ? '新しい楽譜を追加' : '楽譜の修正'}</div>
          <div className={styles.save} onClick={updateScoreEdit}>
            {updateScoreMutation.isLoading ? <span>読み込み中...</span> : editMode === 'new' ? '追加' : '修正'}
          </div>
        </div>

        <div
          className={styles.contents}
          // ref={(i) => {
          //   !this.props.editModalRef ? this.props.setEditModalRef(i) : false
          // }}
        >
          {scorePreEditQuery.isLoading && <ContentsLoading />}
          {!scorePreEditQuery.isLoading && (
            <Contents scorePreEditQuery={scorePreEditQuery} inputState={inputState} updateScoreEdit={updateScoreEdit} />
          )}
        </div>
      </div>

      <div className={clsx(styles['score-edit-modal-background'], { [styles.open]: isOpen })} onClick={onClose}></div>
    </div>
  )
}

const Contents = ({
  scorePreEditQuery,
  inputState,
  updateScoreEdit,
}: {
  scorePreEditQuery: UseQueryResult<PreEditApi>
  inputState: ReturnType<typeof useScoreEdit>
  updateScoreEdit: () => void
}) => {
  const { editMode } = useScoreEditModalStore()
  const { displayPlayer } = useMediaStore()
  const { input, setValue, addBlank } = inputState

  return (
    <div className={styles['contents-inner']}>
      {(editMode === 'editDetail' || editMode === 'new') && (
        <Base input={input} setValue={setValue} addBlank={addBlank} />
      )}

      {(editMode === 'editDetail' || editMode === 'new') && (
        <Status input={input} setValue={setValue} addBlank={addBlank} />
      )}

      {(editMode === 'editStatus' || editMode === 'new') && (
        <Info editMode={editMode} boxList={scorePreEditQuery.data?.boxList || []} input={input} setValue={setValue} />
      )}

      <ContentsBox>
        <ContentsButton icon={<EditIcon />} label={editMode === 'new' ? '追加' : '修正'} onClick={updateScoreEdit} />
      </ContentsBox>

      {displayPlayer && <div className={styles.gap}></div>}
    </div>
  )
}

const Base = ({
  input,
  setValue,
  addBlank,
}: {
  input: InputType
  setValue: (value: string, key: keyof typeof initialState, arrayIndex?: number) => void
  addBlank: (key: ArraysKey) => void
}) => {
  const pc = useStyle()
  return (
    <ContentsBox>
      <div className={clsx(styles['score-edit'], styles[pc])}>
        <TitleFrame title="基本情報">
          <div className={styles.list}>
            <Input
              label="タイトル(日本語)"
              value={input.titleJa}
              target="titleJa"
              inputClassName={styles['title-ja']}
              onChange={(value) => setValue(value, 'titleJa')}
            />
            <Input
              label="タイトル(英語)"
              value={input.titleEn}
              target="titleEn"
              inputClassName={styles['title-en']}
              onChange={(value) => setValue(value, 'titleEn')}
            />
            {input.composer.map((composer, index) => {
              return (
                <Input
                  key={`composer-${index}`}
                  label={'作曲者' + (index + 1)}
                  value={composer}
                  target="composer"
                  inputClassName={styles.composer}
                  multi={true}
                  onChange={(value) => setValue(value, 'composer', index)}
                />
              )
            })}
            <div className={styles['add-data']} onClick={() => addBlank('composer')}>
              <PlusIcon />
              作曲者を追加
            </div>
            {input.arranger.map((arranger, index) => {
              return (
                <Input
                  key={`arranger-${index}`}
                  label={'編曲者' + (index + 1)}
                  value={arranger}
                  target="arranger"
                  inputClassName={styles.arranger}
                  multi={true}
                  onChange={(value) => setValue(value, 'arranger', index)}
                />
              )
            })}
            <div className={styles['add-data']} onClick={() => addBlank('arranger')}>
              <PlusIcon />
              編曲者を追加
            </div>
            <Input
              label="出版社"
              value={input.publisher}
              target="publisher"
              inputClassName={styles.publisher}
              onChange={(value) => setValue(value, 'publisher')}
            />
            <Input
              label="ジャンル"
              value={input.genre}
              target="genre"
              inputClassName={styles.genre}
              onChange={(value) => setValue(value, 'genre')}
            />
          </div>
        </TitleFrame>
      </div>
    </ContentsBox>
  )
}

const Status = ({
  input,
  setValue,
  addBlank,
}: {
  input: InputType
  setValue: (value: string, key: keyof typeof initialState, arrayIndex?: number) => void
  addBlank: (key: ArraysKey) => void
}) => {
  const pc = useStyle()
  return (
    <ContentsBox>
      <div className={clsx(styles['score-edit'], styles[pc])}>
        <TitleFrame title="楽譜の状態">
          <div className={styles.list}>
            <div className={styles.input}>
              <label>種類</label>
              <div className={styles['radio-input']}>
                <input
                  type="radio"
                  name="scoreType"
                  id="scoreTypeTrue"
                  value={1}
                  checked={input.scoreType === '1'}
                  onChange={(e) => setValue(e.target.value, 'scoreType')}
                />
                <label htmlFor="scoreTypeTrue">
                  <span>コピー譜</span>
                </label>
                <input
                  type="radio"
                  name="scoreType"
                  id="scoreTypeFalse"
                  value={0}
                  checked={input.scoreType === '0'}
                  onChange={(e) => setValue(e.target.value, 'scoreType')}
                />
                <label htmlFor="scoreTypeFalse">
                  <span>原譜</span>
                </label>
              </div>
            </div>
            {input.scoreType === '1' && (
              <Input
                label="コピーメモ"
                value={input.copyMemo}
                target="copyMemo"
                inputClassName={styles['copied-from']}
                onChange={(value) => setValue(value, 'copyMemo')}
              />
            )}
            <div className={styles.input}>
              <label>欠譜</label>
              <div className={styles['radio-input']}>
                <input
                  type="radio"
                  name="scoreLack"
                  id="scoreLackTrue"
                  value={1}
                  checked={input.scoreLack === '1'}
                  onChange={(e) => setValue(e.target.value, 'scoreLack')}
                />
                <label htmlFor="scoreLackTrue">
                  <span>あり</span>
                </label>
                <input
                  type="radio"
                  name="scoreLack"
                  id="scoreLackUnconfirmed"
                  value={2}
                  checked={input.scoreLack === '2'}
                  onChange={(e) => setValue(e.target.value, 'scoreLack')}
                />
                <label htmlFor="scoreLackUnconfirmed">
                  <span>未確認</span>
                </label>
                <input
                  type="radio"
                  name="scoreLack"
                  id="scoreLackFalse"
                  value={0}
                  checked={input.scoreLack === '0'}
                  onChange={(e) => setValue(e.target.value, 'scoreLack')}
                />
                <label htmlFor="scoreLackFalse">
                  <span>なし</span>
                </label>
              </div>
            </div>
            {input.scoreLack === '1' && (
              <div>
                {input.lackList.map((lack, index) => (
                  <Input
                    key={`lack-${index}`}
                    label={'欠譜' + (index + 1)}
                    value={lack}
                    target="lackList"
                    inputClassName={styles['lack-list']}
                    multi={true}
                    onChange={(value) => setValue(value, 'lackList', index)}
                  />
                ))}
                <div className={styles['add-data']} onClick={() => addBlank('lackList')}>
                  <PlusIcon />
                  欠譜情報を追加
                </div>
              </div>
            )}
            <div className={styles.input}>
              <label>原譜処理</label>
              <div className={styles['radio-input']}>
                <input
                  type="radio"
                  name="scoreBased"
                  id="scoreBasedTrue"
                  value={1}
                  checked={input.scoreBased === '1'}
                  onChange={(e) => setValue(e.target.value, 'scoreBased')}
                />
                <label htmlFor="scoreBasedTrue">
                  <span>未処理</span>
                </label>
                <input
                  type="radio"
                  name="scoreBased"
                  id="scoreBasedFalse"
                  value={0}
                  checked={input.scoreBased === '0'}
                  onChange={(e) => setValue(e.target.value, 'scoreBased')}
                />
                <label htmlFor="scoreBasedFalse">
                  <span>処理済</span>
                </label>
              </div>
            </div>
          </div>
        </TitleFrame>
      </div>
    </ContentsBox>
  )
}

const Info = ({
  editMode,
  boxList,
  input,
  setValue,
}: {
  editMode: EditMode | null
  boxList: BoxItem[]
  input: InputType
  setValue: (value: string, key: keyof typeof initialState, arrayIndex?: number) => void
}) => {
  const pc = useStyle()
  return (
    <ContentsBox>
      <div className={clsx(styles['score-edit'], styles[pc])}>
        <TitleFrame title="保管情報">
          <div className={styles.list}>
            <div className={styles.input}>
              <label>保管状況</label>
              <div className={styles['radio-input']}>
                <input
                  type="radio"
                  name="scoreStatus"
                  id="scoreStatusLend"
                  value={2}
                  checked={input.scoreStatus === '2'}
                  onChange={(e) => setValue(e.target.value, 'scoreStatus')}
                />
                <label htmlFor="scoreStatusLend" className={styles['highlight-high']}>
                  <span>貸出中</span>
                </label>
                <input
                  type="radio"
                  name="scoreStatus"
                  id="scoreStatusUsing"
                  value={1}
                  checked={input.scoreStatus === '1'}
                  onChange={(e) => setValue(e.target.value, 'scoreStatus')}
                />
                <label htmlFor="scoreStatusUsing" className={styles['highlight-low']}>
                  <span>使用中</span>
                </label>
                <input
                  type="radio"
                  name="scoreStatus"
                  id="scoreStatusStrage"
                  value={0}
                  checked={input.scoreStatus === '0'}
                  onChange={(e) => setValue(e.target.value, 'scoreStatus')}
                />
                <label htmlFor="scoreStatusStrage">
                  <span>保管</span>
                </label>
                {editMode !== 'new' && (
                  <>
                    <input
                      type="radio"
                      name="scoreStatus"
                      id="scoreStatusRemove"
                      value={-1}
                      checked={input.scoreStatus === '-1'}
                      onChange={(e) => setValue(e.target.value, 'scoreStatus')}
                    />
                    <label htmlFor="scoreStatusRemove" className={styles['highlight-high']}>
                      <span>削除</span>
                    </label>
                  </>
                )}
              </div>
            </div>
            {input.scoreStatus === '2' && (
              <Input
                label="貸出先"
                value={input.lendLocate}
                target="lendLocate"
                inputClassName={styles.lend}
                onChange={(value) => setValue(value, 'lendLocate')}
              />
            )}
            <div
              className={styles.input}
              // onClick={() => this.reloadNumberLabel()}
            >
              <label>楽譜管理番号</label>
              <span className={styles['score-number']}>{input.label}</span>
            </div>
            <div className={styles.input}>
              <label>楽譜保管箱</label>
              <div>
                <select value={input.boxLabel} onChange={(e) => setValue(e.target.value, 'boxLabel')}>
                  {boxList.map((box) => (
                    <option key={box._id} value={box.label}>
                      {box.label} - {box.locate === false ? '未設定' : box.locate}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </TitleFrame>
      </div>
    </ContentsBox>
  )
}
