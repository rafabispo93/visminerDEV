package br.edu.ufba.softvis.visminer.servlets;

import javax.servlet.ServletException;

import org.repositoryminer.persistence.Connection;

import com.sun.jersey.spi.container.servlet.ServletContainer;
import com.sun.jersey.spi.container.servlet.WebConfig;

public class VisminerLoader extends ServletContainer{
	
	private static final long serialVersionUID = 1L;

	@Override
	protected void init(WebConfig webConfig) throws ServletException {
		System.out.println("Configuring Database...");
		
		Connection connection = Connection.getInstance();
		connection.connect("mongodb://localhost:27017", "visminer");
		
		super.init(webConfig);
	}

	@Override
	public void destroy() {
		System.out.println("Closing Database...");	
		super.destroy();
	}
	
}
