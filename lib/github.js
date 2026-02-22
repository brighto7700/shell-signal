const GH_BASE = "https://api.github.com";

// Extract "owner/repo" from a URL like https://github.com/owner/repo
function extractRepo(url) {
  if (!url) return null;
  const match = url.match(/github\.com\/([^/]+\/[^/]+)/);
  return match ? match[1] : null;
}

export async function getRepoHealth(repoPath) {
  const headers = {
    Accept: "application/vnd.github+json",
    ...(process.env.GITHUB_TOKEN && {
      Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
    }),
  };

  try {
    const [repoRes, commitsRes] = await Promise.all([
      fetch(`${GH_BASE}/repos/${repoPath}`, { headers }),
      fetch(`${GH_BASE}/repos/${repoPath}/commits?per_page=1`, { headers }),
    ]);

    if (!repoRes.ok) return null;

    const repo = await repoRes.json();
    const commits = await commitsRes.json();

    const lastCommit = commits?.[0]?.commit?.committer?.date || null;
    const hoursSinceCommit = lastCommit
      ? Math.round((Date.now() - new Date(lastCommit)) / 36e5)
      : null;

    return {
      stars: repo.stargazers_count,
      forks: repo.forks_count,
      openIssues: repo.open_issues_count,
      lastCommit: hoursSinceCommit !== null ? `${hoursSinceCommit}h ago` : "unknown",
      description: repo.description,
    };
  } catch {
    return null;
  }
}

// Enrich stories that link to GitHub repos
export async function enrichWithGitHub(stories) {
  return Promise.all(
    stories.map(async (story) => {
      const repo = extractRepo(story.url);
      if (!repo) return story;
      const health = await getRepoHealth(repo);
      return { ...story, github: health, repoPath: repo };
    })
  );
  }
