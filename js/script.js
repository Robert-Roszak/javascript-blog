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
  /*  console.log('Link was clicked!');
  console.log(event); */
  /* [DONE] remove class 'active' from all article links  */
  const activeLinks = document.querySelectorAll('.titles a.active');
  //console.log('activeLinks value:', activeLinks);
  for (let activeLink of activeLinks) {
    if (activeLink) activeLink.classList.remove('active');
  }

  /* [DONE] add class 'active' to the clicked link */
  const clickedElement = this;
  /*  console.log('clickedElement:', clickedElement);
  console.log('clickedElement (with plus): ' + clickedElement); */
  clickedElement.classList.add('active');

  /* [DONE] remove class 'active' from all articles */
  const activeArticles = document.querySelectorAll('.post.active');
  //console.log('activeArticles value:', activeArticles);
  for (let activeArticle of activeArticles) {
    //console.log('activeArticle value:', activeArticle);
    if (activeArticle) {
      activeArticle.classList.remove('active');
    }
  }
  /* [DONE] get 'href' attribute from the clicked link */
  const articleSelector = clickedElement.getAttribute('href');
  //  console.log('href attribute of clicked link:', articleSelector);

  /* [DONE] find the correct article using the selector (value of 'href' attribute) */
  const targetArticle = document.querySelector(articleSelector);
  //  console.log('target article: ', targetArticle);

  /* [DONE] add class 'active' to the correct article */
  targetArticle.classList.add('active');
};

function generateTitleLinks(customSelector = ''){

  /* remove contents of titleList */
  const titleList = document.querySelector(select.listOf.titles);
  // console.log(titleList);
  titleList.innerHTML = '';
  let html = '';

  /* for each article */
  const articles = document.querySelectorAll(select.all.articles + customSelector);
  for (let article of articles){

    /* get the article id */
    const articleId = article.getAttribute('id');
    //  console.log('Article ID is: ', articleId);

    /* find the title element */
    /* get the title from the title element */
    const articleTitle = article.querySelector(select.article.title).innerHTML;
    // console.log('Title element is: ', articleTitle);

    /* create HTML of the link */
    const linkHTML = '<li><a href="#'+articleId+'"><span>'+articleTitle+'</span></a></li>';
    // console.log(linkHTML);
    html += linkHTML;

    /* insert link into titleList - not optimal as with every loop js connects with html */
    /* Method 1 */
    //  titleList.innerHTML = titleList.innerHTML + linkHTML;
    /* Method 2 */
    //  titleList.insertAdjacentHTML('afterbegin', linkHTML);

  }
  titleList.innerHTML = html;

  /* Event listener */
  const links = document.querySelectorAll('.titles a');
  // console.log(links);
  for (let link of links) link.addEventListener('click', titleClickHandler);

  /* Bring back active class on first link */
  // document.querySelector('.titles a').classList.add('active');
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
  const normalizedCount = count - params.min;
  const normalizedMax = params.max - params.min;
  const percentage = normalizedCount / normalizedMax;
  const classNumber = Math.floor( percentage * (opts.tagSizes.count - 1) + 1 );
  console.log(classNumber);
  return opts.tagSizes.classPrefix+classNumber;
}

function generateTags(){
  /* [NEW] create a new variable allTags with an empty object */
  let allTags = {};
  /* find all articles */
  const articles = document.querySelectorAll(select.all.articles);
  //console.log(articles);
  /* START LOOP: for every article: */
  for (let article of articles) {
    /* find tags wrapper */
    const tagsWrapper = article.querySelector(select.article.tags);
    //  console.log(tagsWrapper);
    /* make html variable with empty string */
    let html = '';
    /* get tags from data-tags attribute */
    const tagAttribute = article.getAttribute('data-tags');
    //  console.log(tagAttribute);
    /* split tags into array */
    const articleTagsArray = tagAttribute.split(' ');
    //   console.log(articleTagsArray);
    /* START LOOP: for each tag */
    for (let articleTag of articleTagsArray) {
    //  console.log(articleTag);
      /* generate HTML of the link */
      const linkHtml = `<li><a href="#tag-${articleTag}">${articleTag}</a></li>`;
      //   console.log(linkHtml);
      /* add generated code to html variable */
      html += linkHtml;
      /* [NEW] check if this link is NOT already in allTags */
      if(!allTags[articleTag]) {
        /* [NEW] add tag to allTags object */
        allTags[articleTag] = 1;
      }
      else allTags[articleTag]++;
    //  console.log(html);
    /* END LOOP: for each tag */
    }
    /* insert HTML of all the links into the tags wrapper */
    tagsWrapper.innerHTML = html;
  /* END LOOP: for every article: */
  }
  /* [NEW] find list of tags in right column */
  const tagList = document.querySelector(select.listOf.tags);
  /* [NEW] create variable for all links HTML code */
  const tagsParams = calculateTagsParams(allTags);
  console.log('tagsParams:', tagsParams);
  let allTagsHTML = '';

  /* [NEW] START LOOP: for each tag in allTags: */
  for(let tag in allTags){
  /* [NEW] generate code of a link and add it to allTagsHTML */
    const tagLinkHTML = `<li><a href="#tag-${tag}" class="${calculateTagClass(allTags[tag], tagsParams)}">${tag} (${allTags[tag]})</a></li>`;
    allTagsHTML += tagLinkHTML;
  }
  /* [NEW] END LOOP: for each tag in allTags: */
  /*[NEW] add HTML from allTagsHTML to tagList */
  tagList.innerHTML = allTagsHTML;
}

