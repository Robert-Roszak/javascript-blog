'use strict';

const titleClickHandler = function(event){
  event.preventDefault();
  /*  console.log('Link was clicked!');
  console.log(event); */
  /* [DONE] remove class 'active' from all article links  */
  const activeLinks = document.querySelectorAll('.titles a.active');
  console.log('activeLinks value:', activeLinks);
  for (let activeLink of activeLinks) {
    if (activeLink) {
      activeLink.classList.remove('active');
    }
  }

  /* [DONE] add class 'active' to the clicked link */
  const clickedElement = this;
  /*  console.log('clickedElement:', clickedElement);
  console.log('clickedElement (with plus): ' + clickedElement); */
  clickedElement.classList.add('active');

  /* [DONE] remove class 'active' from all articles */
  const activeArticles = document.querySelectorAll('.posts .active');
  console.log('activeArticles value:', activeArticles);
  for (let activeArticle of activeArticles) {
    console.log('activeArticle value:', activeArticle);
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

const optArticleSelector = '.post',
optTitleSelector = '.post-title',
optTitleListSelector = '.titles',
optArticleTagsSelector = '.post-tags .list';

function generateTitleLinks(customSelector = ''){

  /* remove contents of titleList */
  const titleList = document.querySelector(optTitleListSelector);
 // console.log(titleList);
  titleList.innerHTML = '';
  let html = '';

  /* for each article */
  const articles = document.querySelectorAll(optArticleSelector + customSelector);
  for (let article of articles){

    /* get the article id */
    const articleId = article.getAttribute('id');
  //  console.log('Article ID is: ', articleId);

    /* find the title element */
    /* get the title from the title element */
    const articleTitle = article.querySelector(optTitleSelector).innerHTML;
   // console.log('Title element is: ', articleTitle);

    /* create HTML of the link */
    const linkHTML = '<li><a href="#'+articleId+'"><span>'+articleTitle+'</span></a></li>';
   // console.log(linkHTML);
    html = html + linkHTML;

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
  document.querySelector('.titles a').classList.add('active');
}
generateTitleLinks();

function generateTags(){
  /* find all articles */
  const articles = document.querySelectorAll('.post');
  //console.log(allArticles);
  /* START LOOP: for every article: */
  for (let article of articles) {
    /* find tags wrapper */
    const tagsWrapper = article.querySelector(optArticleTagsSelector);
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
      html = html + linkHtml;
    //  console.log(html);
    /* END LOOP: for each tag */
    }
    /* insert HTML of all the links into the tags wrapper */
    tagsWrapper.innerHTML = html;
  /* END LOOP: for every article: */
  }
}

generateTags();

function tagClickHandler(event){
  /* prevent default action for this event */
  event.preventDefault();
//  console.log(event);
  /* make new constant named "clickedElement" and give it the value of "this" */
  const clickedElement = this;
  console.log('this value:', clickedElement);
  /* make a new constant "href" and read the attribute "href" of the clicked element */
  const href = clickedElement.getAttribute('href');
  console.log('href value:', href);
  /* make a new constant "tag" and extract tag from the "href" constant */
  const tag = href.replace('#tag-', '');
  console.log('tag value:', tag);
//sprawdzic ponizej
  /* find all tag links with class active */
  const activeLinks = document.querySelectorAll('a.active[href^="#tag-"]');
  console.log('activeLinks value:', activeLinks);
  /* START LOOP: for each active tag link */
  for (let activeLink of activeLinks) {
    if (activeLink) {
      /* remove class active */
      activeLink.classList.remove('active');
      console.log('activeLink value:', activeLink);
    }
  }
  /* END LOOP: for each active tag link */

  /* find all tag links with "href" attribute equal to the "href" constant */
  const tagLinks = document.querySelectorAll('a[href="' + href + '"]');
  console.log('tagLinks value:', tagLinks);
  /* START LOOP: for each found tag link */
  for (let tagLink of tagLinks) {
  /* add class active */
  tagLink.classList.add('active');
  console.log('tagLink value:', tagLink);
  /* END LOOP: for each found tag link */
  }

  /* execute function "generateTitleLinks" with article selector as argument */
  console.log('tag value:', tag);
  generateTitleLinks('[data-tags~="' + tag + '"]');
}

function addClickListenersToTags(){
  /* find all links to tags */
  const tags = document.querySelectorAll('a[href^="#tag-"]');
//  console.log(tags);
  /* START LOOP: for each link */
  for (let tag of tags) tag.addEventListener('click', tagClickHandler);
    /* add tagClickHandler as event listener for that link */
  /* END LOOP: for each link */
}

addClickListenersToTags();
