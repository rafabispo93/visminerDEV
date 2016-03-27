package br.edu.ufba.softvis.visminer.filter;

import java.io.IOException;

import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.FilterConfig;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

public class UrlFilter implements Filter {

	@Override
	public void destroy() {
		// TODO Auto-generated method stub
		
	}

	@Override
	public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
			throws IOException, ServletException {
		// TODO Auto-generated method stub
		
		HttpServletRequest req = (HttpServletRequest) request;
		HttpServletResponse resp = (HttpServletResponse) response;		
		String url = req.getRequestURI();
		String test = req.getServletContext().getContextPath();
		if (url.endsWith("tdevolution")) {
			resp.sendRedirect(url.replace("tdevolution", "/#tdevolution"));
		}
		else if (url.endsWith("tdanalyzer")) {
			resp.sendRedirect(url.replace("tdanalyzer", "/#tdanalyzer"));
		}
		else if (url.endsWith("committers")) {
			resp.sendRedirect(url.replace("committers", "/#committers"));
		} else {
		chain.doFilter(request, response);	
		}
	}

	@Override
	public void init(FilterConfig arg0) throws ServletException {
		// TODO Auto-generated method stub
		
	}

}
