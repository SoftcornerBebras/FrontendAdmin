import React, { useReducer} from "react";
import axios from 'axios';

import {baseURL} from '../pages/constants'

var UserStateContext = React.createContext();
var UserDispatchContext = React.createContext();

function userReducer(state, action) {
  switch (action.type) {
    case "LOGIN_SUCCESS":
      return { ...state, isAuthenticated: true, name:action.payload };
    case "LOGIN_FAILURE":
      {
        return { ...state, isAuthenticated: false };
      }
    case "SIGN_OUT_SUCCESS":
     {
      return { ...state, isAuthenticated: false ,name:""};
     }
    case "Auth Error":
      {
        return { ...state, isAuthenticated: false };
      }
    default: {
      throw new Error(`Unhandled action type: ${action.type}`);
    }
  }
}

function UserProvider({ children }) {
  var [state, dispatch] = React.useReducer(userReducer, {
    isAuthenticated: !!localStorage.getItem("id_token"),
    name: ""
  });

  return (
    <UserStateContext.Provider value={state}>
      <UserDispatchContext.Provider value={dispatch}>
        {children}
      </UserDispatchContext.Provider>
    </UserStateContext.Provider>
  );
}

function useUserState() {
  var context = React.useContext(UserStateContext);
  if (context === undefined) {
    throw new Error("useUserState must be used within a UserProvider");
  }
  return context;
}

function useUserDispatch() {
  var context = React.useContext(UserDispatchContext);
  if (context === undefined) {
    throw new Error("useUserDispatch must be used within a UserProvider");
  }
  return context;
}

export { UserProvider, useUserState, useUserDispatch, loginUser, signOut };

// ###########################################################

function loginUser(dispatch, login, password, history, setIsLoading, setError , setOpenLink) {
  setError(false);

  setIsLoading(true);
  var resStat, token , timer;

    axios.post(baseURL + "api/usr/login/", {loginID: login , password:password},
    {
        headers: {
        'content-type' : 'application/json'
        }
    }
  )
  .then(response => {
  let expiryTime = response.data.expiry/3600

    let today = new Date()
    today.setHours(today.getHours() + expiryTime)

  resStat=response.status;
    token = response.data.token;
    if (token != null) {
        setTimeout(() => {
          localStorage.setItem('id_token', token)
          localStorage.setItem('username',login)
          localStorage.setItem("tokenExpiry",today )
          localStorage.setItem("timeRemaining",0)
          setError(false)
          setIsLoading(false)
          dispatch({ type: 'LOGIN_SUCCESS' , payload:login })
          history.push('/app/dashboard')
        }, 2000);
      }
       if (resStat==200 && token==null){
        setIsLoading(false);
        setOpenLink(true);
      }
  } ).catch(error => {
  setError(true);setIsLoading(false);});

}

function signOut(dispatch, history) {

   fetch(baseURL + "api/usr/logout/", { method:"POST",    headers: {Authorization: 'Token '+localStorage.getItem('id_token')}})
  .then(response => {
    if(response.status == 204)
    {
        return {status: response.status, data: {} };
    }
    else if(response.status<500)
    {
        return response.json().then(data => {
            return {status: response.status, data: {}};
        })
    }
    else
    {
        throw response;
    }
    }).then(response => {
        if(response.status == 204)
        {
            dispatch({ type: "SIGN_OUT_SUCCESS" });
            return response.data;
        }else if(response.status == 403 || response.status == 401)
        {
            dispatch({ type: "Auth Error" });
            throw response.data;
        }
    });

  localStorage.removeItem("id_token");
  localStorage.removeItem("username");
  localStorage.removeItem("tokenExpiry");
}
