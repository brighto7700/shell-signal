const HN_BASE = "https://hacker-news.firebaseio.com/v0";

export async function getTopStories(limit = 30) {
  const res = await fetch(`${HN_BASE}/topstories.json`);
  const ids = await res.json();
  const top = ids.slice(0, limit);

  const stories = await Promise.all(
    top.map((id) =>
      fetch(`${HN_BASE}/item/${id}.json`).then((r) => r.json())
    )
  );

  return stories
    .filter((s) => s && s.title && s.url)
    .map((s) => ({
      id: s.id,
      title: s.title,
      url: s.url,
      score: s.score,
      by: s.by,
      time: s.time,
      descendants: s.descendants || 0,
      hnUrl: `https://news.ycombinator.com/item?id=${s.id}`,
    }));
                                                     }
