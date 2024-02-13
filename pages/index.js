import { getWordPressProps, WordPressTemplate } from '@faustwp/core';
import { useAuth, getApolloAuthClient } from '@faustwp/core';
import { useQuery, gql } from '@apollo/client';

// ... other imports

function AuthenticatedView() {
  const client = getApolloAuthClient();

  const { data, loading } = useQuery(
    gql`
      {
        viewer {
          posts {
            nodes {
              id
              title
            }
          }
          name
        }
      }
    `,
    { client },
  );

  if (loading) {
    return <>Loading...</>;
  }

  return (
    <>
      <p>Welcome {data?.viewer?.name}!</p>

      <p>My posts</p>

      <ul>
        {data?.viewer?.posts?.nodes.map((post) => (
          <li key={post.id}>{post.title}</li>
        ))}
      </ul>
    </>
  );
}

export default function Page(props) {
  const { isAuthenticated, isReady, loginUrl } = useAuth();

  if (!isReady) {
    return <>Loading...</>;
  }

  if (isAuthenticated === true) {
    // If authenticated, render the AuthenticatedView component
    return <AuthenticatedView />;
  }

  return (
    <>
      <p>Welcome! Please log in to access the content.</p>
      <a href={loginUrl}>Login</a>
    </>
  );
}

export function getStaticProps(ctx) {
  // Include authentication data in the props
  const authProps = useAuth(); // This may not work, and you might need an alternative method to get authentication data during static generation

  return getWordPressProps({ ctx, ...authProps });
}
