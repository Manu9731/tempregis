import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleCheck } from '@fortawesome/free-solid-svg-icons'
import "./thanksMessage.css"

function ThanksMessage({message}) {
  return (
    <div className='thanksmessage-container'>
        <div className='thanks-message'>
            <FontAwesomeIcon icon={faCircleCheck} className='thanks-icon'/>
            <div style={{fontWeight:"bold"}}>Thank You</div>
            <div>{message}</div>
        </div>
    </div>
  )
}

export default ThanksMessage