/* NicEdit - Micro Inline WYSIWYG
 * Copyright 2007-2008 Brian Kirchoff
 *
 * NicEdit is distributed under the terms of the MIT license
 * For more information visit http://nicedit.com/
 * Do not remove this copyright message
 */
var bkExtend = function(){
	var args = arguments;
	if (args.length == 1) args = [this, args[0]];
	for (var prop in args[1]) args[0][prop] = args[1][prop];
	return args[0];
};
function bkClass() { }
bkClass.prototype.construct = function() {};
bkClass.extend = function(def) {
  var classDef = function() {
      if (arguments[0] !== bkClass) { return this.construct.apply(this, arguments); }
  };
  var proto = new this(bkClass);
  bkExtend(proto,def);
  classDef.prototype = proto;
  classDef.extend = this.extend;
  return classDef;
};

var bkElement = bkClass.extend({
	construct : function(elm,d) {
		if(typeof(elm) == "string") {
			elm = (d || document).createElement(elm);
		}
		elm = $BK(elm);
		return elm;
	},

	appendTo : function(elm) {
		elm.appendChild(this);
		return this;
	},

	appendBefore : function(elm) {
		elm.parentNode.insertBefore(this,elm);
		return this;
	},

	addEvent : function(type, fn) {
		bkLib.addEvent(this,type,fn);
		return this;
	},

	setContent : function(c) {
		this.innerHTML = c;
		return this;
	},

	pos : function() {
		var curleft = curtop = 0;
		var o = obj = this;
		if (obj.offsetParent) {
			do {
				curleft += obj.offsetLeft;
				curtop += obj.offsetTop;
			} while (obj = obj.offsetParent);
		}
		var b = (!window.opera) ? parseInt(this.getStyle('border-width') || this.style.border) || 0 : 0;
		return [curleft+b,curtop+b+this.offsetHeight];
	},

	noSelect : function() {
		bkLib.noSelect(this);
		return this;
	},

	parentTag : function(t) {
		var elm = this;
		 do {
			if(elm && elm.nodeName && elm.nodeName.toUpperCase() == t) {
				return elm;
			}
			elm = elm.parentNode;
		} while(elm);
		return false;
	},

	hasClass : function(cls) {
		return this.className.match(new RegExp('(\\s|^)nicEdit-'+cls+'(\\s|$)'));
	},

	addClass : function(cls) {
		if (!this.hasClass(cls)) { this.className += " nicEdit-"+cls };
		return this;
	},

	removeClass : function(cls) {
		if (this.hasClass(cls)) {
			this.className = this.className.replace(new RegExp('(\\s|^)nicEdit-'+cls+'(\\s|$)'),' ');
		}
		return this;
	},

	setStyle : function(st) {
		var elmStyle = this.style;
		for(var itm in st) {
			switch(itm) {
				case 'float':
					elmStyle['cssFloat'] = elmStyle['styleFloat'] = st[itm];
					break;
				case 'opacity':
					elmStyle.opacity = st[itm];
					elmStyle.filter = "alpha(opacity=" + Math.round(st[itm]*100) + ")";
					break;
				case 'className':
					this.className = st[itm];
					break;
				default:
					//if(document.compatMode || itm != "cursor") { // Nasty Workaround for IE 5.5
						elmStyle[itm] = st[itm];
					//}
			}
		}
		return this;
	},

	getStyle : function( cssRule, d ) {
		var doc = (!d) ? document.defaultView : d;
		if(this.nodeType == 1)
		return (doc && doc.getComputedStyle) ? doc.getComputedStyle( this, null ).getPropertyValue(cssRule) : this.currentStyle[ bkLib.camelize(cssRule) ];
	},

	remove : function() {
		this.parentNode.removeChild(this);
		return this;
	},

	setAttributes : function(at) {
		for(var itm in at) {
			this[itm] = at[itm];
		}
		return this;
	}
});

var bkLib = {
	isMSIE : (navigator.appVersion.indexOf("MSIE") != -1),

	addEvent : function(obj, type, fn) {
		(obj.addEventListener) ? obj.addEventListener( type, fn, false ) : obj.attachEvent("on"+type, fn);
	},

	toArray : function(iterable) {
		var length = iterable.length, results = new Array(length);
    	while (length--) { results[length] = iterable[length] };
    	return results;
	},

	noSelect : function(element) {
		if(element.setAttribute && element.nodeName.toLowerCase() != 'input' && element.nodeName.toLowerCase() != 'textarea') {
			element.setAttribute('unselectable','on');
		}
		for(var i=0;i<element.childNodes.length;i++) {
			bkLib.noSelect(element.childNodes[i]);
		}
	},
	camelize : function(s) {
		return s.replace(/\-(.)/g, function(m, l){return l.toUpperCase()});
	},
	inArray : function(arr,item) {
	    return (bkLib.search(arr,item) != null);
	},
	search : function(arr,itm) {
		for(var i=0; i < arr.length; i++) {
			if(arr[i] == itm)
				return i;
		}
		return null;
	},
	cancelEvent : function(e) {
		e = e || window.event;
		if(e.preventDefault && e.stopPropagation) {
			e.preventDefault();
			e.stopPropagation();
		}
		return false;
	},
	domLoad : [],
	domLoaded : function() {
		if (arguments.callee.done) return;
		arguments.callee.done = true;
		for (i = 0;i < bkLib.domLoad.length;i++) bkLib.domLoad[i]();
	},
	onDomLoaded : function(fireThis) {
		this.domLoad.push(fireThis);
		if (document.addEventListener) {
			document.addEventListener("DOMContentLoaded", bkLib.domLoaded, null);
		} else if(bkLib.isMSIE) {
			document.write("<style>.nicEdit-main p { margin: 0; }</style><scr"+"ipt id=__ie_onload defer " + ((location.protocol == "https:") ? "src='javascript:void(0)'" : "src=//0") + "><\/scr"+"ipt>");
			$BK("__ie_onload").onreadystatechange = function() {
			    if (this.readyState == "complete"){bkLib.domLoaded();}
			};
		}
	    window.onload = bkLib.domLoaded;
	}
};

function $BK(elm) {
	if(typeof(elm) == "string") {
		elm = document.getElementById(elm);
	}
	return (elm && !elm.appendTo) ? bkExtend(elm,bkElement.prototype) : elm;
}

var bkEvent = {
	addEvent : function(evType, evFunc) {
		if(evFunc) {
			this.eventList = this.eventList || {};
			this.eventList[evType] = this.eventList[evType] || [];
			this.eventList[evType].push(evFunc);
		}
		return this;
	},
	fireEvent : function() {
		var args = bkLib.toArray(arguments), evType = args.shift();
		if(this.eventList && this.eventList[evType]) {
			for(var i=0;i<this.eventList[evType].length;i++) {
				this.eventList[evType][i].apply(this,args);
			}
		}
	}
};

function __(s) {
	return s;
}

Function.prototype.closure = function() {
  var __method = this, args = bkLib.toArray(arguments), obj = args.shift();
  return function() { if(typeof(bkLib) != 'undefined') { return __method.apply(obj,args.concat(bkLib.toArray(arguments))); } };
}

Function.prototype.closureListener = function() {
  	var __method = this, args = bkLib.toArray(arguments), object = args.shift();
  	return function(e) {
  	e = e || window.event;
  	if(e.target) { var target = e.target; } else { var target =  e.srcElement };
	  	return __method.apply(object, [e,target].concat(args) );
	};
}





/* START CONFIG */

