import React from 'react'
import Link from 'next/link'
import Editor from './documents/editor'

const Home = () => {
  return (
    <div>
      Click  
        <Link href="/documents/78" className='text-blue-500'> here</Link> 
        <Editor />
    </div>
  )
}

export default Home