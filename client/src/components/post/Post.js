import React, { Fragment, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import Spinner from '../layout/Spinner';
import { getPost } from '../../actions/post';
import PostItem from '../posts/PostItem';
import CommentForm from './CommentForm';
import CommentItem from './CommentItem';

const Post = ({ getPostConnect, post, match }) => {
  useEffect(() => {
    getPostConnect(match.params.id);
  }, [getPostConnect, match.params.id]);

  return post.loading || post.post === null ? <Spinner /> : <Fragment>
    <Link to='/posts' className="btn">Back to Posts</Link>
    <PostItem post={post.post} showActions={false}/>
    <CommentForm postId={post.post._id} />
    <div className="posts">
      {post.post.comments.map((c) => (
        <CommentItem key={c._id} comment={c} postId={post.post._id}/>
      ))}
    </div>
  </Fragment>;
};

Post.propTypes = {
  getPostConnect: PropTypes.func.isRequired,
  post: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => (
  {
    post: state.post,
  }
);

export default connect(
  mapStateToProps,
  { getPostConnect: getPost },
)(Post);
