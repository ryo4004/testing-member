import { Fragment, ReactNode } from 'react'
import { Link } from 'react-router-dom'
import clsx from 'clsx'

import { useStyle } from '../../utilities/useStyle'
import { Header } from './Header'
import { MenuContents } from './MenuContents'
import { ReactComponent as RightIcon } from '../../assets/right.svg'

import styles from './Layout.module.scss'
import { Audio } from '../Audio'

type BreadItem = {
  path: string
  label: string
  isLoading?: boolean
}

type LayoutProps = {
  breadList: BreadItem[]
  title: string
  subTitle?: string | ReactNode
  children: ReactNode
}

export const Layout = (props: LayoutProps) => {
  const pc = useStyle()
  return (
    <div className={styles.auth}>
      <Header />
      <div className={clsx(styles.contents, styles[pc])}>
        <div className={clsx(styles['contents-inner'], styles[pc])}>
          <div className={clsx({ [styles['flex-frame']]: pc === 'pc' })}>
            <NavigationInline />
            <div className={styles[pc === 'pc' ? 'inline-contents' : 'full-contents']}>
              <ContentsLayout {...props} />
            </div>
          </div>
          <Footer />
        </div>
      </div>
      <Audio />
    </div>
  )
}

const NavigationInline = () => {
  const pc = useStyle()
  if (pc === 'mobile') {
    return null
  }
  return (
    <div className={styles['menu-contents-inline']}>
      <MenuContents />
    </div>
  )
}

const ContentsLayout = ({ breadList, title, subTitle, children }: LayoutProps) => {
  const pc = useStyle()
  return (
    <div className={clsx(styles['contents-layout'], styles[pc])}>
      <div className={clsx(styles['contents-header'], styles[pc])}>
        <div className={styles['bread-navigation']}>
          {breadList.map((breadItem, index, array) => {
            return (
              <Fragment key={index}>
                {breadItem.isLoading && <>読み込み中</>}
                {!breadItem.isLoading && <Link to={breadItem.path}>{breadItem.label}</Link>}
                {array.length - 1 !== index && (
                  <div className={styles.icon}>
                    <RightIcon />
                  </div>
                )}
              </Fragment>
            )
          })}
        </div>
        <h2>{title}</h2>
        {subTitle && typeof subTitle === 'string' && <p>{subTitle}</p>}
        {subTitle && typeof subTitle !== 'string' && subTitle}
      </div>
      {children}
    </div>
  )
}

const Footer = () => (
  <footer>
    <small>&copy; The Wind Ensemble</small>
  </footer>
)
