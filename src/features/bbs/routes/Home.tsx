import { Layout } from '../../../components/Layout'
import { PostList } from '../components/PostList'

export const Home = () => {
  return (
    <Layout
      breadList={[
        { path: '/', label: 'ホーム' },
        { path: '/bbs', label: '掲示板' },
      ]}
      title="会員専用掲示板"
    >
      <PostList />
    </Layout>
  )
}