var nicEditorConfig = bkClass.extend({
	buttons : {
		'bold' : {name : __('Bold'), command : 'Bold', tags : ['B','STRONG'], css : {'font-weight' : 'bold'}, key : 'b'},
		'italic' : {name : __('Italic'), command : 'Italic', tags : ['EM','I'], css : {'font-style' : 'italic'}, key : 'i'},
		'underline' : {name : __('Underline'), command : 'Underline', tags : ['U'], css : {'text-decoration' : 'underline'}, key : 'u'},
		'undo' : {name : 'Undo', command : 'undo', noActive : true, tile : 23},
        'redo' : {name : 'Redo', command : 'redo', noActive : true, tile : 24},
		'left' : {name : __('Align Left'), command : 'justifyleft', noActive : true},
		'center' : {name : __('Align Center'), command : 'justifycenter', noActive : true},
		'right' : {name : __('Align Right'), command : 'justifyright', noActive : true},
		'justify' : {name : __('Align Justify'), command : 'justifyfull', noActive : true},
		'ol' : {name : __('Numbered List'), command : 'insertorderedlist', tags : ['OL']},
		'ul' : 	{name : __('Bulleted List'), command : 'insertunorderedlist', tags : ['UL']},
		'subscript' : {name : __('Subscript'), command : 'subscript', tags : ['SUB']},
		'superscript' : {name : __('Superscript'), command : 'superscript', tags : ['SUP']},
		'strikethrough' : {name : __('Strike Through'), command : 'strikeThrough', css : {'text-decoration' : 'line-through'}},
		'removeformat' : {name : __('Remove Formatting'), command : 'removeformat', noActive : true},
		'indent' : {name : __('Indent Text'), command : 'indent', noActive : true},
		'outdent' : {name : __('Remove Indent'), command : 'outdent', noActive : true},
		'hr' : {name : __('Horizontal Rule'), command : 'insertHorizontalRule', noActive : true}
	},
	iconsPath : base_url+'/webappassets/images-front/nicEditorIcons.png?v=6-20-2013',
	buttonList : ['save','bold','italic','underline','left','center','right','justify','ol','ul','fontSize','fontFamily','fontFormat','indent','outdent','image','upload','link','unlink','forecolor','bgcolor'],
	iconList : {"bgcolor":1,"forecolor":2,"bold":3,"center":4,"hr":6,"indent":14,"italic":7,"justify":8,"left":5,"ol":10,"outdent":12,"removeformat":13,"right":9,"save":24,"strikethrough":16,"subscript":17,"superscript":18,"ul":15,"underline":16,"link":18,"unlink":19,"close":27,"arrow":25,"xhtml":1,"undo":20,"redo":21}

});
/* END CONFIG */



var nicEditors = {
	nicPlugins : [],
	editors : [],

	registerPlugin : function(plugin,options) {
		this.nicPlugins.push({p : plugin, o : options});
	},

	allTextAreas : function(nicOptions) {
		var textareas = document.getElementsByTagName("textarea");
		for(var i=0;i<textareas.length;i++) {
			nicEditors.editors.push(new nicEditor(nicOptions).panelInstance(textareas[i]));
		}
		return nicEditors.editors;
	},

	findEditor : function(e) {
		var editors = nicEditors.editors;
		for(var i=0;i<editors.length;i++) {
			if(editors[i].instanceById(e)) {
				return editors[i].instanceById(e);
			}
		}
	}
};


var nicEditor = bkClass.extend({
	construct : function(o) {
		this.options = new nicEditorConfig();
		bkExtend(this.options,o);
		this.nicInstances = new Array();
		this.loadedPlugins = new Array();

		var plugins = nicEditors.nicPlugins;
		for(var i=0;i<plugins.length;i++) {
			this.loadedPlugins.push(new plugins[i].p(this,plugins[i].o));
		}
		nicEditors.editors.push(this);
		bkLib.addEvent(document.body,'mousedown', this.selectCheck.closureListener(this) );
	},

	panelInstance : function(e,o) {
		e = this.checkReplace($BK(e));
		var panelElm = new bkElement('DIV').setStyle({width : (parseInt(e.getStyle('width')) || e.clientWidth)+'px'}).appendBefore(e);
		this.setPanel(panelElm);
		return this.addInstance(e,o);
	},

	checkReplace : function(e) {
		var r = nicEditors.findEditor(e);
		if(r) {
			r.removeInstance(e);
			r.removePanel();
		}
		return e;
	},

	addInstance : function(e,o) {
		e = this.checkReplace($BK(e));
		if( e.contentEditable || !!window.opera ) {
			var newInstance = new nicEditorInstance(e,o,this);
		} else {
			var newInstance = new nicEditorIFrameInstance(e,o,this);
		}
		this.nicInstances.push(newInstance);
		return this;
	},

	removeInstance : function(e) {
		e = $BK(e);
		var instances = this.nicInstances;
		for(var i=0;i<instances.length;i++) {
			if(instances[i].e == e) {
				instances[i].remove();
				this.nicInstances.splice(i,1);
			}
		}
	},

	removePanel : function(e) {
		if(this.nicPanel) {
			this.nicPanel.remove();
			this.nicPanel = null;
		}
	},

	instanceById : function(e) {
		e = $BK(e);
		var instances = this.nicInstances;
		for(var i=0;i<instances.length;i++) {
			if(instances[i].e == e) {
				return instances[i];
			}
		}
	},

	setPanel : function(e) {
		this.nicPanel = new nicEditorPanel($BK(e),this.options,this);
		this.fireEvent('panel',this.nicPanel);
		return this;
	},

	nicCommand : function(cmd,args) {
		if(this.selectedInstance) {
			this.selectedInstance.nicCommand(cmd,args);
		}
	},

	getIcon : function(iconName,options) {
		var icon = this.options.iconList[iconName];
		var file = (options.iconFiles) ? options.iconFiles[iconName] : '';
		return {backgroundImage : "url('"+((icon) ? this.options.iconsPath : file)+"')", backgroundPosition : ((icon) ? ((icon-1)*-32) : 0)+'px 0px'};
	},

	selectCheck : function(e,t) {
		var found = false;
		do{
			if(t.className && t.className.indexOf('nicEdit') != -1) {
				return false;
			}
		} while(t = t.parentNode);
		this.fireEvent('blur',this.selectedInstance,t);
		this.lastSelectedInstance = this.selectedInstance;
		this.selectedInstance = null;
		return false;
	}

});
nicEditor = nicEditor.extend(bkEvent);




