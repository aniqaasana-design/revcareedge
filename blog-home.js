(function () {
  const grid = document.getElementById('homeBlogGrid');
  if (!grid || !window.RevCareBlog) return;

  function render() {
    const posts = window.RevCareBlog.getPosts().slice(0, 3);
    grid.innerHTML = posts.map(post => {
      const image = post.coverImage
        ? `<img src="${window.RevCareBlog.escapeHtml(post.coverImage)}" alt="${window.RevCareBlog.escapeHtml(post.title)}" loading="lazy">`
        : `<div class="blog-cover-fallback"><iconify-icon icon="fa6-solid:newspaper"></iconify-icon></div>`;
      return `
        <article class="blog-card">
          <a class="blog-cover" href="blog-post.html?slug=${encodeURIComponent(post.slug)}">${image}</a>
          <div class="blog-card-body">
            <div class="blog-card-meta">
              <span>${window.RevCareBlog.escapeHtml(post.category)}</span>
              <span>${window.RevCareBlog.formatDate(post.date)}</span>
            </div>
            <h3 class="blog-card-title"><a href="blog-post.html?slug=${encodeURIComponent(post.slug)}">${window.RevCareBlog.escapeHtml(post.title)}</a></h3>
            <p>${window.RevCareBlog.escapeHtml(post.excerpt)}</p>
            <a class="blog-read-link" href="blog-post.html?slug=${encodeURIComponent(post.slug)}">
              <span>Read More</span>
              <iconify-icon icon="fa6-solid:arrow-right"></iconify-icon>
            </a>
          </div>
        </article>
      `;
    }).join('');
  }

  window.addEventListener('revcare:blogs-updated', render);
  render();
})();
