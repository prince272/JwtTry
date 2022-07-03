import React from 'react';
import { useForm } from "react-hook-form";
import * as Icons from 'react-bootstrap-icons';
import axios from "axios";
import { useAuth } from '../utils/auth';
import toast from 'react-hot-toast';
import { useHistory } from 'react-router-dom';

const LoginComponent = () => {
    const { register, handleSubmit, watch, formState: { errors } } = useForm();
    const auth = useAuth();
    const history = useHistory();

    const onSubmit = async (data) => {
        toast.promise(
            axios.post('/api/authenticate/login', data),
            {
                loading: 'Loading',
                success: (result) => {
                    auth.setAccessToken(result.data.token);
                    console.log(result);
                    history.push('/books');
                    return 'Login successful.';
                },
                error: (error) => {
                    console.error(error);
                    return 'Unable to login.';
                },
            },
        );
    };

    return (
        <>
            <div className="text-center pt-5 mt-5">
                <div className="form-signin w-100 m-auto" style={{ maxWidth: "330px" }}>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="mb-3"><Icons.Book className="text-primary" size={96} /></div>
                        <h1 className="h3 mb-3">Login</h1>
                        <div className="form-floating mb-3">
                            <input defaultValue="admin" {...register("username")} className="form-control" id="usernameInput" />
                            <label htmlFor="usernameInput">Username</label>
                        </div>
                        <div className="form-floating mb-3">
                            <input defaultValue="Admin@1234" {...register("password")} className="form-control" id="passwordInput" />
                            <label htmlFor="passwordInput">Password</label>
                        </div>
                        <button className="w-100 btn btn-lg btn-primary" type="submit">Login</button>
                    </form>
                </div>
            </div>
        </>
    )
};

export default LoginComponent;