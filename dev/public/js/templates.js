this["JST"] = this["JST"] || {};

this["JST"]["modules/blog/templates/index"] = function(data) {
var __t, __p = '', __e = _.escape, __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
__p += '<div><div><span>this</span><span>SHOULD not be connected</span></div><ul>';
 _.each(data,function(post){ ;
__p += '<li><a href="/posts/' +
((__t = (post.id )) == null ? '' : __t) +
'">' +
((__t = (post.title )) == null ? '' : __t) +
'</a></li>';
 }); ;
__p += '</ul><h1>this is the header</h1><p>asdfasdf</p></div>';
return __p
};

this["JST"]["modules/blog/templates/read"] = function(data) {
var __t, __p = '', __e = _.escape;
__p += '<div><h1>' +
((__t = (data.title )) == null ? '' : __t) +
'</h1><p><i>by:</i>' +
((__t = (data.author )) == null ? '' : __t) +
'</p><p>' +
((__t = (data.text )) == null ? '' : __t) +
'</p></div>';
return __p
};

this["JST"]["modules/layout/templates/default"] = function(data) {
var __t, __p = '', __e = _.escape;
__p += '<div><a href="/">Home</a><hr><div id="content"></div></div>';
return __p
};