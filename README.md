# er1x site

Just an [Hexo](https://hexo.io) generated site. Used theme (Cactus) is a git submodule

## Develop

First install hexo-cli as a global npm package (or use it locally, whatever).

```
hexo server
```

## Publish

```
hexo generate
git subtree push --prefix public origin master
```
