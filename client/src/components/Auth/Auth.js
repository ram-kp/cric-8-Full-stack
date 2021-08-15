import React, {useState, useEffect} from 'react'
import { Avatar, Paper, Typography, Grid, Button, Container, TextField, Divider } from '@material-ui/core';
import { GoogleLogin } from 'react-google-login';
import {useDispatch} from 'react-redux';
import {useHistory} from 'react-router-dom';

import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Input from './input';
import { signin, signup} from '../../actions/auth';
import useStyles from './styles';
import Icon from './icon';

const initialState = {firstName: '', lastName: '', email: '', password: '', confirmPassword: ''};

const Auth = () => {
	const classes = useStyles();
	const [showPassword, setShowPassword] = useState(false);
	const [isSignup, setIssignup] = useState(false);
	const [formData, setFormData] = useState(initialState);
	const dispatch = useDispatch();
	const history = useHistory();

	const handleShowPassword = () => setShowPassword((prevShowPassword) => !prevShowPassword);

	const handleSubmit = (e) => {
		e.preventDefault();
		console.log(formData);
		if(isSignup){
			dispatch(signup(formData, history));   
		} else {
			dispatch(signin(formData, history));
		}
	}
	const handleChange = (e) => {
		setFormData({ ...formData, [e.target.name]: e.target.value })
	}
	const switchMode = () => {
		setIssignup((prevIsSignup) => !prevIsSignup) ;
		setShowPassword(false);
	}
	const googleSuccess = async (res) => {
		const result = res?.profileObj;
		const token = res?.tokenId;

		try {
			dispatch({ type: 'AUTH', data: {result, token} });

			history.push('/');
		} catch(error){
			console.log(error);
		}
	}
	const googleFailure = () => {
		console.log('Google Sign In was unsuccessful. Try again later')
	}

	return (
		<Container component="main" maxWidth="xs">
			<Paper className={classes.paper} elevation={3}>
				<Avatar className={classes.avatar}>
					<LockOutlinedIcon />
				</Avatar>
				<Typography variant="h5"> { isSignup ? "Sign Up" : "Sign In" } </Typography>
				<form className={classes.form} onSubmit= {handleSubmit}>
					<Grid container spacing={2}>
						{
							isSignup && (
								<>   
									<Input name="firstName" label="First Name" handleChange={handleChange} autoFocus half />
									<Input name="lastName" label="Last Name" handleChange={handleChange}  half/>
								</>
							)
						}
						<Input name="email" label="Email Address" handleChange={handleChange} type="email"/>
						<Input name="password" label ="Password" handleChange={handleChange} type={showPassword? "text" : "password"} handleShowPassword={handleShowPassword} />
						{ isSignup && <Input name="confirmPassword" label="Repeat Password" handleChange={handleChange} type="password" /> }
					</Grid>

					<Button type="submit" fullWidth variant="contained" color ="primary" className={classes.submit} >
						{ isSignup ? 'Sign Up' : 'Sign In' }
					</Button>
					<GoogleLogin
						clientId = '235025116846-mn1l0ocs6vn240spbm36sevrd0ahm5cm.apps.googleusercontent.com'
						render= { (renderProps) => (
							<Button className={classes.googleButton} title="clean browser cache incase auth failed" color="primary" fullWidth onClick={renderProps.onClick} disabled={renderProps.disabled} startIcon={<Icon />} variant="contained">
								Google Sign In
							</Button>	
						)}
						onSuccess = {googleSuccess}
						onFailure = {googleFailure}
						cookiePolicy="single_host_origin"
					/>
					<Grid container justify="flex-end">
						<Button onClick={switchMode} > {isSignup? 'Already have an account? Sign In' : "don't have an account? Sign Up"} </Button>
					</Grid>
				</form>
			</Paper>
		</Container> 
	)
}

export default Auth
