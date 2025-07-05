import React, { useState } from "react";
import { signup } from "../services/api";
import { useNavigate } from "react-router-dom";

const Signup = () => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        leetcodeUsername: ""
    })

    const navigate = useNavigate();

    const handleChange = (e) =>
        setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await signup(formData);
            alert("✅ Sign up successful!");
            navigate("/login");
        } catch (error) {
            alert(error.message);
        }
    };

    return (
        <div style={styles.container}>
            <h2>Leetcode Tracker - Sign Up</h2>
            <form onSubmit={handleSubmit} style={styles.form}>
                <input name="name" placeholder="Name" onChange={handleChange} required />
                <input name="email" type="email" placeholder="Email" onChange={handleChange} required />
                <input name="password" type="password" placeholder="Password" onChange={handleChange} required />
                <input name="leetcodeUsername" placeholder="LeetCode username" onChange={handleChange} required />
                <button type="submit">Sign Up</button>
            </form>
            <p>Already have an account? <a href="/login">Login Here</a></p>
        </div>
    );
};

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

export default Signup;