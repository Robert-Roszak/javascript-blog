'use strict';

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

function generateTitleLinks(customSelector = ''){
  let html = '';
  const titleList = document.querySelector(select.listOf.titles),
    articles = document.querySelectorAll(select.all.articles + customSelector),
    links = document.querySelectorAll('.titles a');

  titleList.innerHTML = '';

  for (let article of articles){
    const articleId = article.getAttribute('id'),
      articleTitle = article.querySelector(select.article.title).innerHTML,
      linkHTML = '<li><a href="#'+articleId+'"><span>'+articleTitle+'</span></a></li>';
    html += linkHTML;
  }
  titleList.innerHTML = html;
  for (let link of links) link.addEventListener('click', titleClickHandler);
}

generateTitleLinks();

function calculateTagsParams(tags) {
  const params = {min: 999999, max: 0};
  for (let tag in tags) {
    console.log(tag + ' is used ' + tags[tag] + ' times');
    if(tags[tag] > params.max) params.max = tags[tag];
    if(tags[tag] < params.min) params.min = tags[tag];
  }
  return params;
}

function calculateTagClass(count, params) {
  const normalizedCount = count - params.min,
    normalizedMax = params.max - params.min,
    percentage = normalizedCount / normalizedMax,
    classNumber = Math.floor( percentage * (opts.tagSizes.count - 1) + 1 );
  console.log(classNumber);
  return opts.tagSizes.classPrefix+classNumber;
}

function generateTags(){
  let allTags = {},
    allTagsHTML = '';
  const articles = document.querySelectorAll(select.all.articles),
    tagList = document.querySelector(select.listOf.tags),
    tagsParams = calculateTagsParams(allTags);

  for (let article of articles) {
    let html = '';
    const tagsWrapper = article.querySelector(select.article.tags),
      tagAttribute = article.getAttribute('data-tags'),
      articleTagsArray = tagAttribute.split(' ');

    for (let articleTag of articleTagsArray) {
      const linkHtml = `<li><a href="#tag-${articleTag}">${articleTag}</a></li>`;
      html += linkHtml;
      if(!allTags[articleTag]) {
        allTags[articleTag] = 1;
      }
      else allTags[articleTag]++;
    }
    tagsWrapper.innerHTML = html;
  }
  console.log('tagsParams:', tagsParams);

  for(let tag in allTags){
    const tagLinkHTML = `<li><a href="#tag-${tag}" class="${calculateTagClass(allTags[tag], tagsParams)}">${tag} (${allTags[tag]})</a></li>`;
    allTagsHTML += tagLinkHTML;
  }
  tagList.innerHTML = allTagsHTML;
}

generateTags();

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
}

function addClickListenersToTags(){
  const tags = document.querySelectorAll(select.all.linksTo.tags);
  for (let tag of tags) tag.addEventListener('click', tagClickHandler);
}

addClickListenersToTags();

function generateAuthors (){
  let allAuthors = {},
    allTagsHTML = '';
  const articles = document.querySelectorAll(select.all.articles),
    tagsParams = calculateTagsParams(allAuthors),
    authorWrapper = document.querySelector(select.listOf.authors);

  for (let article of articles) {
    let html = '';
    const tagsWrapper = article.querySelector(select.article.author),
      tagAttribute = article.getAttribute('data-author'),
      linkHtml = `<li><a href="#author-${tagAttribute}">${tagAttribute}</a></li>`;

    html += linkHtml;
    tagsWrapper.innerHTML = html;
    if(!allAuthors[tagAttribute]) allAuthors[tagAttribute] = 1;
    else allAuthors[tagAttribute]++;
  }

  console.log('tagsParams:', tagsParams);
  for(let tag in allAuthors){
    const tagLinkHTML = `<li><a href="#author-${tag}" class="${calculateTagClass(allAuthors[tag], tagsParams)}">${tag} (${allAuthors[tag]})</a></li>`;
    allTagsHTML += tagLinkHTML;
  }
  authorWrapper.innerHTML = allTagsHTML;
}

generateAuthors();

function addClickListenersToAuthors (){
  const tags = document.querySelectorAll(select.all.linksTo.authors);
  for (let tag of tags) tag.addEventListener('click', authorClickHandler);
}

addClickListenersToAuthors();

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
}
