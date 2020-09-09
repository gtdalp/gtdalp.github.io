/*深一层封装photoswipe 暴露接口*/
var photoswipeObj = {
    // 创建image
    createImgTpl: function (obj) {
        var html = '';
        var aHtml = function (o) {
            var maxImgSrc1 = o.maxImgSrc1 || '';
            var maxImgSrc2 = o.maxImgSrc2 || '';

            var maxImgSrc1wh = o.maxImgSrc1wh || '';
            var maxImgSrc2wh = o.maxImgSrc2wh || '';
            if (!maxImgSrc2) {
                maxImgSrc2 = maxImgSrc1;
                maxImgSrc2wh = maxImgSrc1wh;
            }
            var html = '<a href="' + maxImgSrc1 + '" data-size="' + maxImgSrc1wh + '" data-med="' + maxImgSrc2 + '" data-med-size="' + maxImgSrc2wh + '" data-author="' + (o.author || '') + '" class="demo-gallery__img--main">\
              <img src="' + o.minImgSrc + '" alt="" />\
              <figure>' + (o.msg || '') + '</figure>\
            </a>';
            return html;
        }
        if (Array.isArray(obj)) {
            for (var i = 0; i < obj.length; i++) {
                html += aHtml(obj[i]);
            }
        } else {
            html = aHtml(obj);
        }
        return html;
    },
    // 创建弹出框图片
    createGalleryDialog: function (dom) {
        // 如果存在则不在渲染
        if (document.querySelector('#gallery')) {
            return;
        }
        var body = document.body;
        var galleryDom = document.createElement("DIV");
        galleryDom.id = 'gallery';
        galleryDom.className = 'pswp';

        // append body  dialog
        body.appendChild(galleryDom);
        var galleryHtml = '\
        <div class="pswp__bg"></div>\
        <div class="pswp__scroll-wrap">\
          <div class="pswp__container">\
            <div class="pswp__item"></div>\
            <div class="pswp__item"></div>\
            <div class="pswp__item"></div>\
          </div>\
          <div class="pswp__ui pswp__ui--hidden">\
            <div class="pswp__top-bar">\
                <div class="pswp__counter"></div>\
                <button class="pswp__button pswp__button--close" title="Close (Esc)"></button>\
                <button class="pswp__button pswp__button--fs" title="Toggle fullscreen"></button>\
                <button class="pswp__button pswp__button--zoom" title="Zoom in/out"></button>\
                <div class="pswp__preloader">\
                    <div class="pswp__preloader__icn">\
                      <div class="pswp__preloader__cut">\
                        <div class="pswp__preloader__donut"></div>\
                      </div>\
                    </div>\
                </div>\
            </div>\
            <div class="pswp__share-modal pswp__share-modal--hidden pswp__single-tap">\
                <div class="pswp__share-tooltip"></div>\
            </div>\
            <button class="pswp__button pswp__button--arrow--left" title="Previous (arrow left)"></button>\
            <button class="pswp__button pswp__button--arrow--right" title="Next (arrow right)"></button>\
            <div class="pswp__caption">\
              <div class="pswp__caption__center"></div>\
            </div>\
          </div>\
        </div>';
        // <button class="pswp__button pswp__button--share" title="Share"></button>\
        galleryDom.innerHTML = galleryHtml;
        // 初始化
        photoswipeObj.initPhotoSwipeFromDOM(dom);
    },
    initPhotoSwipeFromDOM: function(gallerySelector) {
    
        var parseThumbnailElements = function(el) {
            var thumbElements = el.childNodes,
                numNodes = thumbElements.length,
                items = [],
                el,
                childElements,
                thumbnailEl,
                size,
                item;

            for(var i = 0; i < numNodes; i++) {
                el = thumbElements[i];

                // include only element nodes 
                if(el.nodeType !== 1) {
                  continue;
                }

                childElements = el.children;

                size = el.getAttribute('data-size').split('x');

                // create slide object
                item = {
                    src: el.getAttribute('href'),
                    w: parseInt(size[0], 10),
                    h: parseInt(size[1], 10),
                    author: el.getAttribute('data-author')
                };

                item.el = el; // save link to element for getThumbBoundsFn

                if(childElements.length > 0) {
                  item.msrc = childElements[0].getAttribute('src'); // thumbnail url
                  if(childElements.length > 1) {
                      item.title = childElements[1].innerHTML; // caption (contents of figure)
                  }
                }


                var mediumSrc = el.getAttribute('data-med');
                if(mediumSrc) {
                    size = el.getAttribute('data-med-size').split('x');
                    // "medium-sized" image
                    item.m = {
                        src: mediumSrc,
                        w: parseInt(size[0], 10),
                        h: parseInt(size[1], 10)
                    };
                }
                // original image
                item.o = {
                    src: item.src,
                    w: item.w,
                    h: item.h
                };
                
                items.push(item);
            }
            console.log(items)
            return items;
        };

        // find nearest parent element
        var closest = function closest(el, fn) {
            return el && ( fn(el) ? el : closest(el.parentNode, fn) );
        };

        var onThumbnailsClick = function(e) {
            e = e || window.event;
            e.preventDefault ? e.preventDefault() : e.returnValue = false;

            var eTarget = e.target || e.srcElement;

            var clickedListItem = closest(eTarget, function(el) {
                return el.tagName === 'A';
            });

            if(!clickedListItem) {
                return;
            }

            var clickedGallery = clickedListItem.parentNode;

            var childNodes = clickedListItem.parentNode.childNodes,
                numChildNodes = childNodes.length,
                nodeIndex = 0,
                index;

            for (var i = 0; i < numChildNodes; i++) {
                if(childNodes[i].nodeType !== 1) { 
                    continue; 
                }

                if(childNodes[i] === clickedListItem) {
                    index = nodeIndex;
                    break;
                }
                nodeIndex++;
            }

            if(index >= 0) {
                openPhotoSwipe( index, clickedGallery );
            }
            return false;
        };

        var photoswipeParseHash = function() {
            var hash = window.location.hash.substring(1),
            params = {};

            if(hash.length < 5) { // pid=1
                return params;
            }

            var vars = hash.split('&');
            for (var i = 0; i < vars.length; i++) {
                if(!vars[i]) {
                    continue;
                }
                var pair = vars[i].split('=');  
                if(pair.length < 2) {
                    continue;
                }           
                params[pair[0]] = pair[1];
            }

            if(params.gid) {
                params.gid = parseInt(params.gid, 10);
            }

            return params;
        };

        var openPhotoSwipe = function(index, galleryElement, disableAnimation, fromURL) {
            var pswpElement = document.querySelectorAll('.pswp')[0],
                gallery,
                options,
                items;

            items = parseThumbnailElements(galleryElement);

            // define options (if needed)
            options = {

                galleryUID: galleryElement.getAttribute('data-pswp-uid'),

                getThumbBoundsFn: function(index) {
                    // See Options->getThumbBoundsFn section of docs for more info
                    var thumbnail = items[index].el.children[0],
                        pageYScroll = window.pageYOffset || document.documentElement.scrollTop,
                        rect = thumbnail.getBoundingClientRect(); 

                    return {x:rect.left, y:rect.top + pageYScroll, w:rect.width};
                },

                addCaptionHTMLFn: function(item, captionEl, isFake) {
                    if(!item.title) {
                        captionEl.children[0].innerText = '';
                        return false;
                    }
                    var author = item.author ? '<br/><small>Photo:' + item.author + '</small>' : '';
                    captionEl.children[0].innerHTML = item.title + author;
                    return true;
                },
                
            };


            if(fromURL) {
                if(options.galleryPIDs) {
                    // parse real index when custom PIDs are used 
                    // http://photoswipe.com/documentation/faq.html#custom-pid-in-url
                    for(var j = 0; j < items.length; j++) {
                        if(items[j].pid == index) {
                            options.index = j;
                            break;
                        }
                    }
                } else {
                    options.index = parseInt(index, 10) - 1;
                }
            } else {
                options.index = parseInt(index, 10);
            }
            console.log(options.index)
            // exit if index not found
            if( isNaN(options.index) ) {
                return;
            }



            var radios = document.getElementsByName('gallery-style');
            for (var i = 0, length = radios.length; i < length; i++) {
                if (radios[i].checked) {
                    if(radios[i].id == 'radio-all-controls') {

                    } else if(radios[i].id == 'radio-minimal-black') {
                        options.mainClass = 'pswp--minimal--dark';
                        options.barsSize = {top:0,bottom:0};
                        options.captionEl = false;
                        options.fullscreenEl = false;
                        options.shareEl = false;
                        options.bgOpacity = 0.85;
                        options.tapToClose = true;
                        options.tapToToggleControls = false;
                    }
                    break;
                }
            }

            if(disableAnimation) {
                options.showAnimationDuration = 0;
            }

            // Pass data to PhotoSwipe and initialize it
            gallery = new PhotoSwipe( pswpElement, PhotoSwipeUI_Default, items, options);

            // see: http://photoswipe.com/documentation/responsive-images.html
            var realViewportWidth,
                useLargeImages = false,
                firstResize = true,
                imageSrcWillChange;

            gallery.listen('beforeResize', function() {

                var dpiRatio = window.devicePixelRatio ? window.devicePixelRatio : 1;
                dpiRatio = Math.min(dpiRatio, 2.5);
                realViewportWidth = gallery.viewportSize.x * dpiRatio;


                if(realViewportWidth >= 1200 || (!gallery.likelyTouchDevice && realViewportWidth > 800) || screen.width > 1200 ) {
                    if(!useLargeImages) {
                        useLargeImages = true;
                        imageSrcWillChange = true;
                    }
                    
                } else {
                    if(useLargeImages) {
                        useLargeImages = false;
                        imageSrcWillChange = true;
                    }
                }

                if(imageSrcWillChange && !firstResize) {
                    gallery.invalidateCurrItems();
                }

                if(firstResize) {
                    firstResize = false;
                }

                imageSrcWillChange = false;

            });

            gallery.listen('gettingData', function(index, item) {
                if( useLargeImages ) {
                    item.src = item.o.src;
                    item.w = item.o.w;
                    item.h = item.o.h;
                } else {
                    item.src = item.m.src;
                    item.w = item.m.w;
                    item.h = item.m.h;
                }
            });

            gallery.init();
        };

        // select all gallery elements
        var galleryElements = document.querySelectorAll( gallerySelector );
        for(var i = 0, l = galleryElements.length; i < l; i++) {
            galleryElements[i].setAttribute('data-pswp-uid', i+1);
            galleryElements[i].onclick = onThumbnailsClick;
        }

        // Parse URL and open gallery if it contains #&pid=3&gid=1
        var hashData = photoswipeParseHash();
        if(hashData.pid && hashData.gid) {
            openPhotoSwipe( hashData.pid,  galleryElements[ hashData.gid - 1 ], true, true );
        }
    }
}

window.photoswipe = {
    init: function (dom) {
        photoswipeObj.createGalleryDialog(dom);
    },
    createImgTpl: function (obj, cb) {
        return photoswipeObj.createImgTpl(obj);
    }
}