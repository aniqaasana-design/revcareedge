(function () {
  const shell = document.getElementById('blogPostShell');
  if (!shell || !window.RevCareBlog) return;

  const params = new URLSearchParams(window.location.search);
  const slug = params.get('slug');
  const post = window.RevCareBlog.findPost(slug);
  const posts = window.RevCareBlog.getPosts();

  function relatedList(current) {
    return posts
      .filter(item => item.slug !== current.slug)
      .slice(0, 4)
      .map(item => `<a href="blog-post.html?slug=${encodeURIComponent(item.slug)}">${window.RevCareBlog.escapeHtml(item.title)}</a>`)
      .join('');
  }

  if (!post) {
    shell.innerHTML = `
      <section class="blog-post-empty">
        <span class="blog-chip">Blog</span>
        <h1>Post Not Found</h1>
        <p>This article may have been removed or renamed from the admin panel.</p>
        <a class="blog-primary-btn" href="blog.html">Back To Blog</a>
      </section>
    `;
    return;
  }

  document.title = `${post.title} - RevCare Edge Blog`;

  const cover = post.coverImage
    ? `<img src="${window.RevCareBlog.escapeHtml(post.coverImage)}" alt="${window.RevCareBlog.escapeHtml(post.title)}">`
    : `<div class="blog-post-cover-fallback"><iconify-icon icon="fa6-solid:newspaper"></iconify-icon></div>`;

  shell.innerHTML = `
    <article class="blog-post">
      <header class="blog-post-header">
        <a class="blog-back-link" href="blog.html"><iconify-icon icon="fa6-solid:arrow-left"></iconify-icon><span>Back To Blog</span></a>
        <span class="blog-chip">${window.RevCareBlog.escapeHtml(post.category)}</span>
        <h1>${window.RevCareBlog.escapeHtml(post.title)}</h1>
        <p>${window.RevCareBlog.escapeHtml(post.excerpt)}</p>
        <div class="blog-post-meta">
          <span>By ${window.RevCareBlog.escapeHtml(post.author)}</span>
          <span>${window.RevCareBlog.formatDate(post.date)}</span>
        </div>
      </header>

      <div class="blog-post-cover">${cover}</div>

      <div class="blog-post-layout">
        <div class="blog-article-content">${window.RevCareBlog.renderBody(post.body)}</div>
        <aside class="blog-post-sidebar">
          <h2>Contents</h2>
          <a href="#top">${window.RevCareBlog.escapeHtml(post.title)}</a>
          ${relatedList(post)}
        </aside>
      </div>
    </article>
  `;
})();
