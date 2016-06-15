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

@WebServlet("/MetricsServlet")
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
				getAll(request.getParameter("metric"));				
				break;
			default:
				break;
		}
	}
    
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		
	}
	
	private void getAll(String metric) {
		List<String> metrics = new ArrayList<>();
		repositoryHandler.findAll(null)
			.forEach(mett->metrics.add(mett.toJson()));
		out.println(metrics.toString());		
	}

}
