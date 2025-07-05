import React, {useState} from "react";
import {login} from "../services/api"
import {useNavigate} from "react-router-dom"

const Login = () => {
    const [formData, setFormData] = useState ({
        email: "",
        password: ""
    });

    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({...formData, [e.target.name]: e.target.value})
    }
    const handleSubmit = (e) => {
        e.preventDefault();
        try{
            const res=  login(formData);
            localStorage.setItem("token",res.token);
            navigate("/dashboard");
        } catch (error){
            alert(error.message);
        }
    };

    return (
        <div style={styles.container}>
            <h2>Login</h2>
            <form onSubmit={handleSubmit} style={styles.form}>
                <input name="email" type="email" placeholder="Email" onChange={handleChange} required />
                <input name="password" type="password" placeholder="Password" onChange={handleChange} required />
                <button type="submit">Login</button>
            </form>
            <p>New user? <a href="/signup">Sign up here</a></p>
        </div>
    );
}

const styles = {
    container: {
        maxWidth: "400px",
        margin: "auto",
        padding: "2rem"
    },
    form: {
        display: "flex",
        flexDirection: "column",
        gap: "10px"
    }
};

export default Login;