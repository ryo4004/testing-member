import clsx from 'clsx'
import { confirmAlert } from 'react-confirm-alert'
import { ContentsBox } from '../../../components/ContentsBox'
import { useAuth } from '../../../library/auth'
import { getClientId } from '../../../utilities/session'
import { getBrowserName } from '../../../utilities/userAgent'
import { ReactComponent as DesktopIcon } from '../../../assets/desktop.svg'
import { ReactComponent as TabletIcon } from '../../../assets/tablet.svg'
import { ReactComponent as MobileIcon } from '../../../assets/mobile.svg'
import { Alert } from '../../../components/Alert/Alert'
import { useDeleteSession } from '../api/deleteSession'
import styles from './SessionList.module.scss'

export const SessionList = () => {
  const { user } = useAuth()
  const deleteSessionMutation = useDeleteSession()

  if (!user) {
    return null
  }

  const deleteSession = (clientId: string) => {
    confirmAlert({
      customUI: ({ onClose }) => (
        <Alert
          title="この端末をログアウトしますか？"
          message="ユーザー情報は端末に残りません。"
          onConfirm={() => deleteSessionMutation.mutate({ clientId })}
          confirmButtonLabel="削除"
          onClose={onClose}
        />
      ),
    })
  }

  return (
    <ContentsBox>
      <div className={styles['session-list']}>
        <div>
          <ol>
            {user.clientList
              .sort((n, m) => (n.lastLogin < m.lastLogin ? 1 : -1))
              .map((clientInfo, index) => {
                if (!clientInfo.agent) {
                  return null
                }
                const selfLabel =
                  clientInfo.id === getClientId() ? <span className={styles.self}>現在の端末</span> : false
                const icon = clientInfo.agent.match(/(iPhone|iPad|iPod|Android)/i) ? (
                  clientInfo.agent.match(/iPad/i) ? (
                    <TabletIcon />
                  ) : (
                    <MobileIcon />
                  )
                ) : (
                  <DesktopIcon />
                )
                const deviceLabel = getBrowserName(clientInfo.agent)
                const listClick = clientInfo.id === getClientId() ? () => {} : () => deleteSession(clientInfo.id)
                return (
                  <li
                    key={'client-' + index}
                    onClick={listClick}
                    className={clsx(
                      { [styles.self]: clientInfo.id === getClientId() },
                      { [styles.other]: clientInfo.id !== getClientId() }
                    )}
                  >
                    <div className={styles.icon}>{icon}</div>
                    <div className={styles.info}>
                      <label>{deviceLabel}</label>
                      {selfLabel}
                      <div className={styles['last-login']}>
                        {clientInfo.id === getClientId()
                          ? '今'
                          : lastLogin(new Date().getTime() - clientInfo.lastLogin)}
                      </div>
                    </div>
                  </li>
                )
              })}
          </ol>
        </div>
      </div>
    </ContentsBox>
  )
}

const lastLogin = (time: number) => {
  if (time / (1000 * 60 * 60 * 24 * 365) >= 1) {
    return Math.round(time / (1000 * 60 * 60 * 24 * 365)) + '年前'
  } else if (time / (1000 * 60 * 60 * 24) >= 1) {
    return Math.round(time / (1000 * 60 * 60 * 24)) + '日前'
  } else if (time / (1000 * 60 * 60) >= 1) {
    return Math.round(time / (1000 * 60 * 60)) + '時間前'
  } else if (time / (1000 * 60) >= 1) {
    return Math.round(time / (1000 * 60)) + '分前'
  } else {
    return Math.round(time / 1000) + '秒前'
  }
}
