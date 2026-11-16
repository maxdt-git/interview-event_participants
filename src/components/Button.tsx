import type { ButtonHTMLAttributes } from 'react'

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement>

export function Button({ type='button', className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full', ...props }: ButtonProps) {
  return (
    <button
      type={type}
      className={`${className}`}
      {...props}
    />
  )
}
