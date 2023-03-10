import { useParams } from 'react-router-dom'
import { Layout } from '../../../components/Layout'
import { BackToHome } from '../../../components/Navigations'
import { BackLink } from '../../../components/Navigations/BackLink'
import { useConcertList } from '../api/getConcertList'
import { VideoList } from '../components/VideoList'

export const Video = () => {
  const { concertId } = useParams()
  const concertListQuery = useConcertList()
  const concertItem = concertListQuery.data?.list.find((item) => item.id === concertId)
  return (
    <Layout
      breadList={[
        { path: '/', label: 'ホーム' },
        { path: '/archive', label: 'アーカイブ' },
        {
          path: `/archive/overview/${concertId}`,
          label: concertItem?.detail.title || '',
          isLoading: concertListQuery.isLoading,
        },
        {
          path: `/archive/video/${concertId}`,
          label: '映像',
          isLoading: concertListQuery.isLoading,
        },
      ]}
      title="アーカイブ"
      subTitle="過去のウィンズの活動履歴を確認できます"
      mobileTitle="映像"
    >
      <VideoList />
      <BackLink path="/archive" label="一覧へ" />
      <BackToHome />
    </Layout>
  )
}
