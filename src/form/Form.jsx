import React, {useRef, useState, useEffect} from "react";
import "./form.css"
import {useForm} from "react-hook-form"
import axios from "axios"
import "../components/thankyou/ThanksMessage.jsx"
import ThanksMessage from "../components/thankyou/ThanksMessage.jsx";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSpinner } from '@fortawesome/free-solid-svg-icons'

function Form() {

    const [selectedValue, setSelectedValue] = useState(""); 
    const [jiraIntegration, setJiraIntegration] = useState(""); 
    const [emailnotify, setEmailnotify] = useState(""); 
    const [dbValue, setdbValue] = useState(""); 
    const [mongoDBValue, setMongoDBValue] = useState(""); 
    const [thanksMessage, setthanksMessage] = useState(false);
    const [insertInFrame, setinsertInFrame] = useState("")
    const [loading, setloading] = useState(false)
    const {register, control, handleSubmit, formState, reset, setError, clearErrors, resetField} = useForm({})

    const [isHovered, setIsHovered] = useState(false);

    // const addTootltipActionsRef = useRef(null);

    const handleMouseEnter = () => {
        setIsHovered(true); 
        setTimeout(() => {
            setIsHovered(false);
        }, 2000);
        // addTootltipActionsRef.current.classList.add('action-tooltip');
      };
    
      const handleMouseLeave = () => {
        setIsHovered(false);
      };

    
    const {errors} = formState
    const [env, setEnv] = useState([
        { value: '-- Select --', label: '-- Select --' },
        { value: 'DevEnv', label: 'DevEnv' },
        { value: 'QaEnv', label: 'QaEnv' },
        { value: 'ProdEnv', label: 'ProdEnv' },
        { value: 'UatEnv', label: 'UatEnv' },
     
    ])
    // const [jiraoptions, setJiraOptions] = useState([
    //     { value: '-- Select JIRA Connectivity--', label: '-- Select JIRA Connectivity --' },
    //     { value: 'Yes', label: 'Yes' },
    //     { value: 'No', label: 'No' }
    //   ]);
    const [options, setOptions] = useState([
        { value: '-- Select --', label: '-- Select --' },
        { value: 'Yes', label: 'Yes' },
        { value: 'No', label: 'No' }
      ]);

    const [mailService, setMailService] = useState([
        { value: 'gmail', label: 'gmail' }
      ]);

      const [options1, setOptions1] = useState([
        { value: '-- Select --', label: '-- Select --' },
        { value: 'MYSQL', label: 'MYSQL' },
        // { value: 'MS-SQL', label: 'MS-SQL' },
        { value: 'POSTGRES', label: 'POSTGRES' },
        // { value: 'ORACLE', label: 'ORACLE' },
        // { value: 'DB2', label: 'DB2' }
        { value: 'MONGODB', label: 'MONGODB' },
      ]);
    
      useEffect(() => {
        if (thanksMessage) {
            window.scrollTo({
                top: 0,
                behavior: 'smooth',
            });
        }
    }, [thanksMessage]);

      const onSubmit = (data)=>{
        setloading(true);
        axios.post("http://localhost:3110/submit", data)
        .then((res)=>{
            // console.log(res.data)
            setinsertInFrame(res.data)
            setthanksMessage(true)
            setloading(false)
            setTimeout(()=>{
                reset()
                setSelectedValue("")
                setdbValue("")
                setJiraIntegration("")
                setEmailnotify("")
            }, 2000);
    
            setTimeout(()=>{
                setthanksMessage(false)
            }, 2000)

            // if (errors.server) {
            //     clearErrors("server");
            //   }
        })
        .catch((err)=>{
            setloading(false)
            if(err.message === "Network Error"){
                alert("Network Error: Check if the server connection is on.")
                return
            }
            console.log(err.response.data)
            // setError('server', { type: 'manual', message: err.response.data });
            alert(err.response.data)
            setTimeout(()=>{
                reset()
                setSelectedValue("")
                setdbValue("")
                setJiraIntegration("")
                setEmailnotify("")
            }, 2000);
        })
        
     
      }

  return (
    <>
    <form className="form" onSubmit={handleSubmit(onSubmit)} action="">

        {/* <div className='inputcontainer' >
            <input type="text" className="input" name="appenv" id='app-env' placeholder='' {...register("appenv", {
                required:{
                    value:true,
                    message:"App Env was blank. Please enter your App Env!",
                },
                minLength: {
                    value: 9,
                    message: "App Env must be at least 9 characters long",
                },
                maxLength: {
                    value: 30,
                    message: "App Env must not exceed 30 characters",
                },
                // pattern: {
                //     value: /^[^\d]+$/,
                //     message: "appenv cannot contain numbers",
                // },
            })}/>
            <label htmlFor="app-env" className='placeholder'>Application Enviornment</label>
            {errors.appenv?.message&&<p className="error-message p" >{errors.appenv?.message}</p>}
        </div> */}

        <div className='inputcontainer tooltip' onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
            <input type="text" className="input" name="appname" id='app-name' placeholder='' {...register("appname", {
                required:{
                    value:true,
                    message:"App Name was blank. Please enter your App Name!",
                }
            })}/>
            <label htmlFor="app-name" className='placeholder'>Application Name</label>
            {errors.appname?.message&&<p className="error-message p" >{errors.appname?.message}</p>}
            <span className={`tooltiptext ${isHovered ? 'action-tooltip' : ''}`} >Enter the application name here</span>
        </div>

        <div className='inputcontainer tooltip' onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
            <select type="text" className="input" name="env" id='env' placeholder='' {...register("env",{
                required: "This field is required",
                validate: {
                  notEmpty: (value) => {
                    if (value === "-- Select --"){
                        return "Please select an option other than '-- Select --'";
                    }
                  }
                }
              })}>
                {env?.map((option) => (
                    <option key={option.value} value={option.value} style={{color:"#726D7B"}}>
                      {option.label}
                    </option>
                  ))}
              </select>
            <label htmlFor="env" className='placeholder' >Enviornment</label>
            {errors.env?.message&&<p className="error-message p" >{errors.env?.message}</p>}
            <span className={`tooltiptext ${isHovered ? 'action-tooltip' : ''}`} >Select the environment.</span>
        </div>

        <div className='inputcontainer tooltip' onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
            <input type="text" className="input" name="baseurl" id='base-url' placeholder='' {...register("baseurl", {
                required:{
                    value:true,
                    message:"Base Url was blank. Please enter your Base Url!",
                },
            })}/>
            <label htmlFor="base-url" className='placeholder'>Base Url</label>
            {errors.baseurl?.message&&<p className="error-message p" >{errors.baseurl?.message}</p>}
            <span className="tooltiptext action-tooltip">Enter the base URL here.</span>
        </div>

        <div className='inputcontainer tooltip' onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
            <input type="text" className="input" name="basepath" id='base-path' placeholder='' {...register("basepath", {
                required:{
                    value:true,
                    message:"Base Path was blank. Please enter your Base Path!",
                }
            })}/>
            <label htmlFor="base-path" className='placeholder'>Base Path</label>
            {errors.basepath?.message&&<p className="error-message p" >{errors.basepath?.message}</p>}
            {/* {errors.server && <p className="error-message p">{errors.server.message}</p>} */}
            <span className={`tooltiptext ${isHovered ? 'action-tooltip' : ''}`} >Enter the Base Path.</span>
        </div>

        <div className='inputcontainer tooltip' onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
            <input type="text" className="input" name="decryptionkey" id='decryption-key' placeholder='' {...register("decryptionkey", {
                required:{
                    value:true,
                    message:"Decryption key was blank. Please enter your Decryption key!",
                },
                minLength: {
                    value: 3,
                    message: "Decryption key must be at least 3 characters long",
                },
                maxLength: {
                    value: 10,
                    message: "Decryption key must not exceed 10 characters",
                },
            })}/>
            <label htmlFor="decryption-key" className='placeholder'>Decryption key</label>
            {errors.decryptionkey?.message&&<p className="error-message p" >{errors.decryptionkey?.message}</p>}
            <span className={`tooltiptext ${isHovered ? 'action-tooltip' : ''}`} >Enter the Decryption key</span>
        </div>

        <div className='inputcontainer tooltip' onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
            <select type="text" className="input" name="jiraIntegration" id='jira-Integration' placeholder='' {...register("jiraIntegration",{
                required: "This field is required",
                validate: {
                  notEmpty: (value) => {
                    if (value === "-- Select --"){
                        return "Please select an option other than '-- Select --'";
                    }
                  }
                }
              })}  onChange={(event)=>{
                if(event.target.value==="Yes"){
                    setJiraIntegration(event.target.value);
                    // console.log(event.target.value);
                    // alert("PLease enter the DB connection details")
                }else{
                    // console.log(event.target.value);
                    setJiraIntegration(event.target.value);
                    if (event.target.value === "No") {
                        resetField("jirahost");
                        resetField("jiraemail");
                        resetField("jiraapi");
                        setJiraIntegration("")
                      }
                    setJiraIntegration("")
                }
            }} >
            {options?.map((option) => (
                    <option key={option.value} value={option.value} style={{color:"#726D7B"}}>
                      {option.label}
                    </option>
                  ))}
            </select>
            <label htmlFor='jira-connection' className='placeholder'>JIRA Connection</label>
            {errors.jiraIntegration?.message&&<p className="error-message p" >{errors.jiraIntegration?.message}</p>}
            <span className={`tooltiptext ${isHovered ? 'action-tooltip' : ''}`} >Select the JIRA Connection</span>
        </div>

        {jiraIntegration && <>
            <div className="host-email">
                <div className='inputcontainer tooltip' onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
                    <input type="text" className="input" name="jirahost" id='jira-host' placeholder='' {...register("jirahost", {
                    required:{
                        value:true,
                        message:"jira Host was blank. Please enter your jira Host!",
                    }
                })}/>
                    <label htmlFor="jira-host" className='placeholder'>JIRA Host</label>
                    {errors.jirahost?.message&&<p className="error-message p" >{errors.jirahost?.message}</p>}
                    <span className="tooltiptext action-tooltip">Enter the JIRA Host.</span>
                </div>
                <div className='inputcontainer tooltip' onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
                    <input type="text" className="input" name="jiraemail" id='jira-email' placeholder='' {...register("jiraemail", {
                    validate: {
                        required: (value) => value.trim() !== '' || "Jira Email was blank. Please enter your Jira Email!",
                        validEmail: (value) =>
                        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) || "Please enter a valid email address",
                    },
                })}/>
                    <label htmlFor="jira-email" className='placeholder'>JIRA EMAIL</label>
                    {errors.jiraemail?.message&&<p className="error-message p" >{errors.jiraemail?.message}</p>}
                    <span className="tooltiptext action-tooltip">Enter the JIRA EMAIL.</span>
                </div>
            </div>
            <div className='inputcontainer tooltip' onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
                <input type="password" className="input" name="jiraapi" id='jira-api' placeholder='' {...register("jiraapi", {
                required:{
                    value:true,
                    message:"jira Host was blank. Please enter your jira api/password!",
                }
            })}/>
                <label htmlFor="jira-api" className='placeholder'>JIRA API_KEY/Password</label>
                {errors.jiraapi?.message&&<p className="error-message p" >{errors.jiraapi?.message}</p>}
                <span className="tooltiptext action-tooltip">Enter the API_KEY/Password.</span>
            </div>
        </>}


{/* Email Notification ------------------------------------------------------------------------------------------------------------------------------- */}


        <div className='inputcontainer tooltip' onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
            <select type="text" className="input" name="emailnotify" id='email-notify' placeholder='' {...register("emailnotify",{
                required: "This field is required",
                validate: {
                  notEmpty: (value) => {
                    if (value === "-- Select --"){
                        return "Please select an option other than '-- Select --'";
                    }
                  }
                }
              })}  onChange={(event)=>{
                if(event.target.value==="Yes"){
                    setEmailnotify(event.target.value);
                    // console.log(event.target.value);
                    // alert("PLease enter the DB connection details")
                }else{
                    // console.log(event.target.value);
                    setEmailnotify(event.target.value);
                    if (event.target.value === "No") {
                        resetField("emailfrom");
                        resetField("emailpassword");
                        resetField("emailto");
                        setEmailnotify("")
                      }
                      setEmailnotify("")
                }
            }} >
            {options?.map((option) => (
                    <option key={option.value} value={option.value} style={{color:"#726D7B"}}>
                      {option.label}
                    </option>
                  ))}
            </select>
            <label htmlFor='email-connection' className='placeholder'>Email Notification Connection</label>
            {errors.emailnotify?.message&&<p className="error-message p" >{errors.emailnotify?.message}</p>}
            <span className={`tooltiptext ${isHovered ? 'action-tooltip' : ''}`} >Select the Email Notification Connection.</span>
        </div>

        {emailnotify && <>
            <div className="email-pass">
                <div className='inputcontainer tooltip' onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
                    <input type="email" className="input" name="emailfrom" id='email-from' placeholder='' {...register("emailfrom", {
                    validate: {
                        required: (value) => value.trim() !== '' || "The 'From' email was blank. Please enter your email ID!",
                        validEmail: (value) =>
                        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) || "Please enter a valid email address",
                    },
                })}/>
                    <label htmlFor="email-from" className='placeholder'>From Email</label>
                    {errors.emailfrom?.message&&<p className="error-message p" >{errors.emailfrom?.message}</p>}
                    <span className="tooltiptext action-tooltip">Enter the From Email.</span>
                </div>
                <div className='inputcontainer tooltip' onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
                    <input type="password" className="input" name="emailpassword" id='email-password' placeholder='' {...register("emailpassword", {
                    required:{
                        value:true,
                        message:"Password was blank. Please enter your email notification password",
                    }
                })}/>
                    <label htmlFor="email-password" className='placeholder'>Password</label>
                    {errors.emailpassword?.message&&<p className="error-message p" >{errors.emailpassword?.message}</p>}
                    <span className="tooltiptext action-tooltip">Enter the Password.</span>
                </div>
            </div>
            <div className="service-toemail">
                <div className='inputcontainer tooltip' onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
                    <select type="text" className="input" name="mailservice" id='mail-service' placeholder='' {...register("mailservice", {})}>
                    {mailService?.map((option) => (
                            <option key={option.value} value={option.value} style={{color:"#726D7B"}}>
                            {option.label}
                            </option>
                        ))}
                    </select>
                    <label htmlFor='mail-service' className='placeholder'>Service</label>
                    {errors.mailservice?.message&&<p className="error-message p" >{errors.mailservice?.message}</p>}
                    <span className={`tooltiptext ${isHovered ? 'action-tooltip' : ''}`} >Service eg: @gmail.com</span>
                </div>
                <div className='inputcontainer tooltip' onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
                    <input type="email" className="input" name="emailto" id='email-to' placeholder='' {...register("emailto", {
                    validate: {
                        required: (value) => value.trim() !== '' || "The 'To' email was blank. Please enter your email ID!",
                        validEmail: (value) =>
                        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) || "Please enter a valid email address",
                        compareEmails: (value, context) => {
                            if (value === context.emailfrom) {
                              return "To can't be the same as From Email."  // Error message if they match
                            }
                            return true; // Validation passed if they don't match
                          }                          
                    },
                })}/>
                    <label htmlFor="email-to" className='placeholder'>To Email</label>
                    {errors.emailto?.message&&<p className="error-message p" >{errors.emailto?.message}</p>}
                    <span className="tooltiptext action-tooltip">Enter the To Email</span>
                </div>
            </div>
        </>}         

