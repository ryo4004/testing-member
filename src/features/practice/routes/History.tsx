import { Layout } from '../../../components/Layout'
import { BackToHome } from '../../../components/Navigations'
import { BackLink } from '../../../components/Navigations/BackLink'
import { HistoryList } from '../components/HistoryList'

export const History = () => {
  return (
    <Layout
      breadList={[
        { path: '/', label: 'ホーム' },
        { path: '/practice', label: '練習について' },
        { path: '/practice/history', label: '練習の記録' },
      ]}
      title="練習の記録"
      subTitle={
        <>
          <p>練習の録音を掲載しています</p>
          <p>合奏前から録音しているため適宜早送りしてご利用ください</p>
        </>
      }
    >
      <HistoryList />
      <BackLink path="/practice" />
      <BackToHome />
    </Layout>
  )
}
