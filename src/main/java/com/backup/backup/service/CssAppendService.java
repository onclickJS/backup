package com.backup.backup.service;

import java.util.ArrayList;
import java.util.List;

import com.gargoylesoftware.htmlunit.html.HtmlElement;
import com.gargoylesoftware.htmlunit.html.HtmlPage;

public class CssAppendService implements AppendService {
	private final List<String> cssList = new ArrayList<String>();

	public CssAppendService() {
		cssList.add("web/css/pdf.css");
		cssList.add("web/vendor/froala/css/froala_style.min.css");

		cssList.add("web/vendor/rappid/rappid.1.css");
		cssList.add("web/vendor/web-modeler/css/web-modeler-layout.css");
		cssList.add("web/vendor/web-modeler/css/web-modeler.css");
	}

	@Override
	public void append(HtmlPage htmlPage, int depth) {
		HtmlElement head = htmlPage.getHead();
		String prePath = "../";
		depth = depth - 1;

		for (int i = 0; i < depth; i++) {
			prePath += prePath;
		}

		for (String css : cssList) {
			HtmlElement link = (HtmlElement) htmlPage.createElement("link");
			link.setAttribute("type", "text/css");
			link.setAttribute("rel", "stylesheet");
			link.setAttribute("media", "all");
			link.setAttribute("href", prePath + css);

			head.appendChild(link);
		}
	}
}
