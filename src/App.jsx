import './App.css'
import Form from './form/Form'

function App() {


  return (
    <>
      <div className='app'>
        {/* <div className='logo'>
          <img src="./istaffvision.jpeg" alt="" />
        </div> */}
        <div className="headline-container">
          <div className='image-container'>
            <div className="image" />
          </div>
          <h1 className="headline">PAAVANA TEST AUTOMATION</h1>
          <h2 className="sub-headline">APPLICATION REGISTRATION</h2>
        </div>
        <div>
          <Form/>
          <p className='copyright' style={{color:"black"}}>Copyright © "Paavana," a Test Automation Framework Suite from iStaffVision Consulting LLP.</p>
        </div>
      </div>
    </>
  )
}

export default App