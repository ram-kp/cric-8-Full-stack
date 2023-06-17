import mongoose from 'mongoose';
import PostMessage from '../models/postMessage.js';
export const getPosts = async (req, res) => {
	const { page } = req.query;
	try{
		const LIMIT = 8;
		const startIndex = (Number(page)-1)*LIMIT;
		const total = await PostMessage.countDocuments({});

		const posts = await PostMessage.find().sort({_id: -1}).limit(LIMIT).skip(startIndex) ;
		//console.log(postMessages);

		res.status(200).json({data: posts, currentPage: Number(page), numberOfPages: Math.ceil(total/LIMIT) });
	} catch(error){
		res.status(404).json({message: error.message});
	}
};

export const getPostsBySearch = async (req, res) => {
	const { searchQuery, tags } = req.query; 

	try {
		const FullName = new RegExp(searchQuery, 'i');
		
		const posts = await PostMessage.find({$or: [ {FullName}, {Nickname: {$in: tags.split(',')}} ]})
		
		res.json( { data: posts } ); 
	} catch(e) {
		res.status(404).json({message: error.message});
	}
}

export const getPost = async (req, res) => {
	const { id } = req.params;
	try{
		const post = await PostMessage.findById(id);

		res.status(200).json(post);
	} catch(error){
		res.status(404).json({message: error.message});
	}
};

export const createPost = async (req, res) => {
	const post = req.body;
	//console.log(req)
	const newPostMessage = new PostMessage({...post, creator: req.userId, createdAt: new Date().toString() });
	try{
		await newPostMessage.save();

		res.status(201).json(newPostMessage);
	} catch(error){
		res.status(409).json({message: error.message})
	}
}

export const updatePost = async (req, res) => {
	const {id: _id} = req.params;
	const post = req.body;
	//console.log("i reached server");
	if (!mongoose.Types.ObjectId.isValid(_id)) return res.status(404).send("No post with that id");
	const updatedPost = await PostMessage.findByIdAndUpdate(_id, { ...post, _id }, {new: true});
	res.json(updatedPost);
	
}

export const deletePost = async (req, res) => {
	const { id } = req.params;
	if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send("No post with that id");
	await PostMessage.findByIdAndRemove(id);
	res.json({ message : "Post deleted succesfully"});
}

export const likePost = async (req, res) => {
	const { id } = req.params;

	if(!req.userId) return res.json({message: 'Unauthenticated'});
	if(!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send("No post with that id");

	const post = await PostMessage.findById(id);

	const index = post.likes.findIndex((id) => id === String(req.userId));
	
	if(index === -1){
		post.likes.push(req.userId);
	} else {
		post.likes = post.likes.filter((id) => id !== String(req.userId));
	}
	const updatedPost = await PostMessage.findByIdAndUpdate(id, post, { new: true });

	res.json(updatedPost);
}


