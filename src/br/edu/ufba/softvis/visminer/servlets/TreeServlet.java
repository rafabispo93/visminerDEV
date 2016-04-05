package br.edu.ufba.softvis.visminer.servlets;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.ArrayList;
import java.util.List;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import br.edu.ufba.softvis.visminer.persistence.handler.TreeDocumentHandler;

@WebServlet("/TreeServlet")
public class TreeServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;
	private TreeDocumentHandler treeHandler = new TreeDocumentHandler();
	private PrintWriter out;
       
    public TreeServlet() {
        super();
        // TODO Auto-generated constructor stub
    }

	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		response.setContentType("application/json");
		out = response.getWriter();				
		String action = request.getParameter("action");
		
		switch (action) {
			case "getAllByRepository":
				getAllByRepository(request.getParameter("repositoryId"));				
				break;
			case "getAllTags":
				getAllTags(request.getParameter("repositoryId"));				
				break;
			case "getLatestTag":
				getLatestTag(request.getParameter("repositoryId"));				
				break;
			default:
				break;
		}
		
	}

	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {		
	}
	
	private void getAllByRepository(String repositoryId) {
		List<String> treesList = new ArrayList<>();
		treeHandler.getAllByRepository(repositoryId)
			.forEach(tree->treesList.add(tree.toJson()));		
		
		out.println(treesList.toString());		
	}
	
	private void getAllTags(String repositoryId) {
		List<String> tagsList = new ArrayList<>();
		treeHandler.getTagsByRepository(repositoryId)
			.forEach(tag->tagsList.add(tag.toJson()));		
		
		out.println(tagsList.toString());		
	}
	
	private void getLatestTag(String repositoryId) {
		List<String> tagsList = new ArrayList<>();
		treeHandler.getTagsByRepository(repositoryId)
			.forEach(tag->tagsList.add(tag.toJson()));	
		
		if (!tagsList.isEmpty()) {
			String lastestTag = tagsList.get(tagsList.size()-1);
			out.println(lastestTag.toString());
		}
	}
}
