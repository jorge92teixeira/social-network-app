import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getGitHubRepos } from '../../actions/profile';
import Spinner from '../layout/Spinner';

const ProfileGithub = ({ username, getGitHubReposConnect, repos }) => {
  useEffect(() => {
    getGitHubReposConnect(username);
  }, [getGitHubReposConnect, username]);

  return (
    <div className="profile-github">
      <h2 className="text-primary my-1">Github Repos</h2>
      {repos === null ? <Spinner /> : (
        repos.map((r) => (
          <div key={r.id} className="repo bg-white p-1 my-1">
            <div>
              <h4>
                <a href={r.html_url} target='_blanck' rel='noopener noreferrer'>
                  {r.name}
                </a>
              </h4>
              <p>{r.description}</p>
            </div>
            <div>
              <ul>
                <li className="badge badge-primary">
                  Stars: {r.stargazers_count}
                </li>
                <li className="badge badge-dark">
                  Watchers: {r.watchers_count}
                </li>
                <li className="badge badge-light">
                  Forks: {r.forks_count}
                </li>
              </ul>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

ProfileGithub.propTypes = {
  getGitHubReposConnect: PropTypes.func.isRequired,
  repos: PropTypes.array.isRequired,
  username: PropTypes.string.isRequired,
};

const mapStateToProps = (state) => (
  {
    repos: state.profile.repos,
  }
);

export default connect(
  mapStateToProps,
  { getGitHubReposConnect: getGitHubRepos },
)(ProfileGithub);
