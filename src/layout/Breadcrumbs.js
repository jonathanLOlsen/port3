import React from 'react';
import { useLocation, Link } from 'react-router-dom';

const Breadcrumbs = () => {
  const location = useLocation();

  // Split the pathname into segments, excluding the empty string at the start
  const paths = location.pathname.split('/').filter((path) => path);

  return (
    <nav className="breadcrumbs">
      {paths.length === 0 ? (
        <span>Home</span>
      ) : (
        <span>
          <Link to="/">Home</Link>
          {paths.map((path, index) => {
            const fullPath = `/${paths.slice(0, index + 1).join('/')}`;
            return (
              <span key={index}>
                {' / '}
                <Link to={fullPath}>{path.replace(/-/g, ' ')}</Link>
              </span>
            );
          })}
        </span>
      )}
    </nav>
  );
};

export default Breadcrumbs;
