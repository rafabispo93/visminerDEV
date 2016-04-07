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
import org.bson.json.JsonReader;
import org.json.JSONArray;

import com.mongodb.util.JSON;

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
			case "confirmSingleDebt":
				clickSingleDebt(request.getParameter("commitId"), 
						request.getParameter("fileId"), request.getParameter("debt"), 1);	
				break;
			case "removeSingleDebt":
				clickSingleDebt(request.getParameter("commitId"), 
						request.getParameter("fileId"), request.getParameter("debt"), 0);	
				break;
			case "confirmAllDebtsByTag":
				confirmAllDebtsByTag(request.getParameter("treeId"));	
				break;
			case "confirmAllDebtsByRepository":
				confirmAllDebtsByRepository(request.getParameter("repositoryId"));	
				break;
			case "getListOfTypesByListOfTags":
				getListOfTypesByListOfTags(request.getParameter("ids"));
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
	
	private void getListOfTypesByListOfTags(String tagsId) {
		JSONArray array = new JSONArray(tagsId);
		List<ArrayList<String>> typeLists = new ArrayList<>();
		for (Object id : array) {
			ArrayList<String> typeList = new ArrayList<String>();
			typeHandler.getAllByTree(id.toString())
				.forEach(type->typeList.add(type.toJson()));
			typeLists.add(typeList);
		}	
		out.println(typeLists);
	}

	private void clickSingleDebt(String commitId, String fileId, String debt, int status) {
		typeHandler.updateDebtStatus(commitId, fileId, debt, status);
	}
	
	private void confirmAllDebtsByTag(String treeId) {
		typeHandler.confirmAllDebtsByTag(treeId);		
	}
	
	private void confirmAllDebtsByRepository(String repositoryId) {
		typeHandler.confirmAllDebtsByRepository(repositoryId);		
	}
}
