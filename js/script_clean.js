'use strict';

const templates = {
  articleLink: Handlebars.compile(document.querySelector('#template-article-link').innerHTML),
  articleTag: Handlebars.compile(document.querySelector('#template-article-tag').innerHTML),
  articleAuthor: Handlebars.compile(document.querySelector('#template-article-author').innerHTML),
  tagCloudLink: Handlebars.compile(document.querySelector('#template-tag-cloud-link').innerHTML),
  tagCloudAuthor: Handlebars.compile(document.querySelector('#template-tag-cloud-author').innerHTML),
};

const opts = {
  tagSizes: {
    count: 5,
    classPrefix: 'tag-size-',
  },
};

const select = {
  all: {
    articles: '.post',
    linksTo: {
      tags: 'a[href^="#tag-"]',
      authors: 'a[href^="#author-"]',
    },
  },
  article: {
    tags: '.post-tags .list',
    author: '.post-author',
    title: '.post-title',
  },
  listOf: {
    titles: '.titles',
    tags: '.tags.list',
    authors: '.authors.list',
  },
};

const titleClickHandler = function(event){
  event.preventDefault();
  const activeLinks = document.querySelectorAll('.titles a.active'),
    clickedElement = this,
    activeArticles = document.querySelectorAll('.post.active'),
    articleSelector = clickedElement.getAttribute('href'),
    targetArticle = document.querySelector(articleSelector);

  for (let activeLink of activeLinks) {
    if (activeLink) activeLink.classList.remove('active');
  }

  clickedElement.classList.add('active');

  for (let activeArticle of activeArticles) {
    if (activeArticle) activeArticle.classList.remove('active');
  }
  targetArticle.classList.add('active');
};

function refreshArticle(customSelector = '') {
  const activeArticle = document.querySelector('.post.active');
  activeArticle.classList.remove('active');

  const activeLink = document.querySelector('.titles a[href="#' + activeArticle.getAttribute('id') + '"]');
  if(activeLink) activeLink.classList.remove('active');

  const targetArticle = document.querySelector(select.all.articles + customSelector);
  targetArticle.classList.add('active');

  const targetLink = document.querySelector('.titles a[href="#' + targetArticle.getAttribute('id') + '"]');
  console.log(targetLink);
  targetLink.classList.add('active');

}

function generateTitleLinks(customSelector = '') {

  let html = '';
  const titleList = document.querySelector(select.listOf.titles),
    articles = document.querySelectorAll(select.all.articles + customSelector);

  titleList.innerHTML = '';

  for (let article of articles){
    const articleId = article.getAttribute('id'),
      articleTitle = article.querySelector(select.article.title).innerHTML,
      linkHTMLData = {id: articleId, title: articleTitle},
      linkHTML = templates.articleLink(linkHTMLData);
    html += linkHTML;
  }
  titleList.innerHTML = html;
  const links = document.querySelectorAll('.titles a');
  for (let link of links) link.addEventListener('click', titleClickHandler);
}

function calculateTagsParams(tags) {
  const params = {min: 999999, max: 0};
  for (let tag in tags) {
    if(tags[tag] > params.max) params.max = tags[tag];
    if(tags[tag] < params.min) params.min = tags[tag];
  }
  return params;
}

function calculateTagClass(count, params) {
  const normalizedCount = count - params.min,
    normalizedMax = params.max - params.min,
    percentage = normalizedCount / normalizedMax,
    classNumber = Math.floor(percentage * (opts.tagSizes.count - 1) + 1 );
  return opts.tagSizes.classPrefix+classNumber;
}

function generateTags(){
  let allTags = {};
  const articles = document.querySelectorAll(select.all.articles),
    tagList = document.querySelector(select.listOf.tags),
    allTagsData = {tags: []};

  for (let article of articles) {
    let html = '';
    const tagsWrapper = article.querySelector(select.article.tags),
      tagAttribute = article.getAttribute('data-tags'),
      articleTagsArray = tagAttribute.split(' ');

    for (let articleTag of articleTagsArray) {
      const linkHTMLData = {id: articleTag, title: articleTag},
        linkHtml = templates.articleTag(linkHTMLData);
      html += linkHtml;
      if(!allTags[articleTag]) {
        allTags[articleTag] = 1;
      }
      else allTags[articleTag]++;
    }
    tagsWrapper.innerHTML = html;
  }
  const tagsParams = calculateTagsParams(allTags);

  for(let tag in allTags){
    allTagsData.tags.push({
      tag: tag,
      count: allTags[tag],
      className: calculateTagClass(allTags[tag], tagsParams)
    });
  }
  tagList.innerHTML = templates.tagCloudLink(allTagsData);
}

function tagClickHandler(event){
  event.preventDefault();
  const clickedElement = this,
    href = clickedElement.getAttribute('href'),
    tag = href.replace('#tag-', ''),
    activeLinks = document.querySelectorAll('a.active[href^="#"]'),
    tagLinks = document.querySelectorAll('a[href="' + href + '"]');

  for (let activeLink of activeLinks) {
    if (activeLink) activeLink.classList.remove('active');
  }

  for (let tagLink of tagLinks) tagLink.classList.add('active');

  generateTitleLinks('[data-tags~="' + tag + '"]');
  if (clickedElement.classList.contains('tag-outside')) refreshArticle('[data-tags~="' + tag + '"]');
}

function addClickListenersToTags(){
  const tags = document.querySelectorAll(select.all.linksTo.tags);
  for (let tag of tags) tag.addEventListener('click', tagClickHandler);
}


function generateAuthors (){
  let allAuthors = {},
    allAuthorsData = {tags: []};
  const articles = document.querySelectorAll(select.all.articles),
    authorWrapper = document.querySelector(select.listOf.authors);

  for (let article of articles) {
    let html = '';
    const tagsWrapper = article.querySelector(select.article.author),
      tagAttribute = article.getAttribute('data-author'),
      linkHTMLData = {id: tagAttribute, title: tagAttribute},
      linkHtml = templates.articleAuthor(linkHTMLData);

    html += linkHtml;
    tagsWrapper.innerHTML = html;
    if(!allAuthors[tagAttribute]) allAuthors[tagAttribute] = 1;
    else allAuthors[tagAttribute]++;
  }
  const tagsParams = calculateTagsParams(allAuthors);
  for(let tag in allAuthors){
    allAuthorsData.tags.push({
      tag: tag,
      count: allAuthors[tag],
      className: calculateTagClass(allAuthors[tag], tagsParams)
    });
  }
  authorWrapper.innerHTML = templates.tagCloudAuthor(allAuthorsData);
}

function addClickListenersToAuthors (){
  const tags = document.querySelectorAll(select.all.linksTo.authors);
  for (let tag of tags) tag.addEventListener('click', authorClickHandler);
}

function authorClickHandler (event){
  event.preventDefault();
  const clickedElement = this,
    href = clickedElement.getAttribute('href'),
    tag = href.replace('#author-', ''),
    activeLinks = document.querySelectorAll('a.active[href^="#"]'),
    tagLinks = document.querySelectorAll('a[href="' + href + '"]');

  clickedElement.classList.add('active');
  for (let activeLink of activeLinks) {
    if (activeLink) activeLink.classList.remove('active');
  }
  for (let tagLink of tagLinks) tagLink.classList.add('active');
  generateTitleLinks('[data-author="' + tag + '"]');
  if (clickedElement.classList.contains('tag-outside')) refreshArticle('[data-author="' + tag + '"]');
}

generateTitleLinks();
generateTags();
addClickListenersToTags();
generateAuthors();
addClickListenersToAuthors();
