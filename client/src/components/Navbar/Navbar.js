import React, {useState, useEffect} from 'react';
import { Avatar, AppBar, Typography, Toolbar, Button } from '@material-ui/core';
import { Link, useHistory, useLocation } from 'react-router-dom';
import {useDispatch} from 'react-redux';
import decode from 'jwt-decode';

import useStyles from './styles';
import cricLogo1 from '../../images/cricketText.png';
import cricLogo2 from '../../images/test1.png';


const Navbar = () => {
	const classes = useStyles();
	const [user, setUser] = useState(JSON.parse(localStorage.getItem('profile') ));
	const dispatch = useDispatch();
	const history = useHistory();
	const location = useLocation();
	const logOut = () => {
		dispatch({type: 'LOGOUT'});

		history.push('/auth');
		setUser(null); 
	}

	useEffect(() => {
		const token = user?.token;

		if(token){
			const decodedToken = decode(token);
			if(decodedToken.exp * 1000 < new Date().getTime()) logOut();
		}

		setUser(JSON.parse(localStorage.getItem('profile') ));
	}, [location]);
	return (
		<AppBar className={classes.appBar} position="static" color="inherit" >
        <Link to='/' className={classes.brandContainer} style={{display: 'table'}} >
        	<div style={{display: 'table-row'}}>
            <img component={Link} to='/' src={cricLogo1}  alt="icon" height="60px" width = '270px' />
        	<img className={classes.image}src={cricLogo2} alt="applogo" height="75px" width="170" />
        	</div>
        </Link>
        <Toolbar className={ classes.toolbar }>
        	{ user?.result ? ( //ch
        		<div className={ classes.profile }>
        			<Avatar className={classes.purple} alt={user.result.name} src={user.result.imageUrl} > {user.result.name.charAt(0)}  </Avatar>
        			<Typography className={classes.userName} variant="h6"> { user.result.name } </Typography>
        			<Button variant="contained" className={classes.logout} color = 'secondary' onClick={logOut} > Logout </Button>
        		</div>
        	):(
        		<Button component={Link} to="/auth" variant="contained" color="primary"> Signin </Button>
        	)}
        </Toolbar>
        </AppBar>
	)
}

export default Navbar;