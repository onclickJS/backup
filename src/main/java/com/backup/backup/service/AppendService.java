package com.backup.backup.service;

import com.gargoylesoftware.htmlunit.html.HtmlPage;

public interface AppendService {
	void append(HtmlPage htmlPage, int depth);
}
