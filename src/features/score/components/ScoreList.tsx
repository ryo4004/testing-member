import { useState } from 'react'
import type { UseQueryResult } from 'react-query'
import clsx from 'clsx'
import { ContentsBox, Loading } from '../../../components/ContentsBox'
import { ScoreListApi, useScoreList } from '../api/getScoreList'
import { ReactComponent as SearchIcon } from '../../../assets/search.svg'
import { ReactComponent as CloseIcon } from '../../../assets/close-circle.svg'
import type { ScoreItem } from '../../../types'
import { useScoreModalStore } from '../../../stores/scoreModal'
import { ReactComponent as EditIcon } from '../../../assets/edit.svg'

import styles from './ScoreList.module.scss'
import { ContentsButton } from '../../../components/Navigations/ContentsButton'
import { useAuth } from '../../../library/auth'
import { useScoreEditModalStore } from '../../../stores/scoreEditModal'
import { ContentsLinks } from '../../../components/Navigations'

const LOAD_MORE = 10

export const ScoreList = () => {
  const { user } = useAuth()
  const isScoreAdmin = user?.scoreAdmin

  const { onOpen } = useScoreEditModalStore()

  const [loadMore, setLoadMore] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const scoreListQuery = useScoreList(searchQuery)

  const scoreList = scoreListQuery.data?.list.filter((s) => s.scoreStatus !== '-1') || null

  return (
    <>
      <ContentsBox>
        <div className={styles.score}>
          <SearchBox
            searchQuery={searchQuery}
            setSearchQuery={(searchQuery) => {
              setLoadMore(false)
              setSearchQuery(searchQuery)
            }}
          />
          <ScoreCount isSearch={!!searchQuery} scoreList={scoreList} />
          <ScoreListComponent
            searchQuery={searchQuery}
            scoreListQuery={scoreListQuery}
            loadMore={loadMore}
            setLoadMore={setLoadMore}
          />
        </div>
      </ContentsBox>

      {isScoreAdmin && (
        <ContentsBox>
          <ContentsButton icon={<EditIcon />} label="新しい楽譜を追加" onClick={() => onOpen('new', null)} />
        </ContentsBox>
      )}

      {isScoreAdmin && (
        <ContentsBox>
          <ContentsLinks list={[{ path: 'box', label: '楽譜管理箱' }]} />
        </ContentsBox>
      )}
    </>
  )
}

const ScoreListComponent = ({
  searchQuery,
  scoreListQuery,
  loadMore,
  setLoadMore,
}: {
  searchQuery: string
  scoreListQuery: UseQueryResult<ScoreListApi>
  loadMore: boolean
  setLoadMore: (loadMore: boolean) => void
}) => {
  const { onOpen } = useScoreModalStore()
  if (scoreListQuery.isLoading) {
    return <Loading />
  }

  if (!scoreListQuery.data) {
    return null
  }

  const scoreList = scoreListQuery.data.list.filter((s) => s.scoreStatus !== '-1') || null

  return (
    <>
      {scoreList.map((scoreItem, index) => {
        if (!loadMore && index > LOAD_MORE) {
          return null
        }
        if (scoreItem.status === 'false') {
          return null
        }
        const composer = scoreItem.composer.length === 0 ? '' : scoreItem.composer.join(', ')
        const arranger = scoreItem.arranger.length === 0 ? '' : scoreItem.arranger.join(', ')
        const bar = composer === '' || arranger === '' ? '' : <span className={styles.bar}>/</span>

        return (
          <div
            key={scoreItem._id}
            className={styles['score-list']}
            onTouchStart={() => {}}
            onClick={() => onOpen(scoreItem)}
          >
            <div className={styles.content}>
              {/* {boxInfo} */}
              <div className={styles['title-ja']}>
                <span>{scoreItem.titleJa}</span>
              </div>
              <div className={styles['title-en']}>
                <span>{scoreItem.titleEn}</span>
              </div>
              <div className={styles['composer-arranger']}>
                <span>
                  <span>{composer}</span>
                  {bar}
                  <span>{arranger}</span>
                </span>
              </div>
            </div>
          </div>
        )
      })}
      <EndLabel
        scoreList={scoreListQuery.data.list}
        isSearch={!!searchQuery}
        loadMore={loadMore}
        setLoadMore={setLoadMore}
      />
    </>
  )
}

const SearchBox = ({
  searchQuery,
  setSearchQuery,
}: {
  searchQuery: string
  setSearchQuery: (searchQuery: string) => void
}) => {
  const searchBarButtonClass = searchQuery
    ? styles['search-bar-button']
    : clsx(styles['search-bar-button'], styles.hidden)
  return (
    <div className={styles['search-bar']}>
      <div className={styles['search-frame']}>
        <div className={styles['search-box']}>
          <div className={styles['search-bar-icon']}>
            <SearchIcon />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            // リセットしたらカーソルを検索inputに戻す処理を削除
            placeholder="検索"
          />
          <div onClick={() => setSearchQuery('')} className={searchBarButtonClass}>
            <CloseIcon />
          </div>
        </div>
      </div>
    </div>
  )
}

const ScoreCount = ({ isSearch, scoreList }: { isSearch: boolean; scoreList: ScoreItem[] | null }) => {
  const title = isSearch ? '該当' : '楽譜'
  return (
    <div className={styles['score-count']}>
      <div>
        <span>{title}</span>
        <span>{scoreList ? scoreList.length : '-'}</span>
        <span>件</span>
      </div>
    </div>
  )
}

const EndLabel = ({
  scoreList,
  isSearch,
  loadMore,
  setLoadMore,
}: {
  scoreList: ScoreItem[]
  isSearch: boolean
  loadMore: boolean
  setLoadMore: (loadMore: boolean) => void
}) => {
  if (scoreList.length > LOAD_MORE && !loadMore) {
    return (
      <div onClick={() => setLoadMore(true)} className={styles['score-more']}>
        <span>すべての楽譜を表示</span>
      </div>
    )
  }
  return (
    <div className={styles['end-label']}>
      {scoreList.length === 0 && !isSearch && 'データはありません'}
      {scoreList.length === 0 && isSearch && 'みつかりませんでした'}
      {scoreList.length !== 0 && (loadMore || isSearch) && 'これ以上データはありません'}
    </div>
  )
}