generateTags();

function tagClickHandler(event){
  /* prevent default action for this event */
  event.preventDefault();
  //  console.log(event);
  /* make new constant named "clickedElement" and give it the value of "this" */
  const clickedElement = this;
  //console.log('this value:', clickedElement);
  /* make a new constant "href" and read the attribute "href" of the clicked element */
  const href = clickedElement.getAttribute('href');
  //console.log('href value:', href);
  /* make a new constant "tag" and extract tag from the "href" constant */
  const tag = href.replace('#tag-', '');
  //console.log('tag value:', tag);
  /* find all tag links with class active
  Below removes class 'active' only from tags
  const activeLinks = document.querySelectorAll('a.active[href^="#tag-"]'); */
  // Below removes class 'active' from ALL
  const activeLinks = document.querySelectorAll('a.active[href^="#"]');
  for (let activeLink of activeLinks) {
    if (activeLink) activeLink.classList.remove('active');
  }
  /* END LOOP: for each active tag link */

  /* find all tag links with "href" attribute equal to the "href" constant */
  const tagLinks = document.querySelectorAll('a[href="' + href + '"]');
  //console.log('tagLinks value:', tagLinks);
  /* START LOOP: for each found tag link */
  for (let tagLink of tagLinks) {
  /* add class active */
    tagLink.classList.add('active');
    //console.log('tagLink value:', tagLink);
  /* END LOOP: for each found tag link */
  }

  /* execute function "generateTitleLinks" with article selector as argument */
  //console.log('tag value:', tag);
  generateTitleLinks('[data-tags~="' + tag + '"]');
}

function addClickListenersToTags(){
  const tags = document.querySelectorAll(select.all.linksTo.tags);
  for (let tag of tags) tag.addEventListener('click', tagClickHandler);
}

addClickListenersToTags();

function generateAuthors (){
// Generate empty array for author html
  let allAuthors = {};

  const articles = document.querySelectorAll(select.all.articles);
  for (let article of articles) {
  //  console.log(article);
    const tagsWrapper = article.querySelector(select.article.author);
    let html = '';
    const tagAttribute = article.getAttribute('data-author');
    const linkHtml = `<li><a href="#author-${tagAttribute}">${tagAttribute}</a></li>`;
    html += linkHtml;
    tagsWrapper.innerHTML = html;
    if(!allAuthors[tagAttribute]) allAuthors[tagAttribute] = 1;
    else allAuthors[tagAttribute]++;
    /* Old version based on array
    // In the loop, check whether html is in the array and add if not
    if (allAuthors.indexOf(linkHtml) == -1) {
      allAuthors.push(html);
    }*/
  }
  /* Old version based on array
  // Add script generated authors list to html
  const authorWrapper = document.querySelector(select.listOf.authors);
  authorWrapper.innerHTML = allAuthors.join(' '); */
  const tagsParams = calculateTagsParams(allAuthors);
  console.log('tagsParams:', tagsParams);
  let allTagsHTML = '';
  for(let tag in allAuthors){
    const tagLinkHTML = `<li><a href="#author-${tag}" class="${calculateTagClass(allAuthors[tag], tagsParams)}">${tag} (${allAuthors[tag]})</a></li>`;
    // allTagsHTML += `<li><a href="#author-${tag}" class="${calculateTagClass(allTags[tag], tagsParams)}">${tag} (${allAuthors[tag]})</a></li>`;
    allTagsHTML += tagLinkHTML;
  }
  const authorWrapper = document.querySelector(select.listOf.authors);
  authorWrapper.innerHTML = allTagsHTML;
}
generateAuthors();

function addClickListenersToAuthors (){
  const tags = document.querySelectorAll(select.all.linksTo.authors);
  for (let tag of tags) tag.addEventListener('click', authorClickHandler);
}

addClickListenersToAuthors();

function authorClickHandler (event){
  // console.log('link was clicked');
  event.preventDefault();
  const clickedElement = this;
  //console.log(clickedElement);
  clickedElement.classList.add('active');
  const href = clickedElement.getAttribute('href');
  //console.log(href);
  const tag = href.replace('#author-', '');
  //console.log(tag);
  /* Below removes 'active' class only from authors
  const activeLinks = document.querySelectorAll('a.active[href^="#author-"]'); */
  // Below removes 'active' class from ALL
  const activeLinks = document.querySelectorAll('a.active[href^="#"]');
  for (let activeLink of activeLinks) {
    if (activeLink) activeLink.classList.remove('active');
  }
  const tagLinks = document.querySelectorAll('a[href="' + href + '"]');
  for (let tagLink of tagLinks) tagLink.classList.add('active');

  generateTitleLinks('[data-author="' + tag + '"]');
}
