import React from 'react'
import { TbLogout } from "react-icons/tb";

const logout = () => {
  return (
    <div className='logout flex items-center gap-2 absolute '>
      <span>Logout</span>
      <span><TbLogout /></span>
    </div>
  )
}

export default logout