var nicEditorInstance = bkClass.extend({
	isSelected : false,

	construct : function(e,options,nicEditor) {
		this.ne = nicEditor;
		this.elm = this.e = e;
		this.options = options || {};

		newX = parseInt(e.getStyle('width')) || e.clientWidth;
		newY = parseInt(e.getStyle('height')) || e.clientHeight;
		this.initialHeight = newY-8;

		var isTextarea = (e.nodeName.toLowerCase() == "textarea");
		if(isTextarea || this.options.hasPanel) {
			var ie7s = (bkLib.isMSIE && !((typeof document.body.style.maxHeight != "undefined") && document.compatMode == "CSS1Compat"))
			var s = {width: newX+'px', border : '1px solid #ccc', borderTop : 0, overflowY : 'auto', overflowX: 'hidden' };
			s[(ie7s) ? 'height' : 'maxHeight'] = (this.ne.options.maxHeight) ? this.ne.options.maxHeight+'px' : null;
			this.editorContain = new bkElement('DIV').setStyle(s).appendBefore(e);


			/* CLEAN WORD PASTE MOD */
            //var editorElm = new bkElement('DIV').setAttributes({id : e.id}).setStyle({width : (newX-8)+'px', margin: '4px', minHeight : newY+'px'}).addClass('main').appendTo(this.editorContain);
            var editorElm = new bkElement('DIV').setStyle({width : (newX-8)+'px', margin: '4px', minHeight : newY+'px'}).addClass('main').appendTo(this.editorContain);

			e.setStyle({display : 'none'});

			editorElm.innerHTML = e.innerHTML;
			if(isTextarea) {
				editorElm.setContent(e.value);
				this.copyElm = e;
				var f = e.parentTag('FORM');
				if(f) { bkLib.addEvent( f, 'submit', this.saveContent.closure(this)); }
			}
			editorElm.setStyle((ie7s) ? {height : newY+'px'} : {overflow: 'hidden'});
			this.elm = editorElm;
		}
		this.ne.addEvent('blur',this.blur.closure(this));

		this.init();
		this.blur();
	},

	init : function() {
		this.elm.setAttribute('contentEditable','true');
		if(this.getContent() == "") {
			if(ie != 1)
				this.setContent('<br />');
		}
		this.instanceDoc = document.defaultView;
		this.elm.addEvent('mousedown',this.selected.closureListener(this)).addEvent('mouseup',this.selected.closureListener(this)).addEvent('keypress',this.keyDown.closureListener(this)).addEvent('focus',this.selected.closure(this)).addEvent('blur',this.blur.closure(this)).addEvent('keyup',this.selected.closure(this));
		this.ne.fireEvent('add',this);



		 /* CLEAN WORD PASTE MOD */
        this.elm.addEvent('paste',this.initPasteClean.closureListener(this));



	},

	initPasteClean : function() {
        this.pasteCache = this.getElm().innerHTML;
        setTimeout(this.pasteClean.closure(this),100);
    },

	  /* CLEAN WORD PASTE MOD : pasteClean method added for clean word paste */
    pasteClean : function() {
        var matchedHead = "";
        var matchedTail = "";
        var newContent = this.getElm().innerHTML;
        this.ne.fireEvent("get",this);
        var newContentStart = 0;
        var newContentFinish = 0;
        var newSnippet = "";
        var tempNode = document.createElement("div");

        /* Find start of both strings that matches */

        for (newContentStart = 0; newContent.charAt(newContentStart) == this.pasteCache.charAt(newContentStart); newContentStart++)
        {
            matchedHead += this.pasteCache.charAt(newContentStart);
        }

        /* If newContentStart is inside a HTML tag, move to opening brace of tag */
        for (var i = newContentStart; i >= 0; i--)
        {
            if (this.pasteCache.charAt(i) == "<")
            {
                newContentStart = i;
                matchedHead = this.pasteCache.substring(0, newContentStart);

                break;
            }
            else if(this.pasteCache.charAt(i) == ">")
            {
                break;
            }
        }

        newContent = this.reverse(newContent);
        this.pasteCache = this.reverse(this.pasteCache);

        /* Find end of both strings that matches */
        for (newContentFinish = 0; newContent.charAt(newContentFinish) == this.pasteCache.charAt(newContentFinish); newContentFinish++)
        {
            matchedTail += this.pasteCache.charAt(newContentFinish);
        }

        /* If newContentFinish is inside a HTML tag, move to closing brace of tag */
        for (var i = newContentFinish; i >= 0; i--)
        {
            if (this.pasteCache.charAt(i) == ">")
            {
                newContentFinish = i;
                matchedTail = this.pasteCache.substring(0, newContentFinish);

                break;
            }
            else if(this.pasteCache.charAt(i) == "<")
            {
                break;
            }
        }

        matchedTail = this.reverse(matchedTail);

        /* If there's no difference in pasted content */
        if (newContentStart == newContent.length - newContentFinish)
        {
            return false;
        }

        newContent = this.reverse(newContent);
        newSnippet = newContent.substring(newContentStart, newContent.length - newContentFinish);
        newSnippet = this.validTags(newSnippet);

        /* Replace opening bold tags with strong */
        newSnippet = newSnippet.replace(/<b(\s+|>)/g, "<strong$1");
        /* Replace closing bold tags with closing strong */
        newSnippet = newSnippet.replace(/<\/b(\s+|>)/g, "</strong$1");

        /* Replace italic tags with em */
        newSnippet = newSnippet.replace(/<i(\s+|>)/g, "<em$1");
        /* Replace closing italic tags with closing em */
        newSnippet = newSnippet.replace(/<\/i(\s+|>)/g, "</em$1");

        /* strip out comments -cgCraft */
        newSnippet = newSnippet.replace(/<!(?:--[\s\S]*?--\s*)?>\s*/g, "");

        /* strip out &nbsp; -cgCraft */
        newSnippet = newSnippet.replace(/&nbsp;/gi, " ");
        /* strip out extra spaces -cgCraft */
        newSnippet = newSnippet.replace(/ <\//gi, "</");

        while (newSnippet.indexOf("  ") != -1) {
            var anArray = newSnippet.split("  ")
            newSnippet = anArray.join(" ")
        }

        /* strip &nbsp; -cgCraft */
        newSnippet = newSnippet.replace(/^\s*|\s*$/g, "");

        /* Strip out unaccepted attributes */

        newSnippet = newSnippet.replace(/<[^>]*>/g, function(match)
            {
                match = match.replace(/ ([^=]+)="[^"]*"/g, function(match2, attributeName)
                    {
                        if (attributeName == "alt" || attributeName == "href" || attributeName == "src" || attributeName == "title")
                        {
                            return match2;
                        }

                        return "";
                    });

                return match;
            }
            );

        /* Final cleanout for MS Word cruft */
        newSnippet = newSnippet.replace(/<\?xml[^>]*>/g, "");
        newSnippet = newSnippet.replace(/<[^ >]+:[^>]*>/g, "");
        newSnippet = newSnippet.replace(/<\/[^ >]+:[^>]*>/g, "");

        /* remove undwanted tags */
        newSnippet = newSnippet.replace(/<(div|span|style|meta|link){1}.*?>/gi,'');

        this.content = matchedHead + newSnippet + matchedTail;
        this.ne.fireEvent("set",this);
        this.elm.innerHTML = this.content;
    },

    reverse : function(sentString) {
        var theString = "";
        for (var i = sentString.length - 1; i >= 0; i--) {
            theString += sentString.charAt(i);
        }
        return theString;
    },

    /* CLEAN WORD PASTE MOD : validTags method added for clean word paste */
    validTags : function(snippet) {
        var theString = snippet;

        /* Replace uppercase element names with lowercase */
        theString = theString.replace(/<[^> ]*/g, function(match){return match.toLowerCase();});

        /* Replace uppercase attribute names with lowercase */
        theString = theString.replace(/<[^>]*>/g, function(match) {
            match = match.replace(/ [^=]+=/g, function(match2){return match2.toLowerCase();});
            return match;
        });

        /* Put quotes around unquoted attributes */
        theString = theString.replace(/<[^>]*>/g, function(match) {
            match = match.replace(/( [^=]+=)([^"][^ >]*)/g, "$1\"$2\"");
            return match;
        });

        return theString;
    },









	remove : function() {
		this.saveContent();
		if(this.copyElm || this.options.hasPanel) {
			this.editorContain.remove();
			this.e.setStyle({'display' : 'block'});
			this.ne.removePanel();
		}
		this.disable();
		this.ne.fireEvent('remove',this);
	},

	disable : function() {
		this.elm.setAttribute('contentEditable','false');
	},

	getSel : function() {
		return (window.getSelection) ? window.getSelection() : document.selection;
	},

	/* getRng : function() {
		var s = this.getSel();
		if(!s) { return null; }
		return (s.rangeCount > 0) ? s.getRangeAt(0) : s.createRange();
	}, */
	getRng : function() {
		var s = this.getSel();
		if(!s) { return null; }

		return (s.rangeCount > 0) ? s.getRangeAt(0) :
		s.createRange && s.createRange() || document.createRange();
	},

	selRng : function(rng,s) {
		if(window.getSelection) {
			s.removeAllRanges();
			s.addRange(rng);
		} else {
			rng.select();
		}
	},

	selElm : function() {
		var r = this.getRng();
		if(!r) { return; }
		if(r.startContainer) {
			var contain = r.startContainer;
			if(r.cloneContents().childNodes.length == 1) {
				for(var i=0;i<contain.childNodes.length;i++) {
					var rng = contain.childNodes[i].ownerDocument.createRange();
					rng.selectNode(contain.childNodes[i]);
					if(r.compareBoundaryPoints(Range.START_TO_START,rng) != 1 &&
						r.compareBoundaryPoints(Range.END_TO_END,rng) != -1) {
						return $BK(contain.childNodes[i]);
					}
				}
			}
			return $BK(contain);
		} else {
			return $BK((this.getSel().type == "Control") ? r.item(0) : r.parentElement());
		}
	},

	saveRng : function() {
		this.savedRange = this.getRng();
		this.savedSel = this.getSel();
	},

	restoreRng : function() {
		if(this.savedRange) {
			this.selRng(this.savedRange,this.savedSel);
		}
	},

	keyDown : function(e,t) {
		if(e.ctrlKey) {
			this.ne.fireEvent('key',this,e);
		}
	},

	selected : function(e,t) {
		//if(!t) {t = this.selElm()}
		if(!t && !(t = this.selElm)) { t = this.selElm(); }
		if(!e.ctrlKey) {
			var selInstance = this.ne.selectedInstance;
			if(selInstance != this) {
				if(selInstance) {
					this.ne.fireEvent('blur',selInstance,t);
				}
				this.ne.selectedInstance = this;
				this.ne.fireEvent('focus',selInstance,t);
			}
			this.ne.fireEvent('selected',selInstance,t);
			this.isFocused = true;
			this.elm.addClass('selected');
		}
		return false;
	},

	blur : function() {
		this.isFocused = false;
		this.elm.removeClass('selected');
	},

	saveContent : function() {
		if(this.copyElm || this.options.hasPanel) {
			this.ne.fireEvent('save',this);
			(this.copyElm) ? this.copyElm.value = this.getContent() : this.e.innerHTML = this.getContent();
		}
	},

	getElm : function() {
		return this.elm;
	},

	getContent : function() {
		this.content = this.getElm().innerHTML;
		this.ne.fireEvent('get',this);
		return this.content;
	},

	setContent : function(e) {
		this.content = e;
		this.ne.fireEvent('set',this);
		this.elm.innerHTML = this.content;
	},

	/* nicCommand : function(cmd,args) {
		document.execCommand(cmd,false,args);
	}
	/////////////////////////////////////////
	updated on 7 Nov, by pravin@maxixx.com to rectify the FireFOx Bug for text-alignment issues in 1st line
	*/

	nicCommand : function(cmd,args) {

		if ((cmd == 'justifyright') || (cmd == 'justifyleft') || (cmd == 'justifycenter') || (cmd == 'justifyfull')) {
              try {
                 document.execCommand(cmd, false, null);
              }
              catch (e) {
                 //special case for Mozilla Bug #442186

                 if (e && e.result == 2147500037) {
                    //probably firefox bug 442186 - workaround
                    var range = window.getSelection().getRangeAt(0);
                    var dummy = document.createElement('div');

                     //To restore the range after collapsing for triple click bug...
                     var restoreSelection = false;
                    dummy.style.height="1px;";

                    //find node with contentEditable

                    //Triple Click selection Problem in mozilla, the selection contains the content editable div, which creates a problem for some reason, so we collapse the selection to the end, and then re-select everything...
                    if(range.startContainer.contentEditable == 'true'){
                        window.getSelection().collapseToEnd();
                        restoreSelection = true;
                    }

                    var ceNode = window.getSelection().getRangeAt(0).startContainer;













                    while (ceNode && ceNode.contentEditable != 'true')
                       ceNode = ceNode.parentNode;

                    if (!ceNode) throw 'Selected node is not editable!';

                    ceNode.insertBefore(dummy, ceNode.childNodes[0]);
                    document.execCommand(cmd, false, null);
                    dummy.parentNode.removeChild(dummy);

                     //RestoreSelection if we changed it...
                     if(restoreSelection){
                        window.getSelection().addRange(range);
                     }
                 } else if (console && console.log) console.log(e);
              }
           } else {
              document.execCommand(cmd, false, args);
      }
	}


});

var nicEditorIFrameInstance = nicEditorInstance.extend({
	savedStyles : [],

	init : function() {
		var c = this.elm.innerHTML.replace(/^\s+|\s+$/g, '');
		this.elm.innerHTML = '';
		(!c) ? c = "<br />" : c;
		this.initialContent = c;

		this.elmFrame = new bkElement('iframe').setAttributes({'src' : 'javascript:;', 'frameBorder' : 0, 'allowTransparency' : 'true', 'scrolling' : 'no'}).setStyle({height: '100px', width: '100%'}).addClass('frame').appendTo(this.elm);

		if(this.copyElm) { this.elmFrame.setStyle({width : (this.elm.offsetWidth-4)+'px'}); }

		var styleList = ['font-size','font-family','font-weight','color'];
		for(itm in styleList) {
			this.savedStyles[bkLib.camelize(itm)] = this.elm.getStyle(itm);
		}

		setTimeout(this.initFrame.closure(this),50);
	},

	disable : function() {
		this.elm.innerHTML = this.getContent();
	},

	initFrame : function() {
		var fd = $BK(this.elmFrame.contentWindow.document);
		fd.designMode = "on";
		fd.open();
		var css = this.ne.options.externalCSS;
		fd.write('<html><head>'+((css) ? '<link href="'+css+'" rel="stylesheet" type="text/css" />' : '')+'</head><body id="nicEditContent" style="margin: 0 !important; background-color: transparent !important;">'+this.initialContent+'</body></html>');
		fd.close();
		this.frameDoc = fd;

		this.frameWin = $BK(this.elmFrame.contentWindow);
		this.frameContent = $BK(this.frameWin.document.body).setStyle(this.savedStyles);
		this.instanceDoc = this.frameWin.document.defaultView;

		this.heightUpdate();
		this.frameDoc.addEvent('mousedown', this.selected.closureListener(this)).addEvent('keyup',this.heightUpdate.closureListener(this)).addEvent('keydown',this.keyDown.closureListener(this)).addEvent('keyup',this.selected.closure(this));
		this.ne.fireEvent('add',this);
	},

	getElm : function() {
		return this.frameContent;
	},

	setContent : function(c) {
		this.content = c;
		this.ne.fireEvent('set',this);
		this.frameContent.innerHTML = this.content;
		this.heightUpdate();
	},

	getSel : function() {
		return (this.frameWin) ? this.frameWin.getSelection() : this.frameDoc.selection;
	},

	heightUpdate : function() {
		this.elmFrame.style.height = Math.max(this.frameContent.offsetHeight,this.initialHeight)+'px';
	},

	nicCommand : function(cmd,args) {
		this.frameDoc.execCommand(cmd,false,args);
		setTimeout(this.heightUpdate.closure(this),100);
	}


});
var nicEditorPanel = bkClass.extend({
	construct : function(e,options,nicEditor) {
		this.elm = e;
		this.options = options;
		this.ne = nicEditor;
		this.panelButtons = new Array();
		this.buttonList = bkExtend([],this.ne.options.buttonList);

		this.panelContain = new bkElement('DIV').setStyle({overflow:"hidden",width:"auto",border:"1px solid #cccccc",backgroundColor:"#ccc",position:'fixed','top':'0px',left:'37.5%','text-align':'center'}).addClass('panelContain');
		this.panelElm = new bkElement('DIV').setStyle({margin : '0', zoom : 1, overflow : 'hidden'}).addClass('panel').appendTo(this.panelContain);
		this.panelContain.appendTo(e);

		var opt = this.ne.options;
		var buttons = opt.buttons;
		for(button in buttons) {
			this.addButton(button,opt,true);
		}
		this.reorder();
		e.noSelect();
	},

	addButton : function(buttonName,options,noOrder) {
		var button = options.buttons[buttonName];
		var type = (button['type']) ? eval('(typeof('+button['type']+') == "undefined") ? null : '+button['type']+';') : nicEditorButton;
		var hasButton = bkLib.inArray(this.buttonList,buttonName);
		if(type && (hasButton || this.ne.options.fullPanel)) {
			this.panelButtons.push(new type(this.panelElm,buttonName,options,this.ne));
			if(!hasButton) {
				this.buttonList.push(buttonName);
			}
		}
	},

	findButton : function(itm) {
		for(var i=0;i<this.panelButtons.length;i++) {
			if(this.panelButtons[i].name == itm)
				return this.panelButtons[i];
		}
	},

	reorder : function() {
		var bl = this.buttonList;
		for(var i=0;i<bl.length;i++) {
			var button = this.findButton(bl[i]);
			if(button) {
				this.panelElm.appendChild(button.margin);
			}
		}
	},

	remove : function() {
		this.elm.remove();
	}
});
var nicEditorButton = bkClass.extend({

	construct : function(e,buttonName,options,nicEditor) {
		this.options = options.buttons[buttonName];
		this.name = buttonName;
		this.ne = nicEditor;
		this.elm = e;

		this.margin = new bkElement('DIV').setStyle({'float' : 'left'}).appendTo(e);
		this.contain = new bkElement('DIV').setStyle({width : '31px', height : '30px'}).addClass('buttonContain').appendTo(this.margin);
		this.border = new bkElement('DIV').setStyle({backgroundColor : '#efefef'}).appendTo(this.contain);
		this.button = new bkElement('DIV').setStyle({width : '31px', height : '30px', overflow : 'hidden', zoom : 1, cursor : 'pointer'}).addClass('button').setStyle(this.ne.getIcon(buttonName,options)).appendTo(this.border);
		this.button.addEvent('mouseover', this.hoverOn.closure(this)).addEvent('mouseout',this.hoverOff.closure(this)).addEvent('mousedown',this.mouseClick.closure(this)).noSelect();

		if(!window.opera) {
			this.button.onmousedown = this.button.onclick = bkLib.cancelEvent;
		}

		nicEditor.addEvent('selected', this.enable.closure(this)).addEvent('blur', this.disable.closure(this)).addEvent('key',this.key.closure(this));

		this.disable();
		this.init();
	},

	init : function() {  },

	hide : function() {
		this.contain.setStyle({display : 'none'});
	},

	updateState : function() {
		if(this.isDisabled) { this.setBg(); }
		else if(this.isHover) { this.setBg('hover'); }
		else if(this.isActive) { this.setBg('active'); }
		else { this.setBg(); }
	},

	setBg : function(state) {
		switch(state) {
			case 'hover':
				var stateStyle = {border : '', backgroundColor : '#efefef'};
				break;
			case 'active':
				var stateStyle = {border : '', backgroundColor : '#efefef'};
				break;
			default:
				var stateStyle = {border : '', backgroundColor : '#efefef'};
		}
		this.border.setStyle(stateStyle).addClass('button-'+state);
	},

	checkNodes : function(e) {
		var elm = e;
		do {
			if(this.options.tags && bkLib.inArray(this.options.tags,elm.nodeName)) {
				this.activate();
				return true;
			}
		} while(elm = elm.parentNode && elm.className != "nicEdit");
		elm = $BK(e);
		while(elm.nodeType == 3) {
			elm = $BK(elm.parentNode);
		}
		if(this.options.css) {
			for(itm in this.options.css) {
				if(elm.getStyle(itm,this.ne.selectedInstance.instanceDoc) == this.options.css[itm]) {
					this.activate();
					return true;
				}
			}
		}
		this.deactivate();
		return false;
	},

	activate : function() {
		if(!this.isDisabled) {
			this.isActive = true;
			this.updateState();
			this.ne.fireEvent('buttonActivate',this);
		}
	},

	deactivate : function() {
		this.isActive = false;
		this.updateState();
		if(!this.isDisabled) {
			this.ne.fireEvent('buttonDeactivate',this);
		}
	},

	enable : function(ins,t) {
		this.isDisabled = false;
		this.contain.setStyle({'opacity' : 1}).addClass('buttonEnabled');
		this.updateState();
		this.checkNodes(t);
	},

	disable : function(ins,t) {
		this.isDisabled = true;
		this.contain.setStyle({'opacity' : 0.6}).removeClass('buttonEnabled');
		this.updateState();
	},

	toggleActive : function() {
		(this.isActive) ? this.deactivate() : this.activate();
	},

	hoverOn : function() {
		if(!this.isDisabled) {
			this.isHover = true;
			this.updateState();
			this.ne.fireEvent("buttonOver",this);
		}
	},

	hoverOff : function() {
		this.isHover = false;
		this.updateState();
		this.ne.fireEvent("buttonOut",this);
	},

	mouseClick : function() {
		if(this.options.command) {
			this.ne.nicCommand(this.options.command,this.options.commandArgs);
			if(!this.options.noActive) {
				this.toggleActive();
			}
		}
		this.ne.fireEvent("buttonClick",this);
	},

	key : function(nicInstance,e) {
		if(this.options.key && e.ctrlKey && String.fromCharCode(e.keyCode || e.charCode).toLowerCase() == this.options.key) {
			this.mouseClick();
			if(e.preventDefault) e.preventDefault();
		}
	}

});


var nicPlugin = bkClass.extend({

	construct : function(nicEditor,options) {
		this.options = options;
		this.ne = nicEditor;
		this.ne.addEvent('panel',this.loadPanel.closure(this));

		this.init();
	},

	loadPanel : function(np) {
		var buttons = this.options.buttons;
		for(var button in buttons) {
			np.addButton(button,this.options);
		}
		np.reorder();
	},

	init : function() {  }
});
 /* START CONFIG */
var nicPaneOptions = { };
/* END CONFIG */

var nicEditorPane = bkClass.extend({
	construct : function(elm,nicEditor,options,openButton) {
		this.ne = nicEditor;
		this.elm = elm;
		this.pos = elm.pos();
		var posleft = ((this.pos[0])+'px');

		// alert(posleft);

		this.contain = new bkElement('div').setStyle({zIndex : '99999', overflow : 'visible', 'position' : 'absolute', 'left' : posleft, 'top' : this.pos[1]+'px'})
		this.pane = new bkElement('div').setStyle({fontSize : '12px', border : '1px solid #ccc', overflow: 'hidden', padding : '4px', textAlign: 'left', backgroundColor : '#ffffc9'}).addClass('pane').setStyle(options).appendTo(this.contain);

		if(openButton && !openButton.options.noClose) {
			this.close = new bkElement('div').setStyle({'float' : 'right', height: '29px', width : '31px', cursor : 'pointer', position : 'relative', top : '6px', right : '7px'}).setStyle(this.ne.getIcon('close',nicPaneOptions)).addEvent('mousedown',openButton.removePane.closure(this)).appendTo(this.pane);
		}

		this.contain.noSelect().appendTo(document.body);

		this.position();
		this.init();
	},

	init : function() { },

	position : function() {
		if(this.ne.nicPanel) {
			var panelElm = this.ne.nicPanel.elm;
			var panelPos = panelElm.pos();
			var newLeft = panelPos[0]+parseInt(panelElm.getStyle('width'))-(parseInt(this.pane.getStyle('width'))+8);
			if(newLeft < this.pos[0]) {
				this.contain.setStyle({left : newLeft+'px'});
			}
		}
	},

	toggle : function() {
		this.isVisible = !this.isVisible;
		this.contain.setStyle({display : ((this.isVisible) ? 'block' : 'none')});
	},

	remove : function() {
		if(this.contain) {
			this.contain.remove();
			this.contain = null;
		}
	},

	append : function(c) {
		c.appendTo(this.pane);
	},

	setContent : function(c) {
		this.pane.setContent(c);
	}

});



var nicEditorAdvancedButton = nicEditorButton.extend({

	init : function() {
		this.ne.addEvent('selected',this.removePane.closure(this)).addEvent('blur',this.removePane.closure(this));
	},

	mouseClick : function() {
		if(!this.isDisabled) {
			if(this.pane && this.pane.pane) {
				this.removePane();
			} else {
				this.pane = new nicEditorPane(this.contain,this.ne,{width : (this.width || '270px'), backgroundColor : '#fff',position:'fixed',left:'700px'},this);
				this.addPane();
				this.ne.selectedInstance.saveRng();
			}
		}
	},

	addForm : function(f,elm) {
		this.form = new bkElement('form').addEvent('submit',this.submit.closureListener(this));
		this.pane.append(this.form);
		this.inputs = {};

		for(itm in f) {
			var field = f[itm];
			var val = '';
			if(elm) {
				val = elm.getAttribute(itm);
			}
			if(!val) {
				val = field['value'] || '';
			}
			var type = f[itm].type;

			if(type == 'title') {
					new bkElement('h5').setContent(field.txt).appendTo(this.form);
			} else {
				var contain = new bkElement('div').setStyle({overflow : 'hidden', clear : 'both'}).appendTo(this.form);
				if(field.txt) {
					new bkElement('label').setAttributes({'for' : itm}).setContent(field.txt).setStyle({margin : '2px 4px', fontSize : '13px', width: '50px', lineHeight : '22px', textAlign : 'right', 'float' : 'left'}).appendTo(contain);
				}

				switch(type) {
					case 'text':
						this.inputs[itm] = new bkElement('input').setAttributes({id : itm, 'value' : val, 'type' : 'text'}).setStyle({margin : '2px 0', fontSize : '13px', 'float' : 'left', height : '20px', border : '1px solid #ccc', overflow : 'hidden'}).setStyle(field.style).appendTo(contain);
						break;
					case 'select':
						this.inputs[itm] = new bkElement('select').setAttributes({id : itm}).setStyle({border : '1px solid #ccc', 'float' : 'left', margin : '2px 0'}).appendTo(contain);
						for(opt in field.options) {
							var o = new bkElement('option').setAttributes({value : opt, selected : (opt == val) ? 'selected' : ''}).setContent(field.options[opt]).appendTo(this.inputs[itm]);
						}
						break;
					case 'content':
						this.inputs[itm] = new bkElement('textarea').setAttributes({id : itm}).setStyle({border : '1px solid #ccc', 'float' : 'left'}).setStyle(field.style).appendTo(contain);
						this.inputs[itm].value = val;
				}
			}
		}
		new bkElement('input').setAttributes({'type' : 'submit'}).addClass("btn").appendTo(this.form);
		this.form.onsubmit = bkLib.cancelEvent;
	},

	submit : function() { },

	findElm : function(tag,attr,val) {
		var list = this.ne.selectedInstance.getElm().getElementsByTagName(tag);
		for(var i=0;i<list.length;i++) {
			if(list[i].getAttribute(attr) == val) {
				return $BK(list[i]);
			}
		}
	},

	removePane : function() {
		if(this.pane) {
			this.pane.remove();
			this.pane = null;
			this.ne.selectedInstance.restoreRng();
			document.getElementById('displaybox').style.display='none';
		}
	}
});


var nicButtonTips = bkClass.extend({
	construct : function(nicEditor) {
		this.ne = nicEditor;
		nicEditor.addEvent('buttonOver',this.show.closure(this)).addEvent('buttonOut',this.hide.closure(this));

	},

	show : function(button) {
		this.timer = setTimeout(this.create.closure(this,button),400);
	},

	create : function(button) {
		this.timer = null;
		if(!this.pane) {
			this.pane = new nicEditorPane(button.button,this.ne,{fontSize : '12px', marginTop : '5px',position:'fixed'});
			this.pane.setContent(button.options.name);
		}
	},

	hide : function(button) {
		if(this.timer) {
			clearTimeout(this.timer);
		}
		if(this.pane) {
			this.pane = this.pane.remove();
		}
	}
});
nicEditors.registerPlugin(nicButtonTips);



 /* START CONFIG */
var nicSelectOptions = {
	buttons : {
		'fontSize' : {name : __('Font Size'), type : 'nicEditorFontSizeSelect', command : 'fontsize'},
		'fontFamily' : {name : __('Font Type'), type : 'nicEditorFontFamilySelect', command : 'fontname'},
		'fontFormat' : {name : __('Select Font Format'), type : 'nicEditorFontFormatSelect', command : 'formatBlock'}
	}
};
/* END CONFIG */
var nicEditorSelect = bkClass.extend({

	construct : function(e,buttonName,options,nicEditor) {
		this.options = options.buttons[buttonName];
		this.elm = e;
		this.ne = nicEditor;
		this.name = buttonName;
		this.selOptions = new Array();

		this.margin = new bkElement('div').setStyle({'float' : 'left', margin : '0 1px 0 1px'}).appendTo(this.elm);
		this.contain = new bkElement('div').setStyle({width: '112px', height : '30px', cursor : 'pointer', overflow: 'hidden'}).addClass('selectContain').addEvent('click',this.toggle.closure(this)).appendTo(this.margin);
		this.items = new bkElement('div').setStyle({overflow : 'hidden', zoom : 1, paddingLeft : '3px', backgroundColor : '#fff'}).appendTo(this.contain);
		this.control = new bkElement('div').setStyle({overflow : 'hidden', 'float' : 'right', height: '30px', width : '31px'}).addClass('selectControl').setStyle(this.ne.getIcon('arrow',options)).appendTo(this.items);
		this.txt = new bkElement('div').setStyle({overflow : 'hidden', 'float' : 'left', width : '66px', height : '14px', marginTop : '8px', fontFamily : 'sans-serif', textAlign : 'center', fontSize : '12px'}).addClass('selectTxt').appendTo(this.items);

		if(!window.opera) {
			this.contain.onmousedown = this.control.onmousedown = this.txt.onmousedown = bkLib.cancelEvent;
		}

		this.margin.noSelect();

		this.ne.addEvent('selected', this.enable.closure(this)).addEvent('blur', this.disable.closure(this));

		this.disable();
		this.init();
	},

	disable : function() {
		this.isDisabled = true;
		this.close();
		this.contain.setStyle({opacity : 0.6});
	},

	enable : function(t) {
		this.isDisabled = false;
		this.close();
		this.contain.setStyle({opacity : 1});
	},

	setDisplay : function(txt) {
		this.txt.setContent(txt);
	},

	toggle : function() {
		if(!this.isDisabled) {
			(this.pane) ? this.close() : this.open();
		}
	},

	open : function() {
	//jQuery('.nicEdit-pane').remove();
	jQuery('.nicEdit-pane').hide('fast');
	//nicEditors.registerPlugin(nicPlugin,nicSelectOptions);
		this.pane = new nicEditorPane(this.items,this.ne,{width : '112px', padding: '0px', borderTop : 0, borderLeft : '1px solid #cccccc', borderRight : '1px solid #cccccc', borderBottom : '0px', backgroundColor : '#ffffff',position:'fixed'});

		for(var i=0;i<this.selOptions.length;i++) {
			var opt = this.selOptions[i];
			var itmContain = new bkElement('div').setStyle({overflow : 'hidden', borderBottom : '1px solid #cccccc', width: '112px', textAlign : 'left', cursor : 'pointer'});
			var itm = new bkElement('div').setStyle({padding : '0px 4px'}).setContent(opt[1]).appendTo(itmContain).noSelect();
			itm.addEvent('click',this.update.closure(this,opt[0])).addEvent('mouseover',this.over.closure(this,itm)).addEvent('mouseout',this.out.closure(this,itm)).setAttributes('id',opt[0]);
			this.pane.append(itmContain);
			if(!window.opera) {
				itm.onmousedown = bkLib.cancelEvent;
			}
		}
	},

	close : function() {
		if(this.pane) {
			this.pane = this.pane.remove();
		}
	},

	over : function(opt) {
		opt.setStyle({backgroundColor : '#ccc'});
	},

	out : function(opt) {
		opt.setStyle({backgroundColor : '#fff'});
	},


	add : function(k,v) {
		this.selOptions.push(new Array(k,v));
	},

	update : function(elm) {
		this.ne.nicCommand(this.options.command,elm);
		this.close();
	}
});

var nicEditorFontSizeSelect = nicEditorSelect.extend({
	//sel : {1 : '1&nbsp;(8pt)', 2 : '2&nbsp;(10pt)', 3 : '3&nbsp;(12pt)', 4 : '4&nbsp;(14pt)', 5 : '5&nbsp;(18pt)', 6 : '6&nbsp;(24pt)'},
	sel : {1 : 'AaBbCc', 2 : 'AaBbCc', 3 : 'AaBbCc', 4 : 'AaBbCc', 5 : 'AaBbCc', 6 : 'AaBbC', 7 : 'AaB'},
	init : function() {
		this.setDisplay('Font&nbsp;Size...');
		for(itm in this.sel) {
			this.add(itm,'<font size="'+itm+'">'+this.sel[itm]+'</font>');
		}
	}
});

var nicEditorFontFamilySelect = nicEditorSelect.extend({
	sel : {'arial' : 'Arial','comic sans ms' : 'Comic Sans','courier new' : 'Courier New','georgia' : 'Georgia', 'helvetica' : 'Helvetica', 'impact' : 'Impact', 'times new roman' : 'Times', 'trebuchet ms' : 'Trebuchet', 'verdana' : 'Verdana'},

	init : function() {
		this.setDisplay('Font&nbsp;Type...');
		for(itm in this.sel) {
			this.add(itm,'<font face="'+itm+'">'+this.sel[itm]+'</font>');
		}
	}
});

var nicEditorFontFormatSelect = nicEditorSelect.extend({
		sel : {'p' : 'Paragraph', 'pre' : 'Pre', 'h6' : 'Heading&nbsp;6', 'h5' : 'Heading&nbsp;5', 'h4' : 'Heading&nbsp;4', 'h3' : 'Heading&nbsp;3', 'h2' : 'Heading&nbsp;2', 'h1' : 'Heading&nbsp;1'},

	init : function() {
		this.setDisplay('Font&nbsp;Format...');
		for(itm in this.sel) {
			var tag = itm.toUpperCase();
			this.add('<'+tag+'>','<'+itm+' style="padding: 0px; margin: 0px;">'+this.sel[itm]+'</'+tag+'>');
		}
	}
});

nicEditors.registerPlugin(nicPlugin,nicSelectOptions);



/* START CONFIG */
var nicLinkOptions = {
	buttons : {
		'link' : {name : 'Link', type : 'nicLinkButton', tags : ['A']},
		'unlink' : {name : 'Unlink',  command : 'unlink', noActive : true}
	}
};
/* END CONFIG */

var nicLinkButton = nicEditorAdvancedButton.extend({
	addPane : function() {

		this.ln = this.ne.selectedInstance.selElm().parentTag('A');
		this.addForm({
			'' : {type : 'title', txt : 'Add/Edit Link'},
			'href' : {type : 'text', txt : 'URL', value : 'http://', style : {width: '150px'}}
		},this.ln);
		document.getElementById('displaybox').style.display='block';
		/* this.addForm({
			'' : {type : 'title', txt : 'Add/Edit Link'},
			'href' : {type : 'text', txt : 'URL', value : 'http://', style : {width: '150px'}},
			'title' : {type : 'text', txt : 'Title'},
			'target' : {type : 'select', txt : 'Open In', options : {'' : 'Current Window', '_blank' : 'New Window'},style : {width : '100px'}}
		},this.ln); */
	},

	submit : function(e) {
		var url = this.inputs['href'].value;
		url = url.replace(/^\s+|\s+$/g,"");
		filter = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,6})+$/;
		if (filter.test(url)) url = 'mailto:'+url;

		if(url == "http://" || url == "") {
			alert("You must enter a URL to Create a Link");
			return false;
		}
		this.removePane();

		if(!this.ln) {
			var tmp = 'javascript:nicTemp();';
			
			var id = this.ne.selectedInstance.e.getAttribute("id");
			document.getElementById(id).setAttribute("contenteditable","true");
			
			this.ne.nicCommand("createlink",tmp);
			this.ln = this.findElm('A','href',tmp);
			// MS: set the link text to the title or the url if there is no text selected
         if (this.ln.innerHTML == tmp) {
            this.ln.innerHTML = url;
         }
		}
		if(this.ln) {
			var oldTitle = this.ln.href;

			this.ln.setAttributes({
				href : url
				//href : this.inputs['href'].value
				//title : this.inputs['title'].value
				//target : '_blank'
				//target : this.inputs['target'].options[this.inputs['target'].selectedIndex].value
			});

			// MS: set the link text to the title or the url if the old text was the old title
			 if (this.ln.innerHTML == oldTitle) {
				this.ln.innerHTML= url;
				//this.ln.innerHTML= this.inputs['href'].value;
			 }
		}
	}
});

