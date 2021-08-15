import React, {useState, useEffect} from 'react';
import { useDispatch } from 'react-redux';
import { getPosts, getPostsBySearch } from '../../actions/posts';
import { Paper, Container, Typography, Grow, Grid, AppBar, Button, TextField } from '@material-ui/core';
import { useHistory, useLocation } from 'react-router-dom';
import ChipInput from 'material-ui-chip-input';
import Posts from '../Posts/Posts';
import Form from '../Form/Form';
import Pagination from '../Pagination';
import useStyles from './styles';

function useQuery() {
    return new URLSearchParams(useLocation().search);
}

const Home = () => {
	const [currentId, setCurrentId] = useState(0);
    const dispatch = useDispatch();
    const classes = useStyles();
    const query = useQuery();
    const history = useHistory();
    const page = query.get('page') || 1;
    const searchQuery = query.get('searchQuery');
    const [search, setSearch] = useState('');
    const [tags, setTags] = useState([]);


    const searchPost = () => {
        if(search.trim() || tags) {
            dispatch(getPostsBySearch({ search, tags: tags.join(',') }));
            history.push(`/posts/search?searchQuery=${search || 'none'}&tags=${tags.join(',')}`)
        } else {
            history.push('/');
        }
    }

    const handleKeyPress = (e) => {
        if(e.keyCode == 13){
            searchPost();
        }
    }

    const handleAdd = (tag) => setTags([...tags, tag]);

    const handleDelete = (tagToDelete) => setTags(tags.filter((tag) => tag !== tagToDelete));

	return (
		<Grow in>
                <Container maxWidth = 'xl'>
                    <Grid className={classes.gridContainer} container justify="space-between" alignItems="stretch" spacing={3}>
                        <Grid item xs={12} sm={6} md={9} >
                            <Posts setCurrentId = {setCurrentId} />
                        </Grid>
                        <Grid item xs={12} sm={6} md={3} >
                        <AppBar className={classes.appBarSearch} position = 'static' color = 'inherit' >
                            <TextField name="search" variant="outlined" label="search cricketers" onKeyPress={handleKeyPress} fullWidth value={search} onChange={(e) => setSearch(e.target.value)} /> 
                            <ChipInput style={{ margin: '10px 0' }} title="search with country/nickname tag" value={tags} onAdd={handleAdd} onDelete={handleDelete} label="Search Tags(press Enter)" variant="outlined" />
                            <Button onClick={searchPost} variant="contained" className={classes.searchButton} color="primary" > Search </Button>
                        </AppBar>
                            <Form currentId = {currentId} setCurrentId = {setCurrentId} />
                            {(!searchQuery && !tags.length) && (
                                <Paper elevation={6} className={classes.pagination}>
                                    <Pagination page={page}/>
                                </Paper> 
                            )}
                        </Grid>
                    </Grid>
                </Container>
         </Grow>
	)
}

export default Home;


