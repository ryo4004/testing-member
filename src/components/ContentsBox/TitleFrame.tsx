import type { ReactNode } from 'react'
import clsx from 'clsx'
import { useStyle } from '../../utilities/useStyle'
import styles from './TitleFrame.module.scss'

export const TitleFrame = ({ title, children }: { title: string; children: ReactNode }) => {
  const pc = useStyle()
  return (
    <div className={clsx(styles['title-frame'], styles[pc])}>
      <label className={styles[pc]}>{title}</label>
      {children}
    </div>
  )
}