package org.visminer.servlets;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.ArrayList;
import java.util.List;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import org.repositoryminer.persistence.handler.RepositoryDocumentHandler;

@WebServlet("/RepositoryServlet")
public class MetricsServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;
	private RepositoryDocumentHandler repositoryHandler = new RepositoryDocumentHandler();
	private PrintWriter out;

    public MetricsServlet() {
        super();
    }
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		response.setContentType("application/json");
		out = response.getWriter();				
		String action = request.getParameter("action");
		
		switch (action) {
			case "getAll":
				getAll();				
				break;
			default:
				break;
		}
	}
	
	private void getAll() {
		List<String> metrics = new ArrayList<>();
		repositoryHandler.findAll(null)
			.forEach(metric->metrics.add(metric.toJson()));
		out.println(metrics.toString());		
	}

}
