import { Layout } from '../../../components/Layout'
import { BackToHome } from '../../../components/Navigations'
import { BackLink } from '../../../components/Navigations/BackLink'
import { CreatePost } from '../components/CreatePost'

export const Post = () => {
  return (
    <Layout
      breadList={[
        { path: '/', label: 'ホーム' },
        { path: '/bbs', label: '掲示板' },
        { path: '/bbs/post', label: '書き込む' },
      ]}
      title="書き込む"
    >
      <CreatePost />
      <BackLink path="/bbs" />
      <BackToHome />
    </Layout>
  )
}
