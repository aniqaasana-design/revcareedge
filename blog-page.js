(function () {
  const grid = document.getElementById('blogGrid');
  const empty = document.getElementById('blogEmpty');
  const search = document.getElementById('blogSearch');
  const category = document.getElementById('blogCategory');
  const count = document.getElementById('blogCount');

  if (!grid || !window.RevCareBlog) return;

  function categories(posts) {
    const values = [...new Set(posts.map(post => post.category).filter(Boolean))].sort();
    category.innerHTML = '<option value="">All Topics</option>' + values
      .map(value => `<option value="${window.RevCareBlog.escapeHtml(value)}">${window.RevCareBlog.escapeHtml(value)}</option>`)
      .join('');
  }

  function card(post) {
    const image = post.coverImage
      ? `<img src="${window.RevCareBlog.escapeHtml(post.coverImage)}" alt="${window.RevCareBlog.escapeHtml(post.title)}" loading="lazy">`
      : `<div class="blog-cover-fallback"><iconify-icon icon="fa6-solid:newspaper"></iconify-icon></div>`;

    return `
      <article class="blog-card">
        <a class="blog-cover" href="blog-post.html?slug=${encodeURIComponent(post.slug)}" aria-label="Read ${window.RevCareBlog.escapeHtml(post.title)}">
          ${image}
        </a>
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
  }

  function render() {
    const posts = window.RevCareBlog.getPosts();
    if (category && category.options.length <= 1) categories(posts);

    const query = (search && search.value || '').toLowerCase().trim();
    const selected = category && category.value;
    const filtered = posts.filter(post => {
      const haystack = `${post.title} ${post.excerpt} ${post.category}`.toLowerCase();
      return (!query || haystack.includes(query)) && (!selected || post.category === selected);
    });

    grid.innerHTML = filtered.map(card).join('');
    if (empty) empty.hidden = filtered.length > 0;
    if (count) count.textContent = `${filtered.length} ${filtered.length === 1 ? 'Article' : 'Articles'}`;
  }

  if (search) search.addEventListener('input', render);
  if (category) category.addEventListener('change', render);
  window.addEventListener('revcare:blogs-updated', render);
  render();
})();
