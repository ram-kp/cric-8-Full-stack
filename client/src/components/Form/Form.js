import React, { useState, useEffect } from 'react';
import { TextField, Button, Typography, Paper } from '@material-ui/core';
import FileBase from 'react-file-base64';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom'; 

import useStyles from './styles';
import { createPost, updatePost } from '../../actions/posts';


const Form = ({ currentId, setCurrentId }) =>{
	const [postData, setPostData] = useState({ FullName: '', Role: '', About: '', Nickname: '', Nationality: '', selectedFile: '' });
	const post = useSelector((state) => (currentId ? state.posts.posts.find((p) => p._id === currentId) : null));
	
	const classes = useStyles();
	const user = JSON.parse(localStorage.getItem('profile'));
	const dispatch = useDispatch();
	const history = useHistory(); 

	useEffect(() => {
		if(post) setPostData(post);
	}, [post])

	const clear = () => {
		setCurrentId(null);
		setPostData({ FullName: '', Role: '', About: '', Nickname: '', Nationality: '', selectedFile: '' });
	}

	const handleSubmit = (e) => {
		e.preventDefault();
		//console.log(currentId);
		if(currentId === 0){ 
			dispatch(createPost({...postData, name: user?.result?.name  }, history));  // ch
			clear();
		} else {
			dispatch(updatePost(currentId, {...postData, name: user?.result?.name  }));
			clear();
		}
		
		
	}

	if(!(user?.result?.name)){
		return(
			<Paper className={classes.paper}>
				<Typography variant="h6" align="center">
					please Sign In to Add your favourite cricketers and rate them.
				</Typography>
			</Paper>
		)
	}

	return (
		<Paper className={classes.paper}>
			<form autoComplete="off" noValidate elevation={6} className={`${classes.form} ${classes}`} onSubmit={handleSubmit}>
				<Typography variant="h6"> {currentId ? 'Edit' : 'Add'} your FAV cricketer </Typography>
				<TextField name="FullName" variant="outlined" label="FullName" fullWidth value={postData.FullName} onChange={(e)=> setPostData({ ...postData, FullName: e.target.value })}/>
				<TextField name="Role" variant="outlined" label="Role" fullWidth value={postData.Role} onChange={(e)=> setPostData({ ...postData, Role: e.target.value })}/>
				<TextField name="About" variant="outlined" label="About" fullWidth multiline rows={4} value={postData.About} onChange={(e)=> setPostData({ ...postData, About: e.target.value })}/>
				<TextField name="Nickname" variant="outlined" label="tags(seperated by comas)" fullWidth value={postData.Nickname} onChange={(e)=> setPostData({ ...postData, Nickname: e.target.value.split(',') })}/>
				<TextField name="Nationality" variant="outlined" label="Description" fullWidth value={postData.Nationality} onChange={(e)=> setPostData({ ...postData, Nationality: e.target.value })}/>
				<div className={classes.fileInput}><FileBase type= "file" multiple={false} onDone={({base64}) => setPostData({ ...postData, selectedFile:base64}) } /> </div>
				<Button className={classes.buttonSubmit} variant="contained" color="primary" size="large" type="submit" fullWidth> Submit </Button>
				<Button variant="contained" color="secondary" size="small" onClick={clear} fullWidth> Clear </Button>
			</form>
		</Paper>
	);
}

export default Form;