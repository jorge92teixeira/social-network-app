import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import Moment from 'react-moment';
import { deleteComment } from '../../actions/post';

const CommentItem = ({
  postId,
  comment,
  auth,
  deleteCommentConnect,
}) => (
  <div class="post bg-white p-1 my-1">
    <div>
      <Link to={`/profile/${comment.user}`}>
        <img class="round-img" src={comment.avatar} alt=""/>
        <h4>{comment.name}</h4>
      </Link>
    </div>
    <div>
      <p class="my-1">{comment.text}</p>
        <p class="post-date">
          Posted on <Moment format="YYYY/MM/DD">{comment.date}</Moment>
      </p>
    {!auth.loading && comment.user === auth.user._id && (
      <button
        onClick={() => deleteCommentConnect(postId, comment._id)}
        type="button"
        className="btn btn-danger"
      >
        <i className="fas fa-times"></i>
      </button>
    )}
    </div>
  </div>
);

CommentItem.propTypes = {
  postId: PropTypes.number.isRequired,
  comment: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
  deleteCommentConnect: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(
  mapStateToProps,
  { deleteCommentConnect: deleteComment },
)(CommentItem);