nicEditors.registerPlugin(nicPlugin,nicLinkOptions);



/* START CONFIG */
var nicColorOptions = {
	buttons : {
		'forecolor' : {name : __('Font Color'), type : 'nicEditorColorButton', noClose : true},
		'bgcolor' : {name : __('Background Color'), type : 'nicEditorBgColorButton', noClose : true}
	}
};
/* END CONFIG */

var nicEditorColorButton = nicEditorAdvancedButton.extend({

	addPane : function() {

			var pcolors = {0:'#FFFFFF', 1:'#FFCCCC', 2:'#FFCC99', 3:'#FFFF99', 4:'#FFFFCC', 5:'#99FF99', 6:'#99FFFF', 7:'#CCFFFF', 8:'#CCCCFF', 9:'#FFCCFF', 10:'#CCCCCC', 11:'#FF6666', 12:'#FF9966', 13:'#FFFF66', 14:'#FFFF33', 15:'#66FF99', 16:'#33FFFF', 17:'#66FFFF', 18:'#9999FF', 19:'#FF99FF', 20:'#C0C0C0', 21:'#FF0000', 22:'#FF9900', 23:'#FFCC66', 24:'#FFFF00', 25:'#33FF33', 26:'#66CCCC', 27:'#33CCFF', 28:'#6666CC', 29:'#CC66CC', 30:'#999999', 31:'#CC0000', 32:'#FF6600', 33:'#FFCC33', 34:'#FFCC00', 35:'#33CC00', 36:'#00CCCC', 37:'#3366FF', 38:'#6633FF', 39:'#CC33CC', 40:'#666666', 41:'#990000', 42:'#CC6600', 43:'#CC9933', 44:'#999900', 45:'#009900', 46:'#339999', 47:'#3333FF', 48:'#6600CC', 49:'#993399', 50:'#333333', 51:'#660000', 52:'#993300', 53:'#996633', 54:'#666600', 55:'#006600', 56:'#336666', 57:'#000099', 58:'#333399', 59:'#663366', 60:'#000000', 61:'#330000', 62:'#663300', 63:'#663333', 64:'#333300', 65:'#003300', 66:'#003333', 67:'#000066', 68:'#330099', 69:'#330033'};
			document.getElementById('displaybox').style.display='block';

			var colorItems = new bkElement('DIV').setStyle({width: '275px'});

this.ne.selectedInstance.restoreRng();
			for(var x in pcolors) {

						var colorCode =  pcolors[x];

						var colorSquare = new bkElement('DIV').setStyle({'cursor' : 'pointer', 'height' : '27px', 'float' : 'left'}).appendTo(colorItems);
						var colorBorder = new bkElement('DIV').setStyle({border: '2px solid #999999'}).appendTo(colorSquare);
						var colorInner = new bkElement('DIV').setStyle({backgroundColor : colorCode, overflow : 'hidden', width : '22px', height : '22px'}).addEvent('click',this.colorSelect.closure(this,colorCode)).addEvent('mouseover',this.on.closure(this,colorBorder)).addEvent('mouseout',this.off.closure(this,colorBorder,'#999999')).appendTo(colorBorder);



						if(!window.opera) {
							colorSquare.onmousedown = colorInner.onmousedown = bkLib.cancelEvent;
						}
			}
			var colorSelectedBox = new bkElement('INPUT').setAttributes({type:'text','id':'selectedcolor'}).setStyle({color:'#000000',width : '140px', height : '20px','margin-top':'5px'}).appendTo(colorItems);
			var colorSelectedSubmit = new bkElement('INPUT').addClass("btn").setAttributes({type:'button','value':'Apply'}).setStyle({backgroundColor : '#ff6500',color:'#ffffff',width : '75px', height : '34px','margin-top':'5px','margin-left':'5px', 'display' :'inline-block'}).addEvent('click',this.colorImplement.closure(this)).appendTo(colorItems);
			this.pane.append(colorItems.noSelect());
	},

	colorImplement : function() {
		var ci = ''+document.getElementById('selectedcolor').value,
				id = this.ne.selectedInstance.e.getAttribute("id");

		this.ne.selectedInstance.restoreRng();
		document.getElementById(id).setAttribute("contenteditable","true");
		this.ne.nicCommand("foreColor",ci);
		this.removePane();
	},
	colorSelect : function(c) {
		document.getElementById('selectedcolor').value= c;
	},

	on : function(colorBorder) {
		colorBorder.setStyle({border : '2px solid #000'});
	},

	off : function(colorBorder,colorCode) {
		colorBorder.setStyle({border : '2px solid '+colorCode});
	}
});