{/* -------------------------------------------------------------------------------------------------------------------------------------------------------- */}

        <div className='inputcontainer tooltip' onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
            <select type="text" className="input" name="dbconnection" id='db-connection' placeholder='' {...register("dbconnection",{
                required: "This field is required",
                validate: {
                  notEmpty: (value) => {
                    if (value === "-- Select --"){
                        return "Please select an option other than '-- Select --'";
                    }
                  }
                }
              })}  onChange={(event)=>{
                if(event.target.value==="Yes"){
                    setSelectedValue(event.target.value);
                    // console.log(event.target.value);
                    // alert("PLease enter the DB connection details")
                }else{
                    // console.log(event.target.value);
                    setSelectedValue(event.target.value);
                    if (event.target.value === "No") {
                        resetField("dbtype");
                        resetField("dbhost");
                        resetField("dbuser");
                        resetField("dbpassword");
                        resetField("dbport");
                        setSelectedValue("")
                        setdbValue("");
                      }
                    setSelectedValue("")
                    setdbValue("")
                }
            }} >
            {options?.map((option) => (
                    <option key={option.value} value={option.value} style={{color:"#726D7B"}}>
                      {option.label}
                    </option>
                  ))}
            </select>
            <label htmlFor='db-connection' className='placeholder'>Database(DB) Connection</label>
            {errors.dbconnection?.message&&<p className="error-message p" >{errors.dbconnection?.message}</p>}
            <span className={`tooltiptext ${isHovered ? 'action-tooltip' : ''}`} >Select the Database(DB) Connection</span>
        </div>

        {selectedValue&&<>
            <div className='inputcontainer' onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
                <select type="text" className="input" name="dbtype" id='db_type' {...register("dbtype",{
                required: "This field is required",
                validate: {
                  notEmpty: (value) => {
                    if (value === "-- Select --"){
                        return "Please select an option other than '-- Select --'";
                    }
                  }
                }
              })} onChange={(event)=>{
                    if(event.target.value==="-- Select --"){
                        setdbValue("")
                    }else if(event.target.value==="MONGODB"){
                        setMongoDBValue(true)
                        resetField("dbpassword");
                        setdbValue(event.target.value)
                    }else{
                        setMongoDBValue(false)
                        setdbValue(event.target.value)
                    }
                }} placeholder=''>
                {options1?.map((option) => (
                        <option key={option.value} value={option.value} style={{color:"#726D7B"}}>
                        {option.label}
                        </option>
                    ))}
                </select>
                <label htmlFor='db_type' className='placeholder'>Database(DB)</label>
                {errors.dbtype?.message&&<p className="error-message p" >{errors.dbtype?.message}</p>}
                {/* <span className={`tooltiptext ${isHovered ? 'action-tooltip' : ''}`} >Select the environment.</span> */}
            </div>
        </>}

        {dbValue&&<>
            <div className="host-user">
                <div className='inputcontainer tooltip' onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
                    <input type="text" className="input" name="dbhost" id='db-host' placeholder='' {...register("dbhost", {
                    required:{
                        value:true,
                        message:"Db Host was blank. Please enter your Db Host!",
                    }
                })}/>
                    <label htmlFor="db-host" className='placeholder'>Database(DB) Host</label>
                    {errors.dbhost?.message&&<p className="error-message p" >{errors.dbhost?.message}</p>}
                    <span className="tooltiptext action-tooltip">Enter the Database(DB) Host.</span>
                </div>

                <div className='inputcontainer tooltip' onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
                    <input type="text" className="input" name="dbuser" id='db-user' placeholder='' {...register("dbuser", {
                    required:{
                        value:true,
                        message:"Db User was blank. Please enter your Db User!",
                    }
                })}/>
                    <label htmlFor="db-user" className='placeholder'>Database(DB) User</label>
                    {errors.dbuser?.message&&<p className="error-message p" >{errors.dbuser?.message}</p>}
                    <span className={`tooltiptext ${isHovered ? 'action-tooltip' : ''}`} >Enter the Database(DB) User</span>
                </div>
            </div>

            <div className="password-port">
                <div className='inputcontainer tooltip' onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
                    <input type="password" className="input" name="dbpassword" id='db-password' placeholder='' disabled={mongoDBValue} {...register("dbpassword", {
                    required:mongoDBValue?false:{
                        value:true,
                        message:"Db Password was blank. Please enter your Db Password!",
                    }
                })}/>
                    <label htmlFor="db-password" className='placeholder'>Database(DB) Password</label>
                    {errors.dbpassword?.message&&<p className="error-message p" >{errors.dbpassword?.message}</p>}
                    <span className={`tooltiptext ${isHovered ? 'action-tooltip' : ''}`} >Enter the Database(DB) Password</span>
                </div>

                <div className='inputcontainer tooltip' onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
                    <input type="text" className="input" name="dbport" id='db-port' placeholder='' {...register("dbport", {
                    required:{
                        value:true,
                        message:"Db-Port was blank. Please enter your Db-Port!",
                    },
                    pattern: {
                        value: /^\d+$/,
                        message: 'Db Port must contain only numbers',
                    },
                })}/>
                    <label htmlFor="db-port" className='placeholder'>Database(DB) Port</label>
                    {errors.dbport?.message&&<p className="error-message p" >{errors.dbport?.message}</p>}
                    <span className={`tooltiptext ${isHovered ? 'action-tooltip' : ''}`} >Enter the Database(DB) Port</span>
                </div>
            </div>
        </>}

        <div className='inputcontainer tooltip' onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
                <input type="text" className="input" name="appversion" id='app-version' placeholder='' {...register("appversion", {
                    required:{
                        value:true,
                        message:"App version was blank. Please enter your App version!",
                    }
                })}/>
                <label htmlFor="app-version" className='placeholder'>App Version</label>
                {errors.appversion?.message&&<p className="error-message p" >{errors.appversion?.message}</p>}
                <span className={`tooltiptext ${isHovered ? 'action-tooltip' : ''}`} >Enter the application Version here</span>
        </div>
        
        <div className="inputcontainer submit" style={{marginTop:"5px"}}>
                <button type="submit" style={{color:"black", backgroundColor:"#775DD8", fontSize:"20px", display:"flex", justifyContent:"center" ,alignItems:"center"}} className="input submitfor-register">
                {!loading && <p style={{color:"white"}}>Submit</p>}
                {loading && <div style={{ display: "flex", alignItems: "center", gap: "10px", color: "white", padding: "10px" }}>
                                    <p style={{ margin: 0 }}>Loading</p>
                                    <FontAwesomeIcon icon={faSpinner} spin style={{ color: "#39FF14", fontSize: "30px" }} />
                            </div>}</button>
        </div>
        
        {thanksMessage&& <ThanksMessage message = {insertInFrame}/>}
        
    </form>
    </>
  )
}

export default Form