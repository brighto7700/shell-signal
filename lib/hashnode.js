// lib/hashnode.js

export async function publishToHashnode(title, markdownContent) {
  const HASHNODE_API = 'https://gql.hashnode.com/';
  const token = process.env.HASHNODE_PAT;
  const publicationId = process.env.HASHNODE_PUB_ID;

  if (!token || !publicationId) {
    console.error("> SYSTEM ERROR: Missing Hashnode environment variables.");
    return false;
  }

  const query = `
    mutation PublishPost($input: PublishPostInput!) {
      publishPost(input: $input) {
        post { url }
      }
    }
  `;

  const variables = {
    input: {
      title: title,
      contentMarkdown: markdownContent,
      publicationId: publicationId,
    }
  };

  try {
    const response = await fetch(HASHNODE_API, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token,
      },
      body: JSON.stringify({ query, variables })
    });

    const result = await response.json();
    if (result.errors) throw new Error(result.errors[0].message);
    
    console.log("> SYSTEM: Signal deployed to Hashnode ->", result.data.publishPost.post.url);
    return true;
  } catch (error) {
    console.error("> PIPELINE FAILURE:", error);
    return false;
  }
}