var nicEditorBgColorButton = nicEditorColorButton.extend({
	colorSelect : function(c) {
		this.ne.nicCommand('hiliteColor',c);
		this.removePane();
	}
});

nicEditors.registerPlugin(nicPlugin,nicColorOptions);



/* START CONFIG */
var nicSaveOptions = {
	buttons : {
		'save' : {name : __('Save this content'), type : 'nicEditorSaveButton'}
	}
};
/* END CONFIG */

var nicEditorSaveButton = nicEditorButton.extend({
	init : function() {
		if(!this.ne.options.onSave) {
			this.margin.setStyle({'display' : 'none'});
		}
	},
	mouseClick : function() {
		var onSave = this.ne.options.onSave;
		var selectedInstance = this.ne.selectedInstance;
		onSave(selectedInstance.getContent(), selectedInstance.elm.id, selectedInstance);
	}
});

nicEditors.registerPlugin(nicPlugin,nicSaveOptions);









nicEditor = nicEditor.extend({
        floatingPanel : function() {
                this.floating = new bkElement('DIV').setStyle({position: 'absolute', top : '-1000px'}).appendTo(document.body);
                this.addEvent('focus', this.reposition.closure(this)).addEvent('blur', this.hide.closure(this));
                this.setPanel(this.floating);
        },

        reposition : function() {
                var e = this.selectedInstance.e;
                this.floating.setStyle({ width : (parseInt(e.getStyle('width')) || e.clientWidth)+'px' });
                var top = e.offsetTop-this.floating.offsetHeight;
                if(top < 0) {
                        top = e.offsetTop+e.offsetHeight;
                }

                this.floating.setStyle({ top : top+'px', left : e.offsetLeft+'px', display : 'block' });
        },

        hide : function() {
                this.floating.setStyle({ top : '-1000px'});
        }
});



