import React from 'react';
import {
  TextField,
  Button,
  ImageList,
  ImageListItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Typography
} from '@mui/material';
import { Link } from 'react-router-dom';
import './userPhotos.css';
// import fetchModel from "../../lib/fetchModelData";
import axios from 'axios'; 

/**
 * Define UserPhotos, a React componment of project #5
 */
class UserPhotos extends React.Component {
  constructor(props) {
      super(props);
      this.state = {
          userId: undefined,
          userPhotosDetails: undefined,
          new_comment: undefined,
          add_comment: false,
          current_photo_id: undefined
      };
      this.handleCancelAddComment = this.handleCancelAddComment.bind(this);
      this.handleSubmitAddComment = this.handleSubmitAddComment.bind(this);
  }

  componentDidMount() {
    const new_user_id = this.props.match.params.userId;
    this.handleUserChange(new_user_id);
}

componentDidUpdate() {
  const new_user_id = this.props.match.params.userId;
  const current_user_id = this.state.userId;
  if (current_user_id  !== new_user_id){
      this.handleUserChange(new_user_id);
  }
}

handleUserChange(user_id){
  axios.get("/photosOfUser/" + user_id)
      .then((response) =>
      {
          this.setState({
              userId : user_id,
              userPhotosDetails: response.data
          });
      });
  axios.get("/user/" + user_id)
      .then((response) =>
      {
          const new_user = response.data;
          const main_content = "User Photos for " + new_user.first_name + " " + new_user.last_name;
          this.props.changeTopbarContent(main_content);
      })
      .catch(() =>
            {
                console.log('catch2');
            });
}

handleNewCommentChange = (event) => {
  this.setState({
      new_comment: event.target.value
  });
};

handleShowAddComment = (event) => {
  const photo_id = event.target.attributes.photo_id.value;
  this.setState({
      add_comment: true,
      current_photo_id: photo_id
  });
};

handleCancelAddComment = () => {
  this.setState({
      add_comment: false,
      new_comment: undefined,
      current_photo_id: undefined
  });
};

handleSubmitAddComment = () => {
  const currentState = JSON.stringify({comment: this.state.new_comment});
  const photo_id = this.state.current_photo_id;
  const user_id = this.state.userId;
  axios.post("/commentsOfPhoto/" + photo_id,
      currentState,
      {
          headers: {
              'Content-Type': 'application/json',
          }
      })
      .then(() =>
      {
          this.setState({
              add_comment : false,
              new_comment: undefined,
              current_photo_id: undefined
          });
          axios.get("/photosOfUser/" + user_id)
              .then((response1) =>
              {
                  this.setState({
                    userPhotosDetails: response1.data
                  });
              });
      })
      .catch( error => {
          console.log(error);
      });
};

  render() {

    const {userId, userPhotosDetails } = this.state;
    return userId ? (
    <div>
        <div>
        <Button
          variant="contained"
          size="medium"
          component={Link}
          to={`/users/${userId}`}
          className="button"
        >
          USER DETAIL
        </Button>
        </div>
        <ImageList variant="masonry" cols={1} gap={8}>
                    {this.state.userPhotosDetails ? userPhotosDetails.map((item) => (
                        <div key={item._id}>
                            <TextField label="Photo Date" variant="outlined" disabled fullWidth margin="normal"
                                       value={item.date_time} />
                            <ImageListItem key={item.file_name}>
                                <img
                                    src={`images/${item.file_name}?w=164&h=164&fit=crop&auto=format&dpr=2 2x`}
                                    srcSet={`images/${item.file_name}?w=164&h=164&fit=crop&auto=format`}
                                    alt={item.file_name}
                                    loading="lazy"
                                />
                            </ImageListItem>
                            <div>
                            {item.comments ?
                                item.comments.map((comment) => (
                                    <div key={comment._id}>
                                        <TextField label="Comment Date" variant="outlined" disabled fullWidth
                                                   margin="normal" value={comment.date_time} />
                                        <TextField label="User" disabled variant="outlined" fullWidth
                                        value={comment.user.first_name + " " + comment.user.last_name}
                                                   margin="normal"
                                                   component={Link} to={`/users/${comment._id}`}>
                                        </TextField>
                                        <TextField label="Comment" variant="outlined" disabled fullWidth
                                                   margin="normal" multiline rows={4} value={comment.comment} 
                                                   />
                                    </div>
                                ))
                                : (
                                    <div>
                                        <Typography>No Comments</Typography>
                                    </div>
                                )}
                                <Button photo_id={item._id} variant="contained" onClick={this.handleShowAddComment}>
                                    Add Comment
                                </Button>
                            </div>
                        </div>
                    )) : (
                        <div>
                            <Typography>No Photos</Typography>
                        </div>
                    )}
        </ImageList>
                <Dialog open={this.state.add_comment}>
                    <DialogTitle>Add Comment</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Enter New Comment for Photo
                        </DialogContentText>
                        <TextField
                            autoFocus
                            margin="dense"
                            id="comment"
                            label="Comment"
                            multiline rows={4}
                            fullWidth
                            variant="standard"
                            onChange={this.handleNewCommentChange}
                            defaultValue={this.state.new_comment}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => {this.handleCancelAddComment();}}>Cancel</Button>
                        <Button onClick={() => {this.handleSubmitAddComment();}}>Add</Button>
                    </DialogActions>
                </Dialog>
    </div>
        ) : (
            <div/>
        );
    }
}
export default UserPhotos;


