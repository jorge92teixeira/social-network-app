import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import moment from 'moment';
import { deleteComment } from '../../actions/post';

const CommentItem = ({
  postId,
  comment,
  auth,
  deleteCommentConnect,
}) => (
  <div className="post bg-white p-1 my-1">
    <div>
      <Link to={`/profile/${comment.user}`}>
        <img className="round-img" src={comment.avatar} alt=""/>
        <h4>{comment.name}</h4>
      </Link>
    </div>
    <div>
      <p className="my-1">{comment.text}</p>
        <p className="post-date">
          Posted on {moment(comment.date).format('YYYY/MM/DD')}
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
  postId: PropTypes.string.isRequired,
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
