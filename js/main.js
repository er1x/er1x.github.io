document.addEventListener("DOMContentLoaded",function(){var e=function(e){return document.querySelector(e)};var t=function(e){var t=e.offsetWidth,n=e.offsetHeight;return t===0&&n===0||(e.style&&e.style.display||getComputedStyle(e)["display"])==="none"};var n=function(e){if(e.style.display=="block"){e.style.display="none"}else{e.style.display="block"}};Array.from(document.querySelectorAll("#menu-icon, #menu-icon-tablet")).forEach(function(t){t.addEventListener("click",function(){if(getComputedStyle(e("#menu"))["visibility"]==="hidden"){e("#menu").style.visibility="visible";e("#menu-icon, #menu-icon-tablet").classList.add("active");var t=e("#menu > #nav").getBoundingClientRect().top+document.body.scrollTop;if(getComputedStyle(e("#menu"))["visibility"]!=="hidden"&&t<50){e("#menu > #nav").style.display=""}else if(getComputedStyle(e("#menu"))["visibility"]!=="hidden"&&t>100){e("#menu > #nav").style.display="none"}return false}else{e("#menu").style.visibility="hidden";e("#menu-icon, #menu-icon-tablet").classList.remove("active");return false}})});if(e("#actions-footer #toc a")){e("#actions-footer #toc a").addEventListener("click",function(t){t.preventDefault();n(e("#toc-footer"))})}if(e("#actions-footer #menu a")){e("#actions-footer #menu a").addEventListener("click",function(t){t.preventDefault();n(e("#nav-footer"))})}if(e("#header > #nav > ul > .icon")){e("#header > #nav > ul > .icon").addEventListener("click",function(){e("#header > #nav > ul").classList.toggle("responsive")})}if(e("#menu")!==null){window.addEventListener("scroll",function(){var n=e("#menu > #nav").getBoundingClientRect().top+document.body.scrollTop;if(getComputedStyle(e("#menu"))["visibility"]!=="hidden"&&n<50){e("#menu > #nav").style.display=""}else if(getComputedStyle(e("#menu"))["visibility"]!=="hidden"&&n>100){e("#menu > #nav").style.display="none"}if(t(e("#menu-icon"))&&n<50){e("#menu-icon-tablet").style.display="";e("#top-icon-tablet").style.display="none"}else if(t(e("#menu-icon"))&&n>100){e("#menu-icon-tablet").style.display="none";e("#top-icon-tablet").style.display=""}})}if(e("#footer-post")!==null){var i=0;window.addEventListener("scroll",function(){var t=window.pageYOffset!==undefined?window.pageYOffset:(document.documentElement||document.body.parentNode||document.body).scrollTop;if(t>i){e("#footer-post").style.display="none"}else{e("#footer-post").style.display=""}i=t;e("#nav-footer").style.display="none";e("#toc-footer").style.display="none";if(t<50){e("#actions-footer > ul > #top").style.display="none";e("#actions-footer > ul > #menu").style.display=""}else if(t>100){e("#actions-footer > ul > #menu").style.display="none";e("#actions-footer > ul > #top").style.display=""}})}});