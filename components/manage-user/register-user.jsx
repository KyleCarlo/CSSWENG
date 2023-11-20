"use client";
import { useState } from "react";
import {InputGroup, Button, Form} from '@/components/bootstrap';


const Register = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [showPasswordConfirmation, setShowPasswordConfirmation] = useState(false);

    const togglePassword = () => {
        setShowPassword(!showPassword);
    };

    const togglePasswordConfirmation = () => {
        setShowPasswordConfirmation(!showPasswordConfirmation);
    };

    const[data, setData] = useState({});
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        const response = await fetch('/api/manage-user',{
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json'
            }
        });
        if(response.ok){
            window.location.reload();
            alert("User registered successfully");
        }else{
            alert("Failed to register user");
        }
    }

    return (
        <div>
            <div>                
                <h1 style={{ fontWeight: 'bolder', paddingTop: '10px', paddingBottom: '10px' }}>Register New User</h1>
                <Form action="#" onSubmit={handleSubmit}>
                    <div className="row">
                        {/* Username */}
                        <InputGroup className='mb-3'>
                            <InputGroup.Text>
                                <span className="bi bi-person-fill" style={{ borderColor: 'transparent' }}></span>
                            </InputGroup.Text>
                            <Form.Control
                                type="text" 
                                placeholder="Username" required 
                                onChange={(e) => setData({ ...data, username: e.target.value })}
                            />
                        </InputGroup>
                        {/* Password */}
                        <InputGroup className="mb-3">
                            <InputGroup.Text>
                                <span className="bi bi-lock-fill" style={{ borderColor: 'transparent' }}></span>
                            </InputGroup.Text>
                            <Form.Control
                                type={showPassword ? 'text' : 'password'}
                                id="password"
                                placeholder="Password"
                                required
                                onChange={(e) => setData({ ...data, password: e.target.value })}
                            />
                            {/* Hide and Show Password */}
                            <Button
                            variant="light"
                            id="showPasswordButton"
                            onClick={togglePassword}
                            >
                                <span className={`primary-text ${showPassword ? '' : ''}`}>
                                    {showPassword ? 'Hide' : 'Show'}
                                </span>
                            </Button>
                        </InputGroup>
                        {/* Password Confirmation */}
                        <InputGroup className="mb-3">
                            <InputGroup.Text>
                                <span className="bi bi-lock-fill" style={{ borderColor: 'transparent' }}></span>
                            </InputGroup.Text>
                            <Form.Control
                                type={showPasswordConfirmation ? 'text' : 'password'}
                                id="passwordConfirmation"
                                placeholder="Confirm Password"
                                required
                            />
                            {/* Hide and Show Password */}
                            <Button
                            variant="light"
                            id="showPasswordConfirmationButton"
                            onClick={togglePasswordConfirmation}
                            >
                                <span className={`primary-text ${showPasswordConfirmation ? '' : ''}`}>
                                    {showPasswordConfirmation ? 'Hide' : 'Show'}
                                </span>
                            </Button>
                        </InputGroup>

                        {/* Submit Button */}
                        <div className="input-group">
                            <Button variant="primary" type="submit" id="submit" style={{ width: '100%' }}>Create Account</Button>{' '}
                        </div>
                    </div>
                </Form>
            </div>
        </div>
    );
};
export default Register;