/*
Updated on 25Feb2013
*/

var nicXHTML = bkClass.extend({
	stripAttributes : ['_moz_dirty','_moz_resizing','_extended'],
	noShort : ['style','title','script','textarea','a'],
	cssReplace : {'font-weight:bold;' : 'strong', 'font-style:italic;' : 'em'},
	sizes : {1 : 'xx-small', 2 : 'x-small', 3 : 'small', 4 : 'medium', 5 : 'large', 6 : 'x-large'},

	construct : function(nicEditor) {
		this.ne = nicEditor;
		if(this.ne.options.xhtml) {
			nicEditor.addEvent('get',this.cleanup.closure(this));
		}
	},

	cleanup : function(ni) {
		var node = ni.getElm();
		var xhtml = this.toXHTML(node);
		ni.content = xhtml;
	},

	toXHTML : function(n,r,d) {
		var txt = '';
		var attrTxt = '';
		var cssTxt = '';
		var nType = n.nodeType;
		var nName = n.nodeName.toLowerCase();
		var nChild = n.hasChildNodes && n.hasChildNodes();
		var extraNodes = new Array();

		switch(nType) {
			case 1:
				var nAttributes = n.attributes;

				switch(nName) {
					case 'b':
						nName = 'strong';
						break;
					case 'i':
						nName = 'em';
						break;
					case 'font':
						nName = 'span';
						break;
				}

				if(r) {
					for(var i=0;i<nAttributes.length;i++) {
						var attr = nAttributes[i];

						var attributeName = attr.nodeName.toLowerCase();
						var attributeValue = attr.nodeValue;

						if(!attr.specified || !attributeValue || bkLib.inArray(this.stripAttributes,attributeName) || typeof(attributeValue) == "function") {
							continue;
						}

						switch(attributeName) {
							case 'style':
								var css = attributeValue.replace(/ /g,"");
								for(itm in this.cssReplace) {
									if(css.indexOf(itm) != -1) {
										extraNodes.push(this.cssReplace[itm]);
										css = css.replace(itm,'');
									}
								}
								cssTxt += css;
								attributeValue = "";
							break;
							case 'class':
								attributeValue = attributeValue.replace("Apple-style-span","");
							break;
							case 'size':
								cssTxt += "font-size:"+this.sizes[attributeValue]+';';
								attributeValue = "";
							break;
						}

						if(attributeValue) {
							attrTxt += ' '+attributeName+'="'+attributeValue+'"';
						}
					}

					if(cssTxt) {
						attrTxt += ' style="'+cssTxt+'"';
					}

					for(var i=0;i<extraNodes.length;i++) {
						txt += '<'+extraNodes[i]+'>';
					}

					if(attrTxt == "" && nName == "span") {
						r = false;
					}
					if(r) {
						txt += '<'+nName;
						if(nName != 'br') {
							txt += attrTxt;
						}
					}
				}



				if(!nChild && !bkLib.inArray(this.noShort,attributeName)) {
					if(r) {
						txt += ' />';
					}
				} else {
					if(r) {
						txt += '>';
					}

					for(var i=0;i<n.childNodes.length;i++) {
						var results = this.toXHTML(n.childNodes[i],true,true);
						if(results) {
							txt += results;
						}
					}
				}

				if(r && nChild) {
					txt += '</'+nName+'>';
				}

				for(var i=0;i<extraNodes.length;i++) {
					txt += '</'+extraNodes[i]+'>';
				}

				break;
			case 3:
				//if(n.nodeValue != '\n') {
					txt += n.nodeValue;
				//}
				break;
		}

		return txt;
	}
});
nicEditors.registerPlugin(nicXHTML);
/*
Updated on 25Feb2013
*/






































