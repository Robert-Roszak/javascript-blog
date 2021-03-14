'use strict'

const titleClickHandler = function(event){
  event.preventDefault();
  console.log('Link was clicked!');
  console.log(event);
  
  /* [DONE] remove class 'active' from all article links  */
  const activeLinks = document.querySelectorAll('.titles a.active');
  for(let activeLink of activeLinks) activeLink.classList.remove('active');

  /* [DONE] add class 'active' to the clicked link */
  const clickedElement = this;
  console.log('clickedElement:', clickedElement);
  console.log('clickedElement (with plus): ' + clickedElement);
  clickedElement.classList.add('active');

  /* [DONE] remove class 'active' from all articles */
  const activeArticles = document.querySelectorAll('.posts .active');
  for (let activeArticle of activeArticles) activeArticle.classList.remove('active');

  /* [DONE] get 'href' attribute from the clicked link */
  const articleSelector = '#' + clickedElement.getAttribute('href');
  console.log('href attribute of clicked link:', articleSelector);

  /* [DONE] find the correct article using the selector (value of 'href' attribute) */
  const targetArticle = document.querySelector(articleSelector);
  console.log('target article: ', targetArticle);

  /* [DONE] add class 'active' to the correct article */
  targetArticle.classList.add('active');
}

const optArticleSelector = '.post',
optTitleSelector = '.post-title',
optTitleListSelector = '.titles';

function generateTitleLinks(){

  /* remove contents of titleList */
  const titleList = document.querySelector(optTitleListSelector);
 // console.log(titleList);
  titleList.innerHTML = '';
  let html = '';

  /* for each article */
  const articles = document.querySelectorAll(optArticleSelector);
  for (let article of articles){

    /* get the article id */
    const articleId = article.getAttribute('id');
  //  console.log('Article ID is: ', articleId);

    /* find the title element */
    /* get the title from the title element */
    const articleTitle = article.querySelector(optTitleSelector).innerHTML;
   // console.log('Title element is: ', articleTitle);

    /* create HTML of the link */
    const linkHTML = '<li><a href="'+articleId+'"><span>'+articleTitle+'</span></a></li>';
   // console.log(linkHTML);
    html = html + linkHTML;

    /* insert link into titleList */
    /* Method 1 */
    //  titleList.innerHTML = titleList.innerHTML + linkHTML;
    /* Method 2 */
    //  titleList.insertAdjacentHTML('afterbegin', linkHTML);
      
  }
  titleList.innerHTML = html;
  const links = document.querySelectorAll('.titles a');
  console.log(links);
  for(let link of links) link.addEventListener('click', titleClickHandler);
}
generateTitleLinks();
/* Bring back active class on first link */
document.querySelector('.titles a').classList.add('active');