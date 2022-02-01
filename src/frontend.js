import "./frontend.scss"
import React, { useState, useEffect } from "react"
import ReactDOM from "react-dom"
import axios from 'axios';
import clientConfig from "./config";


const divsToUpdate = document.querySelectorAll(".boilerplate-update-me")

divsToUpdate.forEach(div => {
  const data = JSON.parse(div.querySelector("pre").innerText)
  ReactDOM.render(<WishingTree {...data} />, div)
  div.classList.remove("boilerplate-update-me")
})

function WishingTree(props) {
  const [saveWish, setSaveWish] = useState(undefined)
  const [title, setTitle] = useState('')
  const [wish, setWish] = useState('')
  const [email, setEmail] = useState('')
  const [token, setToken] = useState('')
  const [message, setMessage] = useState('')

  useEffect(() => {
    const loginData = {
      username: clientConfig.user,
      password: clientConfig.pass
    }
    axios.post(`${props.url}/wp-json/jwt-auth/v1/token`, loginData)
      .then(res => {
        console.log(res.data)
        setToken(res.data.token)
      })
      .catch(err => {
        console.log(err.response.data)
      })
  },[])


  const handleSubmit = (event) => {
    event.preventDefault()
    if (!saveWish) {
      const data = {
        title: title,
        content: wish,
        email: email
      }
      axios.post(
        `${props.url}/wp-json/wishing-tree/v1/save-wish`, data,
         {
           headers: {
            'Content-type': 'application/json',
            'Authorization': `Bearer ${token}`
           }
         }) 
        .then (res => {
          console.log(res)
          setSaveWish(true)
        })
        .catch( err => console.log(err))
      
    } else {
      setMessage("You already submitted your wish!")
    }
  } 

  return (
    <div className="boilerplate-frontend">
      <form onSubmit={handleSubmit}>

      <div className="container-title" >
              <h1 className="title" ><strong>Make Your Wish Come True</strong></h1>
      </div>
      <div className={(saveWish == true ? "tree-animation" : "tree")}></div>
      <p>
           <h1 className="title"><strong>Watch it land on the Wishing Tree</strong></h1>
      </p>
          <p className="error-message container-title"><h1>{message}</h1></p>
      <p>
        <input type="text" placeholder="Type Title of your wish..." required disabled={saveWish} onChange={(e) => setTitle(e.target.value)}/>
      </p>
      <p>
        <textarea placeholder="Type your wish..." required rows="4" disabled={saveWish} onChange={(e) => setWish(e.target.value)} /> 
      </p>
      <p>
        <input type="email" placeholder="Type your email (optional)..." disabled={saveWish} onChange={(e) => setEmail(e.target.value)} />
      </p>
      <p className="buttonAlign">
        <button className="fontButton" type="submit">Put your wish on the tree</button>
      </p>
      </form>
    </div>
  )
}
