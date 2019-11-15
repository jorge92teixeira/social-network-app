import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { addComment } from '../../redux/actions/post';

const CommentForm = ({ postId, addCommentConnect }) => {
  const [text, setText] = useState('');

  const onSubmit = (e) => {
    e.preventDefault();
    addCommentConnect(postId, { text });
    setText('');
  };

  return (
    <div className="post-form">
    <div className="post-form-header bg-primary">
      <h3>Leave a Comment</h3>
    </div>
    <form className="form my-1" onSubmit={(e) => onSubmit(e)}>
      <textarea
        name="text"
        cols="30"
        rows="5"
        placeholder="Create a post"
        value={text}
        onChange={(e) => setText(e.target.value)}
        required
      ></textarea>
      <input type="submit" className="btn btn-dark my-1" value="Submit" />
    </form>
  </div>
  );
};

CommentForm.propTypes = {
  addCommentConnect: PropTypes.func.isRequired,
};

export default connect(
  null,
  { addCommentConnect: addComment },
)(CommentForm);
