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

import org.bson.Document;

import br.edu.ufba.softvis.visminer.persistence.handler.CommitDocumentHandler;
import br.edu.ufba.softvis.visminer.persistence.handler.TreeDocumentHandler;
import br.edu.ufba.softvis.visminer.persistence.handler.TypeDocumentHandler;

/**
 * Servlet implementation class TypeServlet
 */
@WebServlet("/TypeServlet")
public class TypeServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;
	private TypeDocumentHandler typeHandler = new TypeDocumentHandler();
	private CommitDocumentHandler commitHandler = new CommitDocumentHandler();
	private TreeDocumentHandler treeHandler = new TreeDocumentHandler();
	private PrintWriter out;
       
    /**
     * @see HttpServlet#HttpServlet()
     */
    public TypeServlet() {
        super();
        // TODO Auto-generated constructor stub
    }

	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		response.setContentType("application/json");
		out = response.getWriter();				
		String action = request.getParameter("action");
		
		switch (action) {
			case "getAllByTree":
				getAllByTree(request.getParameter("treeId"));	
				break;
			default:
				break;
		}
	}

	private void getAllByTree(String treeId) {
		List<String> typeList = new ArrayList<>();
		typeHandler.getAllByTree(treeId)
			.forEach(type->typeList.add(type.toJson()));
		out.println(typeList);
	}

	private void getAllByTree2(String treeId) {
		List<String> typeList = new ArrayList<>();
		Document tree = treeHandler.getOneById(treeId);
		ArrayList<Document> commits = (ArrayList<Document>)tree.get("commits");
		for (Document commit : commits) {
			List<Document> types = typeHandler.getAllByCommit(commit.getString("ui"));
			for (Document type : types) {
				typeList.add(type.toJson());
			}		
		}	
		out.println(typeList.toString());
	}

}
