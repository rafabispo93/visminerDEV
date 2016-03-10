package br.edu.ufba.softvis.visminer.servlets;

import javax.servlet.ServletException;

import com.sun.jersey.spi.container.servlet.ServletContainer;
import com.sun.jersey.spi.container.servlet.WebConfig;

import br.edu.ufba.softvis.visminer.main.VisMiner;

public class VisminerLoader extends ServletContainer{
	
	private static final long serialVersionUID = 1L;

	@Override
	protected void init(WebConfig webConfig) throws ServletException {
		System.out.println("Configuring Database...");
		
		VisMiner visMiner = new VisMiner();
		visMiner.setDBConfig("/home/david/Documents/UFBA/TCC/workspace/visminer-dashboard/dbconfig.properties");
		
		super.init(webConfig);
	}

	@Override
	public void destroy() {
		System.out.println("Closing Database...");
		
		super.destroy();
	}
	
}
