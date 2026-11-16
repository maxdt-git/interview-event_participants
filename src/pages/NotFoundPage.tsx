import { Link } from 'react-router'

function NotFoundPage() {
    return (
      <div>
       <p className='text-xs font-bold uppercase text-primary'>Error 404</p>
        <h1 className='mt-2 font-display text-4xl font-extrabold text-foreground'>Page not found</h1>
        <Link to='/' className='mt-4 inline-block text-primary hover:underline'>
          ← Back to events
        </Link>
      </div>
    )
}

export default NotFoundPage
