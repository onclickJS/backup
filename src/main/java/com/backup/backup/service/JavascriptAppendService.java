package com.backup.backup.service;

import java.util.ArrayList;
import java.util.List;

import com.gargoylesoftware.htmlunit.html.HtmlElement;
import com.gargoylesoftware.htmlunit.html.HtmlPage;

public class JavascriptAppendService implements AppendService {
	private static final List<String> jsList = new ArrayList<String>();

	public JavascriptAppendService() {
		jsList.add("web/vendor/jquery/jquery.min.js");
		jsList.add("web/vendor/jquery/jquery.tmpl.min.js");
		jsList.add("web/vendor/lodash/lodash.min.js");
		jsList.add("web/vendor/backbone/backbone-min.js");
		jsList.add("web/vendor/graphlib/graphlib.core.min.js");
		jsList.add("web/vendor/dagre/dagre.core.min.js");
		jsList.add("web/vendor/rappid/rappid.1.js");
		jsList.add("web/vendor/rappid/rappid.2.element.js");
		jsList.add("web/vendor/rappid/rappid.3.pool.js");
		jsList.add("web/vendor/rappid/rappid.4.etc.js");
		jsList.add("web/vendor/rappid/rappid.5.paper.js");
		jsList.add("web/js/common.js");
		jsList.add("web/js/work-action-service.js");

		jsList.add("web/js/proc/proc-constant.js");
		jsList.add("web/js/proc/web-modeler-constant.js");
		jsList.add("web/js/proc/stencil.js");
		jsList.add("web/js/proc/map.js");
	};

	@Override
	public void append(HtmlPage htmlPage, int depth) {
		HtmlElement head = htmlPage.getHead();
		String prePath = "../";
		depth = depth - 1;

		for (int i = 0; i < depth; i++) {
			prePath += prePath;
		}

		for (String js : jsList) {
			HtmlElement script = (HtmlElement) htmlPage.createElement("script");
			script.setAttribute("type", "text/javascript");
			script.setAttribute("src", prePath + js);
			
			head.appendChild(script);
		}
		
//		HtmlElement script = (HtmlElement) htmlPage.createElement("script");
//		script.setAttribute("type", "text/javascript");
//		script.setTextContent("var d = 1");
//		head.appendChild(script);
	}
}
