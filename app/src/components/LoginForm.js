import React, { useState } from 'react'
import Togglable from './Togglable.js'
import loginService from '../services/login'
import noteService from '../services/notes'
import Notification from './Notification'

export default function LoginForm ({ handleChangeUser }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
  
    try {
      const user = await loginService.login({
        username,
        password
      });
  
      window.localStorage.setItem(
        'loggedNoteAppUser', JSON.stringify(user)
      )
  
      noteService.setToken(user.token)
  
      handleChangeUser(user);
      setUsername('')
      setPassword('')
    } catch(e) {
      setErrorMessage('Wrong credentials')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  return (
    <Togglable buttonLabel='Show Login'>
      <Notification message={errorMessage} />
      <form onSubmit={handleSubmit}>
        <div>
          <input
            type='text'
            value={username}
            name='Username'
            placeholder='Username'
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div>
          <input
            type='password'
            value={password}
            name='Password'
            placeholder='Password'
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button id='form-login-button'>
          Login
        </button>
      </form>
    </Togglable>
  )
}