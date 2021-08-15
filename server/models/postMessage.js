import mongoose from 'mongoose';

const postSchema = mongoose.Schema( {
	name : String,
	creator: String,
	FullName: String,
	Role: String,
	About: String,
	Nickname: [String],
	Nationality: String,
	selectedFile: String, 
	likes: {
		type: [String],
		default: []
	},
	createdAt: {
		type: Date,
		default: new Date()
	}
} )

const PostMessage = mongoose.model('PostMessage', postSchema);

export default PostMessage;