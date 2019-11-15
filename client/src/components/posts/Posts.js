import React, { Fragment, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getPosts } from '../../redux/actions/post';
import Spinner from '../layout/Spinner';
import PostItem from './PostItem';
import PostForm from './PostForm';

const Post = ({ getPostsConnect, post }) => {
  useEffect(() => {
    getPostsConnect();
  }, [getPostsConnect]);
  return post.loading ? <Spinner /> : (
    <Fragment>
      <h1 className="large text-primary">Posts</h1>
      <p className="lead">
        <i className="fas fa-user"></i>
        Welcome to the community
      </p>
      <PostForm />
      <div className="posts">
        {
          post.posts.map((p) => (
            <PostItem key={p._id} post={p} />
          ))
        }
      </div>
    </Fragment>
  );
};

Post.propTypes = {
  getPostsConnect: PropTypes.func.isRequired,
  post: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => (
  {
    post: state.post,
  }
);

export default connect(
  mapStateToProps,
  { getPostsConnect: getPosts },
)(Post);
