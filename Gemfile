# <repo-root>/Gemfile
source "https://rubygems.org"

# GitHub Pages가 쓰는 고정된 Jekyll 환경(플러그인 포함)
gem "github-pages", group: :jekyll_plugins

# Minimal Mistakes 권장 플러그인
gem "jekyll-include-cache"

# remote_theme 사용 시(Minimal Mistakes 원격 테마)
group :jekyll_plugins do
  gem "jekyll-remote-theme"
  gem "jekyll-sitemap"
  gem "jekyll-feed"
end

# (로컬 미리보기용 선택) Ruby 3에서 jekyll serve 필요
gem "webrick", "~> 1.8"