/* START CONFIG */
var nicCodeOptions = {
	buttons : {
		'xhtml' : {name : 'Edit HTML', type : 'nicCodeButton'}
	}

};
/* END CONFIG */

var nicCodeButton = nicEditorAdvancedButton.extend({
	width : '350px',

	addPane : function() {
		this.addForm({
			'' : {type : 'title', txt : 'Edit HTML'},
			'code' : {type : 'content', 'value' : this.ne.selectedInstance.getContent(), style : {width: '340px', height : '200px'}}
		});
		document.getElementById('displaybox').style.display='block';
	},

	submit : function(e) {
		var code = this.inputs['code'].value;
		this.ne.selectedInstance.setContent(code);
		this.removePane();
	}
});

nicEditors.registerPlugin(nicPlugin,nicCodeOptions);



/*globals bkClass, nicEditors */
/*jslint browser: true, plusplus: true, eqeq: true */

/* 
	nicEdit.plainTextPaste.js version 0.05 
	The basic structure of this is taken from 
		https://bitbucket.org/pykello/nicedit-improved/commits/05a42fe5ab60 and from 
		 Clean Word Paste Mod by Billy Flaherty (www.billyswebdesign.com/)
	You may consider any code by me (dwoof42@gmail.com) to be in the public domain.
	usage is trivial.  Include this file after nicEdit, and by default all html pasted into a nicEditor will be replaced by plain text.  You
	may set the options.plainTextMode property when creating the nicEditor to control this 
	   options.plainTextMode = 'ignore', do nothing
	   options.plainTextMode = 'plain' (default) : replace all pasted text with plain text (by using element.innerText)
	   options.plainTextMode = 'allowHtml':   NOT YET IMPLEMENTED: parse the pasted text, 
											allowing only those tags that are allowed by the current nicEditor
*/

