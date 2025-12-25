import {Navigate} from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Loader from './Loader';

function ProtectedRoute({children}){

    //Used to check authentication status using local storage like this before:- 
    // const token = localStorage.getItem('token');
    // if(!token){
    //     return <Navigate to="/" />;
    // }
    // return children;

    //Using Context API-
    const { isAuthenticated, loading } = useAuth();

    if(loading) return <Loader />;

    return isAuthenticated ? children : <Navigate to="/" />;
}

export default ProtectedRoute;