import {useCallback, useEffect, useState} from "react";
import {decode} from 'jsonwebtoken';

export const useAuth = () => {

    const [token, setToken] = useState(false);
    const [tokenExpirationDate, setTokenExpirationDate] = useState();
    const [userId, setUserId] = useState();

    const login = useCallback((uid, token, expirationDate) => {
        setToken(token);
        const tokenInfo = decode(token, process.env.REACT_APP_JWT_KEY);
        const tokenExpirationDate = expirationDate || new Date(tokenInfo.exp * 1000) || new Date(new Date().getTime() + 1000 * 60 * 60);
        setTokenExpirationDate(tokenExpirationDate);
        localStorage.setItem('userData', JSON.stringify({
            userId: uid,
            token: token,
            expiration: tokenExpirationDate.toISOString()
        }));
        setUserId(uid);
    }, []);

    const logout = useCallback(() => {
        setToken(null);
        localStorage.setItem('userData', JSON.stringify({userId: null, token: null}));
        setUserId(null);
    }, []);

    useEffect(() => {
        const storedData = JSON.parse(localStorage.getItem('userData'));
        if (storedData && storedData.token && new Date(storedData.expiration) > new Date()) {
            login(storedData.userId, storedData.token, new Date(storedData.expiration));
        }
    }, [login]);

    useEffect(() => {
        if (token && tokenExpirationDate) {
            const remainingTime = tokenExpirationDate.getTime() - new Date().getTime();
            setTimeout(logout, remainingTime);
        } else {
            clearTimeout();
        }
    }, [token, logout, tokenExpirationDate]);

    return {token, userId, login, logout};
};