(function (nicEditors) {
	"use strict";

	/* 
	*/


	var div;

	nicEditors.registerPlugin(bkClass.extend({

		construct: function (nicEditor) {
			if (nicEditor.options.pasteMode !== 'allow') {
				this.ne = nicEditor;
				nicEditor.addEvent('add', this.add.closureListener(this));
				this.pasteCache = '';
			}
		},

		add: function (instance) {
			this.elm = instance.elm;
			this.elm.addEvent('paste', this.initPasteClean.closureListener(this));
		},

		cleanup: function (ni) {

		},

		initPasteClean: function () {
			this.pasteCache = this.elm.innerHTML;
			setTimeout(this.pasteClean.closure(this), 100);
		},

		pasteClean: function () {
			var matchedHead = "",
				matchedTail = "",
				newContent = this.elm.innerHTML,
				newContentStart = 0,
				newContentFinish = 0,
				newSnippet = "",
				i;

			this.ne.fireEvent("get", this);

			/* Find start of both strings that matches */

			for (newContentStart = 0; newContent.charAt(newContentStart) === this.pasteCache.charAt(newContentStart); newContentStart++) {
				matchedHead += this.pasteCache.charAt(newContentStart);
			}

			/* If newContentStart is inside a HTML tag, move to opening brace of tag */
			for (i = newContentStart; i >= 0; i--) {
				if (this.pasteCache.charAt(i) == "<") {
					newContentStart = i;
					matchedHead = this.pasteCache.substring(0, newContentStart);

					break;
				} else if (this.pasteCache.charAt(i) === ">") {
					break;
				}
			}

			newContent = this.reverse(newContent);
			this.pasteCache = this.reverse(this.pasteCache);

			/* Find end of both strings that matches */
			for (newContentFinish = 0; newContent.charAt(newContentFinish) == this.pasteCache.charAt(newContentFinish); newContentFinish++) {
				matchedTail += this.pasteCache.charAt(newContentFinish);
			}

			/* If newContentFinish is inside a HTML tag, move to closing brace of tag */
			for (i = newContentFinish; i >= 0; i--) {
				if (this.pasteCache.charAt(i) == ">") {
					newContentFinish = i;
					matchedTail = this.pasteCache.substring(0, newContentFinish);

					break;
				} else if (this.pasteCache.charAt(i) == "<") {
					break;
				}
			}

			matchedTail = this.reverse(matchedTail);

			/* If there's no difference in pasted content */
			if (newContentStart == newContent.length - newContentFinish) {
				return false;
			}

			newContent = this.reverse(newContent);
			newSnippet = newContent.substring(newContentStart, newContent.length - newContentFinish);
			newSnippet = this.cleanPaste(newSnippet);

			this.content = matchedHead + newSnippet + matchedTail;
			this.ne.fireEvent("set", this);
			this.elm.innerHTML = this.content;
		},

		reverse: function (sentString) {
			var theString = "", i;
			for (i = sentString.length - 1; i >= 0; i--) {
				theString += sentString.charAt(i);
			}
			return theString;
		},

		cleanPaste: function (snippet) {
			var div, text;
			if (!div) {
				div = document.createElement('div');
			}
			div.innerHTML = snippet;
			return div.innerText || div.textContent;
		}

	}));


}(nicEditors));
