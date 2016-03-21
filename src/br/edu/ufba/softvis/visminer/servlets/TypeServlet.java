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

import br.edu.ufba.softvis.visminer.persistence.handler.TypeDocumentHandler;

/**
 * Servlet implementation class TypeServlet
 */
@WebServlet("/TypeServlet")
public class TypeServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;
	private TypeDocumentHandler typeHandler = new TypeDocumentHandler();
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
			case "getAll":
				getAll();				
				break;
			default:
				break;
		}
	}

	private void getAll() {
		/*List<String> typeList = new ArrayList<>();
		typeHandler.getAll()
			.forEach(type->typeList.add(type.toJson()));
		out.println(typeList.toString());*/
	}

}
