import React, { useContext, useState } from 'react'
import Button from "@mui/material/Button"

import Instance from '../apis/Instance'
import { AuthContext } from '../contexts'

const getCode = (connection) => {
    const windowFeatures = 'menubar=no, scrollbars=no, status=no, toolbar=no, width=1000,height=580,left=0,top=0'
    const windowURL = `${connection.baseURL}/SASLogon/oauth/authorize?client_id=${connection.client_id}&response_type=code&redirect_uri=${connection.callbackURL}`
    const loginWin = window.open(windowURL, '_blank', windowFeatures)
    const promise = new Promise((resolve, reject) => {
        const interval = setInterval(() => {
            try {
                const check = loginWin.location.search
                if (check !== '') {
                    loginWin.close()
                    clearInterval(interval)
                    connection["code"] = check.substring(1).split("=")[1]
                    resolve(connection)
                }
            }
            catch (err) {
                if (err.name !== "SecurityError") {
                    reject(Error("Authorization Code could not be retrieved"))
                }
            }
        }, 1000)
    })
    return promise
}

const getToken = (connection) => {
    const endpoint = "/SASLogon/oauth/token/"
    const headers = {
        "Accept": "application/json",
        "Content-Type": "application/x-www-form-urlencoded",
        "Authorization": "Basic " + btoa(`${connection.client_id}:${connection.client_secret}`)
    }
    const data = {
        "grant_type": "authorization_code",
        "code": connection.code,
        "redirect_uri": connection.callbackURL
    }
    const promise = new Promise((resolve, reject) => {
        Instance.post(endpoint, new URLSearchParams(data), { headers: headers })
            .then(response => {
                connection['tokenInfo'] = response.data
                resolve(connection)
            })
    })
    return promise
}

const getCurrentUserInfo = () => {
    const endpoint = "/identities/users/@currentUser"
    const promise = new Promise((resolve, reject) => {
        Instance.get(endpoint)
            .then(response => {
                resolve(response.data)
            })
    })
    return promise
}

function Logon() {
    const { authInfo, setAuthInfo } = useContext(AuthContext)
    const [userInfo, setUserInfo] = useState('')
    const connection = {
        client_id: 'gel_app_auth2',
        client_secret: 'gel_secret_auth',
        callbackURL: 'https://localhost:3000/callback',
        baseURL: Instance.defaults.baseURL
    }
    const authenticate = (connection) => {
        getCode(connection)
            .then(response => getToken(response))
            .then(response => {
                setAuthInfo({ ...authInfo, authenticated: true, tokenInfo: response.tokenInfo })
                Instance.defaults.headers.common['Authorization'] = `${response.tokenInfo.token_type} ${response.tokenInfo.access_token}`
                return getCurrentUserInfo()
            })
            .then(response => {
                setUserInfo({ addresses: response.addresses, emailAddresses: response.emailAddresses, name: response.name, provider: response.provider })
            })
    }
    const logonButton = <Button variant="contained" onClick={() => authenticate(connection)} sx={{ bgcolor: "primary.buttonColor" }}> Logon </Button>
    const userInfoButton = <Button variant="contained" sx={{ bgcolor: "primary.buttonColor" }}> {userInfo.name} </Button>
    return (
        authInfo.authenticated ? userInfoButton : logonButton
    )
}

export default Logon