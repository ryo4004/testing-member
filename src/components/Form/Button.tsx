import { ButtonHTMLAttributes, forwardRef } from 'react'
import styles from './Button.module.scss'

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & { isLoading?: boolean }

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ type = 'button', isLoading = false, ...props }, ref) => {
    const { children, ...rest } = props
    return (
      <button type={type} className={styles.button} {...rest}>
        {isLoading ? '読み込み中' : children}
      </button>
    )
  }
)
